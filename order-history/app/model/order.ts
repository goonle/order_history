import { Vendor } from "./vendor";
import { Item } from "./item";
import { OrderItem } from "./order_item";

export type Order = {
    id: number;
    vendor_id: number;
    
    order_date: Date;
    created_at: Date;
}

export type OrderHistory = {
    id: number,
    vendor_id: number,
    order_date: Date,
    order_item: OrderItem[],
    vendor: Vendor
}