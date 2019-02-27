import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NodeItem } from './../model/nodeitem';
import { LinkItem } from './../model/linkitem';
import { LayoutService } from '@swimlane/ngx-graph/lib/graph/layouts/layout.service';
import { GraphComponent  } from '@swimlane/ngx-graph/lib/graph/graph.component'
import { Layout } from '@swimlane/ngx-graph/lib/models';
import { DagreSettings, Orientation } from '@swimlane/ngx-graph/lib/graph/layouts/dagre';

import { BehaviorSubject} from 'rxjs';

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
export class MygraphComponent implements OnInit, AfterViewInit {

  modalRef: BsModalRef;

  currentNodeId: string;

  @ViewChild(GraphComponent) 
  graph: GraphComponent;


  lid: number = 0;
  layout: Layout;
  nodeitems: NodeItem[] = [];
  linkitems: LinkItem[] = [];


  update$: BehaviorSubject<any>;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private layoutservice: LayoutService, private nodeservice: NodeService, private modalservice: BsModalService, private store: Store<State, Action>) { 
    this.layout = layoutservice.getLayout("dagre"); // "dagreCluster" , "dagreNodesOnly", "d3ForceDirected",  "colaForceDirected"  
    let dagreLayoutSettings: DagreSettings = this.layout.settings;
    dagreLayoutSettings.orientation = Orientation.TOP_TO_BOTTOM;
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(qp => {
      this.currentNodeId = (this.store.state.nlist.some(n => n == qp.selected )) ? qp.selected : null;
    });


    this.update$ = new BehaviorSubject<any>(null);
    this.redraw();  
  }

  ngAfterViewInit() {
    this.graph.select.subscribe((n: NodeItem) => {
      this.router.navigate(['/nodes/ctx1'], { queryParams: { selected: n.id } });
    });


  }

  relayout() {
    let sorted = sortGraphItems(this.graph.nodes,this.graph.links);
    this.store.sendAction({type: "UPDATESORTORDER", nodeIds: sorted.nodeIds, linkIds: sorted.linkIds }).subscribe((x) => {
      this.redraw();
    })
  }

  redraw() {
    this.nodeitems = this.store.state.nlist.map(n => this.store.state.nodes[n]);
    this.linkitems = this.store.state.llist.map(l => this.store.state.links[l])
    this.update$.next(null);
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
        this.redraw();
    });
  }

  deleteNode(node: NodeItem) {    
    this.store.sendAction({type: "DELETENODE", nodeId: node.id}).subscribe(x=>{
      this.router.navigate([], {queryParams: { selected: null }, queryParamsHandling: 'merge'});
      this.redraw();
    });
  }

  deleteLink(link: LinkItem) {  
    this.store.sendAction({ type: "DELETELINK" , linkId: link.id }).subscribe(x =>{
      this.redraw();
    });
  }

  hideContextMenu(){
    this.contextmenudata = null;
  }

}
