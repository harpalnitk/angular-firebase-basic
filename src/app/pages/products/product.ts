export interface Product {
    id?:string;
    name:string;
    categoryId: string;
    category?: string;
    price?: number;
    desc?:string;
    suppliers?: string[];
    quantityInStock?: number;
    searchKey?:string;
    productCode?:string;
    createdOn: Date;
    createdBy: string;
    updatedOn?: Date;
    updatedBy?: string;
}