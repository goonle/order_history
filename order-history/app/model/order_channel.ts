type OrderChannelType = "email_api" | "sms_manual";
type SendMode = "api" | "manual";

export type OrderChannel = {
    id: number;
    vendor_id: number;
    credential_id?: number;

    type: OrderChannelType;
    destination: string;
    
    subject_template: number;
    body_template: number;
    send_mode: SendMode;  // api, manual, etc

    created_at: Date;
    modified_at: Date;    
}