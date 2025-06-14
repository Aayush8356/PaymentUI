import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { PaymentRequest } from '../types';

const router = Router();

// Create a new transaction (public endpoint for payment processing)
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', payment_method, metadata = {} }: PaymentRequest = req.body;

    if (!amount || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Amount and payment method are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Simulate payment processing (90% success rate)
    const isSuccess = Math.random() > 0.1;
    const status = isSuccess ? 'completed' : 'failed';

    // Insert transaction into database
    const result = await pool.query(
      `INSERT INTO transactions (transaction_id, amount, currency, status, payment_method, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [transactionId, amount, currency, status, payment_method, metadata]
    );

    const transaction = result.rows[0];

    if (isSuccess) {
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          transaction_id: transaction.transaction_id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          payment_method: transaction.payment_method,
          created_at: transaction.created_at
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        data: {
          transaction_id: transaction.transaction_id,
          status: transaction.status
        }
      });
    }
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all transactions (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const payment_method = req.query.payment_method as string;
    const search = req.query.search as string;

    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      conditions.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (payment_method) {
      paramCount++;
      conditions.push(`payment_method = $${paramCount}`);
      values.push(payment_method);
    }

    if (search) {
      paramCount++;
      conditions.push(`transaction_id ILIKE $${paramCount}`);
      values.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM transactions ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get transactions
    paramCount++;
    const dataQuery = `
      SELECT * FROM transactions 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);

    const result = await pool.query(dataQuery, values);

    res.json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions: result.rows,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction by ID
router.get('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 OR transaction_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;