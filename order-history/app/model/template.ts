export type Template = {
    id: number;
    name: string;

    user_id: number;
    vendor_id: number;

    subject: string;
    header: string;
    footer: string;

    created_at: Date;
    modified_at: Date;
}