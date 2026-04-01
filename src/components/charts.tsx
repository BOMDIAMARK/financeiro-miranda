"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPrevisaoPorCategoria,
  getPrevisaoPorTipo,
  getDividasPorCredor,
  formatCurrency,
} from "@/lib/data";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type PieLabelRenderProps,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#ef4444",
  "#84cc16",
  "#6366f1",
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { categoria?: string; credor?: string; tipo?: string } }>;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium">
          {payload[0].payload.categoria ||
            payload[0].payload.credor ||
            payload[0].payload.tipo}
        </p>
        <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export function PrevisaoPorCategoriaChart() {
  const data = getPrevisaoPorCategoria();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Previsao por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`}
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="categoria"
              width={130}
              fontSize={11}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PrevisaoPorTipoChart() {
  const data = getPrevisaoPorTipo();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Previsao por Tipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="valor"
              nameKey="tipo"
              label={(props: PieLabelRenderProps) =>
                `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
              fontSize={11}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DividasPorCredorChart() {
  const data = getDividasPorCredor();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Dividas — Saldo por Credor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ left: 20 }}>
            <XAxis
              dataKey="credor"
              fontSize={10}
              angle={-30}
              textAnchor="end"
              height={80}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              fontSize={11}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="saldoRestante"
              name="Saldo Restante"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
