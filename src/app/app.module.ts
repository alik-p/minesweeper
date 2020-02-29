import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomePageComponent } from './home/pages/home-page/home-page.component';
import { GamePageComponent } from './game/pages/game-page.component';
import { MinefieldComponent } from './game/components/minefield/minefield.component';
import { GameContainerComponent } from './game/components/game-container/game-container.component';
import { TerminalComponent } from './game/components/terminal/terminal.component';
import { DasboardComponent } from './game/components/dasboard/dasboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    GamePageComponent,
    MinefieldComponent,
    GameContainerComponent,
    TerminalComponent,
    DasboardComponent
  ],
  imports: [
    CoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
