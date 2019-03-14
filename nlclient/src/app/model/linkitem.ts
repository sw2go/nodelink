import { Item } from './item';

export class LinkItem implements Item {
    //public points: { x:number, y:number }[] = [];
    public constructor(
        public id: string,
        public source: string,
        public target: string,
        public label: string        
    ){};
}