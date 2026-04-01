"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

const CATEGORIAS = [
  "Salario", "Freelance", "Comissao", "Transferencia Recebida",
  "Reembolso", "Investimento", "Outros",
];

const TIPOS_RECEBIMENTO = ["PIX", "Transferencia", "Dinheiro", "Deposito", "Outros"];

export function FormEntrada({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    data: new Date().toLocaleDateString("pt-BR"),
    categoria: "Salario",
    valor: "",
    fonte: "",
    tipoRecebimento: "PIX",
    responsavel: "Marcos",
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sheets/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      setOpen(false);
      setForm({ ...form, valor: "", fonte: "", observacoes: "" });
      onSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <Plus className="h-3.5 w-3.5" />
        Entrada
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Entrada (Receita)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                placeholder="1.500,00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <select
              id="categoria"
              className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="fonte">Fonte / Descricao</Label>
            <Input
              id="fonte"
              value={form.fonte}
              onChange={(e) => setForm({ ...form, fonte: e.target.value })}
              placeholder="Ex: Salario AffiliatesBR"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tipo">Tipo Recebimento</Label>
              <select
                id="tipo"
                className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                value={form.tipoRecebimento}
                onChange={(e) => setForm({ ...form, tipoRecebimento: e.target.value })}
              >
                {TIPOS_RECEBIMENTO.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="resp">Responsavel</Label>
              <select
                id="resp"
                className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                value={form.responsavel}
                onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
              >
                <option value="Marcos">Marcos</option>
                <option value="Kamila">Kamila</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="obs">Observacoes</Label>
            <Textarea
              id="obs"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Salvando..." : "Salvar Entrada"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
