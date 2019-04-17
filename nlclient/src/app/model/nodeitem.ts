import { Item, ItemType } from './item';


export class NodeItem implements Item {
    public type: number;
    public labels: string[];
    public constructor(
        public id: string,
        public label: string,
        public description: string
    ){
        this.type = ItemType.Node;
        this.labels = label.split(/\n/);
    };
}
