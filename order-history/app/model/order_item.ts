export type OrderItem = {
    id: number;

    order_id: number;
    item_id: number;
    
    quantity: number;
    unit_price_cents_at_order?: number;

    create_at: Date;
}