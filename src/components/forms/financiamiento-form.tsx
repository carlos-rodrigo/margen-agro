"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinanciamientoData } from "@/lib/types";

interface FinanciamientoFormProps {
  costosDirectos?: number; // Para mostrar cálculo estimado
  onChange?: (data: FinanciamientoData) => void;
}

export function FinanciamientoForm({ costosDirectos = 0, onChange }: FinanciamientoFormProps) {
  const [incluir, setIncluir] = useState(false);
  const [tea, setTea] = useState<string>("24");

  const notifyChange = (updates: Partial<{
    incluir: boolean;
    tea: string;
  }> = {}) => {
    if (onChange) {
      const inc = updates.incluir ?? incluir;
      const t = updates.tea ?? tea;

      onChange({
        incluir: inc,
        tea: parseFloat(t) || 0,
      });
    }
  };

  // Cálculo estimado del interés
  // Fórmula: (Costos × 0.5) × TEA × (meses/12)
  // Asumimos 6 meses de financiamiento promedio
  const teaVal = parseFloat(tea) || 0;
  const interesEstimado = incluir
    ? (costosDirectos * 0.5) * (teaVal / 100) * (6 / 12)
    : 0;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="financiamiento">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex w-full items-center justify-between pr-4">
            <span>💳 Financiamiento</span>
            {interesEstimado > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ${interesEstimado.toFixed(2)} USD/ha
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Incluye el costo del capital circulante invertido en la campaña.
          </p>

          {/* Toggle incluir */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="incluir-financiamiento"
              checked={incluir}
              onChange={(e) => {
                setIncluir(e.target.checked);
                notifyChange({ incluir: e.target.checked });
              }}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="incluir-financiamiento">
              Incluir costo financiero en el cálculo
            </Label>
          </div>

          {/* TEA */}
          {incluir && (
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              <div className="space-y-2">
                <Label htmlFor="tea">Tasa Efectiva Anual (TEA)</Label>
                <div className="relative">
                  <Input
                    id="tea"
                    type="number"
                    min="0"
                    max="200"
                    step="0.5"
                    placeholder="Ej: 24"
                    value={tea}
                    onChange={(e) => {
                      setTea(e.target.value);
                      notifyChange({ tea: e.target.value });
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasa anual de financiamiento en dólares
                </p>
              </div>

              {/* Fórmula explicada */}
              <div className="rounded bg-primary/10 p-3 text-sm space-y-1">
                <p className="font-medium">Cálculo del interés:</p>
                <p className="text-muted-foreground">
                  (Costos × 50%) × TEA × (6 meses / 12)
                </p>
                {costosDirectos > 0 && (
                  <p>
                    (${costosDirectos.toFixed(2)} × 0.5) × {teaVal}% × 0.5 ={" "}
                    <span className="font-bold">${interesEstimado.toFixed(2)} USD/ha</span>
                  </p>
                )}
                {costosDirectos === 0 && (
                  <p className="text-muted-foreground italic">
                    Complete los costos para ver el cálculo
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Se asume que el 50% del capital se invierte al inicio y el resto
                durante la campaña, con un período promedio de 6 meses.
              </p>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
