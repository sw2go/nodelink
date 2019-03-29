import { NodeItem } from './nodeitem';
import { LinkItem } from './linkitem';

// State
export type State = {
    nodes: { [id: string]: NodeItem},
    nlist: string[],
    links: { [id: string]: LinkItem},
    llist: string[],
    selectedId: string
  };

  
export const initState: State = { nodes: {}, nlist: [],  links: {}, llist: [], selectedId: null };