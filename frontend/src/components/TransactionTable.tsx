import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Search, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { transactionsAPI } from '../lib/api';
import { format } from 'date-fns';

export const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_method: ''
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await transactionsAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        setPagination(prev => ({
          ...prev,
          ...response.data.data.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case 'failed':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
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

  return (
    <div className="space-y-6">
      <Card className="glass-strong">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-white">Transaction History</CardTitle>
              <p className="text-gray-300 text-sm">
                Manage and monitor all payment transactions
              </p>
            </div>
            <Button variant="glass" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="h-10 rounded-md glass text-white px-3 py-2 border border-white/20 focus:border-white/40"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={filters.payment_method}
              onChange={(e) => handleFilterChange('payment_method', e.target.value)}
              className="h-10 rounded-md glass text-white px-3 py-2 border border-white/20 focus:border-white/40"
            >
              <option value="">All Methods</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
              <option value="paypal">PayPal</option>
            </select>

            <Button
              variant="glass"
              onClick={fetchTransactions}
              disabled={isLoading}
            >
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-300 font-medium py-3 px-2">Transaction ID</th>
                  <th className="text-left text-gray-300 font-medium py-3 px-2">Amount</th>
                  <th className="text-left text-gray-300 font-medium py-3 px-2">Method</th>
                  <th className="text-left text-gray-300 font-medium py-3 px-2">Status</th>
                  <th className="text-left text-gray-300 font-medium py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"
                      />
                      <p className="text-gray-300 mt-2">Loading transactions...</p>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <p className="text-gray-300">No transactions found</p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="text-white text-sm font-mono">
                          {transaction.transaction_id}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-white font-medium">
                          {formatCurrency(parseFloat(transaction.amount))}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {transaction.currency}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-white">
                          {formatPaymentMethod(transaction.payment_method)}
                        </div>
                        {transaction.metadata && (
                          <div className="text-gray-400 text-xs">
                            {transaction.metadata.card_last_four && `****${transaction.metadata.card_last_four}`}
                            {transaction.metadata.upi_id && transaction.metadata.upi_id}
                            {transaction.metadata.bank_name && transaction.metadata.bank_name}
                            {transaction.metadata.wallet_type && transaction.metadata.wallet_type}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={getStatusBadge(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-white text-sm">
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {format(new Date(transaction.created_at), 'HH:mm:ss')}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-gray-300 text-sm">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} transactions
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <span className="text-white text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};