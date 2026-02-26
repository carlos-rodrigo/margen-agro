# PRD: Calculadora de Margen Bruto Agrícola

## Introduction

Aplicación web que permite a productores, ingenieros agrónomos y administradores de campos calcular el margen bruto de sus cultivos siguiendo la metodología INTA. El usuario ingresa datos de producción, costos e insumos, y obtiene indicadores económicos clave para evaluar la rentabilidad de su operación.

## Goals

- Permitir calcular margen bruto para cualquier cultivo (soja, maíz, trigo, etc.)
- Proveer precios de referencia actualizados (scraping Bolsa de Cereales) con opción de override manual
- Mostrar resultados claros con visualizaciones (waterfall, breakdown de costos)
- UX optimizada para usuarios expertos que conocen los datos
- Funcionar 100% en el browser (stateless, sin login por ahora)

## User Stories

### US-001: Setup proyecto base
**Description:** Como desarrollador, necesito el scaffolding del proyecto para empezar a construir.

**Acceptance Criteria:**
- [ ] Next.js 14+ con App Router
- [ ] TypeScript configurado
- [ ] shadcn/ui instalado con theme agrícola (verdes)
- [ ] Tailwind CSS configurado
- [ ] Estructura de carpetas definida
- [ ] Deploy inicial en Vercel funcionando
- [ ] Typecheck/lint passes

### US-002: Formulario de datos de producción (Sección 1)
**Description:** Como usuario, quiero ingresar los datos básicos de mi lote para iniciar el cálculo.

**Acceptance Criteria:**
- [ ] Sección colapsable "Producción y Superficie"
- [ ] Campos: Cultivo (select), Superficie (ha), Rendimiento (qq/ha o tn/ha)
- [ ] Toggle para unidad de rendimiento (qq/ha ↔ tn/ha)
- [ ] Validación de campos numéricos positivos
- [ ] Typecheck passes
- [ ] Verify in browser

### US-003: Formulario de precios y comercialización (Sección 2)
**Description:** Como usuario, quiero ingresar el precio de venta y gastos comerciales.

**Acceptance Criteria:**
- [ ] Sección colapsable "Precio y Comercialización"
- [ ] Campo: Precio bruto (USD/tn) - precargado con precio pizarra si disponible
- [ ] Campo: Gastos comerciales (% o USD/tn) con toggle
- [ ] Indicador visual de "precio actualizado" vs "precio manual"
- [ ] Typecheck passes
- [ ] Verify in browser

### US-004: Formulario de labores (Sección 3)
**Description:** Como usuario, quiero ingresar los costos de labores y servicios.

**Acceptance Criteria:**
- [ ] Sección colapsable "Labores y Servicios"
- [ ] Lista dinámica de labores (agregar/eliminar)
- [ ] Por cada labor: nombre, modalidad (propio/contratado), cantidad, costo unitario
- [ ] Subtotal de labores visible
- [ ] Typecheck passes
- [ ] Verify in browser

### US-005: Formulario de insumos (Sección 4)
**Description:** Como usuario, quiero ingresar los costos de semilla, fertilizantes y agroquímicos.

**Acceptance Criteria:**
- [ ] Sección colapsable "Insumos" con sub-secciones:
  - Semilla (dosis kg/ha, precio USD/kg)
  - Tratamiento de semilla (opcional)
  - Fertilizantes (lista dinámica: producto, dosis, precio)
  - Agroquímicos (lista dinámica: tipo, producto, dosis, precio)
- [ ] Subtotales por categoría
- [ ] Typecheck passes
- [ ] Verify in browser

### US-006: Formulario de cosecha y logística (Sección 5)
**Description:** Como usuario, quiero ingresar costos de cosecha y flete.

