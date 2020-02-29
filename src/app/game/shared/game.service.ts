import { Injectable } from '@angular/core';
import { GameAction, GameApiService, GameLevel } from '../../core/shared/game-api';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {


  private alive = true;

  constructor(private apiService: GameApiService) { }


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
