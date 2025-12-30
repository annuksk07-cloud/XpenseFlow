import React, { useEffect, useRef } from 'react';
import { Transaction, TransactionType } from '../types';
import Chart from 'chart.js/auto';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || transactions.length === 0) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyTotals = last7Days.map(dateStr => 
      transactions
        .filter(t => t.type === TransactionType.EXPENSE && t.date.startsWith(dateStr))
        .reduce((acc, t) => acc + t.amount, 0)
    );

    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
          datasets: [{
            label: 'Daily Expense',
            data: dailyTotals,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, display: false }, x: { grid: { display: false } } }
        }
      });
    }
    
    return () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
    };
  }, [transactions]);
  
  if (transactions.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-4">Spend Analysis</h3>
      <div className="p-6 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] mb-6 h-48">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default Analytics;