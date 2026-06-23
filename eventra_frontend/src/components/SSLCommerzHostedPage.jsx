import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, Smartphone, ShieldCheck, HelpCircle, 
  ArrowLeft, Lock, Loader2, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { API_BASE_URL } from '../config';

// Custom logos using simple styled SVGs to avoid missing image assets
const VisaLogo = () => (
  <span className="text-blue-800 font-black italic tracking-tighter text-lg select-none">VISA</span>
);
const MastercardLogo = () => (
  <div className="flex items-center -space-x-2 select-none">
    <div className="w-5 h-5 bg-red-500 rounded-full opacity-90"></div>
    <div className="w-5 h-5 bg-amber-500 rounded-full opacity-90"></div>
  </div>
);
const AmexLogo = () => (
  <span className="bg-blue-500 text-white font-extrabold px-1.5 py-0.5 rounded text-[10px] select-none tracking-tight">AMEX</span>
);

export default function SSLCommerzHostedPage() {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tran_id');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [txDetails, setTxDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Navigation tabs: 'cards' | 'mobile' | 'internet'
  const [activeTab, setActiveTab] = useState('cards');
  
  // Inner payment states
  const [selectedBrand, setSelectedBrand] = useState('Visa'); // Visa, MasterCard, bKash, Nagad, etc.
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  
  // Mobile sub-screens: 'number' | 'otp' | 'pin' | 'processing'
  const [mobileStep, setMobileStep] = useState('number');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Conversion rate: 1 USD = 117 BDT
  const conversionRate = 117;

  useEffect(() => {
    if (!tranId) {
      setErrorMsg('Transaction identifier is missing. Please initiate a checkout from Eventra.');
      setIsLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/sslcommerz/details?tran_id=${tranId}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setTxDetails(data);
        } else {
          setErrorMsg(data.message || 'Failed to retrieve transaction details.');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Network connectivity error. Make sure the Laravel backend server is running.');
        setIsLoading(false);
      });
  }, [tranId]);

  const handleCancelPayment = () => {
    if (window.confirm('Are you sure you want to cancel the payment?')) {
      setIsSubmitting(true);
      fetch(`${API_BASE_URL}/sslcommerz/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tran_id: tranId })
      })
        .then(res => res.json())
        .then(data => {
          window.location.href = data.redirect_url || 'http://localhost:5173/dashboard?payment_status=cancelled';
        })
        .catch(() => {
          window.location.href = 'http://localhost:5173/dashboard?payment_status=cancelled';
        });
    }
  };

  const handlePaymentSuccess = (paymentMethod) => {
    setIsSubmitting(true);
    fetch(`${API_BASE_URL}/sslcommerz/success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tran_id: tranId,
        payment_method: paymentMethod
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          window.location.href = data.redirect_url || 'http://localhost:5173/dashboard?payment_status=success';
        } else {
          alert(data.message || 'Payment processing error.');
          setIsSubmitting(false);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Callback notification failed. Check backend endpoint.');
        setIsSubmitting(false);
      });
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
      alert('Please fill out all card fields.');
      return;
    }
    handlePaymentSuccess(selectedBrand);
  };

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (mobileStep === 'number') {
      if (mobileNumber.length < 11) {
        alert('Please enter a valid 11-digit mobile wallet number.');
        return;
      }
      setMobileStep('otp');
    } else if (mobileStep === 'otp') {
      if (otpCode.length < 6) {
        alert('Enter the 6-digit verification code.');
        return;
      }
      setMobileStep('pin');
    } else if (mobileStep === 'pin') {
      if (pinCode.length < 4) {
        alert('Enter a valid account PIN.');
        return;
      }
      setMobileStep('processing');
      setTimeout(() => {
        handlePaymentSuccess(selectedBrand);
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-40 select-none">
        <Loader2 className="h-10 w-10 animate-spin text-[#1b75bb] mb-4" />
        <span className="text-sm text-gray-500 font-bold font-sans">Connecting to SSLCommerz Secure Gateway...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 select-none font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Secure Gateway Error</h3>
          <p className="text-xs text-gray-500 leading-relaxed text-justify">{errorMsg}</p>
          <button 
            onClick={() => window.location.href = 'http://localhost:5173/events'} 
            className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Return to Eventra
          </button>
        </div>
      </div>
    );
  }

  const bdtAmount = (txDetails?.amount ?? 0) * conversionRate;

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans flex items-center justify-center p-2 sm:p-4 select-none">
      
      {/* Main Container */}
      <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row min-h-[580px]">
        
        {/* Left Panel: Transaction Summary */}
        <div className="w-full md:w-[320px] bg-[#1E2A38] text-white p-6 sm:p-8 flex flex-col justify-between text-left">
          
          <div className="space-y-8">
            {/* Header / Security Badge */}
            <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
              <ShieldCheck className="h-7 w-7 text-emerald-400" />
              <div>
                <h2 className="text-lg font-black tracking-tight text-white select-none">SSLCommerz</h2>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Secure Payment</span>
              </div>
            </div>

            {/* Merchant Details */}
            <div className="space-y-4">
              <div>
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Merchant Name</span>
                <span className="text-sm font-extrabold text-white">Eventra Inc. (T Rana)</span>
              </div>

              <div>
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Order/Event</span>
                <span className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug">{txDetails?.event_title}</span>
              </div>

              <div>
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Transaction Code</span>
                <span className="text-xs font-mono text-emerald-300 select-text font-bold">{txDetails?.transaction_id}</span>
              </div>

              <div>
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">User Details</span>
                <span className="text-xs font-bold text-slate-300 block">{txDetails?.user_name}</span>
                <span className="text-[10px] text-slate-400 font-semibold truncate block">{txDetails?.user_email}</span>
              </div>
            </div>
          </div>

          {/* Amount Display */}
          <div className="space-y-4 border-t border-white/10 pt-4 mt-8">
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Payable Charge</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-3xl font-black text-white tracking-tight">৳{bdtAmount.toLocaleString()}</span>
                <span className="text-xs font-extrabold text-[#94a3b8]">BDT</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                Equivalent to: <span className="text-emerald-400 font-bold">${txDetails?.amount} USD</span> ($1 = 117 BDT)
              </span>
            </div>
            
            <button 
              onClick={handleCancelPayment}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-1 py-2 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent hover:bg-rose-600/10 active:scale-[0.98] disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel Payment</span>
            </button>
          </div>

        </div>

        {/* Right Panel: Payment Tabs Options */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8">
          
          {/* SSLCommerz Aggregator tabs */}
          <div className="space-y-6">
            
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => { setActiveTab('cards'); setMobileStep('number'); }}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-1.5 transition-all px-4 cursor-pointer ${
                  activeTab === 'cards' 
                    ? 'border-[#1b75bb] text-[#1b75bb]' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Cards</span>
              </button>
              <button 
                onClick={() => { setActiveTab('mobile'); setSelectedBrand('bKash'); }}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-1.5 transition-all px-4 cursor-pointer ${
                  activeTab === 'mobile' 
                    ? 'border-[#1b75bb] text-[#1b75bb]' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Mobile Banking</span>
              </button>
              <button 
                onClick={() => setActiveTab('internet')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-1.5 transition-all px-4 cursor-pointer ${
                  activeTab === 'internet' 
                    ? 'border-[#1b75bb] text-[#1b75bb]' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* TAB CONTENT: CARDS */}
            {activeTab === 'cards' && (
              <div className="space-y-6 text-left animate-fade-in">
                <div className="flex items-center space-x-4">
                  {[
                    { name: 'Visa', logo: VisaLogo },
                    { name: 'MasterCard', logo: MastercardLogo },
                    { name: 'Amex', logo: AmexLogo }
                  ].map(brand => (
                    <label 
                      key={brand.name}
                      className={`px-4 py-2 border rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                        selectedBrand === brand.name 
                          ? 'border-[#1b75bb] bg-[#1b75bb]/5 ring-1 ring-[#1b75bb]' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="card_brand" 
                        value={brand.name} 
                        checked={selectedBrand === brand.name}
                        onChange={() => setSelectedBrand(brand.name)}
                        className="sr-only" 
                      />
                      <brand.logo />
                    </label>
                  ))}
                </div>

                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4111 2222 3333 4444" 
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)})}
                      className="w-full p-2.5 border border-slate-200 focus:border-[#1b75bb] bg-slate-50 focus:bg-white rounded-xl text-xs font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Name on Card</label>
                    <input 
                      type="text" 
                      placeholder="Tanvir Rana" 
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      className="w-full p-2.5 border border-slate-200 focus:border-[#1b75bb] bg-slate-50 focus:bg-white rounded-xl text-xs font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value.replace(/[^0-9]/g, '').replace(/(.{2})/, '$1/').slice(0, 5)})}
                        className="w-full p-2.5 border border-slate-200 focus:border-[#1b75bb] bg-slate-50 focus:bg-white rounded-xl text-xs font-bold outline-none text-center"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">CVV / CVC</label>
                      <input 
                        type="password" 
                        placeholder="•••" 
                        maxLength="3"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, '')})}
                        className="w-full p-2.5 border border-slate-200 focus:border-[#1b75bb] bg-slate-50 focus:bg-white rounded-xl text-xs font-bold outline-none text-center"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 py-3.5 bg-[#1b75bb] hover:bg-[#155a92] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Processing Pay...</span>
                      </>
                    ) : (
                      <span>Pay ৳{bdtAmount.toLocaleString()} BDT</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: MOBILE BANKING */}
            {activeTab === 'mobile' && (
              <div className="space-y-6 text-left animate-fade-in">
                {/* Brand selection grid */}
                <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-4">
                  {[
                    { id: 'bKash', label: 'bKash', color: 'border-pink-500 text-pink-600 bg-pink-50/50' },
                    { id: 'Nagad', label: 'Nagad', color: 'border-orange-500 text-orange-600 bg-orange-50/50' },
                    { id: 'Rocket', label: 'Rocket', color: 'border-purple-500 text-purple-600 bg-purple-50/50' },
                    { id: 'Upay', label: 'Upay', color: 'border-blue-500 text-blue-600 bg-blue-50/50' }
                  ].map(wallet => (
                    <label 
                      key={wallet.id}
                      className={`p-2.5 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        selectedBrand === wallet.id 
                          ? `${wallet.color.split(' ')[0]} ${wallet.color.split(' ')[2]} ring-1 ${wallet.color.split(' ')[0]}` 
                          : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="mobile_brand" 
                        value={wallet.id} 
                        checked={selectedBrand === wallet.id}
                        onChange={() => { setSelectedBrand(wallet.id); setMobileStep('number'); }}
                        className="sr-only" 
                      />
                      <Smartphone className={`h-5 w-5 mb-1 ${selectedBrand === wallet.id ? wallet.color.split(' ')[1] : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black">{wallet.label}</span>
                    </label>
                  ))}
                </div>

                {/* High Fidelity Simulated Checkout view based on Brand */}
                {selectedBrand === 'bKash' && (
                  <div className="border border-pink-500/20 bg-pink-50/10 rounded-2xl p-4.5 space-y-4">
                    <div className="flex justify-between items-center bg-[#E2125D] p-3 rounded-xl text-white">
                      <span className="text-xs font-black italic tracking-wide">bKash EasyCheckout</span>
                      <span className="text-[10px] font-bold">Charge: ৳{bdtAmount.toLocaleString()} BDT</span>
                    </div>

                    <form onSubmit={handleMobileSubmit} className="space-y-4">
                      {mobileStep === 'number' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black text-pink-700 uppercase tracking-widest mb-1">Enter bKash Number</label>
                            <input 
                              type="text" 
                              placeholder="01XXXXXXXXX" 
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                              className="w-full p-2.5 border border-pink-200 focus:border-[#E2125D] bg-white rounded-xl text-xs font-bold text-center outline-none tracking-widest text-[#E2125D]"
                              required
                            />
                          </div>
                          <p className="text-[9px] text-gray-400 leading-normal">By clicking, you agree to allow bKash to securely process this payment.</p>
                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-[#E2125D] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
                          >
                            Send OTP Code
                          </button>
                        </div>
                      )}

                      {mobileStep === 'otp' && (
                        <div className="space-y-3">
                          <div className="text-[10px] text-slate-500 font-semibold text-center">Simulated OTP dispatch sent to <span className="font-bold text-slate-800">{mobileNumber}</span></div>
                          <div>
                            <label className="block text-[9px] font-black text-pink-700 uppercase tracking-widest mb-1 text-center">Verification Code (OTP)</label>
                            <input 
                              type="text" 
                              placeholder="123456" 
                              maxLength="6"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                              className="w-full p-2.5 border border-pink-200 focus:border-[#E2125D] bg-white rounded-xl text-xs font-bold text-center outline-none tracking-widest text-slate-800"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-[#E2125D] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
                          >
                            Verify Code
                          </button>
                        </div>
                      )}

                      {mobileStep === 'pin' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black text-pink-700 uppercase tracking-widest mb-1 text-center">Enter bKash Account PIN</label>
                            <input 
                              type="password" 
                              placeholder="••••" 
                              maxLength="4"
                              value={pinCode}
                              onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                              className="w-full p-2.5 border border-pink-200 focus:border-[#E2125D] bg-white rounded-xl text-xs font-bold text-center outline-none tracking-widest text-slate-800"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-[#E2125D] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
                          >
                            Confirm Payment
                          </button>
                        </div>
                      )}

                      {mobileStep === 'processing' && (
                        <div className="py-6 flex flex-col justify-center items-center space-y-3.5">
                          <Loader2 className="h-8 w-8 animate-spin text-[#E2125D]" />
                          <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Simulating PIN clearance...</span>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {selectedBrand === 'Nagad' && (
                  <div className="border border-orange-500/20 bg-orange-50/10 rounded-2xl p-4.5 space-y-4">
                    <div className="flex justify-between items-center bg-[#F69220] p-3 rounded-xl text-white">
                      <span className="text-xs font-black italic tracking-wide">Nagad SecurePay</span>
                      <span className="text-[10px] font-bold">Charge: ৳{bdtAmount.toLocaleString()} BDT</span>
                    </div>

                    <form onSubmit={handleMobileSubmit} className="space-y-4">
                      {mobileStep === 'number' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black text-orange-700 uppercase tracking-widest mb-1">Enter Nagad Number</label>
                            <input 
                              type="text" 
                              placeholder="01XXXXXXXXX" 
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                              className="w-full p-2.5 border border-orange-200 focus:border-[#F69220] bg-white rounded-xl text-xs font-bold text-center outline-none tracking-widest text-[#F69220]"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-[#F69220] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                          >
                            Generate OTP
                          </button>
                        </div>
                      )}

                      {mobileStep === 'otp' && (
                        <div className="space-y-3">
                          <div className="text-[10px] text-slate-500 font-semibold text-center">Simulated OTP dispatch sent to <span className="font-bold text-slate-800">{mobileNumber}</span></div>
                          <div>
                            <label className="block text-[9px] font-black text-orange-700 uppercase tracking-widest mb-1 text-center">Verification Code (OTP)</label>
                            <input 
                              type="text" 
                              placeholder="123456" 
                              maxLength="6"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                              className="w-full p-2.5 border border-orange-200 focus:border-[#F69220] bg-white rounded-xl text-xs font-bold text-center outline-none tracking-widest text-slate-800"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-[#F69220] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                          >
                            Verify Code
                          </button>
                        </div>
                      )}

                      {mobileStep === 'pin' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black text-orange-700 uppercase tracking-widest mb-1 text-center">Enter Nagad Account PIN</label>
                            <input 
                              type="password" 
                              placeholder="••••" 
                              maxLength="4"
                              value={pinCode}
                              onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                              className="w-full p-2.5 border border-orange-200 focus:border-[#F69220] bg-white rounded-xl text-xs font-bold text-center outline-none tracking-widest text-slate-800"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-[#F69220] text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                          >
                            Confirm Payment
                          </button>
                        </div>
                      )}

                      {mobileStep === 'processing' && (
                        <div className="py-6 flex flex-col justify-center items-center space-y-3.5">
                          <Loader2 className="h-8 w-8 animate-spin text-[#F69220]" />
                          <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Simulating PIN clearance...</span>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Rocket / Upay (General quick click) */}
                {(selectedBrand === 'Rocket' || selectedBrand === 'Upay') && (
                  <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl space-y-4">
                    <p className="text-xs text-slate-500 leading-normal font-semibold">Simulating {selectedBrand} fast authorization flow. Input account number to proceed.</p>
                    <div>
                      <input 
                        type="text" 
                        placeholder="01XXXXXXXXX" 
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                        className="w-full p-2.5 border border-slate-200 focus:border-[#1b75bb] bg-white rounded-xl text-xs font-bold text-center outline-none tracking-widest"
                      />
                    </div>
                    <button 
                      onClick={() => handlePaymentSuccess(selectedBrand)}
                      disabled={isSubmitting || mobileNumber.length < 11}
                      className="w-full py-2.5 bg-[#1b75bb] hover:bg-[#155a92] text-white text-xs font-black uppercase tracking-wider rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      Authorize Payment
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: NET BANKING */}
            {activeTab === 'internet' && (
              <div className="space-y-4 text-left animate-fade-in">
                <p className="text-xs text-slate-500 leading-normal font-semibold">Select your respective internet banking account to log in and pay:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { name: 'Sonali Bank', desc: 'Sonali e-Wallet Pay' },
                    { name: 'City Bank', desc: 'City Touch Direct Pay' },
                    { name: 'DBBL Nexus', desc: 'Dutch-Bangla Bank Gateway' },
                    { name: 'Islami Bank', desc: 'i-Banking System Pay' }
                  ].map((bank, index) => (
                    <button 
                      key={index}
                      onClick={() => handlePaymentSuccess('Visa')} // Net banking falls back to success validation
                      disabled={isSubmitting}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/30 border border-slate-100 hover:border-emerald-500/25 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 transition-all cursor-pointer text-left disabled:opacity-50"
                    >
                      <div>
                        <span className="block text-slate-900 leading-snug">{bank.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium leading-none">{bank.desc}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Secure Trust Badges */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className="flex items-center space-x-1">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>SSL Secured Connection</span>
            </span>
            <span>PCI-DSS Compliant</span>
          </div>

        </div>

      </div>

    </div>
  );
}
