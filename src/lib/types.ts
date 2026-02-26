// Tipos compartidos para la calculadora de margen bruto agrícola

export type YieldUnit = "qq" | "tn";
export type CommercialExpenseMode = "percent" | "usd";
export type LaborMode = "propio" | "contratado";
export type RentMode = "qq_soja" | "usd_fijo";

// US-002: Producción
export interface ProductionData {
  cultivo: string;
  superficie: number;
  rendimiento: number;
  unidadRendimiento: YieldUnit;
}

// US-003: Precio y Comercialización
export interface PriceData {
  precioBruto: number; // USD/tn
  gastosComerciales: number;
  modoGastosComerciales: CommercialExpenseMode;
  isPrecioPizarra: boolean;
}

// US-004: Labores
export interface LaborItem {
  id: string;
  nombre: string;
  modalidad: LaborMode;
  cantidad: number;
  costoUnitario: number; // USD/ha
}

export interface LaboresData {
  labores: LaborItem[];
}

// US-005: Insumos
export interface FertilizerItem {
  id: string;
  producto: string;
  dosis: number; // kg/ha o lt/ha
  precio: number; // USD/unidad
}

export interface AgrochemicalItem {
  id: string;
  tipo: string; // herbicida, insecticida, fungicida
  producto: string;
  dosis: number; // lt/ha o kg/ha
  precio: number; // USD/lt o USD/kg
}

export interface InsumosData {
  semilla: {
    dosis: number; // kg/ha
    precio: number; // USD/kg
  };
  tratamientoSemilla: {
    activo: boolean;
    costo: number; // USD/ha
  };
  fertilizantes: FertilizerItem[];
  agroquimicos: AgrochemicalItem[];
}

// US-006: Cosecha y Logística
export interface CosechaData {
  tarifaBase: number; // USD/ha
  correccionRendimiento: boolean;
  fleteDistancia: number; // km
  fleteTarifa: number; // USD/tn/km
  comisionAcopio: number; // % sobre venta
  otrosGastos: number; // USD/ha
}

// US-007: Arrendamiento
export interface ArrendamientoData {
  esArrendado: boolean;
  modo: RentMode;
  qqSojaHa: number;
  precioSojaQq: number; // USD/qq
  montoFijoUsd: number; // USD/ha
}

// US-008: Financiamiento
export interface FinanciamientoData {
  incluir: boolean;
  tea: number; // % Tasa Efectiva Anual
}

// Todos los datos de entrada
export interface CalculatorInputs {
  produccion: ProductionData;
  precio: PriceData;
  labores: LaboresData;
  insumos: InsumosData;
  cosecha: CosechaData;
  arrendamiento: ArrendamientoData;
  financiamiento: FinanciamientoData;
}

// US-009/010: Resultados del cálculo
export interface CalculationResults {
  // Valores por hectárea
  ingresoBrutoHa: number;
  costosDirectosHa: number;
  margenBrutoHa: number;
  
  // Valores totales
  ingresoBrutoTotal: number;
  costosDirectosTotal: number;
  margenBrutoTotal: number;
  
  // Indicadores
  rindeIndiferencia: number; // en la misma unidad que el rendimiento
  retornoPorPesoInvertido: number; // %
  
  // Desglose de costos por rubro (USD/ha)
  desgloseCostos: {
    labores: number;
    semilla: number;
    fertilizantes: number;
    agroquimicos: number;
    cosecha: number;
    flete: number;
    comercializacion: number;
    arrendamiento: number;
    financiamiento: number;
  };
  
  // Margen ajustado (con arrendamiento y financiamiento)
  margenBrutoAjustadoHa: number;
  margenBrutoAjustadoTotal: number;
}

// Precios de pizarra (scraping)
export interface PrecioPizarra {
  cultivo: string;
  precio: number; // USD/tn
  fecha: string; // ISO date
  fuente: string;
}

export interface PreciosPizarra {
  precios: PrecioPizarra[];
  ultimaActualizacion: string;
}

// Tipo de cambio
export interface TipoCambio {
  compra: number;
  venta: number;
  fecha: string;
  fuente: string;
}
