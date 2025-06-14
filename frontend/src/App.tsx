import React, { useState } from 'react';
import { PaymentUI } from './components/PaymentUI';
import { AdminApp } from './components/AdminApp';
import { Button } from './components/ui/button';
import { Settings, ArrowLeft } from 'lucide-react';

type ViewMode = 'demo' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('demo');

  const handlePaymentSuccess = (data: any) => {
    console.log('Payment successful:', data);
    alert(`Payment successful! Transaction ID: ${data.transaction_id || data.transactionId}`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error.message}`);
  };

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-b border-white/20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Button
                variant="glass"
                onClick={() => setCurrentView('demo')}
                className="flex items-center bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 backdrop-blur-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2 text-cyan-400" />
                <span className="text-white font-medium">Back to Demo</span>
              </Button>
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">🏢 Admin Dashboard</h1>
              </div>
              <div className="w-32"></div> {/* Spacer for balance */}
            </div>
          </div>
        </div>
        <AdminApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div />
            <Button
              variant="glass"
              onClick={() => setCurrentView('admin')}
              className="flex items-center bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 backdrop-blur-xl"
            >
              <Settings className="w-4 h-4 mr-2 text-cyan-400" />
              <span className="text-white font-medium">Admin Dashboard</span>
            </Button>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
            💳 Payment UI
          </h1>
          <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
            <p className="text-xl text-gray-200 mb-3 font-medium">
              Beautiful glassmorphism payment interface with complete admin dashboard
            </p>
            <p className="text-gray-300">
              Built with React, TypeScript, TailwindCSS, and Framer Motion
            </p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Payment Component */}
          <div className="lg:col-span-1">
            <PaymentUI
              amount={1}
              currency="INR"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
          
          {/* Features */}
          <div className="lg:col-span-2 space-y-6 relative z-10">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">✨ Payment Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Glassmorphism UI design</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">All major payment methods</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Framer Motion animations</span>
                  </div>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Fully responsive design</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">TypeScript support</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Real-time validation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">📊 Admin Dashboard</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Transaction monitoring</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Advanced analytics</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Interactive charts</span>
                  </div>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Revenue tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Secure authentication</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full mr-4 shadow-lg"></div>
                    <span className="text-gray-200 font-medium">Export capabilities</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">💻 Usage Example</h3>
              <pre className="text-sm text-gray-200 overflow-x-auto bg-gradient-to-br from-black/40 to-black/20 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
{`import { PaymentUI } from '@/components/PaymentUI'

function App() {
  return (
    <PaymentUI
      amount={1}
      currency="INR"
      onSuccess={(data) => console.log(data)}
      onError={(error) => console.error(error)}
    />
  )
}`}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12 relative z-10">
          <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
            <p className="text-gray-300 font-medium">
              🎆 Try the payment component above or access the admin dashboard to see transaction analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
