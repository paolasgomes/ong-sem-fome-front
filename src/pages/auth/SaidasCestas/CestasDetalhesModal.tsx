import React, { useState } from "react";
import { X, User, Box, Calendar, Clipboard } from "lucide-react";
import { updateDistributionStatus } from "../../../services/apiDistribuicao";
import { updateStock } from "../../../services/apiStock";
import type { Distribution } from "../../../services/apiDistribuicao";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  cesta: Distribution;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

const aggregateItems = (items: { name: string; quantity: number }[]) => {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    map[item.name] = (map[item.name] || 0) + item.quantity;
  });
  return Object.entries(map).map(([name, quantity]) => ({ name, quantity }));
};

export default function CestasDetalhesModal({ cesta, onClose, onStatusUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const totalItems = cesta.food_basket.items.reduce((sum, it) => sum + it.quantity, 0);

  const statusMap: Record<string, string> = {
    pending: "Pendente",
    delivered: "Enviado",
    canceled: "Cancelado",
  };

  const statusLabel = statusMap[cesta.status] ?? cesta.status;

  const statusColors: Record<string, { bg: string; text: string }> = {
    Pendente: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Enviado: { bg: "bg-green-100", text: "text-green-700" },
    Cancelado: { bg: "bg-red-100", text: "text-red-700" },
  };

  const statusColor = statusColors[statusLabel] ?? { bg: "bg-gray-200", text: "text-gray-700" };
  const aggregatedItems = aggregateItems(cesta.food_basket.items);

  const generatePDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const primary = "#ff7a00";
    const white = "#ffffff";
    const grayText = "#333333";

    const headerHeight = 60;
    doc.setFillColor(primary);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    doc.setTextColor(white);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório da Cesta", margin, 38);

    const responsible = cesta.family?.responsible_name || "—";
    const city = cesta.family?.city || "—";

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${responsible} — ${city}`, margin, 52);

    let cursorY = headerHeight + 20;

    autoTable(doc, {
      startY: cursorY,
      styles: {
        font: "helvetica",
        fontSize: 11,
        textColor: grayText,
      },
      headStyles: {
        fillColor: primary,
        textColor: white,
        halign: "center",
        fontStyle: "bold",
      },
      theme: "grid",
      head: [["Campo", "Valor"]],
      body: [
        ["Responsável", responsible],
        ["Cidade", city],
        ["Status", statusLabel || "—"],
        [
          "Data de criação",
          cesta.delivery_date ? new Date(cesta.delivery_date).toLocaleDateString() : "—",
        ],
        ["Colaborador", cesta.collaborator?.name || "—"],
        ["Observações", cesta.observations || "—"],
        ["Total de itens", String(totalItems)],
      ],
      margin: { left: margin, right: margin },
      styles: { cellPadding: 6 },
    });

    cursorY = (doc as any).lastAutoTable
      ? (doc as any).lastAutoTable.finalY + 18
      : cursorY + 120;

    doc.setTextColor(primary);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Itens da Cesta", margin, cursorY);

    autoTable(doc, {
      startY: cursorY + 8,
      head: [["Item", "Quantidade"]],
      body: aggregatedItems.map((it) => [it.name || "—", String(it.quantity ?? 0)]),
      styles: {
        font: "helvetica",
        fontSize: 11,
        textColor: grayText,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: primary,
        textColor: white,
        halign: "center",
        fontStyle: "bold",
      },
      margin: { left: margin, right: margin },
      theme: "grid",
    });

    const footerY = doc.internal.pageSize.getHeight() - 40;
    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, margin, footerY);

    const safeStatus = String(statusLabel).replace(/\s+/g, "-").toLowerCase();
    doc.save(`cesta-${cesta.id}-${safeStatus}.pdf`);
  };

  const handleChangeStatus = async (newStatus: "delivered" | "canceled") => {
    if (cesta.status === newStatus) return;
    setLoading(true);

    try {
      await updateDistributionStatus(cesta.id, newStatus);

      if (newStatus === "canceled") {
        for (const item of cesta.food_basket.items) {
          if ((item as any).id) {
            await updateStock((item as any).id, item.quantity);
          }
        }
      }

      onStatusUpdated?.();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar status ou retornar itens ao estoque:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Detalhes da Cesta</h3>
            <p className="text-xs text-gray-500">
              {cesta.family?.responsible_name} — {cesta.family?.city}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4 mb-4 text-gray-700">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Box className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Status:</span>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor.bg} ${statusColor.text}`}>
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Data de criação:</span>
            </div>
            <span>{new Date(cesta.delivery_date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <User className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Responsável:</span>
            </div>
            <span>{cesta.collaborator?.name || "—"}</span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Clipboard className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Observações:</span>
            </div>
            <span>{cesta.observations || "—"}</span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Box className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Total de itens:</span>
            </div>
            <span>{totalItems}</span>
          </div>
        </div>

        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <p className="text-sm font-medium mb-2">Itens da cesta</p>
          <div className="space-y-2">
            {aggregatedItems.length ? (
              aggregatedItems.map((it, i) => (
                <div key={i} className="flex justify-between bg-white p-2 rounded-md border">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">{it.quantity}</div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">Nenhum item adicionado.</p>
            )}
          </div>
        </div>

        {cesta.status === "pending" && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleChangeStatus("delivered")}
              disabled={loading}
              className="flex bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition flex-1"
            >
              {loading ? "Confirmando..." : "Confirmar Entrega"}
            </button>
            <button
              onClick={() => handleChangeStatus("canceled")}
              disabled={loading}
              className="flex bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition flex-1"
            >
              {loading ? "Cancelando..." : "Cancelar Entrega"}
            </button>
          </div>
        )}

        <button
          onClick={generatePDF}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Gerar Comprovante (PDF)
        </button>
      </div>
    </div>
  );
}
