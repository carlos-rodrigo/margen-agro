"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ArrendamientoData, RentMode } from "@/lib/types";

interface ArrendamientoFormProps {
  onChange?: (data: ArrendamientoData) => void;
}

export function ArrendamientoForm({ onChange }: ArrendamientoFormProps) {
  const [esArrendado, setEsArrendado] = useState(false);
  const [modo, setModo] = useState<RentMode>("qq_soja");
  const [qqSojaHa, setQqSojaHa] = useState<string>("12");
  const [precioSojaQq, setPrecioSojaQq] = useState<string>("30");
  const [montoFijoUsd, setMontoFijoUsd] = useState<string>("");

  const notifyChange = (updates: Partial<{
    esArrendado: boolean;
    modo: RentMode;
    qqSojaHa: string;
    precioSojaQq: string;
    montoFijoUsd: string;
  }> = {}) => {
    if (onChange) {
      const arr = updates.esArrendado ?? esArrendado;
      const m = updates.modo ?? modo;
      const qq = updates.qqSojaHa ?? qqSojaHa;
      const ps = updates.precioSojaQq ?? precioSojaQq;
      const mf = updates.montoFijoUsd ?? montoFijoUsd;

      onChange({
        esArrendado: arr,
        modo: m,
        qqSojaHa: parseFloat(qq) || 0,
        precioSojaQq: parseFloat(ps) || 0,
        montoFijoUsd: parseFloat(mf) || 0,
      });
    }
  };

  // Cálculo del costo
  const qq = parseFloat(qqSojaHa) || 0;
  const precioQq = parseFloat(precioSojaQq) || 0;
  const fijo = parseFloat(montoFijoUsd) || 0;
  const costoArrendamiento = esArrendado
    ? modo === "qq_soja"
      ? qq * precioQq
      : fijo
    : 0;

  return (
    <Accordion type="single" collapsible defaultValue="arrendamiento">
      <AccordionItem value="arrendamiento">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex w-full items-center justify-between pr-4">
            <span>🏠 Arrendamiento</span>
            {costoArrendamiento > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ${costoArrendamiento.toFixed(2)} USD/ha
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {/* Toggle Propio/Arrendado */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="campo-propio"
                name="tenencia"
                checked={!esArrendado}
                onChange={() => {
                  setEsArrendado(false);
                  notifyChange({ esArrendado: false });
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="campo-propio">Campo propio</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="campo-arrendado"
                name="tenencia"
                checked={esArrendado}
                onChange={() => {
                  setEsArrendado(true);
                  notifyChange({ esArrendado: true });
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="campo-arrendado">Campo arrendado</Label>
            </div>
          </div>

          {/* Opciones de arrendamiento */}
          {esArrendado && (
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              {/* Modalidad */}
              <div className="space-y-2">
                <Label className="text-sm">Modalidad de pago</Label>
                <Select
                  value={modo}
                  onValueChange={(v) => {
                    setModo(v as RentMode);
                    notifyChange({ modo: v as RentMode });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qq_soja">Quintales de soja por hectárea</SelectItem>
                    <SelectItem value="usd_fijo">Monto fijo en USD/ha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos según modalidad */}
              {modo === "qq_soja" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Quintales por hectárea</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Ej: 12"
                      value={qqSojaHa}
                      onChange={(e) => {
                        setQqSojaHa(e.target.value);
                        notifyChange({ qqSojaHa: e.target.value });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Precio soja (USD/qq)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ej: 30"
                      value={precioSojaQq}
                      onChange={(e) => {
                        setPrecioSojaQq(e.target.value);
                        notifyChange({ precioSojaQq: e.target.value });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs">Monto fijo (USD/ha)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ej: 350"
                    value={montoFijoUsd}
                    onChange={(e) => {
                      setMontoFijoUsd(e.target.value);
                      notifyChange({ montoFijoUsd: e.target.value });
                    }}
                  />
                </div>
              )}

              {/* Resumen */}
              <div className="rounded bg-primary/10 p-3 text-sm">
                <strong>Costo de arrendamiento:</strong>{" "}
                {modo === "qq_soja" ? (
                  <>
                    {qq} qq/ha × ${precioQq.toFixed(2)}/qq ={" "}
                    <span className="font-bold">${costoArrendamiento.toFixed(2)} USD/ha</span>
                  </>
                ) : (
                  <span className="font-bold">${fijo.toFixed(2)} USD/ha</span>
                )}
              </div>
            </div>
          )}

          {!esArrendado && (
            <p className="text-sm text-muted-foreground">
              El costo de arrendamiento no se incluirá en el cálculo.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
