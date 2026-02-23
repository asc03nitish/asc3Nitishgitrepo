// import { Products } from "./products.model";

export interface Products{
    proId: number;
    proName: string;
}

export interface Users{
    userId: number;
    userName: string;
    userCountry: string;
    product: Products[];
}