**Acceptance Criteria:**
- [ ] Sección colapsable "Cosecha y Logística"
- [ ] Cosecha: tarifa base USD/ha + corrección por rendimiento (opcional)
- [ ] Flete: distancia km, tarifa USD/tn/km
- [ ] Comercialización: comisiones, acopio
- [ ] Subtotal visible
- [ ] Typecheck passes
- [ ] Verify in browser

### US-007: Formulario de arrendamiento (Sección 6)
**Description:** Como usuario, quiero indicar si el campo es propio o arrendado.

**Acceptance Criteria:**
- [ ] Sección colapsable "Arrendamiento"
- [ ] Toggle: Propio / Arrendado
- [ ] Si arrendado: modalidad (qq soja/ha o USD/ha fijo)
- [ ] Si qq soja: campos para qq/ha y precio soja USD/qq
- [ ] Sección se oculta/deshabilita si es propio
- [ ] Typecheck passes
- [ ] Verify in browser

### US-008: Formulario de financiamiento (Sección 7)
**Description:** Como usuario, quiero incluir el costo financiero del capital circulante.

**Acceptance Criteria:**
- [ ] Sección colapsable "Financiamiento" (opcional, colapsada por default)
- [ ] Campo: Tasa Efectiva Anual (TEA) %
- [ ] Checkbox para incluir/excluir del cálculo
- [ ] Typecheck passes
- [ ] Verify in browser

### US-009: Motor de cálculo
**Description:** Como desarrollador, necesito implementar la lógica de cálculo según metodología INTA.

**Acceptance Criteria:**
- [ ] Función pura que recibe todos los inputs y retorna resultados
- [ ] Cálculos implementados:
  - Ingreso Bruto = Rendimiento × Precio
  - Costos Directos = Σ(labores + insumos + cosecha + flete + comercialización)
  - Margen Bruto = Ingreso Bruto − Costos Directos
  - Rinde de indiferencia = Costos Directos / Precio
  - Retorno por peso invertido = MB / Costos Directos
  - Interés capital circulante = (Costos × 0.5) × TEA
  - Arrendamiento (según modalidad)
  - Margen Bruto ajustado = MB − Interés − Arrendamiento
- [ ] Tests unitarios para cada cálculo
- [ ] Typecheck passes

### US-010: Panel de resultados
**Description:** Como usuario, quiero ver los resultados del cálculo de forma clara.

**Acceptance Criteria:**
- [ ] Panel fijo o sticky con resultados principales
- [ ] Métricas mostradas:
  - Ingreso Bruto (USD/ha y total)
  - Costos Directos (USD/ha y total)
  - Margen Bruto (USD/ha y total)
  - Rinde de indiferencia (qq/ha o tn/ha)
  - Retorno por peso invertido
- [ ] Colores: verde si MB > 0, rojo si MB < 0
- [ ] Actualización en tiempo real mientras se editan inputs
- [ ] Typecheck passes
- [ ] Verify in browser

### US-011: Gráfico waterfall de margen
**Description:** Como usuario, quiero visualizar cómo se compone el margen bruto.

**Acceptance Criteria:**
- [ ] Gráfico waterfall: Ingreso → (-Costos por rubro) → Margen
- [ ] Colores: verde para ingresos, rojo para costos
- [ ] Tooltip con valores exactos
- [ ] Responsive (mobile friendly)
- [ ] Typecheck passes
- [ ] Verify in browser

### US-012: Gráfico de breakdown de costos
**Description:** Como usuario, quiero ver la distribución porcentual de mis costos.

**Acceptance Criteria:**
- [ ] Gráfico donut/pie con % de cada rubro
- [ ] Rubros: Labores, Semilla, Fertilizantes, Agroquímicos, Cosecha, Flete, Comercialización, Arrendamiento
- [ ] Leyenda con valores absolutos y %
- [ ] Typecheck passes
- [ ] Verify in browser

### US-013: Scraper de precios Bolsa de Cereales
**Description:** Como sistema, necesito obtener precios de referencia actualizados diariamente.

