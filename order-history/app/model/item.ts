export type Item = {
    id: number;
    name: string;

    category_id: number;
    vendor_id: number;

    price_cents: number;
    unit_id: number;

    image_url?: string;
    is_active: boolean; // being sold
    
    // created_at: Date;
    // modified_at: Date; 
}

export type ItemWithMeta = Item & {
    category: { id: number; name: string; };
    unit: { id: number; name: string; };
}