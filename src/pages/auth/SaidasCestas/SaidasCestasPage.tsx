// import { useState } from "react";
// import { Package, Send, CalendarDays } from "lucide-react";
// import CriarCestaModal from "./CriarCestaForm";
// import CestasDetalhesModal from "./CestasDetalhesModal";

// export default function SaidasCestasPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCesta, setSelectedCesta] = useState<any>(null);

//   // 🔥 Mocks reais para exibir dados corretos no modal
//   const cesta1 = {
//     id: 1,
//     family: { name: "Família Silva", address: "Rua A, 123" },
//     items: [
//       { product: { name: "Arroz", unit: "kg" }, quantity: 2 },
//       { product: { name: "Feijão", unit: "kg" }, quantity: 3 },
//       { product: { name: "Óleo", unit: "ml" }, quantity: 900 },
//     ],
//     responsible: "Maria Souza",
//     status: "Entregue",
//     created_at: "2025-01-14",
//     observations: "Entrega realizada normalmente",
//   };

//   const cesta2 = {
//     id: 2,
//     family: { name: "Família Santos", address: "Rua B, 88" },
//     items: [
//       { product: { name: "Cesta básica completa" }, quantity: 1 },
//     ],
//     responsible: "João Lima",
//     status: "Preparando",
//     created_at: "2025-01-13",
//     observations: "Retirar no depósito 3",
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen text-gray-700">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">Saídas / Cestas</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Controle de entregas realizadas às famílias cadastradas
//           </p>
//         </div>

//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
//         >
//           <Send className="w-4 h-4" /> Nova Entrega
//         </button>
//       </div>

//       {/* Cards de estatísticas */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
//           <div>
//             <p className="text-xs text-gray-500">Cestas Este Mês</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">125</p>
//           </div>
//           <div className="bg-orange-50 p-4 rounded-full">
//             <Package className="text-orange-500 w-7 h-7" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
//           <div>
//             <p className="text-xs text-gray-500">Famílias Atendidas</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">89</p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-full">
//             <Send className="text-green-500 w-7 h-7" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
//           <div>
//             <p className="text-xs text-gray-500">Pendentes</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">8</p>
//           </div>
//           <div className="bg-red-50 p-4 rounded-full">
//             <CalendarDays className="text-red-500 w-7 h-7" />
//           </div>
//         </div>
//       </div>

//       {/* Tabela */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse text-sm min-w-[900px]">
//             <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
//               <tr>
//                 <th className="py-3 px-6">Data</th>
//                 <th className="py-3 px-6">Família</th>
//                 <th className="py-3 px-6">Itens</th>
//                 <th className="py-3 px-6">Responsável</th>
//                 <th className="py-3 px-6">Status</th>
//                 <th className="py-3 px-6 text-center">Ações</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Linha 1 */}
//               <tr className="hover:bg-gray-50 transition">
//                 <td className="py-3 px-6">14 Jan</td>
//                 <td className="py-3 px-6">
//                   <p className="font-medium text-gray-800">Família Silva</p>
//                   <p className="text-xs text-gray-500">Ana Silva</p>
//                 </td>
//                 <td className="py-3 px-6 leading-5">
//                   Arroz 5kg ×2<br />
//                   Feijão 1kg ×3<br />
//                   Óleo 900ml ×1
//                 </td>
//                 <td className="py-3 px-6">Maria Souza</td>
//                 <td className="py-3 px-6">
//                   <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
//                     Entregue
//                   </span>
//                 </td>

//                 <td className="py-3 px-6 text-center">
//                   <button
//                     onClick={() => setSelectedCesta(cesta1)}
//                     className="text-blue-500 hover:text-blue-700 transition"
//                   >
//                     Ver Detalhes
//                   </button>
//                 </td>
//               </tr>

