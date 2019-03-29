export interface Item {
    readonly id: string;
    readonly type: ItemType;
}

export enum ItemType {   // Beware Constants are used in context-menu html-template
    Empty = 0,
    Node = 1,
    Link = 2
}
