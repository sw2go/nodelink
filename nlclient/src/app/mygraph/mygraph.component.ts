import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NodeItem } from './../model/node';
import { LinkItem } from './../model/link';

import { LayoutService } from '@swimlane/ngx-graph/lib/graph/layouts/layout.service';
import { GraphComponent  } from '@swimlane/ngx-graph/lib/graph/graph.component'
import { Layout } from '@swimlane/ngx-graph/lib/models';
import { DagreSettings, Orientation } from '@swimlane/ngx-graph/lib/graph/layouts/dagre';

import { BehaviorSubject, fromEvent } from 'rxjs';
import { map,  filter, distinctUntilChanged, switchMap, tap, startWith } from 'rxjs/operators';

// observables to detect if l-Key is pressed
const __ldn = fromEvent(document, 'keydown').pipe(filter((x: any) => x.key == "l"), distinctUntilChanged((x,y) => x.key==y.key));
const lup = fromEvent(document, 'keyup').pipe(startWith({key: "l"}), filter((x: any) => x.key == "l"));
const ldn = lup.pipe(switchMap((x) => __ldn ));

@Component({
  selector: 'app-mygraph',
  templateUrl: './mygraph.component.html',
  styleUrls: ['./mygraph.component.scss']
})
export class MygraphComponent implements OnInit, AfterViewInit {


  @ViewChild(GraphComponent) 
  graph: GraphComponent;


  id: number = 0;
  lid: number = 0;
  layout: Layout;
  nodeitems: NodeItem[] = [];
  linkitems: LinkItem[] = [];

  nodesToLink: NodeItem[] = [];

  update$: BehaviorSubject<any>;

  constructor(private layoutsrv: LayoutService) { 

    this.layout = layoutsrv.getLayout("dagre"); // "dagreCluster" , "dagreNodesOnly", "d3ForceDirected",  "colaForceDirected"
    let s: DagreSettings = this.layout.settings;
    s.orientation = Orientation.TOP_TO_BOTTOM;
    
    this.id = 0;

  }

  newNodeId(): string {
    return "N" + ++this.id;
  }
  newLinkId(): string {
    return "L" + ++this.lid;
  }

  ngOnInit() {

    this.nodeitems.push(new NodeItem(this.newNodeId(), "N1"));
    this.nodeitems.push(new NodeItem(this.newNodeId(), "N2"));
    this.nodeitems.push(new NodeItem(this.newNodeId(), "N3"));
    this.nodeitems.push(new NodeItem(this.newNodeId(), "N4"));

    this.linkitems.push(new LinkItem(this.newLinkId(),"N1", "N2", "L1"));
    this.linkitems.push(new LinkItem(this.newLinkId(),"N1", "N3", "L2"));
    this.linkitems.push(new LinkItem(this.newLinkId(),"N1", "N4", "L3"));

    this.update$ = new BehaviorSubject<any>(null);
  }

  ngAfterViewInit() {
    console.log(this.graph);

    ldn.pipe(
      map(() => { let items: NodeItem[] = []; return items;} ),
      switchMap(items => this.graph.select.pipe(map((n: NodeItem ) => { if (!items.includes(n)){items.push(n);} return items; }))),
      filter(items => items.length > 1)
    ).subscribe( items => {

      let id: string = this.newLinkId()
      this.linkitems.push(new LinkItem(id,items[0].id, items[1].id,  id));
      this.update$.next(null);

    } );

  
  



    
  }



  onClick(event$) {
    //alert(event$);

    if (event$.shiftKey)
      console.log("shift");


    console.log(event$);
  }

  redraw() {
    this.update$.next(null);
  }

  addNode() {
    let id = this.newNodeId();
    this.nodeitems.push(new NodeItem(id, id));
    this.update$.next(null);
  }



}
