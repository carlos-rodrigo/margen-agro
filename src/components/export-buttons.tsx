"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, FileText, Check, Copy } from "lucide-react";
import type { CalculatorInputs, CalculationResults } from "@/lib/types";
import { generateShareUrl } from "@/lib/url-state";

interface ExportButtonsProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
}

export function ExportButtons({ inputs, results }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url = generateShareUrl(inputs);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      alert("Error al copiar el link");
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // Crear contenido HTML para imprimir
      const content = generatePrintContent(inputs, results);
      
      // Abrir ventana de impresión
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        // Dar tiempo para cargar estilos
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error al exportar PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        disabled={copied}
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copiar link
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        disabled={exporting}
      >
        <FileText className="mr-2 h-4 w-4" />
        {exporting ? "Exportando..." : "Exportar PDF"}
      </Button>
    </div>
  );
}

function generatePrintContent(
  inputs: CalculatorInputs,
  results: CalculationResults
): string {
  const { produccion, precio } = inputs;
  const { desgloseCostos } = results;

  const formatCurrency = (value: number) =>
    `USD ${value.toFixed(2)}`;

  const cultivoNames: Record<string, string> = {
    soja: "Soja",
    maiz: "Maíz",
    trigo: "Trigo",
    girasol: "Girasol",
    cebada: "Cebada",
    sorgo: "Sorgo",
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Margen Bruto - ${cultivoNames[produccion.cultivo] || produccion.cultivo}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #1a1a1a;
    }
    h1 { color: #166534; margin-bottom: 8px; }
    h2 { color: #166534; border-bottom: 2px solid #166534; padding-bottom: 8px; margin-top: 32px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .section { margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .label { color: #666; }
    .value { font-weight: 600; text-align: right; }
    .result-box {
      background: #f0fdf4;
      border: 2px solid #166534;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    .result-box.negative {
      background: #fef2f2;
      border-color: #dc2626;
    }
    .result-title { font-size: 14px; color: #666; }
    .result-value { font-size: 24px; font-weight: bold; color: #166534; }
    .result-box.negative .result-value { color: #dc2626; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
    th { background: #f5f5f5; font-weight: 600; }
    td:last-child { text-align: right; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666; }
    @media print {
      body { padding: 20px; }
      .result-box { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>🌾 Análisis de Margen Bruto</h1>
  <p class="subtitle">Generado el ${new Date().toLocaleDateString("es-AR")}</p>
  
  <h2>📋 Datos de Producción</h2>
  <div class="grid">
    <span class="label">Cultivo:</span>
    <span class="value">${cultivoNames[produccion.cultivo] || produccion.cultivo || "-"}</span>
    <span class="label">Superficie:</span>
    <span class="value">${produccion.superficie} ha</span>
    <span class="label">Rendimiento:</span>
    <span class="value">${produccion.rendimiento} ${produccion.unidadRendimiento}/ha</span>
    <span class="label">Precio:</span>
    <span class="value">${formatCurrency(precio.precioBruto)}/tn</span>
  </div>

  <div class="result-box ${results.margenBrutoHa < 0 ? "negative" : ""}">
    <div class="result-title">Margen Bruto</div>
    <div class="result-value">${formatCurrency(results.margenBrutoHa)}/ha</div>
    ${produccion.superficie > 0 ? `<div class="result-title">Total: ${formatCurrency(results.margenBrutoTotal)}</div>` : ""}
  </div>

  <h2>💰 Resumen Económico</h2>
  <table>
    <tr>
      <th>Concepto</th>
      <th>USD/ha</th>
    </tr>
    <tr>
      <td>Ingreso Bruto</td>
      <td style="color: #166534;">+${formatCurrency(results.ingresoBrutoHa)}</td>
    </tr>
    <tr>
      <td>Costos Directos</td>
      <td style="color: #dc2626;">-${formatCurrency(results.costosDirectosHa)}</td>
    </tr>
    <tr style="font-weight: bold;">
      <td>Margen Bruto</td>
      <td style="color: ${results.margenBrutoHa >= 0 ? "#166534" : "#dc2626"};">${formatCurrency(results.margenBrutoHa)}</td>
    </tr>
  </table>

  <h2>📊 Desglose de Costos</h2>
  <table>
    <tr>
      <th>Rubro</th>
      <th>USD/ha</th>
    </tr>
    ${desgloseCostos.labores > 0 ? `<tr><td>Labores</td><td>${formatCurrency(desgloseCostos.labores)}</td></tr>` : ""}
    ${desgloseCostos.semilla > 0 ? `<tr><td>Semilla</td><td>${formatCurrency(desgloseCostos.semilla)}</td></tr>` : ""}
    ${desgloseCostos.fertilizantes > 0 ? `<tr><td>Fertilizantes</td><td>${formatCurrency(desgloseCostos.fertilizantes)}</td></tr>` : ""}
    ${desgloseCostos.agroquimicos > 0 ? `<tr><td>Agroquímicos</td><td>${formatCurrency(desgloseCostos.agroquimicos)}</td></tr>` : ""}
    ${desgloseCostos.cosecha > 0 ? `<tr><td>Cosecha</td><td>${formatCurrency(desgloseCostos.cosecha)}</td></tr>` : ""}
    ${desgloseCostos.flete > 0 ? `<tr><td>Flete</td><td>${formatCurrency(desgloseCostos.flete)}</td></tr>` : ""}
    ${desgloseCostos.comercializacion > 0 ? `<tr><td>Comercialización</td><td>${formatCurrency(desgloseCostos.comercializacion)}</td></tr>` : ""}
    ${desgloseCostos.arrendamiento > 0 ? `<tr><td>Arrendamiento</td><td>${formatCurrency(desgloseCostos.arrendamiento)}</td></tr>` : ""}
    ${desgloseCostos.financiamiento > 0 ? `<tr><td>Financiamiento</td><td>${formatCurrency(desgloseCostos.financiamiento)}</td></tr>` : ""}
    <tr style="font-weight: bold; background: #f5f5f5;">
      <td>Total Costos</td>
      <td>${formatCurrency(results.costosDirectosHa)}</td>
    </tr>
  </table>

  <h2>📈 Indicadores</h2>
  <div class="grid">
    <span class="label">Rinde de indiferencia:</span>
    <span class="value">${results.rindeIndiferencia.toFixed(1)} ${produccion.unidadRendimiento}/ha</span>
    <span class="label">Retorno por $ invertido:</span>
    <span class="value">${results.retornoPorPesoInvertido >= 0 ? "+" : ""}${results.retornoPorPesoInvertido.toFixed(1)}%</span>
  </div>

  <div class="footer">
    <p>Calculadora de Margen Bruto Agrícola - Metodología INTA</p>
    <p>Este es un análisis referencial. Consulte con un profesional para decisiones comerciales.</p>
  </div>
</body>
</html>
  `;
}
