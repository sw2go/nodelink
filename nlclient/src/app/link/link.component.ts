import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../model/linkitem';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '../state/store';
import { State, Action } from '../state/reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  item$: Observable<LinkItem>;  // for use in html-template with async-pipe ( advantage: no code for unsubscribe required )

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store<State, Action>) { 
    this.item$ = combineLatest(this.store.select(), this.activatedRoute.queryParams).pipe(
      map(combined => (combined[0] as State).links[(combined[1] as Params).selected])
    );
  }

  ngOnInit() {
  }

  updateItem(id: string, name: string) {
    this.store.sendAction({type: "UPDATELINK", linkId: id, name: name});
  }

}
