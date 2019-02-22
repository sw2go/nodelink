import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NodeItem } from './../model/nodeitem';
import { LinkItem } from './../model/linkitem';
import { Node } from '@swimlane/ngx-graph/lib/models';

import { LayoutService } from '@swimlane/ngx-graph/lib/graph/layouts/layout.service';
import { GraphComponent  } from '@swimlane/ngx-graph/lib/graph/graph.component'
import { Layout } from '@swimlane/ngx-graph/lib/models';
import { DagreSettings, Orientation } from '@swimlane/ngx-graph/lib/graph/layouts/dagre';

import { BehaviorSubject, fromEvent, of } from 'rxjs';
import { map,  filter, distinctUntilChanged, switchMap, tap, startWith, delay, merge, groupBy, mergeAll, concat, concatMap, mergeMap, exhaustMap, debounce } from 'rxjs/operators';
import { group } from '@angular/animations';
import { NodeService } from '../service/node.service';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAddNodeComponent } from '../modal-add-node/modal-add-node.component';
import { CtxType, ContextMenuData } from '../model/contextmenudata';
import { Item } from '../model/item';

const keyDowns = fromEvent(document, "keydown");
const keyUps = fromEvent(document, "keydown");

const keyPress = keyDowns.pipe(
  merge(keyUps),
  groupBy((e: any) => e.keyCode),
  distinctUntilChanged((e: any) => e.type)
);

const fkey = fromEvent(document, "keydown").pipe(filter((d:any) => d.key == 'f'),
  switchMap((d:any) => of(d).pipe(merge(fromEvent(document, 'keyup').pipe(filter((u:any) => u.key == d.key)))))
)



// observables to detect if l-Key is pressed
const __ldn = fromEvent(document, 'keydown').pipe(filter((x: any) => x.key == "l"), distinctUntilChanged((x,y) => x.key==y.key));
const lup = fromEvent(document, 'keyup').pipe(startWith({key: "l"}), filter((x: any) => x.key == "l"));
const ldn = lup.pipe(switchMap((x) => __ldn ));

const l = lup.pipe(merge(ldn));

//const cl = fromEvent(document, 'keydown').pipe(distinctUntilChanged((x: any ,y: any) => x.key==y.key)


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

  modalRef: BsModalRef;


  current: NodeItem;

  @ViewChild(GraphComponent) 
  graph: GraphComponent;


  lid: number = 0;
  layout: Layout;
  nodeitems: NodeItem[] = [];
  linkitems: LinkItem[] = [];


  update$: BehaviorSubject<any>;

  constructor(private layoutservice: LayoutService, private nodeservice: NodeService, private modalservice: BsModalService) { 
    this.layout = layoutservice.getLayout("dagre"); // "dagreCluster" , "dagreNodesOnly", "d3ForceDirected",  "colaForceDirected"  
    let dagreLayoutSettings: DagreSettings = this.layout.settings;
    dagreLayoutSettings.orientation = Orientation.TOP_TO_BOTTOM;
  }

  ngOnInit() {

    this.update$ = new BehaviorSubject<any>(null);
    this.reload();  
  }

  ngAfterViewInit() {
    this.graph.select.subscribe((n: NodeItem) => {
      this.current = n;
    });







    fkey.subscribe( x => console.log(x));

    





    

    // ldn.pipe(
    //   map(() => { let items: NodeItem[] = []; return items;} ),
    //   switchMap(items => this.graph.select.pipe(map((n: NodeItem ) => { 
    //     if (items.length==2) { items = []; console.log("clear");}
    //     if (!items.includes(n)){ items.push(n); console.log(n.label);      } 
    //     return items; 
    //   }))),
    //   filter(items => items.length > 1)
    // ).subscribe( items => {

    //   let id: string = this.newLinkId()
    //   this.linkitems.push(new LinkItem(id,items[0].id, items[1].id,  id));
    //   this.update$.next(null);

    // } );

    ldn.subscribe( x => console.log("dn")   );
    lup.subscribe( x => console.log("up")   );



  /*  nicht nötig wenn man nichts im resize machen will
    resize.subscribe((x: any) => {
      this.update$.next(null); // kann muss aber nicht
    });

    of('dummy').pipe(delay(2)).subscribe(x => window.dispatchEvent(new Event('resize')));
  */
  }


  updateNode(label: string) {
    let ix = this.nodeitems.findIndex(n => this.current.id == n.id);
    if (ix !== -1) {
      this.nodeitems[ix].label = label;
      this.update$.next(null);
    }      
  }


  sort() {
    this.nodeservice.sortNodes().subscribe(nodes => this.nodeitems =nodes);
    this.nodeservice.sortLinks().subscribe( links => this.linkitems = links);
  }


  contextmenudata: ContextMenuData = null;

  showContextMenu(item: Item, x: number, y: number){
    let type: CtxType = (item instanceof NodeItem) ? CtxType.Node : CtxType.Link;
    this.contextmenudata = new ContextMenuData(type, item.id, x, y);
    this.contextmenudata.addLink = () => { this.showAddLinkNode(item as NodeItem) };
    this.contextmenudata.delNode = () => { this.deleteNode(item as NodeItem) };
    this.contextmenudata.delLink = () => { this.deleteLink(item as LinkItem) };
  }

  showAddLinkNode(sourceNode: NodeItem) {
    let config: ModalOptions = { initialState: { sourceNode: sourceNode } };
    this.modalRef = this.modalservice.show(ModalAddNodeComponent, config);
    this.modalRef.content.onClose.subscribe(result => {
      if (result)
        this.reload();
    });
  }

  deleteNode(node: NodeItem) {    
    this.nodeservice.deleteNode(node.id);
    this.current = null;
    this.reload();
  }

  deleteLink(link: LinkItem) {    
    this.nodeservice.deleteLink(link.id);
    this.reload();
  }

  reload() {
    this.nodeservice.getNodes().subscribe(nodes => this.nodeitems = nodes);
    this.nodeservice.getLinks().subscribe(links => this.linkitems = links);
    this.update$.next(null);
  }

  hideContextMenu(){
    this.contextmenudata = null;
  }

}
