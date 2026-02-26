"use client";

import { useState, useMemo, useEffect } from "react";
import { Wheat, TrendingUp, Lightbulb, Check } from "lucide-react";
import { ProductionForm } from "@/components/forms/production-form";
import { PriceForm } from "@/components/forms/price-form";
import { LaboresForm } from "@/components/forms/labores-form";
import { InsumosForm } from "@/components/forms/insumos-form";
import { CosechaForm } from "@/components/forms/cosecha-form";
import { ArrendamientoForm } from "@/components/forms/arrendamiento-form";
import { FinanciamientoForm } from "@/components/forms/financiamiento-form";
import { ResultsPanel } from "@/components/results-panel";
import { WaterfallChart, CostBreakdownChart } from "@/components/charts";
import { CurrencyToggle } from "@/components/currency-toggle";
import { ExportButtons } from "@/components/export-buttons";
import { calculateMargin, getDefaultInputs } from "@/lib/calculator";
import { usePrecios } from "@/hooks/use-precios";
import { readStateFromUrl, clearUrlState } from "@/lib/url-state";
import type {
  ProductionData,
  PriceData,
  LaboresData,
  InsumosData,
  CosechaData,
  ArrendamientoData,
  FinanciamientoData,
  CalculatorInputs,
} from "@/lib/types";

export default function Home() {
  const defaults = getDefaultInputs();
  const { getPrecioCultivo, precios } = usePrecios();

  // Estado para cada sección
  const [produccion, setProduccion] = useState<ProductionData>(defaults.produccion);
  const [precio, setPrecio] = useState<PriceData>(defaults.precio);
  const [labores, setLabores] = useState<LaboresData>(defaults.labores);
  const [insumos, setInsumos] = useState<InsumosData>(defaults.insumos);
  const [cosecha, setCosecha] = useState<CosechaData>(defaults.cosecha);
  const [arrendamiento, setArrendamiento] = useState<ArrendamientoData>(defaults.arrendamiento);
  const [financiamiento, setFinanciamiento] = useState<FinanciamientoData>(defaults.financiamiento);
  
  // Estado para moneda
  const [showARS, setShowARS] = useState(false);
  const [tipoCambio, setTipoCambio] = useState(1000);

  // Cargar estado desde URL al montar
  useEffect(() => {
    const urlState = readStateFromUrl();
    if (urlState) {
      setProduccion(urlState.produccion);
      setPrecio(urlState.precio);
      setLabores(urlState.labores);
      setInsumos(urlState.insumos);
      setCosecha(urlState.cosecha);
      setArrendamiento(urlState.arrendamiento);
      setFinanciamiento(urlState.financiamiento);
      // Limpiar URL después de cargar
      clearUrlState();
    }
  }, []);

  // Obtener precio pizarra para el cultivo seleccionado
  const precioPizarra = useMemo(() => {
    if (!produccion.cultivo) return undefined;
    const precioValue = getPrecioCultivo(produccion.cultivo);
    if (!precioValue) return undefined;
    const precioData = precios?.precios.find(p => p.cultivo === produccion.cultivo);
    return {
      precio: precioValue,
      fecha: precioData?.fecha || new Date().toISOString().split("T")[0],
    };
  }, [produccion.cultivo, getPrecioCultivo, precios]);

  // Calcular rendimiento en tn/ha para mostrar en cosecha
  const rendimientoTnHa = useMemo(() => {
    return produccion.unidadRendimiento === "qq"
      ? produccion.rendimiento / 10
      : produccion.rendimiento;
  }, [produccion.rendimiento, produccion.unidadRendimiento]);

  // Inputs consolidados
  const inputs: CalculatorInputs = useMemo(() => ({
    produccion,
    precio,
    labores,
    insumos,
    cosecha,
    arrendamiento,
    financiamiento,
  }), [produccion, precio, labores, insumos, cosecha, arrendamiento, financiamiento]);

  // Calcular resultados
  const results = useMemo(() => {
    return calculateMargin(inputs);
  }, [inputs]);

  const handleCurrencyToggle = (showARS: boolean, tc: number) => {
    setShowARS(showARS);
    setTipoCambio(tc);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50/50 to-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Top row: Logo + Ad banner placeholder */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {/* Logo y nombre */}
              <div className="flex items-center gap-2">
                <Wheat className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    RindeMax
                  </h1>
                  <p className="text-sm text-muted-foreground -mt-1">
                    Calculá tu margen. Maximizá tu campo.
                  </p>
                </div>
              </div>
              {/* Badges */}
              <div className="hidden sm:flex items-center gap-2 ml-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                  <Check className="h-3 w-3" /> Gratis
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  <Check className="h-3 w-3" /> Sin registro
                </span>
              </div>
            </div>
            
            {/* Ad banner placeholder */}
            <div className="hidden lg:flex items-center justify-center w-[468px] h-[60px] bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-400">
              Espacio publicitario
            </div>
          </div>

          {/* Mobile badges */}
          <div className="flex sm:hidden items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
              <Check className="h-3 w-3" /> Gratis
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
              <Check className="h-3 w-3" /> Sin registro
            </span>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
            <CurrencyToggle onToggle={handleCurrencyToggle} />
            <ExportButtons inputs={inputs} results={results} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_400px_180px]">
          {/* Forms Column */}
          <div className="space-y-4">
            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-4 text-white shadow-lg">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Calculá ahora tu margen bruto
              </h2>
              <p className="text-green-100 text-sm mt-1">
                Completá los datos de tu campaña y optimizá tu rentabilidad
              </p>
            </div>

            <ProductionForm onChange={setProduccion} />
            
            <PriceForm
              cultivo={produccion.cultivo}
              precioPizarra={precioPizarra?.precio}
              fechaPizarra={precioPizarra?.fecha}
              onChange={setPrecio}
            />
            
            <LaboresForm onChange={setLabores} />
            
            <InsumosForm onChange={setInsumos} />
            
            <CosechaForm
              rendimiento={rendimientoTnHa}
              onChange={setCosecha}
            />
            
            <ArrendamientoForm onChange={setArrendamiento} />
            
            <FinanciamientoForm
              costosDirectos={results.costosDirectosHa}
              onChange={setFinanciamiento}
            />

            {/* Bottom CTA */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-amber-800 font-medium flex items-center justify-center gap-2">
                <Lightbulb className="h-4 w-4" /> Optimizá tu campaña compartiendo este análisis con tu equipo
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-4">
            <ResultsPanel
              results={results}
              unidadRendimiento={produccion.unidadRendimiento}
              superficie={produccion.superficie}
              showARS={showARS}
              tipoCambio={tipoCambio}
            />
            
            {/* Charts */}
            <WaterfallChart results={results} />
            <CostBreakdownChart results={results} />
          </div>

          {/* Ads Sidebar (desktop only) */}
          <div className="hidden xl:block space-y-4">
            <div className="sticky top-8 space-y-4">
              <div className="flex flex-col items-center justify-center w-[160px] h-[600px] bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-400 text-center p-4">
                Publicidad
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Wheat className="h-5 w-5 text-primary" />
                <span className="font-bold text-green-600">RindeMax</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Calculadora de Margen Bruto Agrícola
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Los precios son referenciales. Consulte con un profesional para decisiones comerciales.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
