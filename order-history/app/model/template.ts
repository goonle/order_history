export type Template = {
    id: number;
    name: string;

    userId: number;
    vendorId: number;

    subject: string | null;
    header: string;
    footer: string;

    // created_at: Date;
    // modified_at: Date;
}

export type TemplateDraft = {
    name: string;
    subject: string;
    header: string;
    footer: string;
};