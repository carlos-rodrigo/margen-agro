"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PriceData, CommercialExpenseMode } from "@/lib/types";

interface PriceFormProps {
  cultivo?: string;
  precioPizarra?: number;
  fechaPizarra?: string;
  onChange?: (data: PriceData) => void;
}

export function PriceForm({ cultivo, precioPizarra, fechaPizarra, onChange }: PriceFormProps) {
  const [precioBruto, setPrecioBruto] = useState<string>("");
  const [gastosComerciales, setGastosComerciales] = useState<string>("5");
  const [modoGastos, setModoGastos] = useState<CommercialExpenseMode>("percent");
  const [isPrecioPizarra, setIsPrecioPizarra] = useState(false);

  // Cuando cambia el cultivo y hay precio pizarra, lo precarga
  useEffect(() => {
    if (precioPizarra && cultivo) {
      setPrecioBruto(precioPizarra.toString());
      setIsPrecioPizarra(true);
    }
  }, [precioPizarra, cultivo]);

  const notifyChange = (updates: Partial<{
    precioBruto: string;
    gastosComerciales: string;
    modoGastos: CommercialExpenseMode;
    isPrecioPizarra: boolean;
  }> = {}) => {
    if (onChange) {
      const precio = updates.precioBruto ?? precioBruto;
      const gastos = updates.gastosComerciales ?? gastosComerciales;
      const modo = updates.modoGastos ?? modoGastos;
      const esPizarra = updates.isPrecioPizarra ?? isPrecioPizarra;
      
      onChange({
        precioBruto: parseFloat(precio) || 0,
        gastosComerciales: parseFloat(gastos) || 0,
        modoGastosComerciales: modo,
        isPrecioPizarra: esPizarra,
      });
    }
  };

  const handlePrecioChange = (value: string) => {
    setPrecioBruto(value);
    setIsPrecioPizarra(false);
    notifyChange({ precioBruto: value, isPrecioPizarra: false });
  };

  const resetToPizarra = () => {
    if (precioPizarra) {
      setPrecioBruto(precioPizarra.toString());
      setIsPrecioPizarra(true);
      notifyChange({ precioBruto: precioPizarra.toString(), isPrecioPizarra: true });
    }
  };

  const toggleModoGastos = () => {
    const newMode: CommercialExpenseMode = modoGastos === "percent" ? "usd" : "percent";
    setModoGastos(newMode);
    notifyChange({ modoGastos: newMode });
  };

  return (
    <Accordion type="single" collapsible defaultValue="precio">
      <AccordionItem value="precio">
        <AccordionTrigger className="text-lg font-semibold">
          💰 Precio y Comercialización
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {/* Precio Bruto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="precio-bruto">Precio Bruto (USD/tn)</Label>
              {precioPizarra && (
                <div className="flex items-center gap-2">
                  {isPrecioPizarra ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Pizarra {fechaPizarra || ""}
                    </span>
                  ) : (
                    <>
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                        ✏️ Manual
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resetToPizarra}
                        className="h-6 text-xs"
                      >
                        Usar pizarra
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
            <Input
              id="precio-bruto"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 350"
              value={precioBruto}
              onChange={(e) => handlePrecioChange(e.target.value)}
            />
            {!cultivo && (
              <p className="text-xs text-muted-foreground">
                Seleccione un cultivo para ver precio de referencia
              </p>
            )}
          </div>

          {/* Gastos Comerciales */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gastos-comerciales">Gastos Comerciales</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleModoGastos}
                className="text-xs"
              >
                {modoGastos === "percent" ? "%" : "USD/tn"} ↔
              </Button>
            </div>
            <div className="relative">
              <Input
                id="gastos-comerciales"
                type="number"
                min="0"
                step="0.1"
                placeholder={modoGastos === "percent" ? "Ej: 5" : "Ej: 15"}
                value={gastosComerciales}
                onChange={(e) => {
                  setGastosComerciales(e.target.value);
                  notifyChange({ gastosComerciales: e.target.value });
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {modoGastos === "percent" ? "%" : "USD/tn"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Incluye paritarias, SENASA, impuesto al cheque, etc.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
