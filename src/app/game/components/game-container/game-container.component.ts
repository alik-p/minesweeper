import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameLevel } from '../../../core/shared/game-api';
import { GameService } from '../../shared/game.service';
import { Observable } from 'rxjs';
import { DashboardAction } from '../../shared/dashboard-action';
import { Field, Minefield } from '../../shared/minefield';
import { FieldsSet } from '../../shared/fields-set';
import { takeWhile, tap } from 'rxjs/operators';


@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.sass']
})
export class GameContainerComponent implements OnInit, OnDestroy {

  fieldsFlagged: FieldsSet;
  showDashboard = true;
  level: GameLevel;

  map$: Observable<string[][]>;
  minefield: Minefield;
  minefield$: Observable<Minefield>;
  restarted: boolean;   // TODO refactor
  stop$: Observable<string>;


  solutionTEST$: Observable<Field[]>;


  private alive = true;
  private solutionAuto = false;


  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.map$ = this.gameService.map$;

    this.minefield$ = this.gameService.minefield$;

    this.stop$ = this.gameService.stopped$;

    this.solutionTEST$ = this.gameService.solution$
      .pipe(
        tap(res => console.log('solutionTEST$: ', res))
      )

  }

  ngOnDestroy(): void {
    this.alive = false;
    this.solutionAuto = false;
  }


  onDemine(field: Field): void {
    this.restarted = false;
    this.demine(field);
  }


  onDashboardAction(action: DashboardAction): void {
    switch (action) {
      case ('passwords'): {
        console.log('TODO passwords');
        break;
      }
      default: {
        this.startGame(action);
        break;
      }
    }
    this.showDashboard = false;
  }


  onMinefieldChange(minefield): void {
    this.minefield = minefield;
  }


  onFlagToggle(field: Field): void {
    this.gameService.toggleMine(field);
  }


  onSolution(minefield: Minefield): void {
    this.gameService.findSolution(minefield);
  }


  onSolutionAutoNEW(minefield: Minefield): void {
    this.gameService.findSolutionAuto(minefield);
  }


  onSolutionAuto(minefield: Minefield): void {
    this.solutionAuto = true;
    this.gameService.findSolutionAuto$(minefield)
      .pipe(takeWhile(() => this.solutionAuto))
      .subscribe(
        res => console.log('onSolutionAuto: ', res)
      );
  }


  onRestart(): void {
    this.restarted = true;
    this.solutionAuto = false;
    this.startGame(this.level);
  }


  private demine(field: Field): void {
    if (!field) {
      return;
    }
    this.gameService.demineField(field.x, field.y);
  }


  private startGame(level: GameLevel): void {
    this.level = level;
    this.gameService.startGame(level);
  }


}