**Acceptance Criteria:**
- [ ] Endpoint o cron que scrapea precios pizarra de bolsadecereales.com
- [ ] Extrae: soja, maíz, trigo, girasol, cebada (mínimo)
- [ ] Guarda en JSON/KV store con timestamp
- [ ] Corre 1x por día (6:00 AM Argentina)
- [ ] Fallback a últimos precios conocidos si falla
- [ ] Typecheck passes

### US-014: Integración de precios en formulario
**Description:** Como usuario, quiero ver precios sugeridos pero poder cambiarlos.

**Acceptance Criteria:**
- [ ] Al seleccionar cultivo, se precarga precio pizarra
- [ ] Badge "Precio pizarra [fecha]" junto al campo
- [ ] Usuario puede editar (badge cambia a "Precio manual")
- [ ] Botón para resetear a precio pizarra
- [ ] Typecheck passes
- [ ] Verify in browser

### US-015: Conversión ARS (opcional)
**Description:** Como usuario argentino, quiero ver los valores también en pesos.

**Acceptance Criteria:**
- [ ] Toggle "Mostrar en ARS"
- [ ] Obtener TC del día (API Banco Nación o similar)
- [ ] Mostrar valores en USD y ARS lado a lado
- [ ] Disclaimer de que TC es referencial
- [ ] Typecheck passes
- [ ] Verify in browser

### US-016: Exportar resultados
**Description:** Como usuario, quiero exportar el análisis para compartirlo.

**Acceptance Criteria:**
- [ ] Botón "Exportar PDF" con resumen + gráficos
- [ ] Botón "Copiar link" que genera URL con params (stateless share)
- [ ] El link restaura todos los inputs
- [ ] Typecheck passes
- [ ] Verify in browser

## Functional Requirements

- FR-1: Soporte para múltiples cultivos (soja, maíz, trigo, girasol, cebada, sorgo, otros)
- FR-2: Todos los valores monetarios en USD como base, conversión ARS opcional
- FR-3: Formulario con secciones colapsables (accordion pattern)
- FR-4: Cálculos en tiempo real mientras se edita
- FR-5: Precios de referencia actualizados diariamente via scraping
- FR-6: Usuario puede override cualquier precio sugerido
- FR-7: Resultados exportables (PDF y link compartible)
- FR-8: Mobile responsive
- FR-9: Funciona offline después de carga inicial (PWA opcional)

## Non-Goals

- ❌ No guardar datos de usuario (no login, no persistencia server-side)
- ❌ No comparación entre campañas/años
- ❌ No integración con sistemas de gestión de campos
- ❌ No cálculo de costos indirectos (estructura, administración)
- ❌ No simulaciones de escenarios múltiples (por ahora)
- ❌ No soporte multi-idioma (solo español)

## Technical Considerations

- **Stack:** Next.js 14+, TypeScript, Tailwind, shadcn/ui
- **Charts:** Recharts o Tremor
- **Scraping:** Cheerio + fetch en edge function o server action
- **State:** URL params para persistencia/sharing (nuqs o similar)
- **Hosting:** Vercel
- **Cron:** Vercel Cron para scraping diario

## Design Considerations

- Theme: tonos verdes (agrícola) sobre fondo claro
- Componentes shadcn con customización mínima
- Iconografía: Lucide icons
- Layout: sidebar con secciones, main con resultados (desktop) / stacked (mobile)

## Success Metrics

- Usuario puede completar un cálculo en < 5 minutos
- Resultados coinciden con cálculo manual siguiendo metodología INTA
- Precios actualizados disponibles el 95% de los días
- Tiempo de carga inicial < 2 segundos

## Open Questions

1. ¿Incluir presets de costos típicos por región/zona? (ej: "Zona núcleo", "NOA")
2. ¿Agregar cultivos de invierno vs verano como categorización?
3. ¿Nombre del proyecto? (sugerencias: AgroMargen, CampoCalc, MargenAgro)
