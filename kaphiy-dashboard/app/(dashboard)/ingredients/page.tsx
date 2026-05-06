"use client";

import { IngredientsTable } from "@/src/features/ingredients/components/IngredientsTable";

export default function IngredientsPage() {
  return (
    <main
      role="main"
      aria-label="Gestión de ingredientes"
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <header className="px-7 pb-4 pt-4">
        <h1 className="font-display text-lg font-bold text-[var(--foreground)]">
          Ingredientes
        </h1>
        <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
          Catálogo de insumos. Marca alérgenos para que aparezcan en los tickets de cocina.
        </p>
      </header>

      <div className="flex-1 px-7 pb-10">
        <IngredientsTable />
      </div>
    </main>
  );
}
