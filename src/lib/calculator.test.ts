import { describe, it, expect } from "vitest";
import { calculateMargin, getDefaultInputs } from "./calculator";
import type { CalculatorInputs } from "./types";

describe("calculateMargin", () => {
  it("calcula ingreso bruto correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35, // qq/ha = 3.5 tn/ha
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350, // USD/tn
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
    };

    const result = calculateMargin(inputs);

    // 3.5 tn/ha × 350 USD/tn = 1225 USD/ha
    expect(result.ingresoBrutoHa).toBeCloseTo(1225, 2);
    // 1225 USD/ha × 100 ha = 122500 USD
    expect(result.ingresoBrutoTotal).toBeCloseTo(122500, 2);
  });

  it("calcula costos de labores correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35,
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350,
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      labores: {
        labores: [
          { id: "1", nombre: "Siembra", modalidad: "contratado", cantidad: 1, costoUnitario: 25 },
          { id: "2", nombre: "Fumigación", modalidad: "contratado", cantidad: 3, costoUnitario: 10 },
        ],
      },
    };

    const result = calculateMargin(inputs);

    // 1×25 + 3×10 = 55 USD/ha
    expect(result.desgloseCostos.labores).toBeCloseTo(55, 2);
  });

  it("calcula costos de insumos correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35,
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350,
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      insumos: {
        semilla: { dosis: 80, precio: 0.5 }, // 80 kg/ha × 0.5 USD/kg = 40 USD/ha
        tratamientoSemilla: { activo: true, costo: 10 },
        fertilizantes: [
          { id: "1", producto: "Urea", dosis: 100, precio: 0.6 }, // 60 USD/ha
        ],
        agroquimicos: [
          { id: "1", tipo: "Herbicida", producto: "Glifosato", dosis: 3, precio: 5 }, // 15 USD/ha
        ],
      },
    };

    const result = calculateMargin(inputs);

    // Semilla: 40 + 10 = 50 USD/ha
    expect(result.desgloseCostos.semilla).toBeCloseTo(50, 2);
    // Fertilizantes: 60 USD/ha
    expect(result.desgloseCostos.fertilizantes).toBeCloseTo(60, 2);
    // Agroquímicos: 15 USD/ha
    expect(result.desgloseCostos.agroquimicos).toBeCloseTo(15, 2);
  });

  it("calcula flete correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35, // qq/ha = 3.5 tn/ha
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350,
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      cosecha: {
        tarifaBase: 0,
        correccionRendimiento: false,
        fleteDistancia: 100, // km
        fleteTarifa: 0.08, // USD/tn/km
        comisionAcopio: 0,
        otrosGastos: 0,
      },
    };

    const result = calculateMargin(inputs);

    // 100 km × 0.08 USD/tn/km × 3.5 tn/ha = 28 USD/ha
    expect(result.desgloseCostos.flete).toBeCloseTo(28, 2);
  });

  it("calcula arrendamiento en qq soja correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35,
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350,
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      arrendamiento: {
        esArrendado: true,
        modo: "qq_soja",
        qqSojaHa: 12,
        precioSojaQq: 30, // 1 qq = 100 kg = 0.1 tn, precio 300 USD/tn → 30 USD/qq
        montoFijoUsd: 0,
      },
    };

    const result = calculateMargin(inputs);

    // 12 qq/ha × 30 USD/qq = 360 USD/ha
    expect(result.desgloseCostos.arrendamiento).toBeCloseTo(360, 2);
  });

  it("calcula financiamiento correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35,
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350,
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      labores: {
        labores: [
          { id: "1", nombre: "Siembra", modalidad: "contratado", cantidad: 1, costoUnitario: 100 },
        ],
      },
      cosecha: {
        tarifaBase: 100,
        correccionRendimiento: false,
        fleteDistancia: 0,
        fleteTarifa: 0,
        comisionAcopio: 0,
        otrosGastos: 0,
      },
      financiamiento: {
        incluir: true,
        tea: 24, // 24% anual
      },
    };

    const result = calculateMargin(inputs);

    // Costos directos: 100 (labores) + 100 (cosecha) = 200 USD/ha
    // Financiamiento: 200 × 0.5 × 0.24 × 0.5 = 12 USD/ha
    expect(result.desgloseCostos.financiamiento).toBeCloseTo(12, 2);
  });

  it("calcula rinde de indiferencia correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35, // qq/ha
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350, // USD/tn
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      cosecha: {
        tarifaBase: 700, // USD/ha (para dar un rinde de indiferencia de 2 tn/ha = 20 qq/ha)
        correccionRendimiento: false,
        fleteDistancia: 0,
        fleteTarifa: 0,
        comisionAcopio: 0,
        otrosGastos: 0,
      },
    };

    const result = calculateMargin(inputs);

    // Costos: 700 USD/ha
    // Rinde indiferencia: 700 / 350 = 2 tn/ha = 20 qq/ha
    expect(result.rindeIndiferencia).toBeCloseTo(20, 2);
  });

  it("calcula margen bruto y retorno correctamente", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35, // qq/ha = 3.5 tn/ha
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350, // USD/tn → Ingreso: 3.5 × 350 = 1225 USD/ha
        gastosComerciales: 0,
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      cosecha: {
        tarifaBase: 225, // Para tener costos = 225, margen = 1000
        correccionRendimiento: false,
        fleteDistancia: 0,
        fleteTarifa: 0,
        comisionAcopio: 0,
        otrosGastos: 0,
      },
    };

    const result = calculateMargin(inputs);

    // Ingreso: 1225 USD/ha
    // Costos: 225 USD/ha
    // Margen: 1225 - 225 = 1000 USD/ha
    expect(result.margenBrutoHa).toBeCloseTo(1000, 2);
    // Retorno: 1000 / 225 × 100 = 444.44%
    expect(result.retornoPorPesoInvertido).toBeCloseTo(444.44, 1);
  });

  it("maneja gastos comerciales en porcentaje", () => {
    const inputs: CalculatorInputs = {
      ...getDefaultInputs(),
      produccion: {
        cultivo: "soja",
        superficie: 100,
        rendimiento: 35,
        unidadRendimiento: "qq",
      },
      precio: {
        precioBruto: 350,
        gastosComerciales: 5, // 5%
        modoGastosComerciales: "percent",
        isPrecioPizarra: true,
      },
      cosecha: {
        tarifaBase: 0,
        correccionRendimiento: false,
        fleteDistancia: 0,
        fleteTarifa: 0,
        comisionAcopio: 0, // Sin comisión de acopio para el test
        otrosGastos: 0,
      },
    };

    const result = calculateMargin(inputs);

    // Ingreso: 1225 USD/ha
    // Gastos comerciales: 1225 × 5% = 61.25 USD/ha
    expect(result.desgloseCostos.comercializacion).toBeCloseTo(61.25, 2);
  });
});
