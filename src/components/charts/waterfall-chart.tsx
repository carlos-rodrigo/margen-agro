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
import { BarChart3 } from "lucide-react";
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

// Agricultural color palette
const COLORS = {
  income: "#1a4d1a", // forest green
  cost: "#c45c3e", // terracotta
  profitPositive: "#2d6a2d", // darker green
  profitNegative: "#c45c3e", // terracotta
};

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
      fill: COLORS.income,
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
        fill: COLORS.cost,
        start,
        end: running,
      });
    }
  }

  // Agregar margen final
  data.push({
    name: "Margen",
    value: margenBrutoHa,
    fill: margenBrutoHa >= 0 ? COLORS.profitPositive : COLORS.profitNegative,
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
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Composición del Margen (USD/ha)
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
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                angle={-45}
                textAnchor="end"
                interval={0}
                stroke="hsl(var(--border))"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                tickFormatter={(value) => `$${value}`}
                stroke="hsl(var(--border))"
              />
              <Tooltip
                formatter={(value, _name, entry) => {
                  const actualValue = (entry.payload as { actualValue: number }).actualValue;
                  return [formatCurrency(actualValue), actualValue >= 0 ? "+" : "-"];
                }}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "2px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-mono)",
                }}
              />
              <ReferenceLine y={0} stroke="hsl(var(--border))" />
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
