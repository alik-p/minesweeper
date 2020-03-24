import { Connector } from './connector';
import { Game } from '../../game-backend/game';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Demine } from '../../game-backend/demine';

export class ServerlessConnector implements  Connector {

  private readonly game: Game;
  private minesSub$ = new BehaviorSubject<number>(undefined);

  constructor() {
    this.game = new Game();
  }


  demine$(row: number, col: number): Observable<Demine> {
    return of(this.game.openField({col, row}));
  }


  mines$(): Observable<number> {
    return this.minesSub$.asObservable();
  }


  currentMap$(): Observable<string> {
    return of(this.game.currentMap());
  }


  startGame$(level: number): Observable<boolean> {
    return new Observable(observer => {
      this.game.startGame(level);
      this.minesSub$.next(this.game.minesCount());
      observer.next(true);
      observer.complete();
    });
  }


}
