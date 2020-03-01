import { Injectable } from '@angular/core';
import { GameAction, GameApiService, GameLevel } from '../../core/shared/game-api';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Field, Minefield } from './minefield';
import { FieldsSet } from './fields-set';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private cacheMined$: BehaviorSubject<FieldsSet> = new BehaviorSubject<FieldsSet>(undefined);

  private findSolutionWorker: Worker;
  private noSolution$ = new Subject<boolean>();
  private _solution$ = new Subject<Field[]>();

  solution$: Observable<Field[]>;
  testObs$: Observable<unknown>;

  constructor(private apiService: GameApiService) {

    this.initSolutionWorker();

  }


  get demined$(): Observable<boolean> {
    return this.apiService.on$(GameAction.Open)
      .pipe(
        switchMap((res: string) => {
          return of(res.includes('You lose') ? false : true);
        })
      );
  }


  get lose$(): Observable<boolean> {
    return this.apiService.on$(GameAction.Open)
      .pipe(
        switchMap((res: string) => {
          return of(res.includes('You lose') ? true : false);
        })
      );
  }


  get map$(): Observable<string[][]> {
    return this.apiService.on$(GameAction.Map)
      .pipe(
        switchMap((res: string) => {
          const loseSymbol = '*';
          const lose = res.indexOf(loseSymbol);
          const arr = res.split('\n');
          arr.pop();
          arr.shift();
          return of(arr.map(item => item.split('')));
        })
      );
  }


  get minefield$(): Observable<Minefield> {
    const mined$ = this.cacheMined$.asObservable();
    return combineLatest([this.map$, mined$]).pipe(
      map(([data, mined]) => {
        const minefield = new Minefield(data);
        mined.keys.forEach(({x, y}) => minefield.field(x, y).mine = true);
        return minefield;
      })
    );
  }


  get stopped$(): Observable<string> {
    return this.apiService.on$(GameAction.Open)
      .pipe(
        filter((res: string) =>
          res.includes('You win') || res.includes('You lose')
        ),
        map((res: string) =>
          res.replace(`${GameAction.Open}: `, '')
        ),
      );
  }


  /**
   * Emits when win
   * Input: 'open: You win. The password for this level is: <password>'
   * Output: <password>
   */
  get win$(): Observable<string> {
    return this.apiService.on$(GameAction.Open)
      .pipe(
        filter((res: string) => res.includes('You win')),
        map((res: string) => res.split(' ').pop()),
      );
  }


  demineField(x: number, y: number): void {
    this.apiService.demineField(x, y);
    this.reloadMap();
  }


  demineFields(fields: Field[]): void {
    if (!fields || fields.length === 0) {
      return;
    }
    fields.forEach(({x, y}) => this.apiService.demineField(x, y));
    this.reloadMap();
  }


  findSolution(minefield: Minefield): void {
    this.findSolutionWorker.postMessage(minefield.data);
  }


  findSolutionAuto(minefield: Minefield): void {
    this.findSolutionWorker.postMessage(minefield.data);
  }


  findSolutionAuto$(minefield: Minefield): Observable<boolean> {
    this.findSolution(minefield);
    return this.solutionAuto$();
  }


  toggleMine(field: Field): void {
    const fieldsMined = this.cacheMined$.getValue();
    fieldsMined.has(field)
      ? fieldsMined.delete(field)
      : fieldsMined.add(field);
    this.cacheMined$.next(fieldsMined);
  }


  flagMine(field: Field): void {
    const fieldsMined = this.cacheMined$.getValue();
    fieldsMined.add(field);
    this.cacheMined$.next(fieldsMined);
  }


  reloadMap(): void {
    this.apiService.currentMap();
  }

  startGame(level: GameLevel): void {
    this.cacheMined$.next(new FieldsSet());
    this.apiService.startGame(level);
    this.reloadMap();
  }


  private initSolutionWorker(): void {
    const worker = new Worker('./find-solution.worker', {type: 'module'});

    this.solution$ = this._solution$.asObservable();

    worker.onmessage = ({data}) => {
      console.log('Worker response:', data);
      const fields: Field[] = [...data];

      this._solution$.next(fields);

      if (fields.length > 0) {
        const toDemine: Field[] = [];
        fields.forEach((field: Field) => {
          field.mine ? this.flagMine(field) : toDemine.push(field);
        });
        this.demineFields(toDemine);
      } else {
        this.noSolution$.next(true);
      }
    };

    this.findSolutionWorker = worker;
  }

 /* private initTest$(data): Observable<unknown> {
    return from(new Promise((resolve, reject) => {
      const fields
    }))

  }*/


  private solutionAuto$(): Observable<boolean> {
    const noSolution$ = this.noSolution$.asObservable();
    return this.minefield$.pipe(
      takeUntil(this.stopped$),
      tap((minefield: Minefield) => this.findSolution(minefield)),
      switchMap(() => noSolution$),
      tap(res => console.log('solutionAuto$: ', res)),
      map(res => !!res)
    );
  }


}
