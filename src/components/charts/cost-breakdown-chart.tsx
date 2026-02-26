"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculationResults } from "@/lib/types";

interface CostBreakdownChartProps {
  results: CalculationResults;
}

const COLORS = [
  "#22c55e", // green - Labores
  "#eab308", // yellow - Semilla
  "#3b82f6", // blue - Fertilizantes
  "#8b5cf6", // purple - Agroquímicos
  "#f97316", // orange - Cosecha
  "#ec4899", // pink - Flete
  "#14b8a6", // teal - Comercialización
  "#ef4444", // red - Arrendamiento
  "#6366f1", // indigo - Financiamiento
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
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percent.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-1 text-xs mt-2">
        {dataWithPercent.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate">{entry.name}</span>
            <span className="text-muted-foreground ml-auto">
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
        <CardTitle className="text-sm font-medium">
          🥧 Distribución de Costos
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
        <div className="mt-3 text-center text-sm text-muted-foreground">
          Total: {formatCurrency(total)} USD/ha
        </div>
      </CardContent>
    </Card>
  );
}
