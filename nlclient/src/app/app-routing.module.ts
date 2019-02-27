import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { connectToStore } from './state/storeandrouterconnector';
import { MygraphComponent } from './mygraph/mygraph.component';
import { MynodeComponent } from './mynode/mynode.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'nodes' },
  { path: 'nodes', component: MygraphComponent,
    children: [
      { path: "ctx1", component: MynodeComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(connectToStore(routes))],
  exports: [RouterModule]
})
export class AppRoutingModule { }




