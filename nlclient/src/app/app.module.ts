import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MygraphComponent } from './mygraph/mygraph.component';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NodeService } from './service/node.service';
import { ModalAddNodeComponent } from './modal-add-node/modal-add-node.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { Store } from './state/store';
import { reducer, initState } from './state/reducer';
import { StoreAndRouterConnector } from './state/storeandrouterconnector';
import { MynodeComponent } from './mynode/mynode.component';
import { Router } from '@angular/router';
import { LinkComponent } from './link/link.component';
import { EasygraphComponent } from './easygraph/easygraph.component';



@NgModule({
  declarations: [
    AppComponent,
    MygraphComponent,
    ModalAddNodeComponent,
    ContextMenuComponent,
    MynodeComponent,
    LinkComponent,
    EasygraphComponent
  ],
  entryComponents: [
    ModalAddNodeComponent
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxGraphModule,
    BsDropdownModule.forRoot(),
    SortableModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    NodeService,
    { provide: Store, useFactory: (nservice, router) => new Store(reducer(nservice, router), initState), deps: [NodeService, Router] },
    StoreAndRouterConnector
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
