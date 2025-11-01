export interface Collaborator {
  id?: number;
  name: string;
  registration: string;
  email: string;
  phone: string;
  type: "Voluntário" | "Funcionário";
  function: string;
  date_joined: string;
  observation?: string;
  status: "Ativo" | "Inativo";
}
