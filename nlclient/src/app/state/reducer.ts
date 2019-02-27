import { Reducer, Store } from './store';
import { Observable, pipe } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NodeService } from '../service/node.service';
import { RouterStateSnapshot } from '@angular/router';
import { NodeItem } from '../model/nodeitem';
import { LinkItem } from '../model/linkitem';


// State
export type State = {
  nodes: { [id: string]: NodeItem},
  nlist: string[],
  links: { [id: string]: LinkItem},
  llist: string[]
};

export const initState: State = { nodes: {}, nlist: [],  links: {}, llist: [] };

// Actions
export type RouterNavigation = { type: 'ROUTER_NAVIGATION', state: RouterStateSnapshot };
export type UpdateSortOrder = { type: 'UPDATESORTORDER', nodeIds: string[], linkIds: string[] };
export type AddLink = { type: 'ADDLINK', sourceNodeId: string, targetNodeId: string };
export type AddLinkAndNode = { type: 'ADDLINKANDNODE', sourceNodeId: string, targetNodeName: string };
export type DeleteNode = { type: 'DELETENODE', nodeId: string };
export type DeleteLink = { type: 'DELETELINK', linkId: string };
export type UpdateNode = { type: 'UPDATENODE', nodeId: string, name: string };

export type Watch = { type: 'WATCH', talkId: number };
export type Rate = { type: 'RATE', talkId: number, rating: number };
export type Unrate = { type: 'UNRATE', talkId: number, error: any };

export type Action = RouterNavigation | UpdateSortOrder | DeleteLink |
 DeleteNode | AddLink | AddLinkAndNode | UpdateNode | Watch | Rate | Unrate;


export function isAction<T extends Action>(action: Action): action is T {
  if ((action as T).type)
    return true;
  else 
    return false;
}


export function reducer(backend: NodeService): Reducer<State, Action> {
    return (store: Store<State, Action>, state: State, action: Action): State|Observable<State> => {
      if (action.type == 'ROUTER_NAVIGATION') {
        const route = action.state.root.firstChild.firstChild; 
        const qp = action.state.root.queryParams;
        console.log("reducer: ROUTER_NAVIGATION(" + route.routeConfig.path + ")");
        if (route.routeConfig.path === "nodes") {
          
          let nid: string = qp.selected;

          return backend.getNodes().pipe(
            switchMap(n => backend.getLinks().pipe(map(l => ({...state, nodes: n.nodes, nlist: n.nlist, links: l.links, llist: l.llist }))))
          );

          // return backend.getNodes().pipe(
          //   switchMap(n => backend.getLinks().pipe(map(l => ({...state, nodes: n, links: l, selectedNodeId: nid }))))
          // );
        }
        else if (route.routeConfig.path === "nodes/ctx1") {
          return state;
          ;
        }
      }
      else if (action.type == 'UPDATESORTORDER') {
        return backend.updateSortOrder(action.nodeIds, action.linkIds).pipe(
          map(b => ({...state, nlist: action.nodeIds, llist: action.linkIds }) )
        )
      }
      else if(action.type == "UPDATENODE") {
        return backend.updateNode(action.nodeId, action.name).pipe(
          map(n => {
            let upd = {...state.nodes};
            upd[action.nodeId] = n;
            return ({...state, nodes: upd});
        }));      
      }
      else if (action.type == "DELETELINK") {
        let upd1 = [...state.llist ];
        let upd2 = {...state.links };
        let lix = state.llist.findIndex(l => l == action.linkId);
        if (lix>=0) {
          upd1.splice(lix,1);
          delete upd2[action.linkId];
        }
        return backend.deleteLink(action.linkId).pipe(
          map((b) => ({...state, llist: upd1, links: upd2 }))
        )
      }
      else if (action.type == "DELETENODE") {
        return backend.deleteNode(action.nodeId).pipe(
          map((deleted) => {
            let newstate = {...state};
            let nix = state.nlist.findIndex(n => n == action.nodeId);
            if (nix>=0) {
              newstate.nlist.splice(nix,1);
              delete newstate.nodes[action.nodeId];
              deleted.forEach(lid => {
                let lix = newstate.llist.findIndex(l => l == lid);
                if (lix>=0) {
                  newstate.llist.splice(lix,1);
                  delete newstate.links[lid];                  
                }                
              });
            }
            return (newstate);
          })
        )
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
            let newstate = {...state};
            let six = state.nlist.findIndex(n => n == action.sourceNodeId);
            if (six>=0) {
              newstate.nodes[data.node.id] = data.node;
              newstate.nlist.splice(six+1, 0, data.node.id);
              newstate.links[data.link.id] = data.link;
              newstate.llist.push(data.link.id);
            }
            return (newstate);
          })
        );
      }








      switch (action.type) {
        case 'ROUTER_NAVIGATION':       
          const route = action.state.root.firstChild.firstChild;        
          console.log("reducer: ROUTER_NAVIGATION(" + route.routeConfig.path + ")");
          
          if (route.routeConfig.path === "nodes") {
            //const filters =  createFilters(route.params);
            return backend.getNodes().pipe(map(r => ({...state, ...r})));
          } else if (route.routeConfig.path  === "node/:id") {
            const id = + route.params['id'];
            if (state.nodes[id]) 
                return state;
            //return backend.findTalk(id).pipe(map(t => ({...state, talks: {...state.talks, [t.id]: t}})));
          } else {
            return state;
          }
    
        // case 'ADDLINK':
        //   console.log("reducer: ADDLINK");
        //   asss: AddLinkAction = action;
        //   backend.addLink(action, action.rating).subscribe(
        //     n => {}, 
        //     (e) => store.sendAction({type: 'UNRATE', talkId: action.talkId, error: e}) 
        //   );        
        //   const talkToRate = state.talks[action.talkId];
        //   const ratedTalk = {...talkToRate, yourRating: action.rating};
        //   const updatedTalks = {...state.talks, [action.talkId]: ratedTalk};
        //   return {...state, talks: updatedTalks};
  
        // case 'UNRATE':
        //   console.log("reducer: UNRATE");
        //   const talkToUnrate = state.talks[action.talkId];
        //   const unratedTalk = {...talkToUnrate, yourRating: null};
        //   const updatedTalksAfterUnrating = {...state.talks, [action.talkId]: unratedTalk };
        //   return {...state, talks: updatedTalksAfterUnrating};
  
        default:
          console.log("reducer: DEFAULT");
          return state;
      }
    }
  }