"use client";

import { Card, CardContent } from "@/components/ui/card";
import { dashboardSummary, formatCurrency } from "@/lib/data";
import {
  TrendingDown,
  TrendingUp,
  ArrowRightLeft,
  Wallet,
  AlertTriangle,
  Calendar,
  Clock,
  Percent,
} from "lucide-react";

const kpis = [
  {
    label: "Entradas",
    value: dashboardSummary.entradas,
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Saidas Reais",
    value: dashboardSummary.saidasReais,
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    label: "Transferencias",
    value: dashboardSummary.transferencias,
    icon: ArrowRightLeft,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Saldo Mes",
    value: dashboardSummary.saldoMes,
    icon: Wallet,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Dividas Totais",
    value: dashboardSummary.dividas,
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "% Comprometida",
    value: dashboardSummary.percentComprometida,
    icon: Percent,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    isPercent: true,
  },
  {
    label: "Previsto no Mes",
    value: dashboardSummary.previstoMes,
    icon: Calendar,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    label: "Falta Pagar",
    value: dashboardSummary.faltaPagar,
    icon: Clock,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.label}
            className="border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {kpi.label}
                  </p>
                  <p className="text-lg font-bold tracking-tight">
                    {kpi.isPercent
                      ? `${kpi.value.toFixed(1)}%`
                      : formatCurrency(kpi.value)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
