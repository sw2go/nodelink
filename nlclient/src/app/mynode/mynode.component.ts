import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '../state/store';
import { Action, State } from '../state/reducer';
import { NodeItem } from '../model/nodeitem';
import { from, Observable, combineLatest  } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-mynode',
  templateUrl: './mynode.component.html',
  styleUrls: ['./mynode.component.scss']
})
export class MynodeComponent implements OnInit {

  node$: Observable<NodeItem>;  // for use in html-template with async-pipe ( advantage: no code for unsubscribe required )

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store<State, Action>) {

    this.node$ = combineLatest(this.store.select(), this.activatedRoute.queryParams).pipe(
      map(combined => (combined[0] as State).nodes[(combined[1] as Params).selected])
    );

  }

  ngOnInit() {
  }

  updateNode(id: string, name: string) {
    this.store.sendAction({type: "UPDATENODE", nodeId: id, name: name});
  }

}
