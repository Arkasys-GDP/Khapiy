"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, AlertTriangle, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/src/shared/api/fetcher";
import {
  useIngredientsQuery,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
} from "../hooks/useIngredients";
import { IngredientForm } from "./IngredientForm";
import type { Ingredient } from "../types";
import type { IngredientInput } from "../lib/schema";

export function IngredientsTable() {
  const { data, isLoading, isError, refetch } = useIngredientsQuery();
  const createMutation = useCreateIngredient();
  const updateMutation = useUpdateIngredient();
  const deleteMutation = useDeleteIngredient();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Ingredient | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((i) => i.name.toLowerCase().includes(q));
  }, [data, search]);

  async function handleCreate(values: IngredientInput) {
    try {
      await createMutation.mutateAsync(values);
      toast.success(`Ingrediente "${values.name}" creado`);
      setCreateOpen(false);
    } catch (err) {
      toast.error(formatError(err));
    }
  }

  async function handleUpdate(values: IngredientInput) {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, input: values });
      toast.success(`Ingrediente "${values.name}" actualizado`);
      setEditing(null);
    } catch (err) {
      toast.error(formatError(err));
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success(`Ingrediente "${pendingDelete.name}" eliminado`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(formatError(err));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ingrediente…"
            className="pl-9"
            aria-label="Buscar ingrediente"
          />
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" aria-hidden />
              Nuevo ingrediente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo ingrediente</DialogTitle>
              <DialogDescription>
                Agrega un ingrediente al catálogo. Los marcados como alérgenos se mostrarán en los tickets de cocina.
              </DialogDescription>
            </DialogHeader>
            <IngredientForm
              onSubmit={handleCreate}
              onCancel={() => setCreateOpen(false)}
              submitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Nombre</TableHead>
              <TableHead>Alérgeno</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-8 w-24" /></TableCell>
                  </TableRow>
                ))}
              </>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-[var(--sem-alert)]">
                  Error al cargar ingredientes.{" "}
                  <button onClick={() => refetch()} className="underline">Reintentar</button>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-[var(--muted-foreground)] py-8">
                  {search ? "Sin coincidencias" : "Aún no hay ingredientes. Crea el primero."}
                </TableCell>
              </TableRow>
            )}

            {filtered.map((ing) => (
              <TableRow key={ing.id}>
                <TableCell className="font-medium">{ing.name}</TableCell>
                <TableCell>
                  {ing.isAllergen ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="size-3" aria-hidden />
                      Sí
                    </Badge>
                  ) : (
                    <span className="text-xs text-[var(--muted-foreground)]">No</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Editar ${ing.name}`}
                      onClick={() => setEditing(ing)}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Eliminar ${ing.name}`}
                      onClick={() => setPendingDelete(ing)}
                      className="text-[var(--sem-alert)] hover:text-[var(--sem-alert)]"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar ingrediente</DialogTitle>
            <DialogDescription>
              Modifica los datos del ingrediente. Los cambios se aplican de inmediato.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <IngredientForm
              defaultValues={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
              submitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ingrediente?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a eliminar <strong>{pendingDelete?.name}</strong>. Esta acción no se puede deshacer.
              Si el ingrediente está vinculado a productos, la operación fallará.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-[var(--sem-alert)] text-white hover:opacity-90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function formatError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Sesión expirada — vuelve a iniciar sesión";
    if (err.status === 409) return "Conflicto: el ingrediente está en uso";
    return err.message || "Error del servidor";
  }
  return err instanceof Error ? err.message : "Error desconocido";
}
