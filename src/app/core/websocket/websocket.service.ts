import { interval, NextObserver, Observable, Subject } from 'rxjs';
import { WebSocketConfig } from './websocket-config';
import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { distinctUntilChanged, share, takeWhile } from 'rxjs/operators';


export abstract class WebSocketService {

  protected connection$: NextObserver<boolean>;
  protected messages$: Subject<unknown>;
  protected socket$: WebSocketSubject<unknown>;

  private alive = true;
  private readonly config: WebSocketConfig<unknown>;
  private connectionStatus$: Observable<boolean>;
  private isConnected: boolean;
  private reconnection$: Observable<number>;


  protected constructor(config: WebSocketConfig<unknown>) {
    this.config = config;
    this.messages$ = new Subject<unknown>();
    this.connectionStatus$ = new Observable<boolean>(observer => this.connection$ = observer)
      .pipe(share(), distinctUntilChanged());

    // Reconnect if no connection
    this.connectionStatus$
      .pipe(takeWhile(() => this.alive))
      .subscribe((isConnected) => {
        this.isConnected = isConnected;
        if (!isConnected && !this.reconnection$) {
          this.reconnect();
        }
      });

    this.connect();

  }


  abstract onMessage$<T>(event: string): Observable<T>;


  destroy(): void {
    this.alive = false;
  }


  sendMessage<T>(data: T): void {
    if (this.isConnected) {
      this.socket$.next(data);
    } else {
      console.error('WebSocked Send error!');
    }
  }


  private connect(): void {
    this.socket$ = new WebSocketSubject(this.config);
    this.socket$
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        (message) => {
          this.messages$.next(message);
        },
        (error: Event) => {
          if (!this.socket$) {
            this.reconnect();
          }
        });
  }


  private reconnect(): void {
    this.reconnection$ = interval(this.config.reconnectInterval).pipe(
      takeWhile((val, index) => !this.socket$ && index < this.config.reconnectAttempts)
    );
    this.reconnection$.subscribe(
      () => this.connect(),
      () => null,
      () => {
        this.reconnection$ = null;
        if (!this.socket$) {
          this.messages$.complete();
          this.connection$.complete();
        }
      }
    );
  }


}
