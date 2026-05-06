"use client";

import { ProductsTable } from "@/src/features/products/components/ProductsTable";

export default function ProductsPage() {
  return (
    <main
      role="main"
      aria-label="Gestión de productos"
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <header className="px-7 pb-4 pt-4">
        <h1 className="font-display text-lg font-bold text-[var(--foreground)]">
          Productos
        </h1>
        <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
          Catálogo del menú. Marca productos como no disponibles para ocultarlos del cliente.
        </p>
      </header>

      <div className="flex-1 px-7 pb-10">
        <ProductsTable />
      </div>
    </main>
  );
}
