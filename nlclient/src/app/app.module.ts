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



@NgModule({
  declarations: [
    AppComponent,
    MygraphComponent,
    ModalAddNodeComponent,
    ContextMenuComponent
  ],
  entryComponents: [
    ModalAddNodeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxGraphModule,
    BsDropdownModule.forRoot(),
    SortableModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [NodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
