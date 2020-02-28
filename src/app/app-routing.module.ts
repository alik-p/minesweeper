import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home/pages/home-page/home-page.component';
import { GamePageComponent } from './game/pages/game-page.component';


const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'level', component: GamePageComponent},  // TODO level
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
