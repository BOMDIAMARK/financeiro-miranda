"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { responsaveis, formatCurrency } from "@/lib/data";
import { Users } from "lucide-react";

export function ResponsaveisCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Visao por Responsavel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {responsaveis.map((r) => (
            <div
              key={r.nome}
              className="p-4 rounded-lg border-2"
              style={{ borderColor: r.cor + "40" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: r.cor }}
                />
                <span className="font-semibold text-sm">{r.nome}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entradas</span>
                  <span className="font-mono text-emerald-600">
                    {formatCurrency(r.entradas)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saidas</span>
                  <span className="font-mono text-red-600">
                    {formatCurrency(r.saidas)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transferencias</span>
                  <span className="font-mono">
                    {formatCurrency(r.transferencias)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Saldo</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(r.saldo)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Transacoes</span>
                  <span>{r.transacoes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
