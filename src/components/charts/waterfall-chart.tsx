"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculationResults } from "@/lib/types";

interface WaterfallChartProps {
  results: CalculationResults;
}

interface WaterfallData {
  name: string;
  value: number;
  fill: string;
  start: number;
  end: number;
}

function formatCurrency(value: number): string {
  return `$${Math.abs(value).toFixed(0)}`;
}

export function WaterfallChart({ results }: WaterfallChartProps) {
  const hasData = results.ingresoBrutoHa > 0 || results.costosDirectosHa > 0;

  if (!hasData) {
    return null;
  }

  // Construir datos para waterfall
  const { desgloseCostos, ingresoBrutoHa, margenBrutoHa } = results;

  // Acumular costos para el waterfall
  let running = ingresoBrutoHa;
  const data: WaterfallData[] = [
    {
      name: "Ingreso",
      value: ingresoBrutoHa,
      fill: "#22c55e", // green-500
      start: 0,
      end: ingresoBrutoHa,
    },
  ];

  // Agregar cada costo como paso negativo
  const costos = [
    { name: "Labores", value: desgloseCostos.labores },
    { name: "Semilla", value: desgloseCostos.semilla },
    { name: "Fertiliz.", value: desgloseCostos.fertilizantes },
    { name: "Agroquím.", value: desgloseCostos.agroquimicos },
    { name: "Cosecha", value: desgloseCostos.cosecha },
    { name: "Flete", value: desgloseCostos.flete },
    { name: "Comerc.", value: desgloseCostos.comercializacion },
  ];

  for (const costo of costos) {
    if (costo.value > 0) {
      const start = running;
      running -= costo.value;
      data.push({
        name: costo.name,
        value: -costo.value,
        fill: "#ef4444", // red-500
        start,
        end: running,
      });
    }
  }

  // Agregar margen final
  data.push({
    name: "Margen",
    value: margenBrutoHa,
    fill: margenBrutoHa >= 0 ? "#22c55e" : "#ef4444",
    start: 0,
    end: margenBrutoHa,
  });

  // Para el waterfall, usamos barras flotantes
  // Convertimos a formato que recharts pueda manejar
  const chartData = data.map((d) => ({
    name: d.name,
    value: Math.abs(d.value),
    start: Math.min(d.start, d.end),
    fill: d.fill,
    isNegative: d.value < 0,
    actualValue: d.value,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          📊 Composición del Margen (USD/ha)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value, _name, entry) => {
                  const actualValue = (entry.payload as { actualValue: number }).actualValue;
                  return [formatCurrency(actualValue), actualValue >= 0 ? "+" : "-"];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <ReferenceLine y={0} stroke="#888" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
