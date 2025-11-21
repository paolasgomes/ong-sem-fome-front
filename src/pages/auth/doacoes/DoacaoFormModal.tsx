// import { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { getDonors } from "../../../services/apiDonors";
// import { getProducts } from "../../../services/apiProducts";
// import type { Product } from "../../../services/apiProducts";
// import { getCampaigns } from "../../../services/apiCampaigns";
// import { getCollaborators } from "../../../services/apiColaboradores";
// import { getCategories } from "../../../services/apiCategory";
// import type { ICategory } from "../../../services/apiCategory";
// import type { CreateDonationPayload } from "../../../services/apiDoacoes";

// interface DonationFormModalProps {
//   onClose: () => void;
//   onSave: (donation: CreateDonationPayload) => Promise<void> | void;
// }

// type DonationType = "food" | "clothing" | "money" | "campaign";
// type UnitType = "kg" | "g" | "l" | "ml" | "un";

// interface DonationForm {
//   donor_id: number | ""; 
//   type: DonationType | "";
//   amount: string;
//   quantity: string;
//   unit: UnitType;
//   observations: string;
//   campaign_id: number | "";
//   product_id: number | "";
//   collaborator_id: number | "";
// }

// export function DonationFormModal({ onClose, onSave }: DonationFormModalProps) {
//   const [donors, setDonors] = useState<{ id: number; name: string }[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [campaigns, setCampaigns] = useState<{ id: number; title: string }[]>([]);
//   const [collaborators, setCollaborators] = useState<{ id: number; name: string }[]>([]);
//   const [categories, setCategories] = useState<ICategory[]>([]);

//   const [form, setForm] = useState<DonationForm>({
//     donor_id: "",
//     type: "",
//     amount: "",
//     quantity: "",
//     unit: "un",
//     observations: "",
//     campaign_id: "",
//     product_id: "",
//     collaborator_id: "",
//   });

//   // --- Carrega dados ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // DOADORES
//         try {
//           const donorsRes = await getDonors({ page: 1, limit: 1000 });
//           const donorsList = donorsRes.results ?? donorsRes;
//           setDonors(donorsList.map((d: any) => ({ id: d.id, name: d.name })));
//           console.log("DOADORES:", donorsList);
//         } catch (err) { console.error("Erro ao carregar DOADORES:", err); }

//         // PRODUTOS
//         try {
//           const productsRes = await getProducts(1, 1000);
//           const productsList = productsRes.results ?? productsRes;
//           setProducts(productsList);
//           console.log("PRODUTOS:", productsList);
//         } catch (err) { console.error("Erro ao carregar PRODUTOS:", err); }

//         // CAMPANHAS
//         try {
//           const campaignsRes = await getCampaigns();
//           const campaignsList = campaignsRes.results ?? campaignsRes;
//           setCampaigns(campaignsList.map((c: any) => ({ id: c.id, title: c.title })));
//           console.log("CAMPANHAS:", campaignsList);
//         } catch (err) { console.error("Erro ao carregar CAMPANHAS:", err); }

//         // COLABORADORES
//         try {
//           const collabsRes = await getCollaborators(1, 1000);
//           const collabsList = (collabsRes.results ?? collabsRes).map((c: any) => ({
//             id: c.id,
//             name: c.name,
//           }));
//           setCollaborators(collabsList);
//           console.log("COLABORADORES:", collabsList);
//         } catch (err) { console.error("Erro ao carregar COLABORADORES:", err); }

//         // CATEGORIAS
//         try {
//           const categoriesRes = await getCategories();
//           setCategories(categoriesRes.results ?? []);
//           console.log("CATEGORIAS:", categoriesRes.results ?? categoriesRes);
//         } catch (err) { console.error("Erro ao carregar CATEGORIAS:", err); }

