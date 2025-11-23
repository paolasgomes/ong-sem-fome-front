import React, { useEffect, useState } from "react";
import { X, PlusCircle, Trash2, ChevronLeft, ChevronRight, User, Box, Clipboard } from "lucide-react";
import { getFamily } from "../../../services/apiFamily";
import { getProducts } from "../../../services/apiProducts";
import { createFoodBasket, getFoodBaskets } from "../../../services/apiCestas";
import { createDistribution } from "../../../services/apiDistribuicao";
import { getCollaborators } from "../../../services/apiColaboradores";
import type { FoodBasketItem } from "../../../services/apiCestas";

type Family = { id: number; name: string; address?: string };
type Product = { id: number; name: string; unit?: string };
type Collaborator = { id: number; name: string };
type Item = { product: Product; quantity: number; unit?: string };

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (created: any) => void;
}

export default function CriarCestaModal({ open, onClose, onCreated }: Props) {
  const [step, setStep] = useState<number>(1);
  const [families, setFamilies] = useState<Family[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | "">("");
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>("un");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setStep(1);
    setSelectedFamilyId("");
    setSelectedCollaboratorId("");
    setDescription("");
    setSelectedProductId("");
    setQuantity(1);
    setUnit("un");
    setItems([]);
    setError(null);
    setSuccessMessage(null);

    (async () => {
      setLoading(true);
      try {
        const [fRes, pRes, cRes] = await Promise.all([getFamily(), getProducts(), getCollaborators()]);
        setFamilies(fRes.results ?? fRes);
        setProducts(pRes.results ?? pRes);
        setCollaborators(cRes.results ?? cRes);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar famílias/produtos/colaboradores. Tente novamente.");
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (selectedProductId) {
      const prod = products.find((p) => p.id === Number(selectedProductId));
      setUnit(prod?.unit ?? "un");
    } else {
      setUnit("un");
    }
  }, [selectedProductId, products]);

  const addItem = () => {
    setError(null);
    if (!selectedProductId) return setError("Selecione um produto antes de adicionar.");
    if (!quantity || quantity <= 0) return setError("Informe uma quantidade válida.");
    const prod = products.find((p) => p.id === Number(selectedProductId));
    if (!prod) return setError("Produto inválido.");
    setItems((prev) => [...prev, { product: prod, quantity, unit: prod.unit ?? unit }]);
    setSelectedProductId("");
    setQuantity(1);
    setUnit("un");
  };

  const removeItem = (index: number) => setItems((s) => s.filter((_, i) => i !== index));
  const totalItems = items.reduce((s, it) => s + it.quantity, 0);

  const handleCreate = async () => {
    setError(null);

    if (!selectedFamilyId) { setError("Selecione a família."); setStep(1); return; }
    if (!selectedCollaboratorId) { setError("Selecione o colaborador responsável."); setStep(1); return; }
    if (items.length === 0) { setError("Adicione pelo menos um item na cesta."); setStep(2); return; }

    try {
      setSubmitting(true);

      const cestaPayload = {
        name: description || "Cesta sem nome",
        description: description || undefined,
        is_active: true,
        items: items.map((it): FoodBasketItem => ({ product_id: it.product.id, quantity: it.quantity })),
      };

      await createFoodBasket(cestaPayload);

      const baskets = await getFoodBaskets(1, 20);
      const cestaCriada = baskets.results
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      if (!cestaCriada || !cestaCriada.id) throw new Error("ID da cesta inválido.");

      await createDistribution({
        food_basket_id: cestaCriada.id,
        family_id: Number(selectedFamilyId),
        collaborator_id: Number(selectedCollaboratorId),
        delivery_date: new Date().toISOString(),
        observations: description || undefined,
        status: "pending",
      });

      setSuccessMessage("Cesta criada e distribuída com sucesso!");
      if (onCreated) onCreated(cestaCriada);

      setTimeout(() => { setSubmitting(false); onClose(); }, 900);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || "Erro ao criar cesta/distribuição. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Criar Nova Cesta</h3>
            <p className="text-xs text-gray-500">Preencha as informações e adicione itens à cesta</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600"/>
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-6">
          {[1,2,3].map((s)=>( 
            <div key={s} className="flex-1 text-center">
              <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full mb-1 ${step===s?"bg-orange-50 text-orange-500 border border-orange-200":"bg-gray-100 text-gray-400"}`}>{s}</div>
              <div className={`text-xs ${step===s?"text-orange-600":"text-gray-400"}`}>{s===1?"Informações":s===2?"Itens":"Confirmar"}</div>
            </div>
          ))}
        </div>

        {loading && <div className="mb-4 text-sm text-gray-500">Carregando...</div>}
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {successMessage && <div className="mb-3 text-sm text-green-600">{successMessage}</div>}

        {/* Step 1 */}
        {step===1 && (
          <div className="space-y-4">
            <label className="text-sm text-gray-600">Família</label>
            <select className="w-full border rounded-lg px-3 py-2" value={selectedFamilyId} onChange={(e)=>setSelectedFamilyId(e.target.value===""?"":Number(e.target.value))}>
              <option value="">Selecione a família</option>
              {families.map(f=><option key={f.id} value={f.id}>{f.name}{f.address?` — ${f.address}`:""}</option>)}
            </select>

            <label className="text-sm text-gray-600">Colaborador</label>
            <select className="w-full border rounded-lg px-3 py-2" value={selectedCollaboratorId} onChange={(e)=>setSelectedCollaboratorId(e.target.value===""?"":Number(e.target.value))}>
              <option value="">Selecione o colaborador</option>
              {collaborators.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <label className="text-sm text-gray-600">Descrição (opcional)</label>
            <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Ex: Cesta padrão - novembro" className="w-full border rounded-lg px-3 py-2"/>
          </div>
        )}

        {/* Step 2 */}
        {step===2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-6">
                <label className="text-sm text-gray-600">Produto</label>
                <select className="w-full border rounded-lg px-3 py-2" value={selectedProductId} onChange={(e)=>setSelectedProductId(e.target.value===""?"":Number(e.target.value))}>
                  <option value="">Selecione um produto</option>
                  {products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-sm text-gray-600">Quantidade</label>
                <input type="number" min={1} value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2"/>
              </div>
              <div className="col-span-3">
                <label className="text-sm text-gray-600">Unidade (visual)</label>
                <input type="text" value={unit} disabled className="w-full border rounded-lg px-3 py-2 bg-gray-100"/>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                <PlusCircle className="w-4 h-4"/> Adicionar item
              </button>
              <div className="flex-1 text-right text-xs text-gray-500 self-center">Total itens: {totalItems}</div>
            </div>

            <div className="border rounded-lg p-3">
              <p className="text-sm font-medium mb-2">Itens adicionados</p>
              {items.length===0 && <div className="text-xs text-gray-500">Nenhum item adicionado.</div>}
              <div className="space-y-2">
                {items.map((it,i)=>(
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded-md border">
                    <div>
                      <div className="font-medium text-sm">{it.product.name}</div>
                      <div className="text-xs text-gray-500">{it.quantity} {it.unit}</div>
                    </div>
                    <button className="text-red-500" onClick={()=>removeItem(i)}><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step===3 && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500"/>
                  <div>
                    <p className="text-xs text-gray-500">Família</p>
                    <p className="font-medium">{families.find(f=>f.id===selectedFamilyId)?.name ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-orange-500"/>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Itens</p>
                    <p className="font-medium">{items.length} itens — {totalItems} unidades</p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Itens na cesta</p>
                <div className="space-y-2">
                  {items.map((it,i)=>(
                    <div key={i} className="p-2 bg-white rounded-md border flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-orange-500"/>
                        <div>
                          <div className="font-medium">{it.product.name}</div>
                          <div className="text-xs text-gray-500">{it.quantity} {it.unit}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {description && (
                <div className="mt-3 flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-orange-500"/>
                  <div>
                    <p className="text-xs text-gray-500">Descrição</p>
                    <p className="text-sm">{description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navegação */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            disabled={step===1}
            onClick={()=>setStep(s=>Math.max(1,s-1))}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            <ChevronLeft/> Voltar
          </button>
          <div className="flex items-center gap-3">
            {step<3 && (
              <button
                onClick={()=>{
                  if(step===1 && (!selectedFamilyId || !selectedCollaboratorId)) return setError("Selecione família e colaborador antes de continuar.");
                  if(step===2 && items.length===0) return setError("Adicione pelo menos um item antes de continuar.");
                  setError(null);
                  setStep(s=>Math.min(3,s+1));
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  (step===1 && selectedFamilyId && selectedCollaboratorId) ||
                  (step===2 && items.length>0)
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={
                  (step===1 && (!selectedFamilyId || !selectedCollaboratorId)) ||
                  (step===2 && items.length===0)
                }
              >
                Próximo <ChevronRight className="inline w-4 h-4"/>
              </button>
            )}
            {step===3 && (
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60"
              >
                {submitting?"Criando...":"Criar Cesta"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
