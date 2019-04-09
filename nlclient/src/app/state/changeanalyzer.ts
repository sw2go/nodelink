import { StateChange } from './store';
import { State } from '../model/state';
import { Item } from '../model/item';
import { LinkItem } from '../model/linkitem';
import { NodeItem } from '../model/nodeitem';
import { GraphSettings } from '../model/graphsettings';

export class ChangeAnalyzer {

    public constructor(private state: StateChange<State>) {
    }

    // generic helper for use in instance methods ( to reuse the static ones with the )
    private static GenericChanged<T>(call: (state: StateChange<State>) => T, action: (model: T) => void, state: StateChange<State>) {
        let result: T = call(state);
        if (result)
            action(result);
    }

    // Use the static functions in rxjs map ...
    // return a container { ... } containing the new state or null if no change was detected

    public static ItemSelectionChanged(state: StateChange<State>): { item: Item } {

        if (state.actual.selectedId == state.last.selectedId )
            return null;

        let item: Item = state.actual.links[state.actual.selectedId];
        if (!item)
            item = state.actual.nodes[state.actual.selectedId];

        return { item: item };    
    }

    public static ItemUpdated(state: StateChange<State>): { item: Item } {

        if (state.actual.selectedId != state.last.selectedId )
            return null;
        
        let actual: Item = state.actual.links[state.actual.selectedId];
        if (!actual)
            actual = state.actual.nodes[state.actual.selectedId];

        let last: Item = state.last.links[state.last.selectedId];
        if (!last)
            last = state.last.nodes[state.last.selectedId];

        if (actual == null || actual == last)
            return;

        return { item: actual };    
    }

    public static GraphSettingsChanged(state: StateChange<State>): { settings: GraphSettings } {
        if (state.actual.settings === state.last.settings)
            return null;

        return { settings: state.actual.settings }
    }

    public static GraphModelChanged(state: StateChange<State>): { links: LinkItem[], nodes: NodeItem[] } {

        if (state.actual.nodes === state.last.nodes            
            && state.actual.links === state.last.links
            && state.actual.nlist === state.last.nlist
            && state.actual.llist === state.last.llist)
            return null;

        let links = state.actual.llist.map(l => state.actual.links[l]);
        let nodes = state.actual.nlist.map(n => state.actual.nodes[n]);                  

        return { links: links, nodes: nodes };    
    }

    // Use the instance methods when subscribing to the store.state$ in code

    public ItemSelectionChanged(action: (model: { item: Item }) => void) {
        ChangeAnalyzer.GenericChanged(ChangeAnalyzer.ItemSelectionChanged, action, this.state);
    }

    public GraphSettingsChanged(action: (model: { settings: GraphSettings }) => void) {
        ChangeAnalyzer.GenericChanged(ChangeAnalyzer.GraphSettingsChanged, action, this.state);
    }

    public GraphModelChanged(action: (model: { links: LinkItem[], nodes: NodeItem[] }) => void) {
        ChangeAnalyzer.GenericChanged(ChangeAnalyzer.GraphModelChanged, action, this.state);
    }

}
