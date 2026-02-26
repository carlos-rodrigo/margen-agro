"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculationResults, YieldUnit } from "@/lib/types";

interface ResultsPanelProps {
  results: CalculationResults;
  unidadRendimiento: YieldUnit;
  superficie: number;
  showARS?: boolean;
  tipoCambio?: number;
}

function formatCurrency(value: number, currency: "USD" | "ARS" = "USD"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "ARS" ? 0 : 2,
    maximumFractionDigits: currency === "ARS" ? 0 : 2,
  }).format(value);
}

function DualValue({ usd, tipoCambio, showARS }: { usd: number; tipoCambio: number; showARS: boolean }) {
  return (
    <>
      {formatCurrency(usd)}
      {showARS && (
        <span className="ml-1 text-xs text-muted-foreground">
          ({formatCurrency(usd * tipoCambio, "ARS")})
        </span>
      )}
    </>
  );
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function ResultsPanel({ results, unidadRendimiento, superficie, showARS = false, tipoCambio = 1000 }: ResultsPanelProps) {
  const hasData = results.ingresoBrutoHa > 0 || results.costosDirectosHa > 0;
  const isPositive = results.margenBrutoHa >= 0;
  const isAjustadoPositive = results.margenBrutoAjustadoHa >= 0;

  // Determinar si hay arrendamiento o financiamiento para mostrar margen ajustado
  const hasAdjustments =
    results.desgloseCostos.arrendamiento > 0 ||
    results.desgloseCostos.financiamiento > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          Resultados
          {hasData && (
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isPositive ? "Rentable" : "No rentable"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasData ? (
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            Complete los datos para ver los resultados
          </div>
        ) : (
          <>
            {/* Métricas principales */}
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Ingreso Bruto</span>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(results.ingresoBrutoHa)}/ha</div>
                  {superficie > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(results.ingresoBrutoTotal)} total
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Costos Directos</span>
                <div className="text-right">
                  <div className="font-medium text-red-600">
                    -{formatCurrency(results.costosDirectosHa)}/ha
                  </div>
                  {superficie > 0 && (
                    <div className="text-xs text-muted-foreground">
                      -{formatCurrency(results.costosDirectosTotal)} total
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`flex justify-between rounded-lg p-3 ${
                  isPositive ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <span className="font-semibold">Margen Bruto</span>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      isPositive ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {formatCurrency(results.margenBrutoHa)}/ha
                  </div>
                  {superficie > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(results.margenBrutoTotal)} total
                    </div>
                  )}
                </div>
              </div>

              {/* Margen Ajustado (si aplica) */}
              {hasAdjustments && (
                <div
                  className={`flex justify-between rounded-lg border-2 p-3 ${
                    isAjustadoPositive
                      ? "border-green-200 bg-green-50/50"
                      : "border-red-200 bg-red-50/50"
                  }`}
                >
                  <div>
                    <span className="font-semibold">Margen Ajustado</span>
                    <p className="text-xs text-muted-foreground">
                      (con arrend. y financ.)
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        isAjustadoPositive ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {formatCurrency(results.margenBrutoAjustadoHa)}/ha
                    </div>
                    {superficie > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(results.margenBrutoAjustadoTotal)} total
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Indicadores */}
            <div className="rounded-lg bg-muted/30 p-3 space-y-2">
              <h4 className="text-sm font-medium">Indicadores</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Rinde indiferencia</span>
                  <div className="font-medium">
                    {results.rindeIndiferencia.toFixed(1)} {unidadRendimiento}/ha
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Retorno por $ invertido</span>
                  <div
                    className={`font-medium ${
                      results.retornoPorPesoInvertido >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatPercent(results.retornoPorPesoInvertido)}
                  </div>
                </div>
              </div>
            </div>

            {/* Desglose de costos */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Desglose de costos (USD/ha)</h4>
              <div className="space-y-1 text-sm">
                {results.desgloseCostos.labores > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Labores</span>
                    <span>{formatCurrency(results.desgloseCostos.labores)}</span>
                  </div>
                )}
                {results.desgloseCostos.semilla > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Semilla</span>
                    <span>{formatCurrency(results.desgloseCostos.semilla)}</span>
                  </div>
                )}
                {results.desgloseCostos.fertilizantes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fertilizantes</span>
                    <span>{formatCurrency(results.desgloseCostos.fertilizantes)}</span>
                  </div>
                )}
                {results.desgloseCostos.agroquimicos > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agroquímicos</span>
                    <span>{formatCurrency(results.desgloseCostos.agroquimicos)}</span>
                  </div>
                )}
                {results.desgloseCostos.cosecha > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cosecha</span>
                    <span>{formatCurrency(results.desgloseCostos.cosecha)}</span>
                  </div>
                )}
                {results.desgloseCostos.flete > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flete</span>
                    <span>{formatCurrency(results.desgloseCostos.flete)}</span>
                  </div>
                )}
                {results.desgloseCostos.comercializacion > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comercialización</span>
                    <span>{formatCurrency(results.desgloseCostos.comercializacion)}</span>
                  </div>
                )}
                {results.desgloseCostos.arrendamiento > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Arrendamiento</span>
                    <span>{formatCurrency(results.desgloseCostos.arrendamiento)}</span>
                  </div>
                )}
                {results.desgloseCostos.financiamiento > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Financiamiento</span>
                    <span>{formatCurrency(results.desgloseCostos.financiamiento)}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
