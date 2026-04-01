"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Check, X, FileImage } from "lucide-react";

interface ParsedReceipt {
  data: string;
  valor: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  formaPgto: string;
  tipo: "entrada" | "saida";
  confianca: number;
}

export function ReceiptUpload({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedReceipt | null>(null);
  const [saved, setSaved] = useState(false);
  const [responsavel, setResponsavel] = useState("Marcos");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setParsed(null);
    setSaved(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) handleFile(f);
    },
    [handleFile]
  );

  const processReceipt = async (autoSave: boolean) => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("responsavel", responsavel);
      formData.append("autoSave", autoSave.toString());

      const res = await fetch("/api/receipt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao processar");

      const data = await res.json();
      setParsed(data.parsed);
      if (autoSave) {
        setSaved(true);
        onSuccess?.();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const saveToSheet = async () => {
    if (!file || !parsed) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("responsavel", responsavel);
      formData.append("autoSave", "true");

      const res = await fetch("/api/receipt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      setSaved(true);
      onSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setParsed(null);
    setSaved(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger render={<Button size="sm" variant="outline" className="gap-1.5" />}>
        <Camera className="h-3.5 w-3.5" />
        Comprovante
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload de Comprovante</DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        {!preview && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-zinc-300 hover:border-zinc-400"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("receipt-input")?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">Arraste o comprovante aqui</p>
            <p className="text-xs text-muted-foreground mt-1">ou clique para selecionar</p>
            <input
              id="receipt-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Comprovante"
                className="w-full max-h-48 object-contain rounded-lg bg-zinc-100"
              />
              <button
                onClick={reset}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Responsavel</label>
                <select
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                >
                  <option value="Marcos">Marcos</option>
                  <option value="Kamila">Kamila</option>
                </select>
              </div>

              {!parsed && (
                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    onClick={() => processReceipt(false)}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
                    <span className="ml-1.5">Analisar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => processReceipt(true)}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    <span className="ml-1.5">Salvar direto</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Parsed result */}
            {parsed && (
              <Card className="border-0 bg-zinc-50 dark:bg-zinc-900">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dados lidos pela IA</span>
                    <Badge variant={parsed.confianca >= 80 ? "default" : "secondary"}>
                      {parsed.confianca}% confianca
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Data:</span>{" "}
                      <span className="font-medium">{parsed.data}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor:</span>{" "}
                      <span className="font-medium">R$ {parsed.valor}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>{" "}
                      <Badge variant={parsed.tipo === "entrada" ? "default" : "secondary"} className="text-[10px]">
                        {parsed.tipo === "entrada" ? "Entrada" : "Saida"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pgto:</span>{" "}
                      <span className="font-medium">{parsed.formaPgto}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Descricao:</span>{" "}
                      <span className="font-medium">{parsed.descricao}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Categoria:</span>{" "}
                      <span className="font-medium">{parsed.categoria} &gt; {parsed.subcategoria}</span>
                    </div>
                  </div>

                  {!saved && (
                    <Button
                      onClick={saveToSheet}
                      className="w-full mt-2"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                      Confirmar e salvar na planilha
                    </Button>
                  )}

                  {saved && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mt-2">
                      <Check className="h-4 w-4" />
                      Salvo na planilha e no Google Drive!
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
