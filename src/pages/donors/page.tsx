export function DonorsPage() {
  const donors = [
    {
      id: 1,
      name: "João Silva",
      type: "PF",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      totalDonations: 15,
      lastDonation: "14/01/2024",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Supermercado ABC Ltda",
      type: "PJ",
      email: "contato@supermercadoabc.com",
      phone: "(11) 3333-3333",
      totalDonations: 45,
      lastDonation: "09/01/2024",
      status: "Ativo",
    },
    {
      id: 3,
      name: "Maria Santos",
      type: "PF",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      totalDonations: 8,
      lastDonation: "19/12/2023",
      status: "Inativo",
    },
    {
      id: 4,
      name: "Padaria do Bairro",
      type: "PJ",
      email: "padaria@email.com",
      phone: "(11) 7777-7777",
      totalDonations: 23,
      lastDonation: "07/01/2024",
      status: "Ativo",
    },
  ];

  return <div className="p-8">Oi Arruma a sidebar</div>;
}
