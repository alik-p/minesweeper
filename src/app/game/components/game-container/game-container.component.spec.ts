import { GameContainerComponent } from './game-container.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { GameService } from '../../shared/game.service';
import { Minefield } from '../../shared/minefield';
import { asyncData } from '../../../../testing';
import { Demine } from '../../../core/game-backend/types/demine';
import { EMPTY, Observable, of } from 'rxjs';

@Component({selector: 'app-minefield', template: ''})
class MinefieldStubComponent {
}

describe('Game / GameContainerComponent', () => {
  let component: GameContainerComponent;
  let componentDebugElement: DebugElement;
  let componentNativeElement: HTMLElement;
  let fixture: ComponentFixture<GameContainerComponent>;
  let gameService: GameService;
  let gameServiceStub: Partial<GameService>;
  let gameServiceSpy;


  const levelInfo = (): string => {
    const el = componentNativeElement.querySelector('.info--level');
    return el ? el.textContent : null;
  };


  beforeEach(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [
        GameContainerComponent,
        MinefieldStubComponent
      ],
      providers: [
        {provide: GameService, useValue: gameServiceStub}
      ],
      /*schemas: [NO_ERRORS_SCHEMA]*/
    });
    fixture = TestBed.createComponent(GameContainerComponent);
    component = fixture.componentInstance;
    componentDebugElement = fixture.debugElement;
    componentNativeElement = componentDebugElement.nativeElement;
    // GameService from the root injector
    gameService = TestBed.inject(GameService);
    // GameService actually injected into the component
    // gameService = fixture.debugElement.injector.get(GameService);
  });


  function init(): void {
    initGameService();
  }

  function initGameService(): void {

    // Create a fake TwainService object with a `getQuote()` spy
    gameServiceSpy = jasmine.createSpyObj('GameService', [
        'minefield$',
        'mines$',
        'stopped$',
        'solution$',
      ]
    );
    // Make the spy return a synchronous Observable with the test data
    // getQuoteSpy = twainService.getQuote.and.returnValue( of(testQuote) );
    gameServiceSpy.mines$.and.returnValue(asyncData(1));
    gameServiceSpy.minefield$.and.returnValue(asyncData<Minefield>(initMinefield()));
    gameServiceSpy.stopped$.and.returnValue(asyncData<Demine>(undefined));
    gameServiceSpy.solution$.and.returnValue(of([]));

    gameServiceStub = {
      get minefield$(): Observable<Minefield> {
        return of(initMinefield());
      },
      get mines$(): Observable<number> {
        return of(1);
      },
      get stopped$(): Observable<Demine> {
        return EMPTY;
      },
      solution$: of([])

    };

  }


  function initMinefield(): Minefield {
    return new Minefield([
      ['1', '*', '?', '0'],
      ['?', '?', '?', '0'],
      ['0', '0', '0', '0'],
    ]);
  }


  it('#level should be displayed', () => {
    // TODO
    expect(true).toBeTrue();
  });


  it('#onStartGame', fakeAsync(() => {
    component.level = 1;
    fixture.detectChanges(); // ngOnInit()

    tick(); // flush the observable to get the quote
    fixture.detectChanges();
    expect(levelInfo()).toContain('1');
  }));

});
