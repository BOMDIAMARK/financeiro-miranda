"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { previsoes, formatCurrency } from "@/lib/data";
import { Calendar, Clock } from "lucide-react";

const tipoBadge: Record<string, string> = {
  "Atrasado Mes Anterior": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Fixo Recorrente": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Parcelamento: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function PrevisaoTable() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Previsao de Saidas — Abril 2026
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">#</th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Data
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Descricao
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Categoria
                </th>
                <th className="pb-2 font-medium text-muted-foreground text-right">
                  Valor
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Tipo
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {previsoes.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-dashed last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-2.5 text-muted-foreground">{item.id}</td>
                  <td className="py-2.5 whitespace-nowrap">
                    {item.dataPrevista || "—"}
                  </td>
                  <td className="py-2.5 font-medium">{item.descricao}</td>
                  <td className="py-2.5 text-muted-foreground">
                    {item.categoria}
                  </td>
                  <td className="py-2.5 text-right font-mono font-medium">
                    {formatCurrency(item.valor)}
                  </td>
                  <td className="py-2.5">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium ${tipoBadge[item.tipo] || ""}`}
                    >
                      {item.tipo}
                    </Badge>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1 text-amber-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Pendente</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-bold">
                <td colSpan={4} className="pt-3">
                  TOTAL
                </td>
                <td className="pt-3 text-right font-mono">
                  {formatCurrency(
                    previsoes.reduce((sum, p) => sum + p.valor, 0)
                  )}
                </td>
                <td colSpan={2} className="pt-3 text-muted-foreground text-sm font-normal">
                  {previsoes.length} itens
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
