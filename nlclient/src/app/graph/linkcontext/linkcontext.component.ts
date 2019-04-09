import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../model/linkitem';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '../../state/store';
import { Action } from '../../state/reducer';

import { map, filter, tap } from 'rxjs/operators';
import { ItemType } from '../../model/item';
import { State } from '../../model/state';
import { ChangeAnalyzer } from '../../state/changeanalyzer';

@Component({
  selector: 'app-linkcontext',
  templateUrl: './linkcontext.component.html',
  styleUrls: ['./linkcontext.component.scss']
})
export class LinkContextComponent implements OnInit {

  // for use in html-template with async-pipe ( advantage: no code for unsubscribe required )
  item$: Observable<LinkItem>;
  disable: boolean = true;


  constructor(private store: Store<State, Action>) { 

    this.item$ = store.state$.pipe(
      map(x => ChangeAnalyzer.ItemSelectionChanged(x) || ChangeAnalyzer.ItemUpdated(x)), //
      filter( x => x != null), 
      tap(x => this.disable = true),                         // 
      map(x => { return ((x.item) ? (x.item.type == ItemType.Link) ? x.item : null : null) as LinkItem; })
    )
        
  }

  ngOnInit() {
  }

  updateItem(id: string, name: string) {
    this.store.sendAction({type: "UPDATELINK", linkId: id, name: name});
  }

  deleteItem(id: string) {
    this.store.sendAction({type: "DELETELINK", linkId: id});
  }

}
