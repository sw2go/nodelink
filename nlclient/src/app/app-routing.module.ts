import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { connectToStore } from './state/storeandrouterconnector';
import { GraphviewComponent } from './graph/graphview/graphview.component';
import { EasygraphComponent } from './easygraph/easygraph.component';
import { NodeDetailsComponent } from './node-details/node-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'nodes' },
  { path: 'eg', component: EasygraphComponent },
  { path: 'nodes', component: GraphviewComponent},
  { path: 'nodes/edit/:id', component: NodeDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(connectToStore(routes))],
  exports: [RouterModule]
})
export class AppRoutingModule { }




