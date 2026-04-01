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
import { Minus, Loader2 } from "lucide-react";

const CATEGORIAS = [
  "Alimentacao", "Moradia", "Carro", "Transporte", "Saude", "Educacao",
  "Lazer/Entretenimento", "Internet/Telefone", "Assinaturas",
  "Roupas/Calcados", "Impostos/Taxas", "Igreja/Religiao", "Filhos",
  "Compras Pessoais", "Dividas/Emprestimos", "Servicos Profissionais",
  "Servicos Digitais", "Pagamentos Terceiros", "Outros",
];

const FORMAS_PGTO = ["PIX", "Cartao Credito", "Cartao Debito", "Dinheiro", "Boleto", "Transferencia"];

export function FormSaida({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    data: new Date().toLocaleDateString("pt-BR"),
    categoria: "Alimentacao",
    subcategoria: "",
    valor: "",
    descricao: "",
    responsavel: "Marcos",
    formaPgto: "PIX",
    fixoVariavel: "Variavel",
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sheets/saida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      setOpen(false);
      setForm({ ...form, valor: "", descricao: "", subcategoria: "", observacoes: "" });
      onSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50" />}>
        <Minus className="h-3.5 w-3.5" />
        Saida
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Saida (Despesa)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="s-data">Data</Label>
              <Input
                id="s-data"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div>
              <Label htmlFor="s-valor">Valor (R$)</Label>
              <Input
                id="s-valor"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                placeholder="150,00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="s-descricao">Descricao</Label>
            <Input
              id="s-descricao"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Supermercado Extra"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="s-cat">Categoria</Label>
              <select
                id="s-cat"
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
              <Label htmlFor="s-sub">Subcategoria</Label>
              <Input
                id="s-sub"
                value={form.subcategoria}
                onChange={(e) => setForm({ ...form, subcategoria: e.target.value })}
                placeholder="Ex: Compras mes"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="s-resp">Responsavel</Label>
              <select
                id="s-resp"
                className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                value={form.responsavel}
                onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
              >
                <option value="Marcos">Marcos</option>
                <option value="Kamila">Kamila</option>
              </select>
            </div>
            <div>
              <Label htmlFor="s-pgto">Pagamento</Label>
              <select
                id="s-pgto"
                className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                value={form.formaPgto}
                onChange={(e) => setForm({ ...form, formaPgto: e.target.value })}
              >
                {FORMAS_PGTO.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="s-tipo">Tipo</Label>
              <select
                id="s-tipo"
                className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                value={form.fixoVariavel}
                onChange={(e) => setForm({ ...form, fixoVariavel: e.target.value })}
              >
                <option value="Fixo">Fixo</option>
                <option value="Variavel">Variavel</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="s-obs">Observacoes</Label>
            <Textarea
              id="s-obs"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Salvando..." : "Salvar Saida"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
