

export interface InventoryHistory {
    id?:string;
    action:string;
    qty?: number;
    date: Date;
    userId: string;
    userName: string;
}