"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTipoCambio } from "@/hooks/use-precios";

interface CurrencyToggleProps {
  onToggle?: (showARS: boolean, tipoCambio: number) => void;
}

export function CurrencyToggle({ onToggle }: CurrencyToggleProps) {
  const [showARS, setShowARS] = useState(false);
  const { tipoCambio, loading } = useTipoCambio();

  useEffect(() => {
    if (onToggle && tipoCambio) {
      onToggle(showARS, tipoCambio.venta);
    }
  }, [showARS, tipoCambio, onToggle]);

  const handleToggle = () => {
    setShowARS(!showARS);
  };

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className="opacity-50">
        💱 Cargando...
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={showARS ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        className="text-xs"
      >
        💱 {showARS ? "Mostrando ARS" : "Mostrar en ARS"}
      </Button>
      {showARS && tipoCambio && (
        <span className="text-xs text-muted-foreground">
          TC: ${tipoCambio.venta.toFixed(0)} ({tipoCambio.fuente})
        </span>
      )}
    </div>
  );
}

interface DualCurrencyProps {
  valueUSD: number;
  tipoCambio?: number;
  showARS?: boolean;
  className?: string;
}

export function DualCurrency({
  valueUSD,
  tipoCambio = 1000,
  showARS = false,
  className = "",
}: DualCurrencyProps) {
  const formatUSD = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);

  const formatARS = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const valueARS = valueUSD * tipoCambio;

  return (
    <span className={className}>
      {formatUSD(valueUSD)}
      {showARS && (
        <span className="ml-2 text-muted-foreground">
          ({formatARS(valueARS)})
        </span>
      )}
    </span>
  );
}
