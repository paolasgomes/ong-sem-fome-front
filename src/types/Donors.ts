export type Pagination<T> = {
  limit: number;
  page: number;
  totalPages: number;
  results: T[];
};

export type Donor = {
  id: number; // agora obrigatório
  type: "pessoa_fisica" | "pessoa_juridica";
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  street_number: string;
  street_complement?: string;
  street_neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  street_address: string;
  observation?: string;
  status?: "Ativo" | "Inativo";
  is_active?: boolean;
  totalDonations?: number;
  lastDonation?: string;
};