//       } catch (error) {
//         console.error("Erro geral ao carregar dados:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // --- Handle Change ---
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     setForm(prev => ({
//       ...prev,
//       [name]: 
//         ["collaborator_id", "donor_id", "product_id", "campaign_id"].includes(name)
//           ? value === "" ? "" : Number(value)
//           : value
//     }));
//   };

//   // --- Filtro de produtos por categoria + remover duplicados ---
//   const filteredProducts = Array.from(new Map(
//   products
//     .filter(p => p.category_id)
//     .filter(p => {
//       if (!form.type) return false;
//       const category = categories.find(c => c.id === p.category_id);
//       if (!category) return false;

//       // Mapeamento correto de tipo para categorias
//       if (form.type === "food") return ["enlatados", "higiene"].includes(category.name.toLowerCase());
//       if (form.type === "clothing") return ["roupas"].includes(category.name.toLowerCase());

//       return false;
//     })
//     .map(p => [p.name.toLowerCase(), p]) // remove duplicados pelo nome
// ).values());

//   // --- Handle Submit ---
//   const handleSubmit = () => {
//     if (!form.donor_id || !form.type || !form.collaborator_id) {
//       alert("Selecione doador, tipo de doação e colaborador.");
//       return;
//     }

//     if ((form.type === "money" || form.type === "campaign") && !form.amount) {
//       alert("Informe o valor da doação.");
//       return;
//     }

//     if ((form.type === "food" || form.type === "clothing") && (!form.quantity || !form.product_id)) {
//       alert("Informe produto e quantidade para a doação.");
//       return;
//     }

//     const payload: CreateDonationPayload = {
//       donor_id: form.donor_id as number,
//       type: form.type,
//       amount: form.amount ? Number(form.amount) : undefined,
//       quantity: form.quantity ? Number(form.quantity) : undefined,
//       unit: form.unit,
//       observations: form.observations || undefined,
//       campaign_id: form.campaign_id || undefined,
//       product_id: form.product_id || undefined,
//       collaborator_id: form.collaborator_id as number,
//     };

//     onSave(payload);

//     // Reset form
//     setForm({
//       donor_id: "",
//       type: "",
//       amount: "",
//       quantity: "",
//       unit: "un",
//       observations: "",
//       campaign_id: "",
//       product_id: "",
//       collaborator_id: "",
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl p-7 w-[95%] max-w-lg shadow-lg relative">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//           <X className="w-5 h-5" />
//         </button>

//         <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Registrar Doação</h2>

//         <div className="space-y-4">
//           {/* DOADOR */}
//           <select name="donor_id" value={form.donor_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
//             <option value="">Selecione o doador</option>
//             {donors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//           </select>

//           {/* COLABORADOR */}
//           <select name="collaborator_id" value={form.collaborator_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
//             <option value="">Selecione o colaborador</option>
//             {collaborators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>

//           {/* TIPO */}
//           <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
//             <option value="">Selecione o tipo</option>
//             <option value="food">Alimentos</option>
//             <option value="clothing">Roupas</option>
//             <option value="money">Dinheiro</option>
//             <option value="campaign">Campanha</option>
//           </select>

//           {/* CAMPANHA */}
//           {form.type === "campaign" && (
//             <select name="campaign_id" value={form.campaign_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
//               <option value="">Selecione a campanha</option>
//               {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
//             </select>
//           )}

//           {/* PRODUTO */}
//           {(form.type === "food" || form.type === "clothing") && (
//             <select name="product_id" value={form.product_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
//               <option value="">Selecione o produto</option>
//               {filteredProducts.map(p => (
//                 <option key={p.id} value={p.id}>{p.name}</option>
//               ))}
//             </select>
//           )}

//           {/* QUANTIDADE */}
//           {(form.type === "food" || form.type === "clothing") && (
//             <>
//               <input type="number" name="quantity" placeholder="Quantidade" value={form.quantity} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//               <select name="unit" value={form.unit} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
//                 <option value="un">Unidades</option>
//                 <option value="kg">Kg</option>
//                 <option value="g">g</option>
//                 <option value="l">Litros</option>
//                 <option value="ml">ml</option>
//               </select>
//             </>
//           )}

//           {/* VALOR */}
//           {(form.type === "money" || form.type === "campaign") && (
//             <input type="number" name="amount" placeholder="Valor (R$)" value={form.amount} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//           )}

//           {/* OBSERVAÇÕES */}
//           <input type="text" name="observations" placeholder="Observações (opcional)" value={form.observations} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//         </div>

//         <button onClick={handleSubmit} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow">
//           Registrar Doação
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getDonors } from "../../../services/apiDonors";
import { getProducts } from "../../../services/apiProducts";
import type { Product } from "../../../services/apiProducts";
import { getCampaigns } from "../../../services/apiCampaigns";
import { getCollaborators } from "../../../services/apiColaboradores";
import { getCategories } from "../../../services/apiCategory";
import type { ICategory } from "../../../services/apiCategory";
import type { CreateDonationPayload } from "../../../services/apiDoacoes";

interface DonationFormModalProps {
  onClose: () => void;
  onSave: (donation: CreateDonationPayload) => Promise<void> | void;
}

type DonationType = "food" | "clothing" | "money" | "campaign";
type UnitType = "kg" | "g" | "l" | "ml" | "un";

interface DonationForm {
  donor_id: number | ""; 
  type: DonationType | "";
  amount: string;
  quantity: string;
  unit: UnitType;
  observations: string;
  campaign_id: number | "";
  product_id: number | "";
  collaborator_id: number | "";
}

export function DonationFormModal({ onClose, onSave }: DonationFormModalProps) {
  const [donors, setDonors] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<{ id: number; title: string }[]>([]);
  const [collaborators, setCollaborators] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [form, setForm] = useState<DonationForm>({
    donor_id: "",
    type: "",
    amount: "",
    quantity: "",
    unit: "un",
    observations: "",
    campaign_id: "",
    product_id: "",
    collaborator_id: "",
  });

  // --- Função para formatar valor em moeda ---
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const numberValue = parseInt(numericValue, 10) || 0;
    return (numberValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // --- Carrega dados ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // DOADORES
        try {
          const donorsRes = await getDonors({ page: 1, limit: 1000 });
          const donorsList = donorsRes.results ?? donorsRes;
          setDonors(donorsList.map((d: any) => ({ id: d.id, name: d.name })));
        } catch (err) { console.error("Erro ao carregar DOADORES:", err); }

        // PRODUTOS
        try {
          const productsRes = await getProducts(1, 1000);
          const productsList = productsRes.results ?? productsRes;
          setProducts(productsList);
        } catch (err) { console.error("Erro ao carregar PRODUTOS:", err); }

        // CAMPANHAS
        try {
          const campaignsRes = await getCampaigns();
          const campaignsList = campaignsRes.results ?? campaignsRes;
          setCampaigns(campaignsList.map((c: any) => ({ id: c.id, title: c.title })));
        } catch (err) { console.error("Erro ao carregar CAMPANHAS:", err); }

        // COLABORADORES
        try {
          const collabsRes = await getCollaborators(1, 1000);
          const collabsList = (collabsRes.results ?? collabsRes).map((c: any) => ({
            id: c.id,
            name: c.name,
          }));
          setCollaborators(collabsList);
        } catch (err) { console.error("Erro ao carregar COLABORADORES:", err); }

        // CATEGORIAS
        try {
          const categoriesRes = await getCategories();
          setCategories(categoriesRes.results ?? []);
        } catch (err) { console.error("Erro ao carregar CATEGORIAS:", err); }

      } catch (error) {
        console.error("Erro geral ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  // --- Handle Change ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: 
        ["collaborator_id", "donor_id", "product_id", "campaign_id"].includes(name)
          ? value === "" ? "" : Number(value)
          : name === "amount" 
            ? formatCurrency(value)
            : value
    }));
  };

  // --- Filtro de produtos por categoria + remover duplicados ---
  const filteredProducts = Array.from(new Map(
    products
      .filter(p => p.category_id)
      .filter(p => {
        if (!form.type) return false;
        const category = categories.find(c => c.id === p.category_id);
        if (!category) return false;

        if (form.type === "food") return ["enlatados", "higiene"].includes(category.name.toLowerCase());
        if (form.type === "clothing") return ["roupas"].includes(category.name.toLowerCase());
        return false;
      })
      .map(p => [p.name.toLowerCase(), p])
  ).values());

  // --- Handle Submit ---
  const handleSubmit = () => {
    if (!form.donor_id || !form.type || !form.collaborator_id) {
      alert("Selecione doador, tipo de doação e colaborador.");
      return;
    }

    if ((form.type === "money" || form.type === "campaign") && !form.amount) {
      alert("Informe o valor da doação.");
      return;
    }

    if ((form.type === "food" || form.type === "clothing") && (!form.quantity || !form.product_id)) {
      alert("Informe produto e quantidade para a doação.");
      return;
    }

    const payload: CreateDonationPayload = {
      donor_id: form.donor_id as number,
      type: form.type,
      amount: form.amount ? Number(form.amount.replace(/\D/g, "")) / 100 : undefined,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      unit: form.unit,
      observations: form.observations || undefined,
      campaign_id: form.campaign_id || undefined,
      product_id: form.product_id || undefined,
      collaborator_id: form.collaborator_id as number,
    };

    onSave(payload);

    // Reset form
    setForm({
      donor_id: "",
      type: "",
      amount: "",
      quantity: "",
      unit: "un",
      observations: "",
      campaign_id: "",
      product_id: "",
      collaborator_id: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-7 w-[95%] max-w-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Registrar Doação</h2>

        <div className="space-y-4">
          {/* DOADOR */}
          <select name="donor_id" value={form.donor_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Selecione o doador</option>
            {donors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          {/* COLABORADOR */}
          <select name="collaborator_id" value={form.collaborator_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Selecione o colaborador</option>
            {collaborators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* TIPO */}
          <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Selecione o tipo</option>
            <option value="food">Alimentos</option>
            <option value="clothing">Roupas</option>
            <option value="money">Dinheiro</option>
            <option value="campaign">Campanha</option>
          </select>

          {/* CAMPANHA */}
          {form.type === "campaign" && (
            <select name="campaign_id" value={form.campaign_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">Selecione a campanha</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          )}

          {/* PRODUTO */}
          {(form.type === "food" || form.type === "clothing") && (
            <select name="product_id" value={form.product_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">Selecione o produto</option>
              {filteredProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          {/* QUANTIDADE */}
          {(form.type === "food" || form.type === "clothing") && (
            <>
              <input type="number" name="quantity" placeholder="Quantidade" value={form.quantity} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
              <select name="unit" value={form.unit} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option value="un">Unidades</option>
                <option value="kg">Kg</option>
                <option value="g">g</option>
                <option value="l">Litros</option>
                <option value="ml">ml</option>
              </select>
            </>
          )}

          {/* VALOR */}
          {(form.type === "money" || form.type === "campaign") && (
            <input type="text" name="amount" placeholder="Valor (R$)" value={form.amount} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          )}

          {/* OBSERVAÇÕES */}
          <input type="text" name="observations" placeholder="Observações (opcional)" value={form.observations} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <button onClick={handleSubmit} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow">
          Registrar Doação
        </button>
      </div>
    </div>
  );
}
