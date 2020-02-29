import { Injectable } from '@angular/core';
import { GameAction, GameApiService, GameLevel } from '../../core/shared/game-api';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private apiService: GameApiService) {
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
          /*if (lose > -1) {
            const y = arr.findIndex(item => item.includes(loseSymbol));
            const x = arr[y].indexOf(loseSymbol);
            return throwError(`lose: ${x} ${y}`);
          }*/
          return of(arr.map(item => item.split('')));
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
  }

  startGame(level: GameLevel): void {
    this.apiService.startGame(level);
    this.reloadMap();
  }

  reloadMap(): void {
    this.apiService.currentMap();
  }


}
