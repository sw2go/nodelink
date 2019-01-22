import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MygraphComponent } from './mygraph/mygraph.component';

@NgModule({
  declarations: [
    AppComponent,
    MygraphComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxGraphModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
