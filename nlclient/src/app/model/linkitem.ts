import { Item, ItemType } from './item';

export class LinkItem implements Item {
    public type: number;
    public constructor(
        public id: string,
        public source: string,
        public target: string,
        public label: string        
    ){
        this.type = ItemType.Link;
    };
}