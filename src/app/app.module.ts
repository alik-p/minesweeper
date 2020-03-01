import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GamePageComponent } from './game/pages/game-page.component';
import { MinefieldComponent } from './game/components/minefield/minefield.component';
import { GameContainerComponent } from './game/components/game-container/game-container.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    GamePageComponent,
    MinefieldComponent,
    GameContainerComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
