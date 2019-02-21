import { Item } from './item';


export class NodeItem implements Item {
    public constructor(
        public id: string,
        public label: string
    ){};
}
