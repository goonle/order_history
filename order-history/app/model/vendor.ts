export type Vendor = {
    id: number;
    name: string;

    note: string;
    defaultTemplateId?: number | null;
    // created_at: Date;
    // modified_at: Date;
}

export type VendorData = {
    name: string;
    note: string;
}