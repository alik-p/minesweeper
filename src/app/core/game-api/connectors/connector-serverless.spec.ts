// Straight Jasmine testing without Angular's testing support

import { switchMap } from 'rxjs/operators';
import { ServerlessConnector } from './connector-serverless';
import { Demine } from '../../game-backend/types/demine';

describe('ServerlessConnector', () => {
  let connector: ServerlessConnector;
  beforeEach(() => {
    connector = new ServerlessConnector();
  });


  it('#demine$', (done: DoneFn) => {
    connector.startGame$(1).pipe(
      switchMap(() => connector.demine$(1, 2))
    ).subscribe(res => {
      expect([Demine.Lose, Demine.Success, Demine.Win]).toContain(res);
      done();
    });
  });


  it('#mines$', (done: DoneFn) => {
    connector.startGame$(1).pipe(
      switchMap(() => connector.mines$())
    ).subscribe(res => {
      expect(res).toEqual(jasmine.any(Number));
      done();
    });
  });


  it('#currentMap$', (done: DoneFn) => {
    connector.startGame$(1).pipe(
      switchMap(() => connector.currentMap$())
    ).subscribe(res => {
      expect(res).toEqual(jasmine.any(String));
      done();
    });
  });


  it('#startGame$', (done: DoneFn) => {
    connector.startGame$(1).subscribe(res => {
      expect(res).toBeTrue();
      done();
    });
  });


});
