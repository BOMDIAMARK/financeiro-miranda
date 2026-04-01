// Dados financeiros — Familia Miranda — Abril 2026

export interface DashboardSummary {
  entradas: number;
  saidasReais: number;
  transferencias: number;
  saldoMes: number;
  dividas: number;
  percentComprometida: number;
  previstoMes: number;
  faltaPagar: number;
  saldoProjetado: number;
}

export interface ResponsavelResumo {
  nome: string;
  cor: string;
  entradas: number;
  saidas: number;
  transferencias: number;
  saldo: number;
  transacoes: number;
}

export interface CategoriaGasto {
  categoria: string;
  total: number;
  percentual: number;
  quantidade: number;
  marcos: number;
  kamila: number;
}

export interface PrevisaoItem {
  id: number;
  dataPrevista: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  valor: number;
  responsavel: string;
  status: "pendente" | "pago";
  tipo: string;
  observacoes: string;
}

export interface DividaItem {
  id: number;
  credor: string;
  valorTotal: number;
  parcTotal: number;
  valorParcela: number;
  status: string;
  dataInicio: string;
  dataFim: string;
  parcPagas: number;
  saldoRestante: number;
  pagoEsteMes: boolean;
}

export const dashboardSummary: DashboardSummary = {
  entradas: 0,
  saidasReais: 0,
  transferencias: 0,
  saldoMes: 0,
  dividas: 51990.2,
  percentComprometida: 0,
  previstoMes: 10323.73,
  faltaPagar: 10323.73,
  saldoProjetado: -10323.73,
};

export const responsaveis: ResponsavelResumo[] = [
  {
    nome: "Marcos",
    cor: "#3b82f6",
    entradas: 0,
    saidas: 0,
    transferencias: 0,
    saldo: 0,
    transacoes: 0,
  },
  {
    nome: "Kamila",
    cor: "#ec4899",
    entradas: 0,
    saidas: 0,
    transferencias: 0,
    saldo: 0,
    transacoes: 0,
  },
];

