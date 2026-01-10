import React, { useEffect, useRef, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import Chart from 'chart.js/auto';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstanceRef = useRef<Chart | null>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartInstanceRef = useRef<Chart | null>(null);
  const { t } = useLanguage();

  const hasExpenses = useMemo(() => transactions.some(t => t.type === TransactionType.EXPENSE), [transactions]);

  useEffect(() => {
    Chart.defaults.color = '#6b7280';
    Chart.defaults.borderColor = '#e5e7eb';
    Chart.defaults.font.family = 'Inter, sans-serif';

    if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();
    if (doughnutChartInstanceRef.current) doughnutChartInstanceRef.current.destroy();

    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

    if (barChartRef.current && expenseTransactions.length > 0) {
      const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
      }).reverse();

      const dailyTotals = last7Days.map(dateStr => 
        expenseTransactions.filter(t => t.date.startsWith(dateStr)).reduce((acc, t) => acc + t.amount, 0)
      );
      
      const barCtx = barChartRef.current.getContext('2d');
      if (barCtx) {
        barChartInstanceRef.current = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: last7Days.map(d => new Date(d).toLocaleDateString(undefined, { weekday: 'short' })),
            datasets: [{
              label: t('analytics.dailyExpense'), data: dailyTotals,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1, borderRadius: 8,
              hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
            }]
          },
          options: {
              responsive: true, 
              maintainAspectRatio: false, // Critical for mobile
              plugins: { legend: { display: false } },
              scales: { 
                y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { font: { size: 10 } } }, 
                x: { grid: { display: false }, ticks: { font: { size: 10 } } } 
              }
          }
        });
      }
    }

    if (doughnutChartRef.current && expenseTransactions.length > 0) {
      const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
        const localizedCategory = t(`categories.${transaction.category}`);
        acc[localizedCategory] = (acc[localizedCategory] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

      const doughnutCtx = doughnutChartRef.current.getContext('2d');
      if (doughnutCtx) {
        doughnutChartInstanceRef.current = new Chart(doughnutCtx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
              data: Object.values(categoryTotals),
              backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'],
              borderColor: '#ffffff',
              borderWidth: 4,
              hoverOffset: 8,
            }]
          },
          options: {
            responsive: true, 
            maintainAspectRatio: false, // Critical for mobile
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 8, padding: 10, font: { size: 10 } } },
              tooltip: { callbacks: { label: (c) => `${c.label}: ${new Intl.NumberFormat().format(c.raw as number)}` } }
            },
            cutout: '70%',
          }
        });
      }
    }
    
    return () => {
        if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();
        if (doughnutChartInstanceRef.current) doughnutChartInstanceRef.current.destroy();
    };
  }, [transactions, t]);
  
  if (transactions.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <i className="fa-solid fa-chart-line fa-3x mb-4 opacity-20"></i>
      <p>{t('analytics.noExpenseData')}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <section>
        <h3 className="text-lg font-bold text-[#1A1C2E] px-2 mb-4">{t('analytics.spendAnalysis')}</h3>
        <div className="neumorphic p-6 h-[280px]">
          {hasExpenses ? <canvas ref={barChartRef}></canvas> : <div className="h-full flex items-center justify-center text-gray-400 text-sm">{t('analytics.noExpenseData')}</div>}
        </div>
      </section>
      
      {hasExpenses && (
        <section>
          <h3 className="text-lg font-bold text-[#1A1C2E] px-2 mb-4">{t('analytics.categoryBreakdown')}</h3>
          <div className="neumorphic p-6 h-[340px]">
            <canvas ref={doughnutChartRef}></canvas>
          </div>
        </section>
      )}
    </div>
  );
};

export default Analytics;