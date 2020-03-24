import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameLevel } from '../../../core/game-api';
import { GameService } from '../../shared/game.service';
import { Observable } from 'rxjs';
import { Field, IField, Minefield } from '../../shared/minefield';
import { map, tap } from 'rxjs/operators';
import { IMinefieldAction, MinefieldAction } from '../../shared/models/minefield-action';


@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.sass']
})
export class GameContainerComponent implements OnInit, OnDestroy {

  level: GameLevel;
  minefield$: Observable<Minefield>;
  mines$: Observable<number>;
  solved$: Observable<string>;
  stop$: Observable<string>;

  private alive = true;
  private readonly flagged = new Set<string>();


  constructor(private gameService: GameService) {
  }

  get minesFlagged(): number {
    return this.flagged.size;
  }

  ngOnInit(): void {

    this.minefield$ = this.gameService.minefield$;

    this.mines$ = this.gameService.mines$;

    this.stop$ = this.gameService.stopped$;

    this.solved$ = this.gameService.solution$
      .pipe(
        tap((res: IField[] = []) => {
          res.forEach(item => {
            if (item.mine) {
              this.flagged.add(this.toKey(item));
            }
          });
        }),
        map((res: IField[]) => !res ? '' : res.length > 0
          ? `Fields solved: ${res.length}`
          : 'Solution not found'
        )
      );

  }


  ngOnDestroy(): void {
    this.alive = false;
  }


  onMinefieldAction(event: IMinefieldAction): void {
    const field = event.data;
    switch (event.action) {
      case MinefieldAction.Demine: {
        this.demine(field);
        break;
      }
      case MinefieldAction.Flag: {
        this.flagToggle(field);
        break;
      }
      default:
        break;
    }
  }


  onSolution(minefield: Minefield): void {
    this.gameService.findSolution(minefield);
  }


  onStartGame(level: GameLevel): void {
    this.level = level;
    this.startGame(this.level);
  }


  onRestart(): void {
    this.startGame(this.level);
  }


  private demine(field: Field): void {
    if (!field) {
      return;
    }
    this.gameService.demine(field.x, field.y);
  }


  private flagToggle(field: Field): void {
    const key = this.toKey(field);
    this.flagged.has(key) ? this.flagged.delete(key) : this.flagged.add(key);
    this.gameService.toggleMine(field);
  }


  private startGame(level: GameLevel): void {
    this.level = level;
    this.flagged.clear();
    this.gameService.startGame(level);
  }


  private toKey(field: Field | IField): string {
    return `${field.x} ${field.y}`;
  }


}
