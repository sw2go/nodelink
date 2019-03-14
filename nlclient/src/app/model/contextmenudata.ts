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

    public addNode: ContextMenuCallback;
    public addLink: ContextMenuCallback;
    public delNode: ContextMenuCallback;
    public delLink: ContextMenuCallback;

}

type ContextMenuCallback = () => void;

export enum CtxType {   // Beware Constants are used in context-menu html-template
    Panel = 0,
    Node = 1,
    Link = 2
}