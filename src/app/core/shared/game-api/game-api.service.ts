import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameApiConnectionService } from './game-api-connection.service';
import { GameLevel } from './game-level';
import { GameAction } from './game-action';


@Injectable({
  providedIn: 'root'
})
export class GameApiService {

  private connectionService: GameApiConnectionService;


  constructor() {
    this.connectionService = new GameApiConnectionService();
  }


  currentMap(): void {
    this.connectionService.sendMessage<string>(GameAction.Map);
  }

  demineField(x: number, y: number): void {
    this.connectionService.sendMessage<string>(`${GameAction.Open} ${x} ${y}`);
  }


  on$<T>(event: GameAction): Observable<T> {
    return this.connectionService.onMessage$<T>(event);
  }

  startGame(level: GameLevel): void {
    this.connectionService.sendMessage<string>(`${GameAction.New} ${level}`);
  }


}
