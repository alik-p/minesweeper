import { Observable } from 'rxjs';
import { Demine } from 'src/app/core/game-backend/demine';


export interface Connector {

  demine$(row: number, col: number): Observable<Demine>;

  mines$(): Observable<number>;

  currentMap$(): Observable<string>;

  startGame$(level: number): Observable<boolean>;

}
