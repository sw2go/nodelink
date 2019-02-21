import { Subject } from 'rxjs';
import { Item } from './item';

export class ContextMenuData  {
    public onClick: Subject<Item> = new Subject<Item>();
    public constructor(
        public type: CtxType,
        public itemId: string,
        public x: number,
        public y: number,
    ){
    };

    public addLink: ContextMenuCallback;
    public delNode: ContextMenuCallback;
    public delLink: ContextMenuCallback;

}

type ContextMenuCallback = () => void;

export enum CtxType {
    Node,
    Link
}