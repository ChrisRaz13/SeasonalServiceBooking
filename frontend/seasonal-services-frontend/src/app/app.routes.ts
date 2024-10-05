import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';

const routes: Routes = [
  { path: 'clients', component: ClientListComponent },
  { path: '', redirectTo: '/clients', pathMatch: 'full' } // Redirect root to the client list for easier testing
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
