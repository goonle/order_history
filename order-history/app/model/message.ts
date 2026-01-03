export type Message = {
    id: number;
    public_id: string;

    supplier_id: number;
    order_id: number;

    template_id: number;
    
    title: string;
    body: string;

    created_at: Date;
    modified_at: Date;
}