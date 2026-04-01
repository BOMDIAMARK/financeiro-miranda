"use client";

import { KpiCards } from "@/components/kpi-cards";
import { ProjecaoCard } from "@/components/projecao-card";
import { ResponsaveisCard } from "@/components/responsaveis-card";
import {
  PrevisaoPorCategoriaChart,
  PrevisaoPorTipoChart,
  DividasPorCredorChart,
} from "@/components/charts";
import { PrevisaoTable } from "@/components/previsao-table";
import { DividasTable } from "@/components/dividas-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FormEntrada } from "@/components/form-entrada";
import { FormSaida } from "@/components/form-saida";
import { ReceiptUpload } from "@/components/receipt-upload";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  BarChart3,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Controle Financeiro
            </h1>
            <p className="text-xs text-muted-foreground">
              Familia Miranda — Abril 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ReceiptUpload />
            <FormEntrada />
            <FormSaida />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground ml-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Marcos
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                Kamila
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="dashboard" className="text-xs gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="previsao" className="text-xs gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Previsao
            </TabsTrigger>
            <TabsTrigger value="dividas" className="text-xs gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Dividas
            </TabsTrigger>
            <TabsTrigger value="analise" className="text-xs gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              Analise
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <KpiCards />
            <div className="grid md:grid-cols-2 gap-6">
              <ProjecaoCard />
              <ResponsaveisCard />
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-6">
              <PrevisaoPorCategoriaChart />
              <PrevisaoPorTipoChart />
            </div>
          </TabsContent>

          {/* Previsao Tab */}
          <TabsContent value="previsao" className="space-y-6">
            <PrevisaoTable />
          </TabsContent>

          {/* Dividas Tab */}
          <TabsContent value="dividas" className="space-y-6">
            <DividasTable />
            <DividasPorCredorChart />
          </TabsContent>

          {/* Analise Tab */}
          <TabsContent value="analise" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <PrevisaoPorCategoriaChart />
              <DividasPorCredorChart />
            </div>
            <PrevisaoPorTipoChart />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Dados sincronizados da planilha Google Sheets — Abril 2026
        </div>
      </footer>
    </div>
  );
}
