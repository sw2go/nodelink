import { Item, ItemType } from './item';


export class NodeItem implements Item {
    public type: number;
    public labels: string[];
    public constructor(
        public id: string,
        public label: string,
        public description: string,
        public shape: number,
        public color: string        
    ){
        this.type = ItemType.Node;
        this.labels = label.split(/\n/);
    };
}
