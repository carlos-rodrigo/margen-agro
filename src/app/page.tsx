import { ProductionForm } from "@/components/forms/production-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-primary">
            🌾 Calculadora de Margen Bruto
          </h1>
          <p className="text-muted-foreground">
            Metodología INTA para análisis económico agrícola
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Forms Column */}
          <div className="space-y-4">
            <ProductionForm />
            
            {/* Placeholder for other sections */}
            <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
              Precio y Comercialización (próximamente)
            </div>
            <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
              Labores y Servicios (próximamente)
            </div>
            <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
              Insumos (próximamente)
            </div>
            <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
              Cosecha y Logística (próximamente)
            </div>
            <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
              Arrendamiento (próximamente)
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">📊 Resultados</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Ingreso Bruto</span>
                  <span className="font-medium">--.-- USD/ha</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Costos Directos</span>
                  <span className="font-medium">--.-- USD/ha</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-lg">
                  <span className="font-semibold">Margen Bruto</span>
                  <span className="font-bold text-primary">--.-- USD/ha</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rinde de indiferencia</span>
                  <span>--.-- qq/ha</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retorno por $ invertido</span>
                  <span>--.--%</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                Complete los datos para ver los resultados
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
