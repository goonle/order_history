import { Item } from "./item";

export type OrderHistoryLine = {
    item: Item;
    quantity: number;
    unit_price_cents_at_order: number;
}

export type OrderHistory = {
    id: number;
    order_date: Date;
    vendor_id: number;
    lines: OrderHistoryLine[];
}