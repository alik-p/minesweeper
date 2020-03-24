import { OnDestroy } from '@angular/core';
import { WebSocketConfig, WebSocketService } from '../websocket';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GameAction } from './game-action';
import { Demine } from '../game-backend/demine';


export class GameApiConnectionService extends WebSocketService implements OnDestroy {

  constructor() {
    const config: WebSocketConfig<string> = {
      url: 'wss://hometask.eg1236.com/game1/',
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      serializer: (data: string): string => data,
      deserializer: (res: MessageEvent): string => res.data,
      closeObserver: {
        next: () => {
          this.socket$ = null;
          this.connection$.next(false);
        }
      },
      openObserver: {
        next: () => {
          console.log(`WebSocket connected: ${config.url}`);
          this.connection$.next(true);
        }
      },
    };
    super(config);
  }


  ngOnDestroy(): void {
    this.destroy();
  }


  demine$(row: number, col: number): Observable<Demine> {
    this.sendMessage<string>(`${GameAction.Open} ${col} ${row}`);
    return this.onMessage$<Demine>(GameAction.Open)
      .pipe(
        map(res => res.includes('You lose')
          ? Demine.Lose
          : res.includes('You win') ? Demine.Win : Demine.Success
        )
      );
  }


  mines$(): Observable<number> {
    return of(undefined);  // unknown
  }


  currentMap$(): Observable<string> {
    this.sendMessage<string>(GameAction.Map);
    return this.onMessage$<string>(GameAction.Map)
      .pipe(
        map(res => res.replace('map:\n', ''))
      );
  }


  startGame$(level: number): Observable<boolean> {
    this.sendMessage<string>(`${GameAction.New} ${level}`);
    return this.onMessage$<boolean>(GameAction.New)
      .pipe(
        map(res => 'OK' ? true : false)
      );
  }


  onMessage$<T>(event: string): Observable<T> {
    return this.messages$.pipe(
      filter((res: T) => (res || '').toString().startsWith(event)),
    );
  }


}
