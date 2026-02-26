"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculationResults } from "@/lib/types";

interface CostBreakdownChartProps {
  results: CalculationResults;
}

// Agricultural color palette - earthy tones
const COLORS = [
  "#1a4d1a", // forest green - Labores
  "#d4a84b", // amber/wheat - Semilla
  "#2d6a2d", // mid green - Fertilizantes
  "#8b7355", // earth brown - Agroquímicos
  "#c45c3e", // terracotta - Cosecha
  "#5c8a5c", // sage green - Flete
  "#a67c52", // tan - Comercialización
  "#4a7c59", // hunter green - Arrendamiento
  "#7a6348", // brown - Financiamiento
];

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function CostBreakdownChart({ results }: CostBreakdownChartProps) {
  const { desgloseCostos } = results;

  // Construir datos para el pie chart
  const rawData = [
    { name: "Labores", value: desgloseCostos.labores, color: COLORS[0] },
    { name: "Semilla", value: desgloseCostos.semilla, color: COLORS[1] },
    { name: "Fertilizantes", value: desgloseCostos.fertilizantes, color: COLORS[2] },
    { name: "Agroquímicos", value: desgloseCostos.agroquimicos, color: COLORS[3] },
    { name: "Cosecha", value: desgloseCostos.cosecha, color: COLORS[4] },
    { name: "Flete", value: desgloseCostos.flete, color: COLORS[5] },
    { name: "Comercialización", value: desgloseCostos.comercializacion, color: COLORS[6] },
    { name: "Arrendamiento", value: desgloseCostos.arrendamiento, color: COLORS[7] },
    { name: "Financiamiento", value: desgloseCostos.financiamiento, color: COLORS[8] },
  ];

  // Filtrar solo costos > 0
  const data = rawData.filter((d) => d.value > 0);

  // Calcular total para porcentajes
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return null;
  }

  // Agregar porcentaje a cada item
  const dataWithPercent = data.map((d) => ({
    ...d,
    percent: (d.value / total) * 100,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percent: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border-2 border-border bg-card p-2">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm font-mono text-muted-foreground">
            {formatCurrency(data.value)} ({data.percent.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-1.5 text-xs mt-2">
        {dataWithPercent.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate">{entry.name}</span>
            <span className="font-mono text-muted-foreground ml-auto">
              {entry.percent.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <PieChartIcon className="h-4 w-4 text-primary" />
          Distribución de Costos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercent}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {dataWithPercent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {renderLegend()}
        <div className="mt-3 text-center text-sm font-mono text-muted-foreground">
          Total: {formatCurrency(total)} USD/ha
        </div>
      </CardContent>
    </Card>
  );
}
