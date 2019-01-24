import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NodeItem } from './../model/node';
import { LinkItem } from './../model/link';
import { Node } from '@swimlane/ngx-graph/lib/models';

import { LayoutService } from '@swimlane/ngx-graph/lib/graph/layouts/layout.service';
import { GraphComponent  } from '@swimlane/ngx-graph/lib/graph/graph.component'
import { Layout } from '@swimlane/ngx-graph/lib/models';
import { DagreSettings, Orientation } from '@swimlane/ngx-graph/lib/graph/layouts/dagre';

import { BehaviorSubject, fromEvent, of } from 'rxjs';
import { map,  filter, distinctUntilChanged, switchMap, tap, startWith, delay, merge, groupBy, mergeAll } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

const keyDowns = fromEvent(document, "keydown");
const keyUps = fromEvent(document, "keydown");

const keyPress = keyDowns.pipe(
  merge(keyUps),
  groupBy((e: any) => e.keyCode),
  distinctUntilChanged((e: any) => e.type)
);




// observables to detect if l-Key is pressed
const __ldn = fromEvent(document, 'keydown').pipe(filter((x: any) => x.key == "l"), distinctUntilChanged((x,y) => x.key==y.key));
const lup = fromEvent(document, 'keyup').pipe(startWith({key: "l"}), filter((x: any) => x.key == "l"));
const ldn = lup.pipe(switchMap((x) => __ldn ));

const __adn = fromEvent(document, 'keydown').pipe(filter((x: any) => x.key == "a"), distinctUntilChanged((x,y) => x.key==y.key));
const aup = fromEvent(document, 'keyup').pipe(startWith({key: "a"}), filter((x: any) => x.key == "a"));
const adn = aup.pipe(switchMap((x) => __adn ));

const resize = fromEvent(window, 'resize');


@Component({
  selector: 'app-mygraph',
  templateUrl: './mygraph.component.html',
  styleUrls: ['./mygraph.component.scss']
})
export class MygraphComponent implements OnInit, AfterViewInit {

  current: NodeItem;

  @ViewChild(GraphComponent) 
  graph: GraphComponent;


  id: number = 0;
  lid: number = 0;
  layout: Layout;
  nodeitems: NodeItem[] = [];
  linkitems: LinkItem[] = [];


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

    
    let n1: NodeItem = new NodeItem(this.newNodeId(), "N1");
    let n2: NodeItem = new NodeItem(this.newNodeId(), "N2");
    let n3: NodeItem = new NodeItem(this.newNodeId(), "N3");
    let n4: NodeItem = new NodeItem(this.newNodeId(), "N4");

    let l1: LinkItem = new LinkItem(this.newLinkId(),n1.id, n2.id, "L1")
    let l2: LinkItem = new LinkItem(this.newLinkId(),n1.id, n3.id, "L2")
    let l3: LinkItem = new LinkItem(this.newLinkId(),n1.id, n4.id, "L3")
   
    this.nodeitems.push(n1);
    this.nodeitems.push(n2);
    this.nodeitems.push(n3);
    this.nodeitems.push(n4);


    this.linkitems.push(l1);    
    this.linkitems.push(l2);
    this.linkitems.push(l3);
  
    this.update$ = new BehaviorSubject<any>(null);
  }

  ngAfterViewInit() {
    console.log(this.graph);

    this.graph.select.subscribe((n: NodeItem) => {
      this.current = n;
    });


    keyPress.subscribe( x => console.log(x));


    ldn.pipe(
      map(() => { let items: NodeItem[] = []; return items;} ),
      switchMap(items => this.graph.select.pipe(map((n: NodeItem ) => { 
        if (items.length==2) { items = []; }
        if (!items.includes(n)){ items.push(n); } 
        return items; 
      }))),
      filter(items => items.length > 1)
    ).subscribe( items => {

      let id: string = this.newLinkId()
      this.linkitems.push(new LinkItem(id,items[0].id, items[1].id,  id));
      this.update$.next(null);

    } );

    ldn.subscribe( x => console.log("dn")   );
    lup.subscribe( x => console.log("up")   );




    resize.subscribe((x: any) => {
      this.graph.view = [ window.innerWidth *0.66  , window.innerHeight - 100];
      this.update$.next(null);
    });

    of('dummy').pipe(delay(2)).subscribe(x => window.dispatchEvent(new Event('resize')));
  
  }



  onClick(event$) {
    //alert(event$);

    if (event$.shiftKey)
      console.log("shift");


    console.log(event$);
  }

  redraw() {
    this.sort();
    this.update$.next(null);

    
  }

  addNode() {

    let nid = this.newNodeId();
    let n = new NodeItem(nid, nid);

    if (this.current==null) {
      this.nodeitems.push(n);
    }
    else {
      let ix = this.nodeitems.findIndex(n => this.current.id == n.id);
      if (ix !== -1) {
        this.nodeitems.push(n);        
        let lid = this.newLinkId();
        this.linkitems.push(new LinkItem(lid,this.current.id, n.id, lid));
      }
    }
    this.update$.next(null);
  }

  updateNode(label: string) {

    let ix = this.nodeitems.findIndex(n => this.current.id == n.id);
    if (ix !== -1) {
      this.nodeitems[ix].label = label; //  = new NodeItem(this.current.id, this.current.label  + "33");
      this.update$.next(null);
    }      
  }


  sort() {

    let s: NodeItem[] = this.nodeitems.slice();
    s.sort((a: Node, b: Node) =>  (a.position.y == b.position.y) ? a.position.x - b.position.x : a.position.y - b.position.y);
        
/*
    s.forEach((element: Node) => {

      console.log( { n: element.label,  p: element.position });
      
    });
*/
    

  

  }






}
