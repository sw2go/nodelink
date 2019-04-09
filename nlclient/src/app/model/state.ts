import { NodeItem } from './nodeitem';
import { LinkItem } from './linkitem';
import { GraphSettings } from './graphsettings';

// State
export type State = {
    nodes: { [id: string]: NodeItem},
    nlist: string[],
    links: { [id: string]: LinkItem},
    llist: string[],
    selectedId: string,
    settings: GraphSettings
  };

  
export const initState: State = { nodes: {}, nlist: [],  links: {}, llist: [], selectedId: null, settings: null };