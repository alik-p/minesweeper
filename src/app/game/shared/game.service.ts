import { Injectable } from '@angular/core';
import { GameAction, GameApiService, GameLevel } from '../../core/game-api';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Field, FieldsSet, Minefield } from './minefield';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private cacheMined$: BehaviorSubject<FieldsSet> = new BehaviorSubject<FieldsSet>(undefined);

  private findSolutionWorker: Worker;
  private noSolutionSubj$ = new Subject<boolean>();
  private solutionSubj$ = new Subject<Field[]>();

  solution$: Observable<Field[]>;

  constructor(private apiService: GameApiService) {
    this.initSolutionWorker();
  }


  get map$(): Observable<string[][]> {
    return this.apiService.on$(GameAction.Map)
      .pipe(
        switchMap((res: string) => {
          const arr = res.split('\n');
          arr.pop();
          arr.shift();
          return of(arr.map(item => item.split('')));
        }),
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


  toggleMine(field: Field): void {
    const fieldsMined = this.cacheMined$.getValue();
    fieldsMined.has(field)
      ? fieldsMined.delete(field)
      : fieldsMined.add(field);
    this.cacheMined$.next(fieldsMined);
  }


  private initSolutionWorker(): void {
    const worker = new Worker('./find-solution/find-solution.worker', {type: 'module'});
    this.solution$ = this.solutionSubj$.asObservable();

    worker.onmessage = ({data}) => {
      const fields: Field[] = [...data];
      this.solutionSubj$.next(fields);
      if (fields.length > 0) {
        const toDemine: Field[] = [];
        fields.forEach((field: Field) => {
          field.mine ? this.flagMine(field) : toDemine.push(field);
        });
        this.demineFields(toDemine);
      } else {
        this.noSolutionSubj$.next(true);
      }
    };

    this.findSolutionWorker = worker;

  }


}
