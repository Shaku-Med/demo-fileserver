
export interface KeysProps {
    id?: string;
    status?: 'active' | 'inactive' | 'expired';
    reason?: string;
    success?: boolean;
    is_updated?: boolean;
    created_at?: string;
    updated_at?: string;
    key_data?: object;
}