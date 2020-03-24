import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Demine } from '../game-backend/demine';
import { Connector } from './connectors/connector';
import { ServerlessConnector } from './connectors/connector-serverless';


@Injectable({
  providedIn: 'root'
})
export class GameApiService {

  private connector: Connector;

  constructor() {
    this.connector = new ServerlessConnector();
  }

  mines$(): Observable<number> {
    return this.connector.mines$();
  }


  currentMap$(): Observable<string> {
    return this.connector.currentMap$();
  }


  demineField$(x: number, y: number): Observable<Demine> {
    return this.connector.demine$(y, x);
  }


  startGame$(level: number): Observable<boolean> {
    return this.connector.startGame$(level);
  }


}
