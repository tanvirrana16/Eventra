import { useState } from 'react';
import { CreditCard, Search, DollarSign, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';

export default function PaymentHistory({ payments = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = payments.filter(p => 
    p.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.registration_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaid = payments
    .filter(p => p.payment_status === 'paid')
    .reduce((sum, p) => sum + p.payment_amount, 0);

  return (
    <div className="space-y-8 animate-fade-in font-outfit select-none text-left">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Payment & Billing History</h2>
        <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
          Review details of registrations, payment receipts, and transaction records.
        </p>
      </div>

      {/* Analytics Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Spend card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-[#2E6F40] rounded-2xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Investment</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">${totalPaid.toFixed(2)} USD</p>
          </div>
        </div>

        {/* Paid Tickets Count card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paid Event Passes</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">
              {payments.filter(p => p.payment_status === 'paid').length} Tickets
            </p>
          </div>
        </div>

        {/* Secure Gateways verified indicator */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billing Gateway</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Verified & 100% Encrypted</p>
          </div>
        </div>

      </div>

      {/* Control Actions & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
        
        {/* Search */}
        <div className="relative group max-w-md">
          <input 
            type="text" 
            placeholder="Search by event title, transaction ID, or registration code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
        </div>

        {/* Transactions log table */}
        <div className="overflow-x-auto">
          {filteredPayments.length > 0 ? (
            <table className="w-full border-collapse text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="pb-3 px-4">Event Description</th>
                  <th className="pb-3 px-4">Transaction ID</th>
                  <th className="pb-3 px-4">Gateway</th>
                  <th className="pb-3 px-4">Charge Amount</th>
                  <th className="pb-3 px-4">Billing Date</th>
                  <th className="pb-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-extrabold text-slate-800 text-sm">{p.event_title}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">Code: {p.registration_code}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      {p.transaction_id}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-black uppercase ${
                        p.payment_method === 'bKash' ? 'bg-pink-50 text-pink-700 border border-pink-100' :
                        p.payment_method === 'Nagad' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {p.payment_method}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-black text-slate-800 text-sm">
                      ${p.payment_amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium">
                      {p.payment_date}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        p.payment_status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                        <span>{p.payment_status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-2.5">
              <CreditCard className="h-8 w-8 text-slate-300" />
              <p>No billing logs found.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
