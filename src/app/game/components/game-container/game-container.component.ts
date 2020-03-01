import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameLevel } from '../../../core/shared/game-api';
import { GameService } from '../../shared/game.service';
import { Observable } from 'rxjs';
import { Field, Minefield } from '../../shared/minefield';
import { FieldsSet } from '../../shared/minefield/fields-set';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.sass']
})
export class GameContainerComponent implements OnInit, OnDestroy {

  fieldsFlagged: FieldsSet;
  level: GameLevel;

  map$: Observable<string[][]>;
  minefield: Minefield;
  minefield$: Observable<Minefield>;
  restarted: boolean;   // TODO refactor
  stop$: Observable<string>;


  solved$: Observable<string>;


  private alive = true;
  private solutionAuto = false;


  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.map$ = this.gameService.map$;

    this.minefield$ = this.gameService.minefield$;

    this.stop$ = this.gameService.stopped$;

    this.solved$ = this.gameService.solution$
      .pipe(
        map((res: Field[]) => res.length > 0
          ? `Fields solved: ${res.length}`
          : 'Solution not found'
        )
      );

  }

  ngOnDestroy(): void {
    this.alive = false;
    this.solutionAuto = false;
  }


  onDemine(field: Field): void {
    this.restarted = false;
    this.demine(field);
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


  onStartGame(level: GameLevel): void {
    this.level = level;
    this.restarted = true;
    this.startGame(this.level);
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
