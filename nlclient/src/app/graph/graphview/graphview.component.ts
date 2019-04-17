import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NodeItem } from './../../model/nodeitem';
import { LinkItem } from './../../model/linkitem';
import { LayoutService } from '@swimlane/ngx-graph/lib/graph/layouts/layout.service';
import { GraphComponent  } from '@swimlane/ngx-graph/lib/graph/graph.component'
import { Layout } from '@swimlane/ngx-graph/lib/models';
import { DagreSettings, Orientation } from '@swimlane/ngx-graph/lib/graph/layouts/dagre';
import { Subscription} from 'rxjs';
import { NodeService } from '../../service/node.service';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAddNodeComponent } from '../../modal-add-node/modal-add-node.component';
import { Item, ItemType } from '../../model/item';
import { Store } from '../../state/store';
import { Action} from '../../state/reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';
import { State } from '../../model/state';
import { ChangeAnalyzer } from '../../state/changeanalyzer';


@Component({
  selector: 'app-graphview',
  templateUrl: './graphview.component.html',
  styleUrls: ['./graphview.component.scss']
})
export class GraphviewComponent implements OnInit, OnDestroy, AfterViewInit {

  statesub: Subscription;
  
  selectedItem: Item = null;

  @ViewChild(ContextMenuComponent)
  contextmenu: ContextMenuComponent;
  
  @ViewChild(GraphComponent) 
  graph: GraphComponent;

  url: string;    // path only ( without param and fragment for firefox svg-problems )

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private layoutservice: LayoutService, private nodeservice: NodeService, private modal: BsModalService, private store: Store<State, Action>) { 
    this.url = /[^#?]+/.exec(this.router.url)[0]; 
    console.log(">>> " +  this.url);
  }

  ngOnInit() {

    console.log("mygraph init");


    // subscribe to query-parameter "selected", used to update the display-style of the selected node in graph
    this.activatedRoute.queryParams.subscribe(qp => {    
      console.log("after new query parameter");
    });


    let layout: Layout = this.layoutservice.getLayout("dagre"); // "dagreCluster" , "dagreNodesOnly", "d3ForceDirected",  "colaForceDirected"  
    let dagreLayoutSettings: DagreSettings = layout.settings;
    dagreLayoutSettings.orientation = Orientation.TOP_TO_BOTTOM;

    this.graph.layout = layout;

    this.statesub = this.store.state$.subscribe(change => {

      let analyzer = new ChangeAnalyzer(change);
      analyzer.GraphModelChanged((m) => {        
        this.graph.links = m.links;
        this.graph.nodes = m.nodes;
        console.log("mygraph before update");
        this.graph.update();    
      });

      analyzer.ItemSelectionChanged((m) => {
        this.selectedItem = m.item;
      });
    
    });

  }
  selectionChanged(id: string) {
    this.contextmenu.hide();
    this.store.sendAction({type: "CHANGESELECTION", id: id});
    //this.router.navigate(['nodes'], { queryParams: { selected: id } }); keine Option da Firefox Probleme macht (svg)
  };

  ngOnDestroy() {
    console.log("mygraph destroy");
    this.statesub.unsubscribe(); // unsubscribe here from state if you don't use "| async" in the html-template
  }

  ngAfterViewInit() {
    // subscribe to "graph.select", used to update the url with a "selected" query-parameter
  }

  public isNode(item: Item) : boolean {
      return (item && item.type == ItemType.Node);
  }

  public isLink(item: Item) : boolean {
      return (item && item.type == ItemType.Link);
  }

  public selectedId() : string {
    return (this.selectedItem) ? this.selectedItem.id : null;
  }


  // Context-Menu Stuff
  // ------------------

  showContextMenu(item: Item, x: number, y: number) {

    if (this.contextmenu.x == x && this.contextmenu.y)  // da das "contextmenu" event hochpropagiert, wird nach dem Node-Klick auch noch ein Panel-Klick ausgelöst 
      return;                                           // deshalb -> wenn Menü an dieser Position bereits offen -> Abbruch, 
                                                        // $event.stopPropagation() ist keine Lösung denn nach Panel-Click kommt noch: oncontextmenu="return false;" 

    this.store.sendAction({type: "CHANGESELECTION", id: (item) ? item.id : null})
                                                      
    this.contextmenu.show( x,y, [
      { text: "Edit Node",     show: this.isNode(item), call: () => this.editNode(item.id) },  
      { text: "Add Node",      show: item == null     , call: () => this.showAddLinkNode(item as NodeItem) },
      { text: "Add Link/Node", show: this.isNode(item), call: () => this.showAddLinkNode(item as NodeItem) },  
      { text: "Remove Node",   show: this.isNode(item), call: () => this.deleteNode(item as NodeItem) },
      { text: "Remove Link",   show: this.isLink(item), call: () => this.deleteLink(item as LinkItem) }  
    ]);
  }

  hideContextMenu(){
    this.contextmenu.hide();
  }

  showAddLinkNode(sourceNode: NodeItem) {
    let config: ModalOptions = { initialState: { sourceNode: sourceNode } };
    this.modal.show(ModalAddNodeComponent, config);  
  }

  deleteNode(node: NodeItem) {    
    this.store.sendAction({type: "DELETENODE", nodeId: node.id});
  }

  deleteLink(link: LinkItem) {  
    this.store.sendAction({ type: "DELETELINK" , linkId: link.id });
  }

  editNode(id: string) {
    this.router.navigate(['nodes', 'edit', id])
  }

}
