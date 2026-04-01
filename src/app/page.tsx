"use client";

import { useSheetData } from "@/lib/use-sheet-data";
import { FormEntrada } from "@/components/form-entrada";
import { FormSaida } from "@/components/form-saida";
import { ReceiptUpload } from "@/components/receipt-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard, Calendar, CreditCard, BarChart3,
  TrendingUp, TrendingDown, ArrowRightLeft, Wallet,
  AlertTriangle, Percent, Clock, Users,
  RefreshCw, Loader2, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
  type PieLabelRenderProps,
} from "recharts";

const COLORS = [
  "#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6",
  "#f97316", "#06b6d4", "#ef4444", "#84cc16", "#6366f1",
];

function fmt(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Home() {
  const { data, loading, error, updatedAt, refresh } = useSheetData();

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">Erro: {error}</p>
        <Button onClick={refresh}>Tentar novamente</Button>
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    { label: "Entradas", value: data.entradas, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Saidas Reais", value: data.saidasReais, icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Transferencias", value: data.transferencias, icon: ArrowRightLeft, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Saldo Mes", value: data.saldoMes, icon: Wallet, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Dividas Totais", value: data.dividas, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "% Comprometida", value: data.percentComprometida, icon: Percent, color: "text-orange-500", bg: "bg-orange-500/10", isPercent: true },
    { label: "Previsto no Mes", value: data.previstoMes, icon: Calendar, color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Falta Pagar", value: data.faltaPagar, icon: Clock, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  // Charts data
  const previsaoPorCategoria = (() => {
    const map = new Map<string, number>();
    data.previsoes.forEach(p => {
      if (p.valor > 0) map.set(p.categoria, (map.get(p.categoria) || 0) + p.valor);
    });
    return Array.from(map.entries()).map(([categoria, valor]) => ({ categoria, valor })).sort((a, b) => b.valor - a.valor);
  })();

  const previsaoPorTipo = (() => {
    const map = new Map<string, number>();
    data.previsoes.forEach(p => {
      if (p.valor > 0 && p.tipo) map.set(p.tipo, (map.get(p.tipo) || 0) + p.valor);
    });
    return Array.from(map.entries()).map(([tipo, valor]) => ({ tipo, valor })).sort((a, b) => b.valor - a.valor);
  })();

  const isNegativo = data.saldoProjetado < 0;

  const tipoBadge: Record<string, string> = {
    "Atrasado Mes Anterior": "bg-red-100 text-red-700",
    "Atrasado Mês Anterior": "bg-red-100 text-red-700",
    "Fixo Recorrente": "bg-blue-100 text-blue-700",
    Parcelamento: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Controle Financeiro</h1>
            <p className="text-xs text-muted-foreground">Familia Miranda — Abril 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={refresh} disabled={loading} className="gap-1.5">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <ReceiptUpload onSuccess={refresh} />
            <FormEntrada onSuccess={refresh} />
            <FormSaida onSuccess={refresh} />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground ml-2">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" />Marcos</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500" />Kamila</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="dashboard" className="text-xs gap-1.5"><LayoutDashboard className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
            <TabsTrigger value="previsao" className="text-xs gap-1.5"><Calendar className="h-3.5 w-3.5" />Previsao</TabsTrigger>
            <TabsTrigger value="dividas" className="text-xs gap-1.5"><CreditCard className="h-3.5 w-3.5" />Dividas</TabsTrigger>
            <TabsTrigger value="analise" className="text-xs gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Analise</TabsTrigger>
          </TabsList>

          {/* ── Dashboard ── */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpis.map(kpi => {
                const Icon = kpi.icon;
                return (
                  <Card key={kpi.label} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${kpi.bg}`}><Icon className={`h-4 w-4 ${kpi.color}`} /></div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
                          <p className="text-lg font-bold tracking-tight">
                            {kpi.isPercent ? `${kpi.value.toFixed(1)}%` : fmt(kpi.value)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Projecao + Responsaveis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={`border-0 shadow-sm ${isNegativo ? "bg-red-50 dark:bg-red-950/30" : "bg-emerald-50 dark:bg-emerald-950/30"}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${isNegativo ? "text-red-500" : "text-emerald-500"}`} />
                    Projecao do Mes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Entradas Realizadas</span><span className="font-medium text-emerald-600">{fmt(data.entradas)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Saidas Realizadas</span><span className="font-medium text-red-600">{fmt(data.saidasReais)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Previsto</span><span className="font-medium">{fmt(data.previstoMes)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Falta Pagar</span><span className="font-medium text-amber-600">{fmt(data.faltaPagar)}</span></div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">Saldo Projetado</span>
                      <span className={`text-2xl font-bold ${isNegativo ? "text-red-600" : "text-emerald-600"}`}>{fmt(data.saldoProjetado)}</span>
                    </div>
                    {isNegativo && <p className="text-xs text-red-500 mt-2">Projecao NEGATIVA — faltando {fmt(Math.abs(data.saldoProjetado))}. Revise gastos ou busque receita extra!</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4" />Visao por Responsavel</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ nome: "Marcos", cor: "#3b82f6", d: data.marcos }, { nome: "Kamila", cor: "#ec4899", d: data.kamila }].map(r => (
                      <div key={r.nome} className="p-4 rounded-lg border-2" style={{ borderColor: r.cor + "40" }}>
                        <div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.cor }} /><span className="font-semibold text-sm">{r.nome}</span></div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Entradas</span><span className="font-mono text-emerald-600">{fmt(r.d.entradas)}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Saidas</span><span className="font-mono text-red-600">{fmt(r.d.saidas)}</span></div>
                          <div className="flex justify-between border-t pt-2"><span className="font-medium">Saldo</span><span className="font-mono font-bold">{fmt(r.d.saldo)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Transacoes</span><span>{r.d.transacoes}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Previsao por Categoria</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={previsaoPorCategoria} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`} fontSize={11} />
                      <YAxis type="category" dataKey="categoria" width={130} fontSize={11} tickLine={false} />
                      <Tooltip formatter={(v) => fmt(Number(v))} />
                      <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                        {previsaoPorCategoria.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Previsao por Tipo</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={previsaoPorTipo} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="valor" nameKey="tipo"
                        label={(props: PieLabelRenderProps) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={false} fontSize={11}>
                        {previsaoPorTipo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Previsao ── */}
          <TabsContent value="previsao">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4" />Previsao de Saidas — Abril 2026</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium text-muted-foreground">#</th>
                        <th className="pb-2 font-medium text-muted-foreground">Data</th>
                        <th className="pb-2 font-medium text-muted-foreground">Descricao</th>
                        <th className="pb-2 font-medium text-muted-foreground">Categoria</th>
                        <th className="pb-2 font-medium text-muted-foreground text-right">Valor</th>
                        <th className="pb-2 font-medium text-muted-foreground">Tipo</th>
                        <th className="pb-2 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.previsoes.map(item => (
                        <tr key={item.id} className="border-b border-dashed last:border-0 hover:bg-muted/50">
                          <td className="py-2.5 text-muted-foreground">{item.id}</td>
                          <td className="py-2.5 whitespace-nowrap">{item.dataPrevista || "—"}</td>
                          <td className="py-2.5 font-medium">{item.descricao}</td>
                          <td className="py-2.5 text-muted-foreground">{item.categoria}</td>
                          <td className="py-2.5 text-right font-mono font-medium">{item.valor > 0 ? fmt(item.valor) : "—"}</td>
                          <td className="py-2.5">
                            <Badge variant="secondary" className={`text-[10px] font-medium ${tipoBadge[item.tipo] || ""}`}>{item.tipo}</Badge>
                          </td>
                          <td className="py-2.5">
                            {item.status.includes("Pago") ? (
                              <div className="flex items-center gap-1 text-emerald-600"><Check className="h-3 w-3" /><span className="text-xs">Pago</span></div>
                            ) : (
                              <div className="flex items-center gap-1 text-amber-600"><Clock className="h-3 w-3" /><span className="text-xs">Pendente</span></div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 font-bold">
                        <td colSpan={4} className="pt-3">TOTAL</td>
                        <td className="pt-3 text-right font-mono">{fmt(data.previsoes.reduce((s, p) => s + p.valor, 0))}</td>
                        <td colSpan={2} className="pt-3 text-muted-foreground text-sm font-normal">{data.previsoes.length} itens</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Dividas ── */}
          <TabsContent value="dividas" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><CreditCard className="h-4 w-4" />Dividas & Parcelamentos</CardTitle>
                  <div className="flex gap-4 text-xs">
                    <div><span className="text-muted-foreground">Total em aberto: </span><span className="font-bold text-red-600">{fmt(data.dividasList.reduce((s, d) => s + d.saldoRestante, 0))}</span></div>
                    <div><span className="text-muted-foreground">Custo mensal: </span><span className="font-bold text-amber-600">{fmt(data.dividasList.reduce((s, d) => s + d.valorParcela, 0))}</span></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.dividasList.map(d => {
                    const pct = d.parcTotal > 0 ? Math.round((d.parcPagas / d.parcTotal) * 100) : 0;
                    return (
                      <div key={d.id} className="p-3 rounded-lg border border-dashed hover:border-solid transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{d.credor}</p>
                            <p className="text-xs text-muted-foreground">{d.dataInicio} → {d.dataFim || "Indefinido"}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-sm text-red-600">{fmt(d.saldoRestante)}</p>
                            <p className="text-xs text-muted-foreground">Parcela: {fmt(d.valorParcela)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={pct} className="h-2 flex-1" />
                          <span className="text-xs font-medium min-w-[60px] text-right">{d.parcPagas}/{d.parcTotal} ({pct}%)</span>
                          <Badge variant={d.pagoEsteMes ? "default" : "secondary"} className="text-[10px]">{d.pagoEsteMes ? "Pago" : "Pendente"}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Dividas — Saldo por Credor</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.dividasList} margin={{ left: 20 }}>
                    <XAxis dataKey="credor" fontSize={10} angle={-30} textAnchor="end" height={80} tickLine={false} />
                    <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} fontSize={11} />
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                    <Legend />
                    <Bar dataKey="saldoRestante" name="Saldo Restante" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Analise ── */}
          <TabsContent value="analise" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Previsao por Categoria</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={previsaoPorCategoria} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`} fontSize={11} />
                      <YAxis type="category" dataKey="categoria" width={130} fontSize={11} tickLine={false} />
                      <Tooltip formatter={(v) => fmt(Number(v))} />
                      <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                        {previsaoPorCategoria.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Dividas — Saldo por Credor</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.dividasList} margin={{ left: 20 }}>
                      <XAxis dataKey="credor" fontSize={10} angle={-30} textAnchor="end" height={80} tickLine={false} />
                      <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} fontSize={11} />
                      <Tooltip formatter={(v) => fmt(Number(v))} />
                      <Bar dataKey="saldoRestante" name="Saldo Restante" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Previsao por Tipo</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={previsaoPorTipo} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="valor" nameKey="tipo"
                      label={(props: PieLabelRenderProps) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false} fontSize={11}>
                      {previsaoPorTipo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Dados live da planilha Google Sheets — Atualizado: {updatedAt ? new Date(updatedAt).toLocaleString("pt-BR") : "—"}
        </div>
      </footer>
    </div>
  );
}
