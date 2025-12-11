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
  type: string;
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
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [donationType, setDonationType] = useState<DonationType | "">("");
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

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

  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    const number = parseInt(numeric, 10) || 0;

    return (number / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorsRes = await getDonors({ page: 1, limit: 1000 });
        setDonors((donorsRes.results ?? donorsRes).map((d: any) => ({ id: d.id, name: d.name })));
      } catch {}
      try {
        const productsRes = await getProducts(1, 1000);
        setProducts(productsRes.results ?? productsRes);
      } catch {}
      try {
        const campaignsRes = await getCampaigns({ page: 1, limit: 1000 });
        setCampaigns((campaignsRes.results ?? campaignsRes).filter((c: any) => c.is_active));
      } catch {}
      try {
        const collabsRes = await getCollaborators(1, 1000);
        setCollaborators((collabsRes.results ?? collabsRes).map((c: any) => ({ id: c.id, name: c.name })));
      } catch {}
      try {
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.results ?? []);
      } catch {}
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "campaign_id") {
      const campaign = campaigns.find(c => c.id === Number(value));
      setSelectedCampaign(campaign || null);

      if (campaign) {
        const type = campaign.campaign_type as DonationType;

        setForm(prev => ({
          ...prev,
          campaign_id: campaign.id,
          type: type === "food" || type === "clothing" ? type : prev.type,
          quantity: type === "food" || type === "clothing" ? prev.quantity : "",
          product_id: type === "food" || type === "clothing" ? prev.product_id : "",
          amount: type === "money" ? prev.amount : "",
        }));

        setDonationType(type);
      } else {
        setForm(prev => ({ ...prev, campaign_id: "", type: "", quantity: "", amount: "" }));
        setDonationType("");
        setSelectedCampaign(null);
      }
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]:
        ["donor_id", "collaborator_id", "product_id"].includes(name)
          ? value === "" ? "" : Number(value)
          : name === "amount"
          ? formatCurrency(value)
          : value,
    }));
  };

  const handleTypeSelect = (val: DonationType | "") => {
    setDonationType(val);

    setForm(prev => ({
      ...prev,
      type: "",
      amount: val === "money" || val === "campaign" ? "" : prev.amount,
      quantity: val === "food" || val === "clothing" ? prev.quantity : "",
      product_id: val === "food" || val === "clothing" ? prev.product_id : "",
      campaign_id: val === "campaign" ? prev.campaign_id : "",
    }));

    setSelectedCampaign(null);
  };

  const handleCategoryChange = (e: any) => {
    handleChange(e);
    const selected = e.target.value.toLowerCase();

    if (["enlatados", "higiene", "alimentos", "perecíveis"].includes(selected)) {
      setDonationType("food");
      return;
    }

    if (["roupas", "vestimenta", "agasalhos"].includes(selected)) {
      setDonationType("clothing");
      return;
    }
  };

  const filteredProducts = Array.from(
    new Map(
      products
        .filter(p => p.category)
        .filter(p => {
          if (!form.type) return false;
          return p.category?.name?.toLowerCase() === form.type.toLowerCase();
        })
        .map(p => [p.name.toLowerCase(), p])
    ).values()
  );

  const handleSubmit = () => {
    if (!form.donor_id || !donationType || !form.collaborator_id) {
      alert("Selecione doador, tipo e colaborador.");
      return;
    }

    if ((donationType === "money" || donationType === "campaign") && !form.amount) {
      alert("Informe o valor da doação.");
      return;
    }

    if ((donationType === "food" || donationType === "clothing") && (!form.quantity || !form.product_id)) {
      alert("Informe o produto e a quantidade.");
      return;
    }

    const payload: CreateDonationPayload = {
      donor_id: form.donor_id as number,
      type: donationType,
      amount: form.amount ? Number(form.amount.replace(/\D/g, "")) / 100 : undefined,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      unit: form.unit,
      observations: form.observations || undefined,
      campaign_id: form.campaign_id || undefined,
      product_id: form.product_id || undefined,
      collaborator_id: form.collaborator_id as number,
    };

    onSave(payload);

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

    setDonationType("");
    setSelectedCampaign(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-7 w-[95%] max-w-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Registrar Doação</h2>

        <div className="space-y-4">
          {/* Doador */}
          <select name="donor_id" value={form.donor_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Selecione o doador</option>
            {donors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          {/* Colaborador */}
          <select name="collaborator_id" value={form.collaborator_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Selecione o colaborador</option>
            {collaborators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Tipo de doação + campanhas */}
          <select
            value={form.campaign_id || donationType}
            onChange={(e) => {
              const value = e.target.value;
              const campaign = campaigns.find(c => c.id.toString() === value);
              if (campaign) {
                setSelectedCampaign(campaign);
                const type = campaign.campaign_type as DonationType;
                setDonationType(type);
                setForm(prev => ({
                  ...prev,
                  campaign_id: campaign.id,
                  type: type === "food" || type === "clothing" ? type : "",
                  amount: type === "money" ? prev.amount : "",
                  quantity: type === "food" || type === "clothing" ? prev.quantity : "",
                  product_id: type === "food" || type === "clothing" ? prev.product_id : "",
                }));
              } else {
                handleTypeSelect(value as DonationType);
                setSelectedCampaign(null);
              }
            }}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Selecione o tipo de doação</option>
            <option value="food">Alimentos</option>
            <option value="clothing">Roupas</option>
            <option value="money">Dinheiro</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Categoria de alimento/roupa */}
          {(donationType === "food" || donationType === "clothing") && (
            <select name="type" value={form.type} onChange={handleCategoryChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">Selecione a categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name.toLowerCase()}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}

          {/* Produto, quantidade e unidade */}
          {(donationType === "food" || donationType === "clothing") && (
            <>
              <select name="product_id" value={form.product_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option value="">Selecione o produto</option>
                {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Quantidade"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <select name="unit" value={form.unit} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option value="un">Unidades</option>
                <option value="kg">Kg</option>
                <option value="g">g</option>
                <option value="l">Litros</option>
                <option value="ml">ml</option>
              </select>
            </>
          )}

          {/* Valor */}
          {(donationType === "money" || donationType === "campaign") && (
            <input
              type="text"
              name="amount"
              placeholder="Valor (R$)"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          {/* Observações */}
          <input
            type="text"
            name="observations"
            placeholder="Observações (opcional)"
            value={form.observations}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Detalhes da campanha */}
        {selectedCampaign && (
          <div className="mt-4 p-3 border rounded bg-gray-50 text-sm">
            <p><strong>Descrição:</strong> {selectedCampaign.description}</p>
            <p><strong>Início:</strong> {new Date(selectedCampaign.start_date).toLocaleDateString()}</p>
            <p><strong>Fim:</strong> {new Date(selectedCampaign.end_date).toLocaleDateString()}</p>
            <p><strong>Meta:</strong> {selectedCampaign.goal_quantity ?? "N/A"} unidades</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow"
        >
          Registrar Doação
        </button>
      </div>
    </div>
  );
}
