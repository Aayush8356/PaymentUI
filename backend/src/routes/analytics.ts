import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Get dashboard overview analytics
router.get('/overview', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Get total transactions
    const totalTransactionsResult = await pool.query(
      'SELECT COUNT(*) as total FROM transactions'
    );

    // Get successful transactions
    const successfulTransactionsResult = await pool.query(
      'SELECT COUNT(*) as total FROM transactions WHERE status = $1',
      ['completed']
    );

    // Get total revenue
    const totalRevenueResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE status = $1',
      ['completed']
    );

    // Get today's transactions
    const todayTransactionsResult = await pool.query(
      `SELECT COUNT(*) as total FROM transactions 
       WHERE DATE(created_at) = CURRENT_DATE`
    );

    // Get today's revenue
    const todayRevenueResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
       WHERE DATE(created_at) = CURRENT_DATE AND status = $1`,
      ['completed']
    );

    res.json({
      success: true,
      message: 'Overview analytics retrieved successfully',
      data: {
        totalTransactions: parseInt(totalTransactionsResult.rows[0].total),
        successfulTransactions: parseInt(successfulTransactionsResult.rows[0].total),
        totalRevenue: parseFloat(totalRevenueResult.rows[0].total),
        todayTransactions: parseInt(todayTransactionsResult.rows[0].total),
        todayRevenue: parseFloat(todayRevenueResult.rows[0].total),
        successRate: totalTransactionsResult.rows[0].total > 0 
          ? (successfulTransactionsResult.rows[0].total / totalTransactionsResult.rows[0].total * 100).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    console.error('Overview analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment method distribution
router.get('/payment-methods', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as revenue
       FROM transactions 
       GROUP BY payment_method 
       ORDER BY count DESC`
    );

    res.json({
      success: true,
      message: 'Payment method analytics retrieved successfully',
      data: result.rows.map(row => ({
        method: row.payment_method,
        count: parseInt(row.count),
        revenue: parseFloat(row.revenue)
      }))
    });
  } catch (error) {
    console.error('Payment method analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get daily transactions for the last 30 days
router.get('/daily-transactions', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as transactions,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as revenue,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_transactions
       FROM transactions 
       WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`
    );

    res.json({
      success: true,
      message: 'Daily transaction analytics retrieved successfully',
      data: result.rows.map(row => ({
        date: row.date,
        transactions: parseInt(row.transactions),
        revenue: parseFloat(row.revenue),
        successfulTransactions: parseInt(row.successful_transactions)
      }))
    });
  } catch (error) {
    console.error('Daily transaction analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get hourly transactions for today
router.get('/hourly-transactions', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as transactions,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as revenue
       FROM transactions 
       WHERE DATE(created_at) = CURRENT_DATE
       GROUP BY EXTRACT(HOUR FROM created_at) 
       ORDER BY hour`
    );

    // Fill in missing hours with 0 values
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const existingData = result.rows.find(row => parseInt(row.hour) === hour);
      return {
        hour,
        transactions: existingData ? parseInt(existingData.transactions) : 0,
        revenue: existingData ? parseFloat(existingData.revenue) : 0
      };
    });

    res.json({
      success: true,
      message: 'Hourly transaction analytics retrieved successfully',
      data: hourlyData
    });
  } catch (error) {
    console.error('Hourly transaction analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction status distribution
router.get('/status-distribution', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
       FROM transactions 
       GROUP BY status 
       ORDER BY count DESC`
    );

    res.json({
      success: true,
      message: 'Status distribution analytics retrieved successfully',
      data: result.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count),
        totalAmount: parseFloat(row.total_amount)
      }))
    });
  } catch (error) {
    console.error('Status distribution analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;