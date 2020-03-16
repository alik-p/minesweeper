import { OnDestroy } from '@angular/core';
import { WebSocketConfig, WebSocketService } from '../websocket';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';


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


  onMessage$<T>(event: string): Observable<T> {
    return this.messages$.pipe(
      filter((res: T) => (res || '').toString().startsWith(event)),
    );
  }


}
