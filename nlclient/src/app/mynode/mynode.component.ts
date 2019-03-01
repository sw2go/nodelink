import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '../state/store';
import { Action, State } from '../state/reducer';
import { NodeItem } from '../model/nodeitem';
import { from } from 'rxjs';

@Component({
  selector: 'app-mynode',
  templateUrl: './mynode.component.html',
  styleUrls: ['./mynode.component.scss']
})
export class MynodeComponent implements OnInit {

  current: NodeItem;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store<State, Action>) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((qp) => {
      this.current = this.store.state.nodes[qp.selected];
    })
  }

  updateNode(name: string) {
    this.store.sendAction({type: "UPDATENODE", nodeId: this.current.id, name: name}).subscribe(x=>{
      this.router.navigate([], {queryParamsHandling: 'merge'} );
    }, e => console.log( "eeee " + e));
  }

}
