import { Reducer, Store } from './store';
import { Observable, pipe, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { NodeService } from '../service/node.service';
import { RouterStateSnapshot, Router } from '@angular/router';
import { NodeItem } from '../model/nodeitem';
import { LinkItem } from '../model/linkitem';


// State
export type State = {
  nodes: { [id: string]: NodeItem},
  nlist: string[],
  links: { [id: string]: LinkItem},
  llist: string[],
  nid: string
};

export const initState: State = { nodes: {}, nlist: [],  links: {}, llist: [], nid: null };

// Actions
export type RouterNavigation = { type: 'ROUTER_NAVIGATION', state: RouterStateSnapshot };
export type UpdateSortOrder = { type: 'UPDATESORTORDER', nodeIds: string[], linkIds: string[] };
export type AddNode = { type: 'ADDNODE', targetNodeName: string };
export type AddLink = { type: 'ADDLINK', sourceNodeId: string, targetNodeId: string };
export type AddLinkAndNode = { type: 'ADDLINKANDNODE', sourceNodeId: string, targetNodeName: string };
export type DeleteNode = { type: 'DELETENODE', nodeId: string };
export type DeleteLink = { type: 'DELETELINK', linkId: string };
export type UpdateNode = { type: 'UPDATENODE', nodeId: string, name: string };
export type UpdateLink = { type: 'UPDATELINK', linkId: string, name: string };
export type ReadFromFile = { type: 'READFROMFILE', file: File };


export type Rate = { type: 'RATE', talkId: number, rating: number };
export type Unrate = { type: 'UNRATE', talkId: number, error: any };

export type Action = RouterNavigation | UpdateSortOrder | DeleteLink |
 DeleteNode | AddNode | AddLink | AddLinkAndNode | UpdateNode | UpdateLink | Rate | Unrate |
 ReadFromFile;


export function isAction<T extends Action>(action: Action): action is T {
  if ((action as T).type)
    return true;
  else 
    return false;
}

function fetchStateData(backend: NodeService, state: State, nid: string): Observable<State> {
  return backend.getNodes().pipe(
    switchMap(n => backend.getLinks().pipe(map(l => ({...state, nodes: n.nodes, nlist: n.nlist, links: l.links, llist: l.llist, nid: nid }))))
  );
}

export function reducer(backend: NodeService, router: Router): Reducer<State, Action> {
    return (store: Store<State, Action>, state: State, action: Action): Observable<State> => {      
      console.log("reducer: " + action.type);
      if (action.type == 'ROUTER_NAVIGATION') {
        const route = action.state.root.firstChild.firstChild; 
        const qp = action.state.root.queryParams;
        //console.log("reducer: ROUTER_NAVIGATION(" + route.routeConfig.path + ")");
        if (route.routeConfig.path === "nodes" || route.routeConfig.path === "nodesx") {
          
          let nid: string = qp.selected;

          return fetchStateData(backend, state, nid);
        }
        else if (route.routeConfig.path === "nodes/ctx1" || route.routeConfig.path === "nodes/ctx2"         ) {
          return of(state);
        }
      }
      else if (action.type == 'UPDATESORTORDER') {
        return backend.updateSortOrder(action.nodeIds, action.linkIds).pipe(
          map(b => ({...state, nlist: action.nodeIds, llist: action.linkIds }) )
        );
      }
      else if(action.type == "UPDATENODE") {
        return backend.updateNode(action.nodeId, action.name).pipe(
          map(n => {
            let upd = {...state.nodes };
            upd[action.nodeId] = n;
            return ({...state, nodes: upd});
        }));      
      }
      else if(action.type == "UPDATELINK") {
        return backend.updateLink(action.linkId, action.name).pipe(
          map(l => {
            let upd = {...state.links };
            upd[action.linkId] = l;
            return ({...state, links: upd});
        }));      
      }
      else if (action.type == "DELETELINK") {
        let upd1 = [...state.llist ];
        let upd2 = {...state.links };
        let lix = upd1.findIndex(l => l == action.linkId);
        if (lix>=0) {
          upd1.splice(lix,1);
          delete upd2[action.linkId];
        }
        return backend.deleteLink(action.linkId).pipe(
          map((b) => ({...state, llist: upd1, links: upd2 }))
        );
      }
      else if (action.type == "DELETENODE") {
        return backend.deleteNode(action.nodeId).pipe(
          map((deleted) => {
            let llist = [...state.llist ];
            let links = {...state.links };
            let nlist = [...state.nlist ];
            let nodes = {...state.nodes };
            let nix = nlist.findIndex(n => n == action.nodeId);
            if (nix>=0) {
              nlist.splice(nix,1);
              delete nodes[action.nodeId];
              deleted.forEach(lid => {
                let lix = llist.findIndex(l => l == lid);
                if (lix>=0) {
                  llist.splice(lix,1);
                  delete links[lid];                  
                }                
              });
            }
            return ({ ...state, nodes: nodes, nlist: nlist, links: links, llist: llist})
          }),
          tap( x => {
            console.log("before navigate nodesx");
            router.navigate(['nodesx'], {queryParams: { selected: null }, queryParamsHandling: 'merge'});
            console.log("after navigate nodesx");
          })
        );
      }
      else if (action.type == "ADDNODE") {
        return backend.addNode(action.targetNodeName).pipe(
          map((node) => {
            let nodes = {...state.nodes};
            let nlist = [...state.nlist];
            nodes[node.id] = node;  // add node to the nodes object
            nlist.push(node.id);    // add nodeid to the nodes list
            return ({ ...state, nodes: nodes, nlist: nlist})    
          })
        );
      }
      else if (action.type == "ADDLINK") {
        return backend.addLink(action.sourceNodeId, action.targetNodeId).pipe(
          map((link) => {
            let links = {...state.links};
            let llist = [...state.llist];
            links[link.id] = link;  // add link to the links object
            llist.push(link.id);    // add linkid to the links list
            return ({ ...state, links: links, llist: llist})    
          })
        );
      }
      else if (action.type == "ADDLINKANDNODE") {
        return backend.addLinkAndNode(action.sourceNodeId, action.targetNodeName).pipe(
          map((data) => {
            let llist = [...state.llist ];
            let links = {...state.links };
            let nlist = [...state.nlist ];
            let nodes = {...state.nodes };
            let six = nlist.findIndex(n => n == action.sourceNodeId);
            if (six>=0) {
              nodes[data.node.id] = data.node;
              nlist.splice(six+1, 0, data.node.id);
              links[data.link.id] = data.link;
              llist.push(data.link.id);
            }
            return ({ ...state, nodes: nodes, nlist: nlist, links: links, llist: llist});
          })
        );
      }
      else if (action.type == "READFROMFILE") {
        return backend.setFromFile(action.file).pipe(
          switchMap(b => fetchStateData(backend, state, null))
        );
      }
      else {
        return of(state);
      }
    }
  }