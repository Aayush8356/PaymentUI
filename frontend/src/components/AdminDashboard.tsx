import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Activity,
  LogOut,
  RefreshCw,
  Calendar,
  CreditCard
} from 'lucide-react';
import { analyticsAPI } from '../lib/api';
import { TransactionTable } from './TransactionTable';
import { AnalyticsCharts } from './AnalyticsCharts';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [overview, setOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics'>('overview');

  const fetchOverview = async () => {
    try {
      const response = await analyticsAPI.getOverview();
      setOverview(response.data.data);
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchOverview();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              {description && (
                <p className="text-gray-400 text-xs mt-1">{description}</p>
              )}
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          {trend && (
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative">
      {/* User info and actions */}
      <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <p className="text-gray-300">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="glass"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="glass"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-1 mb-6 border border-white/20 shadow-lg">
          <nav className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-[1.01]'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            {overview && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(overview.totalRevenue)}
                  icon={DollarSign}
                  description="All time revenue"
                />
                <StatCard
                  title="Total Transactions"
                  value={overview.totalTransactions}
                  icon={Activity}
                  description="All time transactions"
                />
                <StatCard
                  title="Today's Revenue"
                  value={formatCurrency(overview.todayRevenue)}
                  icon={Calendar}
                  description="Revenue for today"
                />
                <StatCard
                  title="Success Rate"
                  value={`${overview.successRate}%`}
                  icon={TrendingUp}
                  description="Payment success rate"
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-300">
                    Latest transaction overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {overview && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Today's Transactions</span>
                        <span className="text-white font-semibold">{overview.todayTransactions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Successful Transactions</span>
                        <span className="text-green-400 font-semibold">{overview.successfulTransactions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Success Rate</span>
                        <span className="text-blue-400 font-semibold">{overview.successRate}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                  <CardDescription className="text-gray-300">
                    Payment system health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">API Status</span>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mr-3 shadow-sm"></div>
                        <span className="text-green-400">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Database</span>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mr-3 shadow-sm"></div>
                        <span className="text-green-400">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Last Updated</span>
                      <span className="text-white">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && <TransactionTable />}
        {activeTab === 'analytics' && <AnalyticsCharts />}
      </div>
    </div>
  );
};