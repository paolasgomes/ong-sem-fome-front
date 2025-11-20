export type Pagination<T> = {
  results: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Donation = {
  id?: number;
  type: "food" | "clothing" | "money" | "campaign";
  amount?: number;
  quantity?: number;
  unit?: "kg" | "g" | "l" | "ml" | "un";
  observations?: string;
  donor_id?: number;
  collaborator_id?: number;
  campaign_id?: number;
  product_id?: number;
  donor?: {
    id: number;
    name: string;
    email?: string;
  };
  collaborator?: {
    id: number;
    name: string;
  };
  campaign?: {
    id: number;
    name: string;
  } | null;
  product?: {
    id: number;
    name: string;
    in_stock?: number;
  } | null;
  created_at?: string;
  updated_at?: string | null;
};
