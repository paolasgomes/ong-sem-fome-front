export type Pagination<T> = {
  limit: number;
  page: number;
  totalPages: number;
  results: T[];
};

export type Donor = {
  id?: number;                   // útil para edição/exclusão
  type: 'PF' | 'PJ';
  name: string;
  email: string;
  phone: string;
  cpf?: string;                  // só PF vai ter
  street_number: string;
  street_complement?: string;
  street_neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  street_address: string;
  observation?: string;
  status?: 'Ativo' | 'Inativo';  // usado no edit
  totalDonations?: number;       // usado na tabela
  lastDonation?: string;         // usado na tabela
};
