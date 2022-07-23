export interface Inventory {
    id?:string;
    name:string;
    type: string;
    subType:string;
    make:string;

    count:number;
    createdOn: Date;
    createdBy: string;
    updatedOn?: Date;
    updatedBy?: string;

    typeView?: string;
    subTypeView?:string;
    makeView?:string;

}