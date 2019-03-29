import { Component, OnInit } from '@angular/core';
import { Store } from '../state/store';
import { Action } from '../state/reducer';
import { NodeItem } from '../model/nodeitem';
import { Observable} from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ItemType } from '../model/item';
import { State } from '../model/state';
import { ChangeAnalyzer } from '../state/changeanalyzer';

@Component({
  selector: 'app-mynode',
  templateUrl: './mynode.component.html',
  styleUrls: ['./mynode.component.scss']
})
export class MynodeComponent implements OnInit {

  item$: Observable<NodeItem>;  // for use in html-template with async-pipe ( advantage: no code for unsubscribe required )

  constructor(private store: Store<State, Action>) { 

    this.item$ = store.state$.pipe(
      map(x => ChangeAnalyzer.ItemSelectionChanged(x)), //  
      filter( x => x != null),                          // 
      map(x => { return ((x.item) ? (x.item.type == ItemType.Node) ? x.item : null : null) as NodeItem; })
    )

  }

  ngOnInit() {
  }

  updateItem(id: string, name: string) {
    this.store.sendAction({type: "UPDATENODE", nodeId: id, name: name});
  }

  test() {
    this.store.sendAction({type: "TEST"});
  }

}
