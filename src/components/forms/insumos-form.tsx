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
import type { InsumosData, FertilizerItem, AgrochemicalItem } from "@/lib/types";

const TIPOS_AGROQUIMICO = [
  "Herbicida pre-emergente",
  "Herbicida post-emergente",
  "Insecticida",
  "Fungicida",
  "Coadyuvante",
  "Regulador de crecimiento",
  "Otro",
];

interface InsumosFormProps {
  onChange?: (data: InsumosData) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const defaultFertilizer = (): FertilizerItem => ({
  id: generateId(),
  producto: "",
  dosis: 0,
  precio: 0,
});

const defaultAgrochemical = (): AgrochemicalItem => ({
  id: generateId(),
  tipo: "",
  producto: "",
  dosis: 0,
  precio: 0,
});

export function InsumosForm({ onChange }: InsumosFormProps) {
  // Semilla
  const [semillaDosis, setSemillaDosis] = useState<string>("");
  const [semillaPrecio, setSemillaPrecio] = useState<string>("");
  
  // Tratamiento de semilla
  const [tratamientoActivo, setTratamientoActivo] = useState(false);
  const [tratamientoCosto, setTratamientoCosto] = useState<string>("");
  
  // Fertilizantes
  const [fertilizantes, setFertilizantes] = useState<FertilizerItem[]>([]);
  
  // Agroquímicos
  const [agroquimicos, setAgroquimicos] = useState<AgrochemicalItem[]>([]);

  const notifyChange = (updates: Partial<{
    semillaDosis: string;
    semillaPrecio: string;
    tratamientoActivo: boolean;
    tratamientoCosto: string;
    fertilizantes: FertilizerItem[];
    agroquimicos: AgrochemicalItem[];
  }> = {}) => {
    if (onChange) {
      const sd = updates.semillaDosis ?? semillaDosis;
      const sp = updates.semillaPrecio ?? semillaPrecio;
      const ta = updates.tratamientoActivo ?? tratamientoActivo;
      const tc = updates.tratamientoCosto ?? tratamientoCosto;
      const ferts = updates.fertilizantes ?? fertilizantes;
      const agros = updates.agroquimicos ?? agroquimicos;

      onChange({
        semilla: {
          dosis: parseFloat(sd) || 0,
          precio: parseFloat(sp) || 0,
        },
        tratamientoSemilla: {
          activo: ta,
          costo: parseFloat(tc) || 0,
        },
        fertilizantes: ferts,
        agroquimicos: agros,
      });
    }
  };

  // Fertilizantes handlers
  const addFertilizer = () => {
    const newFerts = [...fertilizantes, defaultFertilizer()];
    setFertilizantes(newFerts);
    notifyChange({ fertilizantes: newFerts });
  };

  const removeFertilizer = (id: string) => {
    const newFerts = fertilizantes.filter((f) => f.id !== id);
    setFertilizantes(newFerts);
    notifyChange({ fertilizantes: newFerts });
  };

  const updateFertilizer = (id: string, field: keyof FertilizerItem, value: string | number) => {
    const newFerts = fertilizantes.map((f) =>
      f.id === id ? { ...f, [field]: value } : f
    );
    setFertilizantes(newFerts);
    notifyChange({ fertilizantes: newFerts });
  };

  // Agroquímicos handlers
  const addAgrochemical = () => {
    const newAgros = [...agroquimicos, defaultAgrochemical()];
    setAgroquimicos(newAgros);
    notifyChange({ agroquimicos: newAgros });
  };

  const removeAgrochemical = (id: string) => {
    const newAgros = agroquimicos.filter((a) => a.id !== id);
    setAgroquimicos(newAgros);
    notifyChange({ agroquimicos: newAgros });
  };

  const updateAgrochemical = (id: string, field: keyof AgrochemicalItem, value: string | number) => {
    const newAgros = agroquimicos.map((a) =>
      a.id === id ? { ...a, [field]: value } : a
    );
    setAgroquimicos(newAgros);
    notifyChange({ agroquimicos: newAgros });
  };

  // Cálculos de subtotales
  const costoSemilla = (parseFloat(semillaDosis) || 0) * (parseFloat(semillaPrecio) || 0);
  const costoTratamiento = tratamientoActivo ? (parseFloat(tratamientoCosto) || 0) : 0;
  const costoFertilizantes = fertilizantes.reduce((sum, f) => sum + f.dosis * f.precio, 0);
  const costoAgroquimicos = agroquimicos.reduce((sum, a) => sum + a.dosis * a.precio, 0);
  const subtotal = costoSemilla + costoTratamiento + costoFertilizantes + costoAgroquimicos;

  return (
    <Accordion type="single" collapsible defaultValue="insumos">
      <AccordionItem value="insumos">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex w-full items-center justify-between pr-4">
            <span>🧪 Insumos</span>
            {subtotal > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ${subtotal.toFixed(2)} USD/ha
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          {/* SEMILLA */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm border-b pb-1">🌱 Semilla</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Dosis (kg/ha)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Ej: 80"
                  value={semillaDosis}
                  onChange={(e) => {
                    setSemillaDosis(e.target.value);
                    notifyChange({ semillaDosis: e.target.value });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Precio (USD/kg)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 0.50"
                  value={semillaPrecio}
                  onChange={(e) => {
                    setSemillaPrecio(e.target.value);
                    notifyChange({ semillaPrecio: e.target.value });
                  }}
                />
              </div>
            </div>
            {costoSemilla > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Subtotal semilla: ${costoSemilla.toFixed(2)} USD/ha
              </p>
            )}
          </div>

          {/* TRATAMIENTO DE SEMILLA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tratamiento-activo"
                checked={tratamientoActivo}
                onChange={(e) => {
                  setTratamientoActivo(e.target.checked);
                  notifyChange({ tratamientoActivo: e.target.checked });
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="tratamiento-activo" className="font-medium text-sm">
                💊 Tratamiento de semilla
              </Label>
            </div>
            {tratamientoActivo && (
              <div className="pl-6 space-y-1">
                <Label className="text-xs">Costo (USD/ha)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 15"
                  value={tratamientoCosto}
                  onChange={(e) => {
                    setTratamientoCosto(e.target.value);
                    notifyChange({ tratamientoCosto: e.target.value });
                  }}
                />
              </div>
            )}
          </div>

          {/* FERTILIZANTES */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm border-b pb-1">🧴 Fertilizantes</h4>
            {fertilizantes.map((fert, index) => (
              <div
                key={fert.id}
                className="rounded-lg border bg-muted/30 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Fertilizante {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFertilizer(fert.id)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Producto</Label>
                    <Input
                      placeholder="Ej: Urea"
                      value={fert.producto}
                      onChange={(e) =>
                        updateFertilizer(fert.id, "producto", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dosis (kg/ha)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Ej: 100"
                      value={fert.dosis || ""}
                      onChange={(e) =>
                        updateFertilizer(fert.id, "dosis", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Precio (USD/kg)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ej: 0.60"
                      value={fert.precio || ""}
                      onChange={(e) =>
                        updateFertilizer(fert.id, "precio", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                {fert.dosis > 0 && fert.precio > 0 && (
                  <p className="text-xs text-muted-foreground text-right">
                    ${(fert.dosis * fert.precio).toFixed(2)} USD/ha
                  </p>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFertilizer}
              className="w-full"
            >
              <Plus className="mr-2 h-3 w-3" />
              Agregar fertilizante
            </Button>
            {costoFertilizantes > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Subtotal fertilizantes: ${costoFertilizantes.toFixed(2)} USD/ha
              </p>
            )}
          </div>

          {/* AGROQUÍMICOS */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm border-b pb-1">🔬 Agroquímicos</h4>
            {agroquimicos.map((agro, index) => (
              <div
                key={agro.id}
                className="rounded-lg border bg-muted/30 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Agroquímico {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAgrochemical(agro.id)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Tipo</Label>
                    <Select
                      value={agro.tipo}
                      onValueChange={(v) => updateAgrochemical(agro.id, "tipo", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_AGROQUIMICO.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Producto</Label>
                    <Input
                      placeholder="Ej: Glifosato"
                      value={agro.producto}
                      onChange={(e) =>
                        updateAgrochemical(agro.id, "producto", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dosis (lt/ha)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ej: 3"
                      value={agro.dosis || ""}
                      onChange={(e) =>
                        updateAgrochemical(agro.id, "dosis", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Precio (USD/lt)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ej: 5"
                      value={agro.precio || ""}
                      onChange={(e) =>
                        updateAgrochemical(agro.id, "precio", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                {agro.dosis > 0 && agro.precio > 0 && (
                  <p className="text-xs text-muted-foreground text-right">
                    ${(agro.dosis * agro.precio).toFixed(2)} USD/ha
                  </p>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAgrochemical}
              className="w-full"
            >
              <Plus className="mr-2 h-3 w-3" />
              Agregar agroquímico
            </Button>
            {costoAgroquimicos > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Subtotal agroquímicos: ${costoAgroquimicos.toFixed(2)} USD/ha
              </p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
