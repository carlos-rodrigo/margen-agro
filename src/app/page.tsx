"use client";

import { useState, useMemo, useEffect } from "react";
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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                🌾 Calculadora de Margen Bruto
              </h1>
              <p className="text-muted-foreground">
                Metodología INTA para análisis económico agrícola
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CurrencyToggle onToggle={handleCurrencyToggle} />
              <ExportButtons inputs={inputs} results={results} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Forms Column */}
          <div className="space-y-4">
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
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Calculadora de Margen Bruto Agrícola - Metodología INTA
          </p>
          <p className="mt-1">
            Los precios son referenciales. Consulte con un profesional para decisiones comerciales.
          </p>
        </div>
      </footer>
    </main>
  );
}
