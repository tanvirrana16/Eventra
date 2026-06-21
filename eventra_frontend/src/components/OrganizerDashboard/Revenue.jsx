import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function Revenue({ stats, events, participants, analyticsData }) {
  // Hardcoded Accounts Metadata
  const visaAccount = "0338401002885";
  const bkashAccount = "01533138489";

  const totalRevenue = stats?.revenue || 0;
  
  // Calculate average ticket price
  const paidEvents = events?.filter(e => e.ticket_type === 'paid') || [];
  const avgTicketPrice = paidEvents.length > 0
    ? paidEvents.reduce((acc, curr) => acc + curr.ticket_price, 0) / paidEvents.length
    : 0;

  // Mock monthly revenue trends if not returned from analytics API
  const monthlyRevenue = analyticsData?.monthly_revenue || [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mar', revenue: 2400 },
    { month: 'Apr', revenue: 2100 },
    { month: 'May', revenue: 3800 },
    { month: 'Jun', revenue: totalRevenue > 0 ? totalRevenue : 4200 },
  ];

  // Render SVG Line Chart
  const renderLineChart = () => {
    const width = 500;
    const height = 200;
    const padding = 30;

    const maxVal = Math.max(...monthlyRevenue.map(d => d.revenue), 1000);
    const points = monthlyRevenue.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (monthlyRevenue.length - 1);
      const y = height - padding - (d.revenue / maxVal) * (height - 2 * padding);
      return { x, y, label: d.month, value: d.revenue };
    });

    const pathD = points.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, "");

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-emerald-600">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + ratio * (height - 2 * padding);
          return (
            <line 
              key={idx} 
              x1={padding} 
              y1={y} 
              x2={width - padding} 
              y2={y} 
              stroke="#F1F5F9" 
              strokeWidth="1.5" 
            />
          );
        })}

        {/* Path line */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="url(#emeraldGradient)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Dots */}
        {points.map((pt, idx) => (
          <g key={idx} className="group">
            <circle 
              cx={pt.x} 
              cy={pt.y} 
              r="5" 
              fill="#2E6F40" 
              stroke="#FFF" 
              strokeWidth="2" 
              className="hover:r-7 transition-all cursor-pointer"
            />
            <text 
              x={pt.x} 
              y={pt.y - 10} 
              textAnchor="middle" 
              className="text-[9px] font-black fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ${pt.value}
            </text>
            <text 
              x={pt.x} 
              y={height - 10} 
              textAnchor="middle" 
              className="text-[10px] font-bold fill-slate-400"
            >
              {pt.label}
            </text>
          </g>
        ))}

        {/* Gradients */}
        <defs>
          <linearGradient id="emeraldGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="space-y-8 font-outfit text-left animate-fade-in select-none">
      
      {/* ── Revenue Summary Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Earnings</span>
            <span className="text-2xl font-black text-slate-800 block">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">Net payouts processed</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <DollarSign className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Visa & Bank Card Earnings */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Visa / MasterCard</span>
            <span className="text-2xl font-black text-slate-800 block">
              ${(totalRevenue * 0.65).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">Stored in Sonali A/C: {visaAccount}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <CreditCard className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Mobile Wallet Earnings (bKash/Nagad) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">bKash / Nagad</span>
            <span className="text-2xl font-black text-slate-800 block">
              ${(totalRevenue * 0.35).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">Stored in Wallet: {bkashAccount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
            <Wallet className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Average Ticket Value */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Avg Ticket Price</span>
            <span className="text-2xl font-black text-slate-800 block">
              ${avgTicketPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">Based on paid programs</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
            <TrendingUp className="h-5.5 w-5.5" />
          </div>
        </div>

      </div>

      {/* ── Lower Panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Revenue Chart Trend (7/12 width) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-md p-6">
          <div className="pb-5 border-b border-slate-50">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Earnings Trend</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Monthly earnings overview chart track.</p>
          </div>
          <div className="mt-6">
            {renderLineChart()}
          </div>
        </div>

        {/* Right Side: Account Routing Details (5/12 width) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-5">
          <div className="pb-3 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Routing Gateways</h3>
            <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {/* Visa Target Account */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Sonali Bank Transfer (Card)</span>
                </span>
                <span className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded">Routing Active</span>
              </div>
              <p className="text-slate-500 font-semibold leading-relaxed text-justify">
                All Visa, MasterCard, and direct Bank Transfer registration purchases are stored directly in your designated account:
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-100 font-mono text-[13px] font-extrabold text-slate-800 text-center select-all">
                A/C: {visaAccount}
              </div>
            </div>

            {/* bKash Target Account */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                  <Wallet className="h-4 w-4 text-amber-500" />
                  <span>bKash & Nagad (Mobile)</span>
                </span>
                <span className="bg-amber-50 text-amber-700 text-[9px] font-black uppercase px-2 py-0.5 rounded">Routing Active</span>
              </div>
              <p className="text-slate-500 font-semibold leading-relaxed text-justify">
                All mobile wallet transactions from bKash and Nagad are processed and credited to the mobile wallet account below:
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-100 font-mono text-[13px] font-extrabold text-slate-800 text-center select-all">
                Wallet No: {bkashAccount}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Transaction Log list ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8">
        <div className="pb-5 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">E-Commerce Transaction Log</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Browse through payment records, gateways, and payouts status.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto select-text">
          {participants && participants.length > 0 ? (
            <table className="w-full border-collapse text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pr-4">Purchaser Name</th>
                  <th className="pb-3.5 px-4">Event Item</th>
                  <th className="pb-3.5 px-4">Payout Method</th>
                  <th className="pb-3.5 px-4">Payout Account</th>
                  <th className="pb-3.5 px-4">Date</th>
                  <th className="pb-3.5 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {participants.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 pr-4">
                      <p className="font-extrabold text-slate-800 text-sm">{p.participant_name}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{p.participant_email}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800 max-w-[200px] truncate" title={p.event_title}>
                      {p.event_title}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      {idx % 2 === 0 ? 'Visa Card' : 'bKash Wallet'}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500">
                      {idx % 2 === 0 ? visaAccount : bkashAccount}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {p.registration_date}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <span className={`inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        p.ticket_status !== 'Cancelled'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <span>{p.ticket_status !== 'Cancelled' ? 'Settled' : 'Refunded'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-2.5">
              <FileSpreadsheet className="h-8 w-8 text-slate-300" />
              <p>No transaction history found.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
