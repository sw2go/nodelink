import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeItem } from '../model/nodeitem';
import { Store } from '../state/store';
import { State } from '../model/state';
import { Action } from '../state/reducer';
import { ChangeAnalyzer } from '../state/changeanalyzer';
import { map, filter, tap } from 'rxjs/operators';
import { ItemType } from '../model/item';
import { Router } from '@angular/router';


@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit {

  item$: Observable<NodeItem>;  // for use in html-template with async-pipe ( advantage: no code for unsubscribe required )
  disable: boolean;

  constructor(private store: Store<State, Action>, private router: Router) { 

    this.item$ = store.state$.pipe(
      map(x => ChangeAnalyzer.ItemSelectionChanged(x) || ChangeAnalyzer.ItemUpdated(x) ), //  
      filter( x => x != null),  
      tap(x => this.disable = true),
      tap(x => console.log( "NodeDetails State$", x.item) ),                        // 
      map(x => { return ((x.item) ? (x.item.type == ItemType.Node) ? x.item : null : null) as NodeItem; })
    )

  }

  ngOnInit() {
  }

  updateItem(id: string, name: string, description: string) {
    this.store.sendAction({type: "UPDATENODE", nodeId: id, name: name, description: description}).subscribe( 
      ok => this.router.navigate(['nodes']),
      err => console.log(err)
    );
  }

  test() {
    this.store.sendAction({type: "TEST"});
  }




}
