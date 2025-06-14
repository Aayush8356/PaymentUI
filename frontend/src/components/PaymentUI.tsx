import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Globe,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export interface PaymentMethod {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'international'
}

export interface PaymentUIProps {
  amount: number
  currency?: string
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  className?: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, RuPay',
    type: 'card'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Pay with any UPI app',
    type: 'upi'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building2,
    description: 'All major banks',
    type: 'netbanking'
  },
  {
    id: 'wallet',
    name: 'Wallets',
    icon: Wallet,
    description: 'Paytm, PhonePe, Amazon Pay',
    type: 'wallet'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: Globe,
    description: 'International payments',
    type: 'international'
  }
]

export const PaymentUI: React.FC<PaymentUIProps> = ({
  amount,
  currency = 'INR',
  onSuccess,
  onError,
  className
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [step, setStep] = useState<'select' | 'form' | 'processing' | 'success' | 'error'>('select')
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    bankName: '',
    walletType: ''
  })

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')
    
    try {
      // Prepare metadata based on payment method
      let metadata = {}
      
      if (selectedMethod === 'card') {
        metadata = {
          card_last_four: formData.cardNumber.slice(-4),
          card_type: 'visa' // This would normally be detected
        }
      } else if (selectedMethod === 'upi') {
        metadata = { upi_id: formData.upiId }
      } else if (selectedMethod === 'netbanking') {
        metadata = { bank_name: formData.bankName }
      } else if (selectedMethod === 'wallet') {
        metadata = { wallet_type: formData.walletType }
      } else if (selectedMethod === 'paypal') {
        metadata = { paypal_email: 'user@example.com' }
      }

      // Make API call to process payment
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/transactions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          payment_method: selectedMethod,
          metadata
        }),
      })

      const result = await response.json()

      if (result.success) {
        setStep('success')
        onSuccess?.(result.data)
      } else {
        setStep('error')
        onError?.({ message: result.message || 'Payment failed. Please try again.' })
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      setStep('error')
      onError?.({ message: 'Network error. Please check your connection and try again.' })
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <Card className="glass-strong shadow-2xl border border-white/20 backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent">
        <CardHeader className="text-center bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-t-lg border-b border-white/10">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            💳 Payment
          </CardTitle>
          <CardDescription className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {formatAmount(amount, currency)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">Choose Payment Method</h3>
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="glass"
                        className="w-full justify-start h-auto p-5 bg-gradient-to-r from-white/5 via-white/10 to-white/5 hover:from-white/10 hover:via-white/15 hover:to-white/10 border border-white/20 hover:border-white/30 transition-all duration-300"
                        onClick={() => handleMethodSelect(method.id)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-4">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-white">{method.name}</div>
                          <div className="text-sm text-gray-300">{method.description}</div>
                        </div>
                      </Button>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {step === 'form' && selectedMethodData && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <Button
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-medium"
                    onClick={() => setStep('select')}
                  >
                    ← Back
                  </Button>
                  <div className="ml-4 flex items-center bg-gradient-to-r from-white/5 to-white/10 px-4 py-2 rounded-lg border border-white/20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-3">
                      <selectedMethodData.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-semibold">{selectedMethodData.name}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedMethod === 'card' && (
                    <>
                      <Input
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                          required
                        />
                        <Input
                          placeholder="CVV"
                          type="password"
                          value={formData.cvv}
                          onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                          required
                        />
                      </div>
                      <Input
                        placeholder="Cardholder Name"
                        value={formData.cardName}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                        required
                      />
                    </>
                  )}

                  {selectedMethod === 'upi' && (
                    <Input
                      placeholder="Enter UPI ID (example@upi)"
                      value={formData.upiId}
                      onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                      required
                    />
                  )}

                  {selectedMethod === 'netbanking' && (
                    <select
                      className="w-full h-10 rounded-md glass text-white px-3 py-2 border border-white/20 focus:border-white/40"
                      value={formData.bankName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                      required
                    >
                      <option value="">Select Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  )}

                  {selectedMethod === 'wallet' && (
                    <select
                      className="w-full h-10 rounded-md glass text-white px-3 py-2 border border-white/20 focus:border-white/40"
                      value={formData.walletType}
                      onChange={(e) => setFormData(prev => ({ ...prev, walletType: e.target.value }))}
                      required
                    >
                      <option value="">Select Wallet</option>
                      <option value="paytm">Paytm</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="amazonpay">Amazon Pay</option>
                      <option value="googlepay">Google Pay</option>
                    </select>
                  )}

                  <Button
                    type="submit"
                    variant="glass"
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold text-lg shadow-lg border-0 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Pay {formatAmount(amount, currency)}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-transparent bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-500 rounded-full mx-auto mb-4 relative"
                >
                  <div className="absolute inset-1 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-full"></div>
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Processing Payment</h3>
                <p className="text-gray-300">Please wait while we securely process your payment...</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">Payment Successful! ✨</h3>
                <p className="text-gray-300 mb-4">Your payment has been processed successfully and securely.</p>
                <Button
                  variant="glass"
                  onClick={() => {
                    setStep('select')
                    setSelectedMethod('')
                    setFormData({
                      cardNumber: '',
                      expiryDate: '',
                      cvv: '',
                      cardName: '',
                      upiId: '',
                      bankName: '',
                      walletType: ''
                    })
                  }}
                >
                  Make Another Payment
                </Button>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">Payment Failed</h3>
                <p className="text-gray-300 mb-4">There was an error processing your payment. Please try again.</p>
                <Button
                  variant="glass"
                  onClick={() => setStep('form')}
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}