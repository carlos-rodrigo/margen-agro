"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Check, Copy } from "lucide-react";
import type { CalculatorInputs, CalculationResults } from "@/lib/types";
import { generateShareUrl } from "@/lib/url-state";

interface ExportButtonsProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
}

// Social share icons as inline SVGs
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export function ExportButtons({ inputs, results }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const getShareUrl = () => generateShareUrl(inputs);

  const getShareText = () => {
    const cultivo = inputs.produccion.cultivo;
    const margen = results.margenBrutoHa.toFixed(2);
    return `Calculé mi margen bruto de ${cultivo}: USD ${margen}/ha con RindeMax`;
  };

  const handleCopyLink = async () => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      alert("Error al copiar el link");
    }
  };

  const handleShareTwitter = () => {
    const url = getShareUrl();
    const text = getShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const handleShareWhatsApp = () => {
    const url = getShareUrl();
    const text = `${getShareText()}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = getShareUrl();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "width=550,height=420");
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
    <div className="flex flex-wrap items-center gap-2">
      {/* Copiar link */}
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

      {/* Social share buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareTwitter}
          className="px-2"
          title="Compartir en X (Twitter)"
        >
          <TwitterIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareWhatsApp}
          className="px-2 hover:bg-green-50 hover:border-green-300"
          title="Compartir en WhatsApp"
        >
          <WhatsAppIcon className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareLinkedIn}
          className="px-2 hover:bg-blue-50 hover:border-blue-300"
          title="Compartir en LinkedIn"
        >
          <LinkedInIcon className="h-4 w-4 text-blue-600" />
        </Button>
      </div>
      
      {/* Export PDF */}
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
  <title>RindeMax - ${cultivoNames[produccion.cultivo] || produccion.cultivo}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #1a1a1a;
    }
    h1 { color: #16a34a; margin-bottom: 8px; }
    h2 { color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 8px; margin-top: 32px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .section { margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .label { color: #666; }
    .value { font-weight: 600; text-align: right; }
    .result-box {
      background: #f0fdf4;
      border: 2px solid #16a34a;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    .result-box.negative {
      background: #fef2f2;
      border-color: #dc2626;
    }
    .result-title { font-size: 14px; color: #666; }
    .result-value { font-size: 24px; font-weight: bold; color: #16a34a; }
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
  <h1>RindeMax - Análisis de Margen Bruto</h1>
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
      <td style="color: #16a34a;">+${formatCurrency(results.ingresoBrutoHa)}</td>
    </tr>
    <tr>
      <td>Costos Directos</td>
      <td style="color: #dc2626;">-${formatCurrency(results.costosDirectosHa)}</td>
    </tr>
    <tr style="font-weight: bold;">
      <td>Margen Bruto</td>
      <td style="color: ${results.margenBrutoHa >= 0 ? "#16a34a" : "#dc2626"};">${formatCurrency(results.margenBrutoHa)}</td>
    </tr>
  </table>

  <h2>Desglose de Costos</h2>
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
    <p><strong>RindeMax</strong> - Calculá tu margen. Maximizá tu campo.</p>
    <p>Este es un análisis referencial. Consulte con un profesional para decisiones comerciales.</p>
  </div>
</body>
</html>
  `;
}
