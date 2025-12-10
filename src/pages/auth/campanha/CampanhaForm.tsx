import { useState } from "react";
import { createCampaign } from "../../../services/apiCampaigns";
import { X } from "lucide-react";
import type { CampaignType } from "../../../types/Campanha";

interface CampanhaFormProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CampanhaForm({ open, onClose, onCreated }: CampanhaFormProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    campaign_type: "food" as CampaignType,
    goal_quantity: "",
    goal_amount: "",
    is_active: true,
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCampaign({
        name: form.name,
        description: form.description,
        start_date: form.start_date,
        end_date: form.end_date || null,
        campaign_type: form.campaign_type,
        goal_quantity: form.campaign_type === "food" ? Number(form.goal_quantity) : null,
        goal_amount: form.campaign_type === "money" ? Number(form.goal_amount) : null,
        is_active: form.is_active,
      });

      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Erro ao criar campanha", err);
      alert("Erro ao criar campanha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Criar Campanha</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Nome da campanha</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Início</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Fim</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Tipo da campanha</label>
            <select
              name="campaign_type"
              value={form.campaign_type}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              <option value="food">Alimentos</option>
              <option value="money">Financeira</option>
              <option value="clothing">Roupas</option>
            </select>
          </div>

          {/* Renderização condicional */}
          {form.campaign_type === "food" && (
            <div>
              <label className="text-sm font-medium">Meta (Quantidade)</label>
              <input
                type="number"
                name="goal_quantity"
                value={form.goal_quantity}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
          )}

          {form.campaign_type === "money" && (
            <div>
              <label className="text-sm font-medium">Meta (Valor R$)</label>
              <input
                type="number"
                name="goal_amount"
                value={form.goal_amount}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg mt-4"
          >
            {loading ? "Criando..." : "Criar Campanha"}
          </button>
        </form>
      </div>
    </div>
  );
}