//               {/* Linha 2 */}
//               <tr className="hover:bg-gray-50 transition">
//                 <td className="py-3 px-6">13 Jan</td>
//                 <td className="py-3 px-6">
//                   <p className="font-medium text-gray-800">Família Santos</p>
//                   <p className="text-xs text-gray-500">Carlos Santos</p>
//                 </td>
//                 <td className="py-3 px-6">Cesta básica completa ×1</td>
//                 <td className="py-3 px-6">João Lima</td>
//                 <td className="py-3 px-6">
//                   <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">
//                     Preparando
//                   </span>
//                 </td>

//                 <td className="py-3 px-6 text-center">
//                   <button
//                     onClick={() => setSelectedCesta(cesta2)}
//                     className="text-blue-500 hover:text-blue-700 transition"
//                   >
//                     Ver Detalhes
//                   </button>
//                 </td>
//               </tr>

//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal Criar */}
//       <CriarCestaModal
//         open={showModal}
//         onClose={() => setShowModal(false)}
//         onCreated={() => setShowModal(false)}
//       />

//       {/* Modal Detalhes */}
//       {selectedCesta && (
//         <CestasDetalhesModal
//           cesta={selectedCesta}
//           onClose={() => setSelectedCesta(null)}
//         />
//       )}

//     </div>
//   );
// }
// src/pages/SaidasCestasPage.tsx
import { useState, useEffect } from "react";
import { Package, Send, CalendarDays } from "lucide-react";
import CriarCestaModal from "./CriarCestaForm";
import CestasDetalhesModal from "./CestasDetalhesModal";
import { getDistributions } from "../../../services/apiDistribuicao";
import type { Distribution } from "../../../services/apiDistribuicao";


export default function SaidasCestasPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCesta, setSelectedCesta] = useState<Distribution | null>(null);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Buscar distribuições da API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDistributions(1, 10);
        setDistributions(res.results);
      } catch (err) {
        console.error("Erro ao carregar distribuições:", err);
        setError("Erro ao carregar distribuições. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 📊 Estatísticas
  const totalCestas = distributions.length;
  const familiasAtendidas = new Set(distributions.map(d => d.family?.id)).size;
  const pendentes = distributions.filter(d => d.status === "pending").length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-700">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Saídas / Cestas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Controle de entregas realizadas às famílias cadastradas
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
          <Send className="w-4 h-4" /> Nova Entrega
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Cestas Este Mês</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalCestas}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full">
            <Package className="text-orange-500 w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Famílias Atendidas</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{familiasAtendidas}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-full">
            <Send className="text-green-500 w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Pendentes</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{pendentes}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-full">
            <CalendarDays className="text-red-500 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[900px]">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Família</th>
                <th className="py-3 px-6">Itens</th>
                <th className="py-3 px-6">Responsável</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : distributions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Nenhuma distribuição encontrada.
                  </td>
                </tr>
              ) : (
                distributions.map((dist) => (
                  <tr key={dist.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-6">
                      {dist.delivery_date
                        ? new Date(dist.delivery_date).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="py-3 px-6">
                      <p className="font-medium text-gray-800">
                        {dist.family?.responsible_name || "—"}
                      </p>
                      <p className="text-xs text-gray-500">{dist.family?.city}</p>
                    </td>
                    <td className="py-3 px-6 leading-5">
                      {dist.food_basket.items.map((item, i) => (
                        <div key={i}>
                          {item.name} ×{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-6">{dist.collaborator?.name || "—"}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          dist.status === "delivered"
                            ? "bg-orange-100 text-orange-600"
                            : dist.status === "pending"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {dist.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => setSelectedCesta(dist)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar */}
      <CriarCestaModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={async () => {
          setShowModal(false);
          try {
            const res = await getDistributions(1, 10);
            setDistributions(res.results);
          } catch (err) {
            console.error("Erro ao atualizar distribuições após criação:", err);
          }
        }}
      />

      {/* Modal Detalhes */}
      {selectedCesta && (
        <CestasDetalhesModal
          cesta={selectedCesta}
          onClose={() => setSelectedCesta(null)}
        />
      )}
    </div>
  );
}
