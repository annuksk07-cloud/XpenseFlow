import React, { useEffect, useRef, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import Chart from 'chart.js/auto';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstanceRef = useRef<Chart | null>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartInstanceRef = useRef<Chart | null>(null);

  const hasExpenses = useMemo(() => transactions.some(t => t.type === TransactionType.EXPENSE), [transactions]);

  useEffect(() => {
    // Clean up previous instances
    if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();
    if (doughnutChartInstanceRef.current) doughnutChartInstanceRef.current.destroy();

    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

    // Bar Chart for daily expenses
    if (barChartRef.current && expenseTransactions.length > 0) {
      const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
      }).reverse();

      const dailyTotals = last7Days.map(dateStr => 
        expenseTransactions
          .filter(t => t.date.startsWith(dateStr))
          .reduce((acc, t) => acc + t.amount, 0)
      );
      
      const barCtx = barChartRef.current.getContext('2d');
      if (barCtx) {
        barChartInstanceRef.current = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
              label: 'Daily Expense', data: dailyTotals,
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1, borderRadius: 4,
            }]
          },
          options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, display: false }, x: { grid: { display: false } } }
          }
        });
      }
    }

    // Doughnut Chart for category breakdown
    if (doughnutChartRef.current && expenseTransactions.length > 0) {
      const categoryTotals = expenseTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
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
              borderColor: '#efeeee',
              borderWidth: 4,
              hoverOffset: 8,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw as number)}`
                }
              }
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
  }, [transactions]);
  
  if (transactions.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-4">Spend Analysis</h3>
      <div className="p-6 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] mb-6 h-48">
        {hasExpenses ? (
          <canvas ref={barChartRef}></canvas>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-400 text-sm">No expense data for chart.</div>
        )}
      </div>
      
      {hasExpenses && (
        <>
          <h3 className="text-lg font-bold text-gray-700 px-2 mb-4">Category Breakdown</h3>
          <div className="p-6 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] h-72">
            <canvas ref={doughnutChartRef}></canvas>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;