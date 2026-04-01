"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardSummary, formatCurrency } from "@/lib/data";
import { AlertTriangle, TrendingDown } from "lucide-react";

export function ProjecaoCard() {
  const isNegativo = dashboardSummary.saldoProjetado < 0;

  return (
    <Card
      className={`border-0 shadow-sm ${isNegativo ? "bg-red-50 dark:bg-red-950/30" : "bg-emerald-50 dark:bg-emerald-950/30"}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isNegativo ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-emerald-500" />
          )}
          Projecao do Mes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Entradas Realizadas</span>
          <span className="font-medium text-emerald-600">
            {formatCurrency(dashboardSummary.entradas)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Saidas Realizadas</span>
          <span className="font-medium text-red-600">
            {formatCurrency(dashboardSummary.saidasReais)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Previsto</span>
          <span className="font-medium">
            {formatCurrency(dashboardSummary.previstoMes)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ja Pago</span>
          <span className="font-medium">
            {formatCurrency(dashboardSummary.saidasReais)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Falta Pagar</span>
          <span className="font-medium text-amber-600">
            {formatCurrency(dashboardSummary.faltaPagar)}
          </span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">Saldo Projetado</span>
            <span
              className={`text-2xl font-bold ${isNegativo ? "text-red-600" : "text-emerald-600"}`}
            >
              {formatCurrency(dashboardSummary.saldoProjetado)}
            </span>
          </div>
          {isNegativo && (
            <p className="text-xs text-red-500 mt-2">
              Projecao NEGATIVA — faltando{" "}
              {formatCurrency(Math.abs(dashboardSummary.saldoProjetado))}. Revise
              gastos ou busque receita extra!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
