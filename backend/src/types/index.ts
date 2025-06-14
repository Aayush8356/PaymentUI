export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'paypal';
  transaction_id: string;
  created_at: Date;
  updated_at: Date;
  metadata?: {
    card_last_four?: string;
    upi_id?: string;
    bank_name?: string;
    wallet_type?: string;
  };
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  payment_method: string;
  metadata?: any;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}