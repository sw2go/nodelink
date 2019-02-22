import { Injectable } from '@angular/core';
import { NodeItem } from './../model/nodeitem';
import { Observable, of } from 'rxjs';
import { LinkItem } from '../model/linkitem';
import { map } from 'rxjs/operators';

import { Node, Edge } from '@swimlane/ngx-graph/lib/models';

@Injectable()
export class NodeService {

  private id: number = 0;
  private nodes: NodeItem[] = [];
  private links: LinkItem[] = [];

  constructor() { 

    let n1: NodeItem = new NodeItem(this.newNodeId(), "N1");
    let n2: NodeItem = new NodeItem(this.newNodeId(), "N2");
    let n3: NodeItem = new NodeItem(this.newNodeId(), "N3");
    let n4: NodeItem = new NodeItem(this.newNodeId(), "N4");

    let l1: LinkItem = new LinkItem(this.newLinkId(),n1.id, n2.id, "L1")
    let l2: LinkItem = new LinkItem(this.newLinkId(),n1.id, n3.id, "L2")
    let l3: LinkItem = new LinkItem(this.newLinkId(),n1.id, n4.id, "L3")

    this.nodes.push(n1);
    this.nodes.push(n2);
    this.nodes.push(n3);
    this.nodes.push(n4);

    this.links.push(l1);
    this.links.push(l2);
    this.links.push(l3);
  }

  private newNodeId(): string {
    this.id = this.id + 1;
    return "N" + this.id.toString();
  }

  private newLinkId(): string {
    this.id = this.id + 1;
    return "L" + this.id.toString();
  }

  addLinkAndNode(sourceNodeId: string, targetNodeName: string): boolean {
    let six = this.nodes.findIndex(n => n.id == sourceNodeId);    
    if (six < 0)
      return false;
    
    let targetNode = new NodeItem(this.newNodeId(), targetNodeName);
    this.nodes.splice(six+1, 0, targetNode);

    let lid = this.newLinkId();
    let newLink = new LinkItem(lid,sourceNodeId, targetNode.id, lid);
    this.links.push(newLink);
    return true;
  }

  addLink(sourceNodeId: string, targetNodeId: string): void {
    let six = this.nodes.findIndex(n => n.id == sourceNodeId);
    let tix = this.nodes.findIndex(n => n.id == targetNodeId);
    if (six>=0 && tix>=0) {
      let lid = this.newLinkId();
      let newLink = new LinkItem(lid,sourceNodeId, targetNodeId, lid);
      this.links.push(newLink);
    }
  }
  
  deleteLink(linkId: string) {
    let lix = this.links.findIndex(l => l.id == linkId);
    if (lix < 0)
      return false;

    this.links.splice(lix, 1);  
  }

  deleteNode(nodeId: string) {
    let nix = this.nodes.findIndex(l => l.id == nodeId);
    if (nix < 0)
      return false;
    else
      this.nodes.splice(nix, 1);

    while(true) {
      let lix = this.links.findIndex(l => l.source == nodeId || l.target == nodeId);
      if (lix < 0)
        break;      
      else
        this.links.splice(lix, 1);
    }
  }

  sortNodes(): Observable<NodeItem[]> {
    let sn: SortNode[] = this.nodes.map(n => new SortNode(n,this.level(n.id)));
    sn.sort((a, b) => (a.level == b.level) ? a.nodeItem.position.x - b.nodeItem.position.x : a.level - b.level);
    
    let sortedNodes: NodeItem[] = sn.map(sn => sn.nodeItem as NodeItem);
    
    this.nodes = sortedNodes;
    this.nodes.forEach(n => console.log(n.label));

    return this.getNodes();
  }

  level(nodeId: string): number {
    let l=0;
    let link: LinkItem = this.links.find(l => l.target == nodeId);
    if (link) {
      let source: Node = this.nodes.find(n => n.id == link.source);
      let target: Node = this.nodes.find(n => n.id == link.target);
      if (source.position.y < target.position.y) {
        return 1 + this.level(link.source);
      }      
    }           
    return l;
  }

  sortLinks(): Observable<LinkItem[]> {
    let sl: SortLink[] = this.links.map(l => {
      let source: Node = this.nodes.find((n: Node) => n.id == l.source);
      let target: Node = this.nodes.find((n: Node) => n.id == l.target);
      return new SortLink(l, source.id, source.position.x, source.position.y,target.id, target.position.x, target.position.y);
    });

    sl.sort((a: SortLink, b: SortLink) => { 
      if (a.sy == b.sy) {
        if (a.sx == b.sx)
          return b.angle() - a.angle();
        else 
          return a.sx - b.sx;
      }
      else
        return a.sy - b.sy;
    });
        
    let sortedLinks: LinkItem[] = sl.map(sl => sl.linkItem);
    this.links = sortedLinks;
    this.links.forEach(l => console.log(l.label));
    return this.getLinks();
  }

  getNodes(): Observable<NodeItem[]> {
    return of(this.nodes);
  }

  getLinks(): Observable<LinkItem[]> {
    return of(this.links);
  }

  getLinkableNodes(sourceNode: NodeItem): Observable<NodeItem[]> {
    return of(this.nodes).pipe(
      map(nodes => nodes.filter(n => n.id != sourceNode.id && (this.links.findIndex(l => l.source == sourceNode.id && l.target == n.id) < 0))
    ));
  }
}


export class SortNode {
  public constructor(
    public nodeItem: Node,
    public level: number
  ){}
}


export class SortLink {
  public constructor(
  public linkItem: LinkItem,

  public sid: string,
  public sx: number,
  public sy: number,

  public tid: string,
  public tx: number,
  public ty: number){}

  public angle() {
    return Math.atan2(this.ty - this.sy, this.tx - this.sx);
  }
}
