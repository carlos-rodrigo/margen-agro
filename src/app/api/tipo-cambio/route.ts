import { NextResponse } from "next/server";
import { getTipoCambio } from "@/lib/scraper";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const tipoCambio = await getTipoCambio();
    return NextResponse.json(tipoCambio);
  } catch (error) {
    console.error("Error in /api/tipo-cambio:", error);
    return NextResponse.json({
      compra: 950,
      venta: 1000,
      fecha: new Date().toISOString(),
      fuente: "Valor referencial",
    });
  }
}
