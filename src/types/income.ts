export interface IncomeEntryType {
    id: string;
    amount: number;
    category: string;
    tag: string;
    currency?: string;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
}

export interface IncomeEntryListProps {
    entries: IncomeEntryType[];
    isLoading?: boolean;
}