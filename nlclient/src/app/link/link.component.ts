import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../model/linkitem';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '../state/store';
import { Action } from '../state/reducer';

import { map, filter } from 'rxjs/operators';
import { ItemType } from '../model/item';
import { State } from '../model/state';
import { ChangeAnalyzer } from '../state/changeanalyzer';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  // for use in html-template with async-pipe ( advantage: no code for unsubscribe required )
  item$: Observable<LinkItem>;


  constructor(private store: Store<State, Action>) { 

    this.item$ = store.state$.pipe(
      map(x => ChangeAnalyzer.ItemSelectionChanged(x)), //
      filter( x => x != null),                          // 
      map(x => { return ((x.item) ? (x.item.type == ItemType.Link) ? x.item : null : null) as LinkItem; })
    )
        
  }

  ngOnInit() {
  }

  updateItem(id: string, name: string) {
    this.store.sendAction({type: "UPDATELINK", linkId: id, name: name});
  }

}
