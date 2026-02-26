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

const CULTIVOS = [
  { value: "soja", label: "Soja" },
  { value: "maiz", label: "Maíz" },
  { value: "trigo", label: "Trigo" },
  { value: "girasol", label: "Girasol" },
  { value: "cebada", label: "Cebada" },
  { value: "sorgo", label: "Sorgo" },
];

type YieldUnit = "qq" | "tn";

interface ProductionData {
  cultivo: string;
  superficie: number;
  rendimiento: number;
  unidadRendimiento: YieldUnit;
}

interface ProductionFormProps {
  onChange?: (data: ProductionData) => void;
}

export function ProductionForm({ onChange }: ProductionFormProps) {
  const [cultivo, setCultivo] = useState<string>("");
  const [superficie, setSuperficie] = useState<string>("");
  const [rendimiento, setRendimiento] = useState<string>("");
  const [unidadRendimiento, setUnidadRendimiento] = useState<YieldUnit>("qq");

  const handleChange = () => {
    if (onChange) {
      onChange({
        cultivo,
        superficie: parseFloat(superficie) || 0,
        rendimiento: parseFloat(rendimiento) || 0,
        unidadRendimiento,
      });
    }
  };

  const toggleUnit = () => {
    const newUnit = unidadRendimiento === "qq" ? "tn" : "qq";
    setUnidadRendimiento(newUnit);
    
    // Convert value if present
    if (rendimiento) {
      const value = parseFloat(rendimiento);
      if (!isNaN(value)) {
        // 1 tn = 10 qq
        const converted = newUnit === "tn" ? value / 10 : value * 10;
        setRendimiento(converted.toFixed(2));
      }
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="produccion">
      <AccordionItem value="produccion">
        <AccordionTrigger className="text-lg font-semibold">
          🌾 Producción y Superficie
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {/* Cultivo */}
          <div className="space-y-2">
            <Label htmlFor="cultivo">Cultivo</Label>
            <Select
              value={cultivo}
              onValueChange={(value) => {
                setCultivo(value);
                handleChange();
              }}
            >
              <SelectTrigger id="cultivo">
                <SelectValue placeholder="Seleccionar cultivo" />
              </SelectTrigger>
              <SelectContent>
                {CULTIVOS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Superficie */}
          <div className="space-y-2">
            <Label htmlFor="superficie">Superficie (ha)</Label>
            <Input
              id="superficie"
              type="number"
              min="0"
              step="0.1"
              placeholder="Ej: 100"
              value={superficie}
              onChange={(e) => {
                setSuperficie(e.target.value);
                handleChange();
              }}
            />
          </div>

          {/* Rendimiento con toggle de unidad */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rendimiento">Rendimiento</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleUnit}
                className="text-xs"
              >
                {unidadRendimiento === "qq" ? "qq/ha" : "tn/ha"} ↔
              </Button>
            </div>
            <div className="relative">
              <Input
                id="rendimiento"
                type="number"
                min="0"
                step="0.1"
                placeholder={unidadRendimiento === "qq" ? "Ej: 35" : "Ej: 3.5"}
                value={rendimiento}
                onChange={(e) => {
                  setRendimiento(e.target.value);
                  handleChange();
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unidadRendimiento}/ha
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
