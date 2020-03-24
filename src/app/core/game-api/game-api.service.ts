import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameApiConnectionService } from './game-api-connection.service';
import { GameApiConnection2Service } from './game-api-connection-2';
import { Demine } from '../game-backend/demine';


@Injectable({
  providedIn: 'root'
})
export class GameApiService {

  private connectionService: GameApiConnectionService;
  private connection2Service: GameApiConnection2Service;


  constructor() {
    this.connectionService = new GameApiConnectionService();
    this.connection2Service = new GameApiConnection2Service();
  }

  mines$(): Observable<number> {
    // return this.connectionService.mines$();
    return this.connection2Service.mines$();
  }


  currentMap$(): Observable<string> {
    // return this.connectionService.currentMap$();
    return this.connection2Service.currentMap$();
  }


  demineField$(x: number, y: number): Observable<Demine> {
    // return this.connectionService.demine$(y, x);
    return this.connection2Service.demine$(y, x);
  }


  startGame$(level: number): Observable<boolean> {
    // return this.connectionService.startGame$(level);
    return this.connection2Service.startGame$(level);
  }


}
