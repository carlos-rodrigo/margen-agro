import * as cheerio from "cheerio";
import type { PrecioPizarra, PreciosPizarra } from "./types";

const BOLSA_URL = "https://www.bolsadecereales.com/precios";

// Mapeo de nombres de cultivos del sitio a nuestros IDs
const CULTIVO_MAP: Record<string, string> = {
  soja: "soja",
  "soja fabrica": "soja",
  maiz: "maiz",
  "maíz": "maiz",
  trigo: "trigo",
  girasol: "girasol",
  cebada: "cebada",
  sorgo: "sorgo",
};

/**
 * Scrapea los precios de pizarra de la Bolsa de Cereales de Buenos Aires
 */
export async function scrapePreciosPizarra(): Promise<PreciosPizarra> {
  try {
    const response = await fetch(BOLSA_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const precios: PrecioPizarra[] = [];
    const fecha = new Date().toISOString().split("T")[0];

    // El sitio de Bolsa de Cereales tiene diferentes estructuras
    // Intentamos extraer de tablas de precios
    $("table tr").each((_index, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 2) {
        const nombreRaw = $(cells[0]).text().trim().toLowerCase();
        const precioText = $(cells[1]).text().trim();

        // Buscar si el nombre coincide con algún cultivo
        const cultivoKey = Object.keys(CULTIVO_MAP).find(
          (key) => nombreRaw.includes(key)
        );

        if (cultivoKey) {
          // Extraer número del precio
          const precioMatch = precioText.match(/[\d.,]+/);
          if (precioMatch) {
            const precio = parseFloat(precioMatch[0].replace(",", "."));
            if (!isNaN(precio) && precio > 0) {
              precios.push({
                cultivo: CULTIVO_MAP[cultivoKey],
                precio,
                fecha,
                fuente: "Bolsa de Cereales de Buenos Aires",
              });
            }
          }
        }
      }
    });

    // Si no encontramos precios en tablas, intentar otro selector
    if (precios.length === 0) {
      // Buscar en divs con clase de precio
      $(".precio, .price, [data-precio]").each((_index, el) => {
        const text = $(el).text().trim();
        console.log("Found price element:", text);
      });
    }

    return {
      precios,
      ultimaActualizacion: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error scraping precios:", error);
    // Retornar precios por defecto si falla el scraping
    return getDefaultPrices();
  }
}

/**
 * Precios por defecto cuando el scraping falla
 * Basados en promedios históricos
 */
export function getDefaultPrices(): PreciosPizarra {
  const fecha = new Date().toISOString().split("T")[0];
  return {
    precios: [
      { cultivo: "soja", precio: 340, fecha, fuente: "Precio referencial" },
      { cultivo: "maiz", precio: 180, fecha, fuente: "Precio referencial" },
      { cultivo: "trigo", precio: 220, fecha, fuente: "Precio referencial" },
      { cultivo: "girasol", precio: 380, fecha, fuente: "Precio referencial" },
      { cultivo: "cebada", precio: 200, fecha, fuente: "Precio referencial" },
      { cultivo: "sorgo", precio: 170, fecha, fuente: "Precio referencial" },
    ],
    ultimaActualizacion: new Date().toISOString(),
  };
}

/**
 * Obtiene el tipo de cambio del dólar
 * Usa la API del Banco Central de Argentina (fallback a valores por defecto)
 */
export async function getTipoCambio(): Promise<{
  compra: number;
  venta: number;
  fecha: string;
  fuente: string;
}> {
  try {
    // API pública de dólar Argentina
    const response = await fetch("https://dolarapi.com/v1/dolares/oficial", {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      compra: data.compra || 950,
      venta: data.venta || 1000,
      fecha: data.fechaActualizacion || new Date().toISOString(),
      fuente: "Dólar API - Banco Nación",
    };
  } catch (error) {
    console.error("Error fetching tipo de cambio:", error);
    // Valores por defecto
    return {
      compra: 950,
      venta: 1000,
      fecha: new Date().toISOString(),
      fuente: "Valor referencial",
    };
  }
}
