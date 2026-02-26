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
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { LaborItem, LaboresData, LaborMode } from "@/lib/types";

const LABORES_COMUNES = [
  "Siembra",
  "Fumigación terrestre",
  "Fumigación aérea",
  "Fertilización",
  "Monitoreo",
  "Rastra",
  "Cincel",
  "Otro",
];

interface LaboresFormProps {
  onChange?: (data: LaboresData) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const defaultLabor = (): LaborItem => ({
  id: generateId(),
  nombre: "",
  modalidad: "contratado",
  cantidad: 1,
  costoUnitario: 0,
});

export function LaboresForm({ onChange }: LaboresFormProps) {
  const [labores, setLabores] = useState<LaborItem[]>([defaultLabor()]);

  const notifyChange = (newLabores: LaborItem[]) => {
    if (onChange) {
      onChange({ labores: newLabores });
    }
  };

  const addLabor = () => {
    const newLabores = [...labores, defaultLabor()];
    setLabores(newLabores);
    notifyChange(newLabores);
  };

  const removeLabor = (id: string) => {
    const newLabores = labores.filter((l) => l.id !== id);
    setLabores(newLabores);
    notifyChange(newLabores);
  };

  const updateLabor = (id: string, field: keyof LaborItem, value: string | number) => {
    const newLabores = labores.map((l) =>
      l.id === id ? { ...l, [field]: value } : l
    );
    setLabores(newLabores);
    notifyChange(newLabores);
  };

  const subtotal = labores.reduce(
    (sum, l) => sum + l.cantidad * l.costoUnitario,
    0
  );

  return (
    <Accordion type="single" collapsible defaultValue="labores">
      <AccordionItem value="labores">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex w-full items-center justify-between pr-4">
            <span>🚜 Labores y Servicios</span>
            {subtotal > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ${subtotal.toFixed(2)} USD/ha
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {labores.map((labor, index) => (
            <div
              key={labor.id}
              className="rounded-lg border bg-muted/30 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Labor {index + 1}
                </span>
                {labores.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLabor(labor.id)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Nombre */}
                <div className="space-y-1">
                  <Label className="text-xs">Tipo de labor</Label>
                  <Select
                    value={labor.nombre}
                    onValueChange={(v) => updateLabor(labor.id, "nombre", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LABORES_COMUNES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Modalidad */}
                <div className="space-y-1">
                  <Label className="text-xs">Modalidad</Label>
                  <Select
                    value={labor.modalidad}
                    onValueChange={(v) =>
                      updateLabor(labor.id, "modalidad", v as LaborMode)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contratado">Contratado</SelectItem>
                      <SelectItem value="propio">Propio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cantidad */}
                <div className="space-y-1">
                  <Label className="text-xs">Cantidad (pasadas)</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={labor.cantidad}
                    onChange={(e) =>
                      updateLabor(labor.id, "cantidad", parseInt(e.target.value) || 1)
                    }
                  />
                </div>

                {/* Costo Unitario */}
                <div className="space-y-1">
                  <Label className="text-xs">Costo (USD/ha)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 15"
                    value={labor.costoUnitario || ""}
                    onChange={(e) =>
                      updateLabor(
                        labor.id,
                        "costoUnitario",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              {/* Subtotal de esta labor */}
              {labor.cantidad > 0 && labor.costoUnitario > 0 && (
                <div className="text-right text-sm text-muted-foreground">
                  Subtotal: ${(labor.cantidad * labor.costoUnitario).toFixed(2)} USD/ha
                </div>
              )}
            </div>
          ))}

          {/* Botón agregar */}
          <Button
            type="button"
            variant="outline"
            onClick={addLabor}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar labor
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
