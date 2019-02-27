import { Edge, Node } from '@swimlane/ngx-graph/lib/models';

export function sortGraphItems(nodes: Node[], links: Edge[]): {nodeIds: string[] , linkIds: string[]} {
    return { nodeIds: sortNodes(nodes, links), linkIds: sortLinks(nodes,links) };
}


function sortNodes(nodes: Node[], links: Edge[]): string[] {
    let sn: SortNode[] = nodes.map(n => new SortNode(n, level(n.id, nodes, links)));
    sn.sort((a, b) => (a.level == b.level) ? a.nodeItem.position.x - b.nodeItem.position.x : a.level - b.level);
    
    let sortedNodes: Node[] = sn.map(sn => sn.nodeItem);
    sortedNodes.forEach(n => console.log(n.label));

    return sortedNodes.map(n => n.id);
}

function level(nodeId: string, nodes: Node[], links: Edge[]): number {
    let l=0;
    let link: Edge = links.find(l => l.target == nodeId);
    if (link) {
      let source: Node = nodes.find(n => n.id == link.source);
      let target: Node = nodes.find(n => n.id == link.target);
      if (source.position.y < target.position.y) {
        return 1 + level(link.source, nodes, links);
      }      
    }           
    return l;
}

function sortLinks(nodes: Node[], links: Edge[]): string[] {
    let sl: SortLink[] = links.map(l => {
      let source: Node = nodes.find((n: Node) => n.id == l.source);
      let target: Node = nodes.find((n: Node) => n.id == l.target);
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

    sl.forEach(l => console.log(l.linkItem.label));

    return sl.map(l => l.linkItem.id);
  }




class SortNode {
    public constructor(
    public nodeItem: Node,
    public level: number
    ){}
}
  
  
class SortLink {
    public constructor(
    public linkItem: Edge,

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