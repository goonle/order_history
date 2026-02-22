import { Item } from "./item";

export type OrderHistoryLine = {
    item: Item;
    quantity: number;
    unit_price_cents_at_order: number;
}

export type OrderHistory = {
    id: number;
    vendor_id: number;
    vendor_name: string;
    order_date: Date;
    itemCount: number;
    summary: string;
}
