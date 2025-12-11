import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createCampaign } from "../../../services/apiCampaigns";
import type { CampaignType } from "../../../types/Campanha";

interface CampanhaFormProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CampanhaForm({ open, onClose, onCreated }: CampanhaFormProps) {
  const [loading, setLoading] = useState(false);

  const INITIAL_FORM_STATE = {
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    campaign_type: "food" as CampaignType,
    goal_quantity: "",
    goal_amount: "",
  };

  const [form, setForm] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    if (open) setForm(INITIAL_FORM_STATE); // Reset ao abrir
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "goal_quantity" || name === "goal_amount") {
      setForm(prev => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = { ...form, is_active: true };

      // Remove meta irrelevante de acordo com tipo
      if (form.campaign_type === "money") {
        delete payload.goal_quantity;
      } else {
        delete payload.goal_amount;
      }

      await createCampaign(payload);
      onCreated?.();
      onClose();
    } catch (err: any) {
      console.error("Erro ao criar campanha", err);
      alert(err.response?.data?.error || "Erro ao criar campanha.");
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
          {/* Nome */}
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

          {/* Descrição */}
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

          {/* Datas */}
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

          {/* Tipo */}
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

          {/* Meta quantidade ou peças */}
          {(form.campaign_type === "food" || form.campaign_type === "clothing") && (
            <div>
              <label className="text-sm font-medium">
                Meta {form.campaign_type === "food" ? "(Quantidade)" : "(Peças)"}
              </label>
              <input
                type="number"
                name="goal_quantity"
                value={form.goal_quantity}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
          )}

          {/* Meta financeira */}
          {form.campaign_type === "money" && (
            <div>
              <label className="text-sm font-medium">Meta (R$)</label>
              <input
                type="number"
                name="goal_amount"
                value={form.goal_amount}
                onChange={handleChange}
                required
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
