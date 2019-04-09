import { Injectable } from '@angular/core';
import { NodeItem } from './../model/nodeitem';
import { Observable, of, throwError } from 'rxjs';
import { LinkItem } from '../model/linkitem';
import { map, switchMap, tap } from 'rxjs/operators';
import { GraphSettings } from '../model/graphsettings';

@Injectable()
export class NodeService {

  private id: number = 0;
  private nodes: NodeItem[] = [];
  private links: LinkItem[] = [];
  private settings: GraphSettings;

  constructor() { 

    let n1: NodeItem = new NodeItem(this.newNodeId(), "N1", null);
    let n2: NodeItem = new NodeItem(this.newNodeId(), "N2", null);
    let n3: NodeItem = new NodeItem(this.newNodeId(), "N3", null);
    let n4: NodeItem = new NodeItem(this.newNodeId(), "N4", null);

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

    this.settings = { name: "nodelink" };
  }

  private newNodeId(): string {
    this.id = this.id + 1;
    return "N" + this.id.toString();
  }

  private newLinkId(): string {
    this.id = this.id + 1;
    return "L" + this.id.toString();
  }

  getGraphSettings(): Observable<GraphSettings> {
    return of(this.settings);
  }

  updateGraphSettings(settings: GraphSettings): Observable<GraphSettings> {
    this.settings = settings;
    return of(this.settings);
  }

  // liefert neuen Node
  addNode(targetNodeName: string): Observable<NodeItem> {    
    let targetNode = new NodeItem(this.newNodeId(), targetNodeName, null);
    this.nodes.push(targetNode);
    return of(targetNode);
  }

  // liefert neuen Link und Node
  addLinkAndNode(sourceNodeId: string, targetNodeName: string): Observable<{link: LinkItem, node: NodeItem}> {
    let six = this.nodes.findIndex(n => n.id == sourceNodeId);    
    if (six < 0)
      throw new RangeError("sourceId " + sourceNodeId + " not found");
    
    let targetNode = new NodeItem(this.newNodeId(), targetNodeName, null);
    this.nodes.splice(six+1, 0, targetNode);

    let lid = this.newLinkId();
    let newLink = new LinkItem(lid,sourceNodeId, targetNode.id, lid);
    this.links.push(newLink);
    return of({link: newLink, node: targetNode});
  }

  // liefert neuen Link
  addLink(sourceNodeId: string, targetNodeId: string): Observable<LinkItem> {
    let six = this.nodes.findIndex(n => n.id == sourceNodeId);
    let tix = this.nodes.findIndex(n => n.id == targetNodeId);
    if (six<0)
      throw new RangeError("sourceId " + sourceNodeId + " not found");
    if (tix<0)
      throw new RangeError("sourceId " + targetNodeId + " not found");    
    
    let lid = this.newLinkId();
    let newLink = new LinkItem(lid, sourceNodeId, targetNodeId, lid);
    this.links.push(newLink);
    return of(newLink);
  }

  updateNode(nodeId: string, name: string, desc: string ): Observable<NodeItem> {
    let nix = this.nodes.findIndex(n => n.id == nodeId);
    if (nix<0)
      throw new RangeError("nodeId " + nodeId + " not found");
    //let upd: NodeItem = {...this.nodes[nix], label: name} as NodeItem;
    let upd: NodeItem = new NodeItem(nodeId, name, desc); // da obige Zeile mit spread-operator immer ein "object" statt ein NodeItem liefert
    this.nodes[nix] = upd;
    if (name == "e")
      throw new Error('update failed with E!');
    return of (upd);
  }

  updateLink(linkId: string, name: string): Observable<LinkItem> {
    let lix = this.links.findIndex(l => l.id == linkId);
    if (lix<0)
      throw new RangeError("linkId " + linkId + " not found");
    let oldLink = this.links[lix];
    let upd: LinkItem = new LinkItem(oldLink.id, oldLink.source, oldLink.target, name); // da obige Zeile mit spread-operator immer ein "object" statt ein NodeItem liefert
    this.links[lix] = upd;
    if (name == "e")
      throw new Error('update failed with E!');
    return of (upd);
  }
  
