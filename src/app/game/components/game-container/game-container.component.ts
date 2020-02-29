import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { GameAction, GameLevel } from '../../../core/shared/game-api';
import { GameService } from '../../shared/game.service';
import { Observable } from 'rxjs';
import { DashboardAction } from '../../shared/dashboard-action';
import { Field } from '../../shared/minefield';


@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.sass']
})
export class GameContainerComponent implements OnInit {

  showDashboard = true;
  level: GameLevel;

  loose$: Observable<boolean>;
  map$: Observable<string[][]>;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.map$ = this.gameService.map$;
    // this.startGame();
  }


  onDemine(field: Field): void {
    this.demine(field);
  }


  onDashboardAction(action: DashboardAction): void {
    switch (action) {
      case ('passwords'): {
        console.log('TODO passwords')
        break;
      }
      default: {
        // this.level = action;
        this.startGame(action)
        break;
      }
    }
    this.showDashboard = false;
  }


  onRestart(): void {
    this.startGame(this.level);
  }


  private demine(field: Field): void {
    if (!field) {
      return;
    }
    this.gameService.demineField(field.x,  field.y);
    this.reloadMap();
  }


  private reloadMap(): void {
    this.gameService.reloadMap();
  }

  private startGame(level: GameLevel): void {
    this.level = level;
    this.gameService.startGame(level);
  }


}
