import type { CalculatorInputs, CalculationResults } from "./types";

/**
 * Motor de cálculo de margen bruto agrícola
 * Metodología basada en INTA
 */
export function calculateMargin(inputs: CalculatorInputs): CalculationResults {
  const { produccion, precio, labores, insumos, cosecha, arrendamiento, financiamiento } = inputs;

  // Convertir rendimiento a tn/ha si está en qq
  const rendimientoTnHa =
    produccion.unidadRendimiento === "qq"
      ? produccion.rendimiento / 10
      : produccion.rendimiento;

  // 1. INGRESO BRUTO
  const ingresoBrutoHa = rendimientoTnHa * precio.precioBruto;
  const ingresoBrutoTotal = ingresoBrutoHa * produccion.superficie;

  // 2. GASTOS COMERCIALES
  const gastosComerciales =
    precio.modoGastosComerciales === "percent"
      ? ingresoBrutoHa * (precio.gastosComerciales / 100)
      : precio.gastosComerciales * rendimientoTnHa;

  // 3. COSTOS DE LABORES
  const costoLabores = labores.labores.reduce(
    (sum, l) => sum + l.cantidad * l.costoUnitario,
    0
  );

  // 4. COSTOS DE INSUMOS
  const costoSemilla = insumos.semilla.dosis * insumos.semilla.precio;
  const costoTratamiento = insumos.tratamientoSemilla.activo
    ? insumos.tratamientoSemilla.costo
    : 0;
  const costoFertilizantes = insumos.fertilizantes.reduce(
    (sum, f) => sum + f.dosis * f.precio,
    0
  );
  const costoAgroquimicos = insumos.agroquimicos.reduce(
    (sum, a) => sum + a.dosis * a.precio,
    0
  );

  // 5. COSTOS DE COSECHA Y LOGÍSTICA
  const costoCosecha = cosecha.tarifaBase;
  const costoFlete = cosecha.fleteDistancia * cosecha.fleteTarifa * rendimientoTnHa;
  const costoComercializacion =
    ingresoBrutoHa * (cosecha.comisionAcopio / 100) +
    gastosComerciales +
    cosecha.otrosGastos;

  // 6. ARRENDAMIENTO
  const costoArrendamiento = arrendamiento.esArrendado
    ? arrendamiento.modo === "qq_soja"
      ? arrendamiento.qqSojaHa * arrendamiento.precioSojaQq
      : arrendamiento.montoFijoUsd
    : 0;

  // 7. COSTOS DIRECTOS TOTALES (sin arrendamiento ni financiamiento)
  const costosDirectosHa =
    costoLabores +
    costoSemilla +
    costoTratamiento +
    costoFertilizantes +
    costoAgroquimicos +
    costoCosecha +
    costoFlete +
    costoComercializacion;

  const costosDirectosTotal = costosDirectosHa * produccion.superficie;

  // 8. MARGEN BRUTO
  const margenBrutoHa = ingresoBrutoHa - costosDirectosHa;
  const margenBrutoTotal = margenBrutoHa * produccion.superficie;

  // 9. FINANCIAMIENTO
  // Fórmula: (Costos × 0.5) × TEA × (6/12)
  const costoFinanciamiento = financiamiento.incluir
    ? costosDirectosHa * 0.5 * (financiamiento.tea / 100) * 0.5
    : 0;

  // 10. MARGEN BRUTO AJUSTADO
  const margenBrutoAjustadoHa = margenBrutoHa - costoArrendamiento - costoFinanciamiento;
  const margenBrutoAjustadoTotal = margenBrutoAjustadoHa * produccion.superficie;

  // 11. INDICADORES
  // Rinde de indiferencia: costos / precio = tn/ha necesarios para cubrir costos
  const rindeIndiferenciaTn =
    precio.precioBruto > 0 ? costosDirectosHa / precio.precioBruto : 0;
  // Convertir a la misma unidad que usa el usuario
  const rindeIndiferencia =
    produccion.unidadRendimiento === "qq"
      ? rindeIndiferenciaTn * 10
      : rindeIndiferenciaTn;

  // Retorno por peso invertido: MB / Costos × 100%
  const retornoPorPesoInvertido =
    costosDirectosHa > 0 ? (margenBrutoHa / costosDirectosHa) * 100 : 0;

  return {
    ingresoBrutoHa,
    costosDirectosHa,
    margenBrutoHa,
    ingresoBrutoTotal,
    costosDirectosTotal,
    margenBrutoTotal,
    rindeIndiferencia,
    retornoPorPesoInvertido,
    desgloseCostos: {
      labores: costoLabores,
      semilla: costoSemilla + costoTratamiento,
      fertilizantes: costoFertilizantes,
      agroquimicos: costoAgroquimicos,
      cosecha: costoCosecha,
      flete: costoFlete,
      comercializacion: costoComercializacion,
      arrendamiento: costoArrendamiento,
      financiamiento: costoFinanciamiento,
    },
    margenBrutoAjustadoHa,
    margenBrutoAjustadoTotal,
  };
}

/**
 * Valores por defecto para inputs vacíos
 */
export function getDefaultInputs(): CalculatorInputs {
  return {
    produccion: {
      cultivo: "",
      superficie: 0,
      rendimiento: 0,
      unidadRendimiento: "qq",
    },
    precio: {
      precioBruto: 0,
      gastosComerciales: 5,
      modoGastosComerciales: "percent",
      isPrecioPizarra: false,
    },
    labores: {
      labores: [],
    },
    insumos: {
      semilla: { dosis: 0, precio: 0 },
      tratamientoSemilla: { activo: false, costo: 0 },
      fertilizantes: [],
      agroquimicos: [],
    },
    cosecha: {
      tarifaBase: 35,
      correccionRendimiento: false,
      fleteDistancia: 0,
      fleteTarifa: 0.08,
      comisionAcopio: 2,
      otrosGastos: 0,
    },
    arrendamiento: {
      esArrendado: false,
      modo: "qq_soja",
      qqSojaHa: 12,
      precioSojaQq: 30,
      montoFijoUsd: 0,
    },
    financiamiento: {
      incluir: false,
      tea: 24,
    },
  };
}
