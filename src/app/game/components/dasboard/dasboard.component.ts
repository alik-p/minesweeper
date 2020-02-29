import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GameLevel } from '../../../core/shared/game-api';
import { DashboardAction } from '../../shared/dashboard-action';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.sass']
})
export class DasboardComponent implements OnInit {
  @Output() action = new EventEmitter<DashboardAction>();

  constructor() { }

  ngOnInit(): void {
  }

  onAction(action: DashboardAction) {
    this.action.emit(action);
  }

}
