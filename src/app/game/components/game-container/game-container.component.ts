import { Component, OnInit } from '@angular/core';
import { GameLevel } from '../../../core/shared/game-api';
import { GameService } from '../../shared/game.service';
import { Observable } from 'rxjs';
import { DashboardAction } from '../../shared/dashboard-action';
import { Field, Minefield } from '../../shared/minefield';
import { FieldsSet } from '../../shared/fields-set';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.sass']
})
export class GameContainerComponent implements OnInit {

  fieldsMarked: FieldsSet;
  showDashboard = true;
  level: GameLevel;

  map$: Observable<string[][]>;
  minefield$: Observable<Minefield>;
  restarted: boolean;   // TODO refactor
  stop$: Observable<string>;


  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.map$ = this.gameService.map$;
    this.minefield$ = this.gameService.map$
      .pipe(map((data: string[][]) => new Minefield(data)));

    this.stop$ = this.gameService.stopped$;

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


  onRestart(): void {
    this.restarted = true;
    this.startGame(this.level);
  }


  private demine(field: Field): void {
    if (!field) {
      return;
    }
    this.gameService.demineField(field.x, field.y);
    this.reloadMap();
  }


  private reloadMap(): void {
    this.gameService.reloadMap();
  }

  private startGame(level: GameLevel): void {
    this.level = level;
    this.fieldsMarked = new FieldsSet();
    this.gameService.startGame(level);
  }


}
