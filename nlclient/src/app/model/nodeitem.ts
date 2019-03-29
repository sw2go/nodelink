import { Item, ItemType } from './item';


export class NodeItem implements Item {
    public type: number;
    public constructor(
        public id: string,
        public label: string
    ){
        this.type = ItemType.Node;
    };
}
