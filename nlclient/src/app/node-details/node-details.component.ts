import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeItem } from '../model/nodeitem';
import { Store } from '../state/store';
import { State } from '../model/state';
import { Action } from '../state/reducer';
import { ChangeAnalyzer } from '../state/changeanalyzer';
import { map, filter, tap, switchMap } from 'rxjs/operators';
import { ItemType } from '../model/item';
import { Router } from '@angular/router';
import { NodeService } from '../service/node.service';
import { NodeColorOption } from '../model/nodecoloroption';
import { NodeShapeOption } from '../model/nodeshapeoption';


@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit {

  selectedShape: number;
  selectedColor: string;
  
  item$: Observable<NodeItem>;  // for use in html-template with async-pipe ( advantage: no code for unsubscribe required )
  shapeOption$: Observable<NodeShapeOption[]>;
  colorOption$: Observable<NodeColorOption[]>;
  
  
  disable: boolean;

  constructor(private store: Store<State, Action>, private router: Router, private ns: NodeService) { 

    this.item$ = store.state$.pipe(
      map(x => ChangeAnalyzer.ItemSelectionChanged(x) || ChangeAnalyzer.ItemUpdated(x) ), 
      filter( x => x != null), 
      tap(x => this.selectedShape = (x.item as NodeItem).shape), 
      tap(x => this.disable = true),
      map(x => { return ((x.item) ? (x.item.type == ItemType.Node) ? x.item : null : null) as NodeItem; })
    );

    this.shapeOption$ = ns.getNodeShapeOptions();

    this.colorOption$ = store.state$.pipe(
      map(x => ChangeAnalyzer.ItemSelectionChanged(x) || ChangeAnalyzer.ItemUpdated(x) ),
      filter( x => x != null),
      tap(x => this.selectedColor = (x.item as NodeItem).color),
      switchMap(x => ns.getNodeColorOptions(x.item as NodeItem))
    );

  }

  ngOnInit() {
  }

  updateItem(id: string, name: string, description: string, shape: number, color: string) {

    console.log(shape);

    this.store.sendAction({type: "UPDATENODE", node: new NodeItem(id, name, description, shape, color)}).subscribe( 
      ok => this.router.navigate(['nodes']),
      err => console.log(err)
    );
  }

  test() {
    this.store.sendAction({type: "TEST"});
  }




}
