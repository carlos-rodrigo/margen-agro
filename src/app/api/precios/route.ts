import { NextResponse } from "next/server";
import { scrapePreciosPizarra, getDefaultPrices } from "@/lib/scraper";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const precios = await scrapePreciosPizarra();
    
    // Si no hay precios del scraper, usar defaults
    if (precios.precios.length === 0) {
      return NextResponse.json(getDefaultPrices());
    }
    
    return NextResponse.json(precios);
  } catch (error) {
    console.error("Error in /api/precios:", error);
    return NextResponse.json(getDefaultPrices());
  }
}