  deleteLink(linkId: string): Observable<boolean> {
    let lix = this.links.findIndex(l => l.id == linkId);
    if (lix < 0)
      throw new RangeError("linkId " + linkId + " not found");
    this.links.splice(lix, 1); 
    return of(true); 
  }

  // liefert id's der gelöschten Links
  deleteNode(nodeId: string): Observable<string[]> {
    let nix = this.nodes.findIndex(n => n.id == nodeId);
    if (nix < 0)
      throw new RangeError("nodeId " + nodeId + " not found");
    else
      this.nodes.splice(nix, 1);

    let deletedLinkIds: string[] = [];
    while(true) {
      let lix = this.links.findIndex(l => l.source == nodeId || l.target == nodeId);
      if (lix < 0)
        break;      
      
      deletedLinkIds.push(this.links[lix].id);
      this.links.splice(lix, 1);
    }
    return of(deletedLinkIds);
  }

  // liefert nodes Objekt mit node Objekten und nlist Array mit Node-Id's
  getNodes(): Observable<{nodes: {[id: string]: NodeItem}, nlist: string[]}>{
    const nodes = this.nodes.reduce((acc, t) => (acc[t.id] = t, acc), {});
    const nlist =  this.nodes.map(t => t.id);
    return of ({nodes, nlist});
  }

  // liefert links Objekt mit link Objekten und llist Array mit Link-Id's
  getLinks(): Observable<{links: {[id: string]: LinkItem}, llist: string[]}>{
    const links = this.links.reduce((acc, t) => (acc[t.id] = t, acc), {});
    const llist =  this.links.map(t => t.id);
    return of ({links, llist});
  }

  // liefert 1 node
  getNode(id: string): Observable<{nodes: {[id: string]: NodeItem}, nlist: string[]}> {
    const filtered = this.nodes.filter(n => n.id == id);
    const nodes = filtered.reduce((acc, t) => (acc[t.id] = t, acc), {});
    const nlist =  filtered.map(t => t.id);
    return of ({nodes, nlist});
  }

  // liefert 1 link
  getLink(id: string): Observable<{links: {[id: string]: LinkItem}, llist: string[]}> {
    const filtered = this.links.filter(l => l.id == id);
    const links = filtered.reduce((acc, t) => (acc[t.id] = t, acc), {});
    const llist =  filtered.map(t => t.id);
    return of ({links, llist});
  }






  updateSortOrder(nodeIds: string[], linkIds: string[]): Observable<boolean> {
    this.nodes = nodeIds.map(id => this.nodes.find((n) => n.id == id ));
    this.links = linkIds.map(id => this.links.find((l) => l.id == id ));
    return of(true);
  }

  getLinkableNodes(sourceNode: NodeItem): Observable<NodeItem[]> {
    return of(this.nodes).pipe(
      map(nodes => nodes.filter(n => sourceNode && n.id != sourceNode.id && (this.links.findIndex(l => l.source == sourceNode.id && l.target == n.id) < 0))
    ));
  }

  hrefGraphData(): string {
    let data = { settings: this.settings, nodes: this.nodes.map(n => new NodeItem(n.id, n.label, n.description)), links: this.links.map(l => new LinkItem(l.id, l.source, l.target, l.label)) };
    let json = JSON.stringify(data);
    let blob = new Blob([json], {type: "application/json"});
    return URL.createObjectURL(blob);
  }

  setFromFile(file: File): Observable<boolean> {

    return readFile(file).pipe(        
      map(str => {
        let data: { settings: GraphSettings, nodes: NodeItem[], links: LinkItem[] } = JSON.parse(str);
        this.settings = data.settings;
        this.nodes = data.nodes;
        this.links = data.links;
        return true;
      })
    );
  }
}


const readFile = (blob: Blob): Observable<string> => Observable.create(obs => {
  if (!(blob instanceof Blob)) {
    obs.error(new Error('`blob` must be an instance of File or Blob.'));
    return;
  }

  const reader = new FileReader();
  reader.onerror = err => obs.error(err);
  reader.onabort = err => obs.error(err);
  reader.onload = () => obs.next(reader.result);
  reader.onloadend = () => obs.complete();
  return reader.readAsText(blob);
});



