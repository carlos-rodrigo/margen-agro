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
import type { CosechaData } from "@/lib/types";

interface CosechaFormProps {
  rendimiento?: number; // tn/ha para calcular flete
  onChange?: (data: CosechaData) => void;
}

export function CosechaForm({ rendimiento = 0, onChange }: CosechaFormProps) {
  const [tarifaBase, setTarifaBase] = useState<string>("35");
  const [correccionRendimiento, setCorreccionRendimiento] = useState(false);
  const [fleteDistancia, setFleteDistancia] = useState<string>("");
  const [fleteTarifa, setFleteTarifa] = useState<string>("0.08");
  const [comisionAcopio, setComisionAcopio] = useState<string>("2");
  const [otrosGastos, setOtrosGastos] = useState<string>("");

  const notifyChange = (updates: Partial<{
    tarifaBase: string;
    correccionRendimiento: boolean;
    fleteDistancia: string;
    fleteTarifa: string;
    comisionAcopio: string;
    otrosGastos: string;
  }> = {}) => {
    if (onChange) {
      const tb = updates.tarifaBase ?? tarifaBase;
      const cr = updates.correccionRendimiento ?? correccionRendimiento;
      const fd = updates.fleteDistancia ?? fleteDistancia;
      const ft = updates.fleteTarifa ?? fleteTarifa;
      const ca = updates.comisionAcopio ?? comisionAcopio;
      const og = updates.otrosGastos ?? otrosGastos;

      onChange({
        tarifaBase: parseFloat(tb) || 0,
        correccionRendimiento: cr,
        fleteDistancia: parseFloat(fd) || 0,
        fleteTarifa: parseFloat(ft) || 0,
        comisionAcopio: parseFloat(ca) || 0,
        otrosGastos: parseFloat(og) || 0,
      });
    }
  };

  // Cálculos
  const costoCosecha = parseFloat(tarifaBase) || 0;
  const dist = parseFloat(fleteDistancia) || 0;
  const tarifa = parseFloat(fleteTarifa) || 0;
  const costoFlete = dist * tarifa * rendimiento; // USD/ha
  const subtotal = costoCosecha + costoFlete + (parseFloat(otrosGastos) || 0);

  return (
    <Accordion type="single" collapsible defaultValue="cosecha">
      <AccordionItem value="cosecha">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex w-full items-center justify-between pr-4">
            <span>🚛 Cosecha y Logística</span>
            {subtotal > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ${subtotal.toFixed(2)} USD/ha
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          {/* COSECHA */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm border-b pb-1">Cosecha</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Tarifa base (USD/ha)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 35"
                  value={tarifaBase}
                  onChange={(e) => {
                    setTarifaBase(e.target.value);
                    notifyChange({ tarifaBase: e.target.value });
                  }}
                />
              </div>
              <div className="space-y-1 flex items-end gap-2">
                <input
                  type="checkbox"
                  id="correccion-rendimiento"
                  checked={correccionRendimiento}
                  onChange={(e) => {
                    setCorreccionRendimiento(e.target.checked);
                    notifyChange({ correccionRendimiento: e.target.checked });
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="correccion-rendimiento" className="text-xs mb-1">
                  Aplicar corrección por rendimiento
                </Label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              La tarifa típica oscila entre 7-9% del valor cosechado o tarifa fija por hectárea
            </p>
          </div>

          {/* FLETE */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm border-b pb-1">🚚 Flete</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Distancia (km)</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ej: 50"
                  value={fleteDistancia}
                  onChange={(e) => {
                    setFleteDistancia(e.target.value);
                    notifyChange({ fleteDistancia: e.target.value });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tarifa (USD/tn/km)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.001"
                  placeholder="Ej: 0.08"
                  value={fleteTarifa}
                  onChange={(e) => {
                    setFleteTarifa(e.target.value);
                    notifyChange({ fleteTarifa: e.target.value });
                  }}
                />
              </div>
            </div>
            {costoFlete > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Costo flete: ${costoFlete.toFixed(2)} USD/ha 
                ({dist} km × ${tarifa}/tn/km × {rendimiento.toFixed(1)} tn/ha)
              </p>
            )}
          </div>

          {/* COMERCIALIZACIÓN */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm border-b pb-1">Comercialización</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Comisión acopio (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Ej: 2"
                  value={comisionAcopio}
                  onChange={(e) => {
                    setComisionAcopio(e.target.value);
                    notifyChange({ comisionAcopio: e.target.value });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Otros gastos (USD/ha)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 5"
                  value={otrosGastos}
                  onChange={(e) => {
                    setOtrosGastos(e.target.value);
                    notifyChange({ otrosGastos: e.target.value });
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Incluye servicios de acopio, secado, zarandeo, etc.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
