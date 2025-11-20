import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getDonors } from "../../../services/apiDonors";
import { getProducts } from "../../../services/apiProducts";
import { getCampaigns } from "../../../services/apiCampaigns";

interface DonationFormModalProps {
  onClose: () => void;
  onSave: (donation: any) => void;
  collaboratorId: number; // vem de quem está logado
}

export function DonationFormModal({ onClose, onSave, collaboratorId }: DonationFormModalProps) {
  const [donors, setDonors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const [form, setForm] = useState({
    donor_id: "",
    type: "",
    amount: "",
    quantity: "",
    unit: "un",
    observations: "",
    campaign_id: "",
    product_id: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const donorsRes = await getDonors({ page: 1, limit: 1000 });
        setDonors(donorsRes.results);

        const productsRes = await getProducts();
        setProducts(productsRes.results);

        const campaignsRes = await getCampaigns();
        setCampaigns(campaignsRes.results);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleChange = (e: any) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.donor_id || !form.type) {
      alert("Selecione um doador e um tipo de doação.");
      return;
    }

    const payload = {
      ...form,
      donor_id: Number(form.donor_id),
      quantity: form.quantity ? Number(form.quantity) : undefined,
      amount: form.amount ? Number(form.amount) : undefined,
      campaign_id: form.campaign_id ? Number(form.campaign_id) : undefined,
      product_id: form.product_id ? Number(form.product_id) : undefined,
      collaborator_id: collaboratorId,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-7 w-[95%] max-w-lg shadow-lg relative">
        
        {/* Botão fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Registrar Doação
        </h2>

        <div className="space-y-4">

          {/* DOADOR */}
          <select name="donor_id" value={form.donor_id} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2">
            <option value="">Selecione o doador</option>
            {donors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* TYPE */}
          <select name="type" value={form.type} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2">
            <option value="">Selecione o tipo</option>
            <option value="food">Alimentos</option>
            <option value="clothing">Roupas</option>
            <option value="money">Dinheiro</option>
            <option value="campaign">Campanha</option>
          </select>

          {/* CAMPANHA (somente type = campaign) */}
          {form.type === "campaign" && (
            <select name="campaign_id" value={form.campaign_id} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2">
              <option value="">Selecione a campanha</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          )}

          {/* PRODUTO (somente food ou clothing) */}
          {(form.type === "food" || form.type === "clothing") && (
            <select name="product_id" value={form.product_id} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2">
              <option value="">Selecione o produto (opcional)</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          {/* QUANTITY (food ou clothing) */}
          {(form.type === "food" || form.type === "clothing") && (
            <>
              <input
                type="number"
                name="quantity"
                placeholder="Quantidade"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <select name="unit" value={form.unit} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2">
                <option value="un">Unidades</option>
                <option value="kg">Kg</option>
                <option value="g">g</option>
                <option value="l">Litros</option>
                <option value="ml">ml</option>
              </select>
            </>
          )}

          {/* AMOUNT (somente dinheiro OU campanha) */}
          {(form.type === "money" || form.type === "campaign") && (
            <input
              type="number"
              name="amount"
              placeholder="Valor (R$)"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          {/* OBSERVAÇÕES */}
          <input
            type="text"
            name="observations"
            placeholder="Observações (opcional)"
            value={form.observations}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow">
          Registrar Doação
        </button>
      </div>
    </div>
  );
}
