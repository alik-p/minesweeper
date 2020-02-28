import { WebSocketSubjectConfig } from 'rxjs/internal-compatibility';

export interface WebSocketConfig<T> extends WebSocketSubjectConfig<T> {
  reconnectAttempts: number;
  reconnectInterval: number;
}
