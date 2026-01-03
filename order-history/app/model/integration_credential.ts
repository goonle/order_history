export type IntegrationCredential = {
    id: number;
    provider: string;
    credentials_encrypted: string;

    created_at: Date;
    modified_at: Date;
}