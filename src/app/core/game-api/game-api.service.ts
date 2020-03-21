import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameApiConnectionService } from './game-api-connection.service';
import { GameLevel } from './game-level';
import { GameAction } from './game-action';
import { GameApiConnection2Service } from './game-api-connection-2';
import { Demine } from '../game-core/demine';


@Injectable({
  providedIn: 'root'
})
export class GameApiService {

  private connectionService: GameApiConnectionService;
  private connection2Service: GameApiConnection2Service;


  constructor() {
    this.connectionService = new GameApiConnectionService();
    this.connection2Service = new GameApiConnection2Service();

    /*this.connection2Service.onMessage$(GameAction.Mines).subscribe(
      res => console.log('GameAction.Mines: ', res)
    );*/

    this.connection2Service.onMessage$(GameAction.Map).subscribe(
      res => console.log(res)
    );

  }

  mines$(): Observable<number> {
    return this.connection2Service.mines$();
  }

  currentMap(): void {
    // this.connectionService.sendMessage<string>(GameAction.Map);
    this.connection2Service.sendMessage(GameAction.Map, null);
  }


  currentMap$(): Observable<string> {
    return this.connection2Service.currentMap$();
  }


  demineField(x: number, y: number): void {
    // this.connectionService.sendMessage<string>(`${GameAction.Open} ${x} ${y}`);
    this.connection2Service.sendMessage<string>(GameAction.Open, `${x} ${y}`);
  }

  demineField$(x: number, y: number): Observable<Demine> {
    return this.connection2Service.demine$(y, x);
  }


  on$<T>(event: GameAction): Observable<T> {
    // return this.connectionService.onMessage$<T>(event);
    return this.connection2Service.onMessage$<T>(event);
  }


  startGame(level: GameLevel): void {
    // this.connectionService.sendMessage<string>(`${GameAction.New} ${level}`);
    this.connection2Service.sendMessage<GameLevel>(GameAction.New, level);
  }


  startGame$(level: number): Observable<boolean> {
    return this.connection2Service.startGame$(level);
  }


}
