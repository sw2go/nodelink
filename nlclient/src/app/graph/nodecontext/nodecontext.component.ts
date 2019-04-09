import { Component, OnInit } from '@angular/core';
import { Store } from '../../state/store';
import { Action } from '../../state/reducer';
import { NodeItem } from '../../model/nodeitem';
import { Observable} from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ItemType } from '../../model/item';
import { State } from '../../model/state';
import { ChangeAnalyzer } from '../../state/changeanalyzer';

@Component({
  selector: 'app-nodecontext',
  templateUrl: './nodecontext.component.html',
  styleUrls: ['./nodecontext.component.scss']
})
export class NodeContextComponent implements OnInit {

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

  test() {
    this.store.sendAction({type: "TEST"});
  }

  addLink(item: NodeItem) {
    this.store.sendAction({type: "ADDMODAL", item: item});
  }

  deleteNode(id: string) {
    this.store.sendAction({type: "DELETENODE", nodeId: id});
  }

}
