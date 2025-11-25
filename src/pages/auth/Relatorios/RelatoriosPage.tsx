import { FileText, CalendarDays, Download, BarChart3, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getDonations } from "../../../services/apiDoacoes";
import { getProducts } from "../../../services/apiProducts";
import { getFamily } from "../../../services/apiFamily";

//tipagens//
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface ReportCardProps {
  title: string;
  description: string;
  onDownload: () => void;
  onPreview: () => void;
  onDownloadExcel: () => void;
}

interface Donation {
  created_at?: string;
  donor?: { name?: string };
  product?: { name?: string };
  quantity?: number;
  amount?: number;
  unit?: string;
}

interface Product {
  name?: string;
  category?: { name?: string };
  in_stock?: number;
  unit?: string;
  minimum_stock?: number;
}

interface Family {
  responsible_name?: string;
  members_count?: number;
  is_active?: boolean;
}

export default function RelatoriosPage() {
  const [period, setPeriod] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [reportsGenerated, setReportsGenerated] = useState<number>(0);
  const [downloads, setDownloads] = useState<number>(0);

  const primaryColor = "#ff7a00";
  const whiteColor = "#ffffff";
  const grayText = "#333333";
  const margin = 40;

  //FUNÇÕES//
  const filterByPeriod = (date?: string) => {
    if (!period) return true;
    if (!date) return false;
    const now = new Date();
    const d = new Date(date);
    if (period === "7d") return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
    if (period === "30d") return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
    return true;
  };

  //PDF //
  const gerarPdfDoacoes = async (preview = false) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerHeight = 60;

    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, headerHeight, "F");
    doc.setTextColor(whiteColor);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Doações", margin, 38);

    const { results } = await getDonations(1, 999);
    const filtered = results.filter(d => filterByPeriod(d.created_at));
    let cursorY = headerHeight + 20;

    autoTable(doc, {
      startY: cursorY,
      head: [["Data", "Doador", "Produto", "Quantidade"]],
      body: filtered.map(d => [
        new Date(d.created_at || '').toLocaleDateString(),
        d.donor?.name || "—",
        d.product?.name || "—",
        d.quantity ? `${d.quantity} ${d.unit || "un"}` : d.amount ? `R$ ${d.amount}` : "—"
      ]),
      headStyles: { fillColor: primaryColor, textColor: whiteColor, halign: "center", fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 11, textColor: grayText, cellPadding: 6 },
      theme: "grid",
      margin: { left: margin, right: margin },
    });

    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.getHeight() - 40);

    if (preview) return doc.output("bloburl");
    doc.save(`relatorio-doacoes.pdf`);
    setDownloads(prev => prev + 1);
  };

  const gerarPdfEstoque = async (preview = false) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerHeight = 60;

    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, headerHeight, "F");
    doc.setTextColor(whiteColor);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Estoque", margin, 38);

    const { results } = await getProducts(1, 999);
    const filtered = results;
    let cursorY = headerHeight + 20;

    autoTable(doc, {
      startY: cursorY,
      head: [["Produto", "Categoria", "Quantidade", "Unidade", "Estoque Mínimo"]],
      body: filtered.map(p => [
        p.name || "—",
        p.category?.name || "—",
        p.in_stock ?? 0,
        p.unit || "—",
        p.minimum_stock ?? "—"
      ]),
      headStyles: { fillColor: primaryColor, textColor: whiteColor, halign: "center", fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 11, textColor: grayText, cellPadding: 6 },
      theme: "grid",
      margin: { left: margin, right: margin },
    });

    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.getHeight() - 40);

    if (preview) return doc.output("bloburl");
    doc.save(`relatorio-estoque.pdf`);
    setDownloads(prev => prev + 1);
  };

  const gerarPdfFamilias = async (preview = false) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerHeight = 60;

    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, headerHeight, "F");
    doc.setTextColor(whiteColor);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Famílias", margin, 38);

    const { results } = await getFamily(1, 999);
    const filtered = results;
    let cursorY = headerHeight + 20;

    autoTable(doc, {
      startY: cursorY,
      head: [["Família", "Integrantes", "Situação"]],
      body: filtered.map(f => [
        f.responsible_name || "—",
        f.members_count ?? 0,
        f.is_active ? "Ativa" : "Inativa"
      ]),
      headStyles: { fillColor: primaryColor, textColor: whiteColor, halign: "center", fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 11, textColor: grayText, cellPadding: 6 },
      theme: "grid",
      margin: { left: margin, right: margin },
    });

    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.getHeight() - 40);

    if (preview) return doc.output("bloburl");
    doc.save(`relatorio-familias.pdf`);
    setDownloads(prev => prev + 1);
  };

  /* ================== EXCEL ================== */
  const gerarExcelDoacoes = async () => {
    const { results } = await getDonations(1, 999);
    const filtered = results.filter(d => filterByPeriod(d.created_at));

    const data = filtered.map(d => ({
      Data: new Date(d.created_at || '').toLocaleDateString(),
      Doador: d.donor?.name || "—",
      Produto: d.product?.name || "—",
      Quantidade: d.quantity ? `${d.quantity} ${d.unit || "un"}` : d.amount ? `R$ ${d.amount}` : "—",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doações");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "relatorio-doacoes.xlsx");
    setDownloads(prev => prev + 1);
  };

  const gerarExcelEstoque = async () => {
    const { results } = await getProducts(1, 999);
    const data = results.map(p => ({
      Produto: p.name,
      Categoria: p.category?.name || "—",
      Quantidade: p.in_stock ?? 0,
      Unidade: p.unit || "—",
      Estoque_Minimo: p.minimum_stock ?? "—"
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "relatorio-estoque.xlsx");
    setDownloads(prev => prev + 1);
  };

  const gerarExcelFamilias = async () => {
    const { results } = await getFamily(1, 999);
    const data = results.map(f => ({
      Familia: f.responsible_name,
      Integrantes: f.members_count ?? 0,
      Situacao: f.is_active ? "Ativa" : "Inativa"
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Famílias");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "relatorio-familias.xlsx");
    setDownloads(prev => prev + 1);
  };

  const handlePreview = async (type: "doacoes" | "estoque" | "familias") => {
    let url;
    if (type === "doacoes") url = await gerarPdfDoacoes(true);
    if (type === "estoque") url = await gerarPdfEstoque(true);
    if (type === "familias") url = await gerarPdfFamilias(true);
    window.open(url, "_blank");
  };

  /* ==================================================== */
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-700">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-800">Relatórios</h1>
        <p className="text-gray-500 text-sm mt-1">Relatórios gerais e estatísticas do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Relatórios Gerados" value={reportsGenerated} icon={FileText} />
        <StatCard label="Este Mês" value={15} icon={CalendarDays} />
        <StatCard label="Downloads" value={downloads} icon={Download} />
        <StatCard label="Categorias" value={4} icon={BarChart3} />
      </div>

      {/* Cards dos Relatórios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <ReportCard
          title="Relatório de Doações"
          description="Listagem completa de todas as doações recebidas"
          onDownload={() => gerarPdfDoacoes()}
          onPreview={() => handlePreview("doacoes")}
          onDownloadExcel={gerarExcelDoacoes}
        />
        <ReportCard
          title="Relatório de Estoque"
          description="Status atual do estoque por categoria"
          onDownload={() => gerarPdfEstoque()}
          onPreview={() => handlePreview("estoque")}
          onDownloadExcel={gerarExcelEstoque}
        />
        <ReportCard
          title="Relatório de Famílias"
          description="Lista de famílias beneficiadas e estatísticas"
          onDownload={() => gerarPdfFamilias()}
          onPreview={() => handlePreview("familias")}
          onDownloadExcel={gerarExcelFamilias}
        />
      </div>

      {/* Relatório Personalizado */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Relatório Personalizado</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <select className="p-3 border outline-none rounded-lg bg-gray-50" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">Selecione o período</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="custom">Período personalizado</option>
          </select>

          <select className="p-3 border outline-none rounded-lg bg-gray-50" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="doacoes">Doações</option>
            <option value="familias">Famílias</option>
            <option value="estoque">Estoque</option>
          </select>
        </div>

        <button
          onClick={() => {
            setReportsGenerated(prev => prev + 1);
            if (category === "doacoes") gerarPdfDoacoes();
            if (category === "estoque") gerarPdfEstoque();
            if (category === "familias") gerarPdfFamilias();
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow transition mb-2"
        >
          Gerar PDF
        </button>

        <button
          onClick={() => {
            setReportsGenerated(prev => prev + 1);
            if (category === "doacoes") gerarExcelDoacoes();
            if (category === "estoque") gerarExcelEstoque();
            if (category === "familias") gerarExcelFamilias();
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow transition flex items-center justify-center gap-2"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Gerar Excel
        </button>
      </div>
    </div>
  );
}

/* ====================== Components ====================== */
function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="bg-orange-50 p-4 rounded-full">
        <Icon className="text-orange-500 w-7 h-7" />
      </div>
    </div>
  );
}

function ReportCard({ title, description, onDownload, onPreview, onDownloadExcel }: ReportCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={onPreview} className="flex-1 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 transition">Visualizar PDF</button>
        <button onClick={onDownload} className="flex-1 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition">Baixar PDF</button>
        <button
          onClick={onDownloadExcel}
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition flex items-center justify-center"
          title="Baixar Excel"
        >
          <FileSpreadsheet className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
