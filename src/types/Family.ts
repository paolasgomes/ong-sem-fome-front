export type Pagination<T> = {
    limit: number;
    page: number;
    totalPages: number;
    results: T[];
};

export type Family = {
    id?: number;                  
    responsible_name: string;
    responsible_cpf: string;
    street_number: string;
    street_complement: string;
    street_neighborhood: string;                 
    city: string;
    state: string;
    zip_code: string;
    street_address: string;
    phone: string;
    email: string;
    members_count: number;
    income_bracket: string ;  
    address: string;       
    observation: string;
    is_active:boolean;       
};
