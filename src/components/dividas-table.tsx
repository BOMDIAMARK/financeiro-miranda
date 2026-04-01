"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { dividas, formatCurrency } from "@/lib/data";
import { CreditCard } from "lucide-react";

export function DividasTable() {
  const totalAberto = dividas.reduce((s, d) => s + d.saldoRestante, 0);
  const custoMensal = dividas.reduce((s, d) => s + d.valorParcela, 0);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Dividas & Parcelamentos
          </CardTitle>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Total em aberto: </span>
              <span className="font-bold text-red-600">
                {formatCurrency(totalAberto)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Custo mensal: </span>
              <span className="font-bold text-amber-600">
                {formatCurrency(custoMensal)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dividas.map((d) => {
            const percentPago = Math.round(
              (d.parcPagas / d.parcTotal) * 100
            );
            return (
              <div
                key={d.id}
                className="p-3 rounded-lg border border-dashed hover:border-solid transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{d.credor}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.dataInicio} → {d.dataFim || "Indefinido"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-red-600">
                      {formatCurrency(d.saldoRestante)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Parcela: {formatCurrency(d.valorParcela)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={percentPago} className="h-2 flex-1" />
                  <span className="text-xs font-medium min-w-[60px] text-right">
                    {d.parcPagas}/{d.parcTotal} ({percentPago}%)
                  </span>
                  <Badge
                    variant={d.pagoEsteMes ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {d.pagoEsteMes ? "Pago" : "Pendente"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
