import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { connectToStore } from './state/storeandrouterconnector';
import { MygraphComponent } from './mygraph/mygraph.component';
import { MynodeComponent } from './mynode/mynode.component';
import { LinkComponent } from './link/link.component';
import { EasygraphComponent } from './easygraph/easygraph.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'nodes' },
  { path: 'eg', component: EasygraphComponent },
  { path: 'nodes', component: MygraphComponent,
    children: [
      { path: "ctx1", component: MynodeComponent },
      { path: "ctx2", component: LinkComponent }
    ]
  },
  {
    path: 'nodesx', component: MygraphComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(connectToStore(routes))],
  exports: [RouterModule]
})
export class AppRoutingModule { }




