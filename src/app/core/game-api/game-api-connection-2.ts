import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GameAction } from './game-action';
import { Game } from '../game-core/game';

interface Message<T> {
  event: string;
  data: T;
}


export class GameApiConnection2Service {

  protected readonly messages$: Subject<unknown>;  // TODO type???

  private readonly game: Game;

  constructor() {
    this.messages$ = new Subject<Message<unknown>>();  // TODO type???
    this.game = new Game();
  }


  onMessage$<T>(event: string): Observable<T> {
    return this.messages$.pipe(
      filter((res: Message<T>) => res.event === event),
      map((res: Message<T>) => res.data)
    );
  }

  /*onMessage$<T>(event: string): Observable<T> {
    return this.messages$.pipe(
      filter((res: T) => (res || '').toString().startsWith(event)),
    );
  }*/



  sendMessage<T>(event: GameAction, data: T): void {
    switch (event) {
      case GameAction.New: {
        this.startGame(+data);
        break;
      }
      case GameAction.Open: {
        this.openField(data.toString());
        break;
      }
      case GameAction.Map: {
        this.currentMap();
        break;
      }
      default:
        break;
    }


  }


  currentMap(): void {
    this.messages$.next({event: GameAction.Map, data: this.game.currentMap()});
  }


  private openField(data: string): void {
    const [col, row] = data.split(' ').map(item => +item);
    const result = this.game.openField({col, row});
    this.messages$.next({event: GameAction.Open, data: result});
  }


  private startGame(level: number): void {
    this.game.startGame(level);
    this.messages$.next({event: GameAction.New, data: true});
  }


}