export const categorias: CategoriaGasto[] = [
  { categoria: "Alimentacao", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Moradia", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Carro", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Transporte", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Saude", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Educacao", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Lazer/Entretenimento", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Internet/Telefone", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Assinaturas", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Roupas/Calcados", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Impostos/Taxas", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Igreja/Religiao", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Filhos", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Compras Pessoais", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Dividas/Emprestimos", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Servicos Profissionais", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Servicos Digitais", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Pagamentos Terceiros", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
  { categoria: "Outros", total: 0, percentual: 0, quantidade: 0, marcos: 0, kamila: 0 },
];

export const previsoes: PrevisaoItem[] = [
  { id: 1, dataPrevista: "05/04/2026", categoria: "Saude", subcategoria: "Psicologa", descricao: "Psicologa Teresa — saldo marco", valor: 180, responsavel: "", status: "pendente", tipo: "Atrasado Mes Anterior", observacoes: "Faltou R$180 de marco" },
  { id: 2, dataPrevista: "20/04/2026", categoria: "Internet/Telefone", subcategoria: "Diversos", descricao: "Internet — conta atrasada marco", valor: 286.01, responsavel: "", status: "pendente", tipo: "Atrasado Mes Anterior", observacoes: "Mesma operadora" },
  { id: 3, dataPrevista: "20/04/2026", categoria: "Saude", subcategoria: "Psicologa", descricao: "Psicologa Teresa — sessao 1/3", valor: 190, responsavel: "", status: "pendente", tipo: "Fixo Recorrente", observacoes: "3 sessoes em abril" },
  { id: 4, dataPrevista: "20/04/2026", categoria: "Saude", subcategoria: "Psicologa", descricao: "Psicologa Teresa — sessao 2/3", valor: 190, responsavel: "", status: "pendente", tipo: "Fixo Recorrente", observacoes: "" },
  { id: 5, dataPrevista: "20/04/2026", categoria: "Saude", subcategoria: "Psicologa", descricao: "Psicologa Teresa — sessao 3/3", valor: 190, responsavel: "", status: "pendente", tipo: "Fixo Recorrente", observacoes: "" },
  { id: 6, dataPrevista: "20/04/2026", categoria: "Internet/Telefone", subcategoria: "Diversos", descricao: "Internet — conta abril", valor: 286.01, responsavel: "", status: "pendente", tipo: "Fixo Recorrente", observacoes: "Usando valor de marco como ref." },
  { id: 7, dataPrevista: "20/04/2026", categoria: "Moradia", subcategoria: "Aluguel", descricao: "Aluguel — abril", valor: 2500, responsavel: "", status: "pendente", tipo: "Fixo Recorrente", observacoes: "" },
  { id: 8, dataPrevista: "", categoria: "Saude", subcategoria: "Academia", descricao: "Total Pass — academia", valor: 120, responsavel: "", status: "pendente", tipo: "Fixo Recorrente", observacoes: "" },
  { id: 9, dataPrevista: "", categoria: "Saude", subcategoria: "Personal", descricao: "Personal trainer", valor: 180, responsavel: "", status: "pendente", tipo: "Fixo Recorrente", observacoes: "" },
  { id: 10, dataPrevista: "", categoria: "Carro", subcategoria: "Financiamento", descricao: "Parcela Celta", valor: 1500, responsavel: "", status: "pendente", tipo: "Parcelamento", observacoes: "" },
  { id: 11, dataPrevista: "", categoria: "Dividas/Emprestimos", subcategoria: "Parcela Divida", descricao: "Computador — Cartao Deliane", valor: 1176, responsavel: "", status: "pendente", tipo: "Parcelamento", observacoes: "" },
  { id: 12, dataPrevista: "", categoria: "Carro", subcategoria: "Seguro", descricao: "Seguro Celta 2025", valor: 244.23, responsavel: "", status: "pendente", tipo: "Parcelamento", observacoes: "" },
  { id: 13, dataPrevista: "", categoria: "Carro", subcategoria: "Seguro", descricao: "Seguro Celta 2026", valor: 180.82, responsavel: "", status: "pendente", tipo: "Parcelamento", observacoes: "" },
  { id: 14, dataPrevista: "", categoria: "Dividas/Emprestimos", subcategoria: "Emprestimo", descricao: "Emprestimo Luzia", valor: 1600.66, responsavel: "", status: "pendente", tipo: "Parcelamento", observacoes: "" },
  { id: 15, dataPrevista: "", categoria: "Dividas/Emprestimos", subcategoria: "Emprestimo", descricao: "Emprestimo Luzia 2", valor: 1000, responsavel: "", status: "pendente", tipo: "Parcelamento", observacoes: "" },
  { id: 16, dataPrevista: "", categoria: "Dividas/Emprestimos", subcategoria: "Parcela Divida", descricao: "Junior (Crewative)", valor: 500, responsavel: "", status: "pendente", tipo: "Parcelamento", observacoes: "" },
];

export const dividas: DividaItem[] = [
  { id: 1, credor: "Financiamento Celta", valorTotal: 36000, parcTotal: 24, valorParcela: 1500, status: "Parcial", dataInicio: "05/03/2025", dataFim: "20/11/2027", parcPagas: 4, saldoRestante: 30000, pagoEsteMes: false },
  { id: 2, credor: "Computador — Cartao Deliane", valorTotal: 11760, parcTotal: 10, valorParcela: 1176, status: "Parcial", dataInicio: "19/11/2025", dataFim: "20/08/2026", parcPagas: 4, saldoRestante: 7056, pagoEsteMes: false },
  { id: 3, credor: "Seguro Celta 2025", valorTotal: 2930.76, parcTotal: 12, valorParcela: 244.23, status: "Parcial", dataInicio: "05/03/2025", dataFim: "05/10/2026", parcPagas: 4, saldoRestante: 1953.84, pagoEsteMes: false },
  { id: 4, credor: "Seguro Celta 2026", valorTotal: 2169.84, parcTotal: 12, valorParcela: 180.82, status: "Parcial", dataInicio: "21/02/2026", dataFim: "21/01/2027", parcPagas: 1, saldoRestante: 1989.02, pagoEsteMes: false },
  { id: 5, credor: "Emprestimo Luzia", valorTotal: 4802, parcTotal: 3, valorParcela: 1600.66, status: "Parcial", dataInicio: "10/02/2026", dataFim: "10/04/2026", parcPagas: 1, saldoRestante: 3201.34, pagoEsteMes: false },
  { id: 6, credor: "Emprestimo Luzia 2", valorTotal: 2790, parcTotal: 2, valorParcela: 1000, status: "Parcial", dataInicio: "08/03/2026", dataFim: "05/04/2026", parcPagas: 1, saldoRestante: 1790, pagoEsteMes: false },
  { id: 7, credor: "Junior (Crewative)", valorTotal: 4000, parcTotal: 8, valorParcela: 500, status: "Parcial", dataInicio: "09/10/2025", dataFim: "20/05/2026", parcPagas: 5, saldoRestante: 1500, pagoEsteMes: false },
  { id: 8, credor: "Kayque (Crewative)", valorTotal: 5000, parcTotal: 10, valorParcela: 500, status: "Parcial", dataInicio: "09/10/2025", dataFim: "", parcPagas: 1, saldoRestante: 4500, pagoEsteMes: false },
];

// Agrupamento de previsoes por categoria para grafico
export function getPrevisaoPorCategoria() {
  const map = new Map<string, number>();
  previsoes.forEach((p) => {
    const current = map.get(p.categoria) || 0;
    map.set(p.categoria, current + p.valor);
  });
  return Array.from(map.entries())
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);
}

// Agrupamento de previsoes por tipo
export function getPrevisaoPorTipo() {
  const map = new Map<string, number>();
  previsoes.forEach((p) => {
    const current = map.get(p.tipo) || 0;
    map.set(p.tipo, current + p.valor);
  });
  return Array.from(map.entries())
    .map(([tipo, valor]) => ({ tipo, valor }))
    .sort((a, b) => b.valor - a.valor);
}

// Total dividas por credor para pie chart
export function getDividasPorCredor() {
  return dividas.map((d) => ({
    credor: d.credor,
    saldoRestante: d.saldoRestante,
    percentPago: Math.round((d.parcPagas / d.parcTotal) * 100),
  }));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
