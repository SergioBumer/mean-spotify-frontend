import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit/user-edit.component';

const appRouter: Routes = [
  {path: '', component: UserEditComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: UserEditComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(appRouter)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
