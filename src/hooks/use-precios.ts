"use client";

import { useState, useEffect } from "react";
import type { PreciosPizarra, TipoCambio } from "@/lib/types";
import { getDefaultPrices } from "@/lib/scraper";

export function usePrecios() {
  const [precios, setPrecios] = useState<PreciosPizarra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrecios() {
      try {
        const response = await fetch("/api/precios");
        if (!response.ok) {
          throw new Error("Error fetching precios");
        }
        const data = await response.json();
        setPrecios(data);
      } catch (err) {
        console.error("Error loading precios:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        // Usar precios por defecto
        setPrecios(getDefaultPrices());
      } finally {
        setLoading(false);
      }
    }

    fetchPrecios();
  }, []);

  const getPrecioCultivo = (cultivo: string): number | undefined => {
    if (!precios) return undefined;
    const precio = precios.precios.find((p) => p.cultivo === cultivo);
    return precio?.precio;
  };

  return {
    precios,
    loading,
    error,
    getPrecioCultivo,
  };
}

export function useTipoCambio() {
  const [tipoCambio, setTipoCambio] = useState<TipoCambio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTipoCambio() {
      try {
        const response = await fetch("/api/tipo-cambio");
        if (!response.ok) {
          throw new Error("Error fetching tipo de cambio");
        }
        const data = await response.json();
        setTipoCambio(data);
      } catch (err) {
        console.error("Error loading tipo de cambio:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        // Usar tipo de cambio por defecto
        setTipoCambio({
          compra: 950,
          venta: 1000,
          fecha: new Date().toISOString(),
          fuente: "Valor referencial",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTipoCambio();
  }, []);

  return {
    tipoCambio,
    loading,
    error,
  };
}
