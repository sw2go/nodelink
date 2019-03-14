import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NodeItem } from './../model/nodeitem';
import { LinkItem } from './../model/linkitem';
import { LayoutService } from '@swimlane/ngx-graph/lib/graph/layouts/layout.service';
import { GraphComponent  } from '@swimlane/ngx-graph/lib/graph/graph.component'
import { Layout } from '@swimlane/ngx-graph/lib/models';
import { DagreSettings, Orientation } from '@swimlane/ngx-graph/lib/graph/layouts/dagre';

import { Observable, Subscription} from 'rxjs';

import { NodeService } from '../service/node.service';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAddNodeComponent } from '../modal-add-node/modal-add-node.component';
import { CtxType, ContextMenuData } from '../model/contextmenudata';
import { Item } from '../model/item';
import { Store } from '../state/store';
import { Action, State } from '../state/reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { sortGraphItems } from './graphsortpolicy';


@Component({
  selector: 'app-mygraph',
  templateUrl: './mygraph.component.html',
  styleUrls: ['./mygraph.component.scss']
})
export class MygraphComponent implements OnInit, OnDestroy, AfterViewInit {

  storesub: Subscription;
  store$: Observable<State>;

  modalRef: BsModalRef;

  selectedGraphId: string;

  @ViewChild(GraphComponent) 
  graph: GraphComponent;

  layout: Layout;
  nodeitems: NodeItem[] = [];
  linkitems: LinkItem[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private layoutservice: LayoutService, private nodeservice: NodeService, private modalservice: BsModalService, private store: Store<State, Action>) { 
    this.layout = layoutservice.getLayout("dagre"); // "dagreCluster" , "dagreNodesOnly", "d3ForceDirected",  "colaForceDirected"  
    let dagreLayoutSettings: DagreSettings = this.layout.settings;
    dagreLayoutSettings.orientation = Orientation.TOP_TO_BOTTOM;
    this.store$ = store.select();
  }

  ngOnInit() {
    // subscribe to query-parameter "selected", used to update the display-style of the selected node in graph
    this.activatedRoute.queryParams.subscribe(qp => {
      this.selectedGraphId = (this.store.state.nlist.some(n => n == qp.selected ) || this.store.state.llist.some(l => l == qp.selected )) ? qp.selected : null;
      console.log("after new query parameter");
    });
      
    // subscribe to store, used to redraw graph after any state changes
    this.storesub = this.store.select().subscribe( state => {
      this.linkitems = state.llist.map(l => state.links[l]);
      this.nodeitems = state.nlist.map(n => state.nodes[n]);
      this.graph.update();
      console.log("after redraw");
    });
  }
  selectionChanged(id: string, ctx: string) {
    this.router.navigate(['nodes', ctx], { queryParams: { selected: id } });
  };

  ngOnDestroy() {
    this.storesub.unsubscribe();  // unsubscribe here from state if you don't use "| async" in the html-template
  }

  ngAfterViewInit() {
    // subscribe to "graph.select", used to update the url with a "selected" query-parameter

  }

  relayoutClicked() {
    let sorted = sortGraphItems(this.graph.nodes,this.graph.links);
    this.store.sendAction({type: "UPDATESORTORDER", nodeIds: sorted.nodeIds, linkIds: sorted.linkIds });
  }


  // Context-Menu Stuff
  // ------------------
  contextmenudata: ContextMenuData = null;

  showContextMenu(item: Item, x: number, y: number) {

    if (item==null && this.contextmenudata != null) // da das "contextmenu" event hochpropagiert wird nach dem Node-Klick auch noch ein Panel-Klick ausgelöst 
      return;                                       // deshalb -> wenn Menü bereits offen -> Abbruch

    let type: CtxType = (item == null) ? CtxType.Panel : ((item instanceof NodeItem) ? CtxType.Node : CtxType.Link );
    let id: string = (item) ? item.id : null;
    this.contextmenudata = new ContextMenuData(type, id, x, y);
    this.contextmenudata.addNode = () => { this.showAddLinkNode(item as NodeItem) };
    this.contextmenudata.addLink = () => { this.showAddLinkNode(item as NodeItem) };
    this.contextmenudata.delNode = () => { this.deleteNode(item as NodeItem) };
    this.contextmenudata.delLink = () => { this.deleteLink(item as LinkItem) };
  }

  showAddLinkNode(sourceNode: NodeItem) {
    let config: ModalOptions = { initialState: { sourceNode: sourceNode } };
    this.modalRef = this.modalservice.show(ModalAddNodeComponent, config);
    this.modalRef.content.onClose.subscribe(result => { /*falls mal nötig*/ } );
  }

  deleteNode(node: NodeItem) {    
    this.store.sendAction({type: "DELETENODE", nodeId: node.id});
  }

  deleteLink(link: LinkItem) {  
    this.store.sendAction({ type: "DELETELINK" , linkId: link.id });
  }

  hideContextMenu(){
    this.contextmenudata = null;
  }

  saveGraphToFile(aElementRef: any) {
    aElementRef.href = this.nodeservice.hrefGraphData();
  }

  loadGraphFromFile(file: File) {
    this.store.sendAction({ type: "READFROMFILE" , file: file });
  }
}
