import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphviewComponent } from './graph/graphview/graphview.component';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap'
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { NodeService } from './service/node.service';
import { ModalAddNodeComponent } from './modal-add-node/modal-add-node.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { Store } from './state/store';
import { reducer } from './state/reducer';
import { StoreAndRouterConnector } from './state/storeandrouterconnector';
import { Router } from '@angular/router';
import { LinkContextComponent } from './graph/linkcontext/linkcontext.component';
import { EasygraphComponent } from './easygraph/easygraph.component';
import { initState } from './model/state';
import { NodeContextComponent } from './graph/nodecontext/nodecontext.component';
import { NodeDetailsComponent } from './node-details/node-details.component';
import { GraphContextComponent } from './graph/graphcontext/graphcontext.component';



@NgModule({
  declarations: [
    AppComponent,
    GraphviewComponent,
    ModalAddNodeComponent,
    ContextMenuComponent,
    LinkContextComponent,
    EasygraphComponent,
    NodeContextComponent,
    NodeDetailsComponent,
    GraphContextComponent
  ],
  entryComponents: [
    ModalAddNodeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxGraphModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    SortableModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    NodeService,
    { provide: Store, useFactory: (nservice, modal, router) => new Store(reducer(nservice, modal, router), initState), deps: [NodeService, BsModalService, Router] },
    StoreAndRouterConnector
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
