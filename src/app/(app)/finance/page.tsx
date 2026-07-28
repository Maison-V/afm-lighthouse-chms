import { Wallet, TrendingUp, TrendingDown, HandCoins } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { FinanceChart } from "@/components/finance/finance-chart";
import { BudgetsCard } from "@/components/finance/budgets-card";
import { TransactionsTable } from "@/components/finance/transactions-table";
import { transactions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function FinancePage() {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const tithes = transactions.filter((t) => t.category === "Tithes").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Finance"
        title="Giving and expenses"
        description="A modern accounting view of every offering, tithe, and expense across the church."
        actions={
          <Button variant="gold" className="gap-2">
            <HandCoins className="h-4 w-4" /> Record a gift
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total income" value={formatCurrency(income)} icon={<TrendingUp />} tone="success" index={0} />
        <StatCard label="Total expenses" value={formatCurrency(expenses)} icon={<TrendingDown />} tone="info" index={1} />
        <StatCard label="Net position" value={formatCurrency(income - expenses)} icon={<Wallet />} tone="primary" index={2} />
        <StatCard label="Tithes recorded" value={formatCurrency(tithes)} icon={<HandCoins />} tone="gold" index={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FinanceChart />
        <BudgetsCard />
      </div>

      <TransactionsTable />
    </div>
  );
}
