import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { analyticsAPI } from '../lib/api';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export const AnalyticsCharts: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [dailyTransactions, setDailyTransactions] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [paymentMethodsRes, dailyTransactionsRes, statusDistributionRes] = await Promise.all([
        analyticsAPI.getPaymentMethods(),
        analyticsAPI.getDailyTransactions(),
        analyticsAPI.getStatusDistribution()
      ]);

      if (paymentMethodsRes.data.success) {
        setPaymentMethods(paymentMethodsRes.data.data);
      }

      if (dailyTransactionsRes.data.success) {
        setDailyTransactions(dailyTransactionsRes.data.data.slice(0, 15).reverse()); // Last 15 days
      }

      if (statusDistributionRes.data.success) {
        setStatusDistribution(statusDistributionRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPaymentMethod = (method: string) => {
    const methods: { [key: string]: string } = {
      'card': 'Card',
      'upi': 'UPI',
      'netbanking': 'Net Banking',
      'wallet': 'Wallet',
      'paypal': 'PayPal'
    };
    return methods[method] || method;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong p-3 rounded-lg border border-white/20">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-300 text-sm">
              {entry.name}: {entry.name.includes('Revenue') ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
        />
        <p className="text-gray-300 ml-3">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <Button
          variant="glass"
          onClick={fetchAnalytics}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Payment Methods Chart */}
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="text-white">Payment Method Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${formatPaymentMethod(name)} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-white">{formatPaymentMethod(method.method)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{method.count} transactions</div>
                    <div className="text-gray-400 text-sm">{formatCurrency(method.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Transactions Chart */}
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="text-white">Daily Transactions & Revenue (Last 15 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyTransactions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value: any) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis yAxisId="left" tick={{ fill: '#9CA3AF' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="transactions" fill="#3B82F6" name="Transactions" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="text-white">Transaction Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="status" 
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value: any) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#8B5CF6" name="Transaction Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="text-white">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusDistribution.map((status) => {
                const percentage = statusDistribution.reduce((acc, curr) => acc + curr.count, 0) > 0
                  ? (status.count / statusDistribution.reduce((acc, curr) => acc + curr.count, 0) * 100).toFixed(1)
                  : 0;
                
                const statusColors: { [key: string]: string } = {
                  completed: 'bg-green-500',
                  pending: 'bg-yellow-500',
                  failed: 'bg-red-500'
                };

                return (
                  <div key={status.status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white capitalize">{status.status}</span>
                      <span className="text-gray-300">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status.status] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{status.count} transactions</span>
                      <span>{formatCurrency(status.totalAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};