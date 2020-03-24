import { Injectable } from '@angular/core';
import { GameApiService, GameLevel } from '../../core/game-api';
import { BehaviorSubject, combineLatest, Observable, of, Subject, zip } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Field, FieldsSet, IField, Minefield } from './minefield';
import { Demine } from '../../core/game-backend/demine';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  solution$: Observable<IField[]>;
  private cacheMined$: BehaviorSubject<FieldsSet> = new BehaviorSubject<FieldsSet>(undefined);
  private findSolutionWorker: Worker;

  private mapSubj$ = new Subject<string>();
  private solutionSubj$ = new Subject<IField[]>();
  private statusSubj$ = new BehaviorSubject<Demine>(undefined);


  constructor(private apiService: GameApiService) {
    this.initSolutionWorker();
  }


  get map$(): Observable<string[][]> {
    return this.mapSubj$.asObservable()
      .pipe(
        switchMap((res: string) => {
          const arr = res.split('\n');
          arr.pop();
          return of(arr.map(item => item.split('')));
        })
      );
  }


  get minefield$(): Observable<Minefield> {
    const mined$ = this.cacheMined$.asObservable();
    return combineLatest([this.map$, mined$]).pipe(
      map(([data, mined]) => {
        const minefield = new Minefield(data);
        mined.keys.forEach(({x, y}) => {
          minefield.field(x, y)
            .setFlag(true)
            .setMine(true);
        });
        return minefield;
      })
    );
  }


  get mines$(): Observable<number> {
    return this.apiService.mines$();
  }


  get stopped$(): Observable<string> {
    return this.statusSubj$.asObservable()
      .pipe(
        filter(res => !res || [Demine.Win, Demine.Lose].includes(res)),
        distinctUntilChanged(),
      );
  }


  demine(x: number, y: number): void {
    this.demineField$(x, y).pipe(
      take(1),
      concatMap(() => this.apiService.currentMap$()),
      tap(res => this.mapSubj$.next(res)),
    ).subscribe();
  }


  findSolution(minefield: Minefield): void {
    this.findSolutionWorker.postMessage(minefield.data);
  }


  flagMine(field: IField): void {
    const fieldsMined = this.cacheMined$.getValue();
    fieldsMined.add(field);
    this.cacheMined$.next(fieldsMined);
  }


  startGame(level: GameLevel): void {
    this.cacheMined$.next(new FieldsSet());
    this.statusSubj$.next(undefined);
    this.solutionSubj$.next(undefined);
    this.apiService.startGame$(level)
      .pipe(
        take(1),
        concatMap(() => this.apiService.currentMap$()),
        tap(res => this.mapSubj$.next(res)),
      ).subscribe();
  }


  toggleMine(field: Field): void {
    const fieldsMined = this.cacheMined$.getValue();
    fieldsMined.has(field)
      ? fieldsMined.delete(field)
      : fieldsMined.add(field);
    this.cacheMined$.next(fieldsMined);
  }


  private demineField$(x: number, y: number): Observable<Demine> {
    return this.apiService.demineField$(x, y)
      .pipe(
        tap(res => this.statusSubj$.next(res)),
      );
  }


  private demineFields(fields: IField[]): void {
    if (!fields || fields.length === 0) {
      return;
    }
    zip(...fields.map(({x, y}) => this.demineField$(x, y)))
      .pipe(
        take(1),
        concatMap(() => this.apiService.currentMap$()),
        tap(res => this.mapSubj$.next(res)),
      ).subscribe();
  }


  private initSolutionWorker(): void {
    const worker = new Worker('./find-solution/find-solution.worker', {type: 'module'});
    this.solution$ = this.solutionSubj$.asObservable();

    worker.onmessage = ({data}) => {
      const fields: IField[] = [...data];
      this.solutionSubj$.next(fields);
      if (fields.length > 0) {
        const toDemine: IField[] = [];
        fields.forEach((field: IField) => {
          field.mine ? this.flagMine(field) : toDemine.push(field);
        });
        this.demineFields(toDemine);
      }
    };

    this.findSolutionWorker = worker;

  }


}
