import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  CheckCircle2, AlertCircle, Loader2, Calendar, MapPin, 
  User, ShieldCheck, Ticket, RefreshCw, ExternalLink 
} from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PassVerificationPage() {
  const query = new URLSearchParams(useLocation().search);
  const regId = query.get('reg_id');
  const token = query.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const fetchPassData = () => {
    if (!regId || !token) {
      setError('Invalid entry pass link. Missing registration parameters.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    fetch(`${API_BASE_URL}/pass/verify?reg_id=${regId}&token=${token}`)
      .then(async (res) => {
        const payload = await res.json();
        setLoading(false);
        if (res.ok) {
          setData(payload);
        } else {
          setError(payload.message || 'Entry pass could not be verified.');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError('Network connection failed. Verify the backend server is active.');
        console.error(err);
      });
  };

  useEffect(() => {
    fetchPassData();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [regId, token]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-outfit text-[#2E6F40] space-y-3.5">
        <Loader2 className="h-10 w-10 animate-spin text-[#2E6F40]" />
        <p className="font-extrabold text-sm tracking-wide">Verifying Entry Pass Authenticity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-outfit p-4 text-center max-w-md mx-auto space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h3 className="text-xl font-extrabold text-slate-800">Verification Failed</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">{error}</p>
        <button 
          onClick={fetchPassData}
          className="py-2.5 px-6 rounded-xl bg-[#2E6F40] hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data?.qr_data || '')}`;

  return (
    <div className="min-h-[70vh] py-12 px-4 flex items-center justify-center font-outfit">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/60 text-center space-y-6">
        
        {/* Verification Success Header */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-[#2E6F40] rounded-full animate-bounce">
            <ShieldCheck className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">
            Pass Verified Successfully
          </h2>
          <p className="text-xs text-slate-400 font-semibold">
            This digital boarding pass represents a valid and active registration for the event.
          </p>
        </div>

        {/* Premium Dashed Boarding Pass Design */}
        <div className="bg-gradient-to-br from-[#0C3B2E] via-[#114E3C] to-[#2E6F40] rounded-3xl shadow-xl border border-emerald-500/20 text-white flex flex-col md:flex-row relative overflow-hidden text-left p-6 gap-6 md:gap-0 select-none">
          
          {/* Ticket Aesthetic Cuts */}
          <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full -ml-3 z-20"></div>
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full -mr-3 z-20"></div>

          {/* Left info block */}
          <div className="w-full md:w-8/12 flex flex-col justify-between space-y-6 md:pr-6 md:border-r md:border-dashed md:border-white/20">
            <div className="space-y-2.5">
              <span className="inline-block bg-yellow-400 text-slate-900 font-black text-[9px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                {data?.event.ticket_type} Pass
              </span>
              <h4 className="text-lg font-black tracking-tight leading-tight block line-clamp-2">
                {data?.event.title}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Attendee Name</span>
                <span className="text-xs font-bold text-white block truncate">{data?.user.name}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Registration Code</span>
                <span className="text-xs font-mono font-bold text-white block">{data?.registration.registration_code}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Date & Time</span>
                <span className="text-[10px] font-semibold text-emerald-100 block leading-tight">
                  {data?.event.dateText}<br />
                  {data?.event.time}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Venue</span>
                <span className="text-[10px] font-semibold text-emerald-100 block truncate leading-normal">
                  {data?.event.venue}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px]">
              <span className="text-emerald-200">Host: <strong>{data?.event.organizer_name}</strong></span>
              <span className="font-black text-yellow-300 uppercase tracking-widest">★ ADMIT ONE</span>
            </div>
          </div>

          {/* Right QR block */}
          <div className="w-full md:w-4/12 flex flex-col items-center justify-center md:pl-6 space-y-3.5 self-center">
            <div className="block md:hidden w-full border-t border-dashed border-white/20 my-2"></div>
            
            <div className="bg-white p-2 rounded-2xl shadow-md flex items-center justify-center border border-emerald-500/10">
              <img src={qrCodeUrl} alt="Verified QR" className="w-28 h-28 object-contain shrink-0" />
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-[9px] text-emerald-200 font-bold uppercase tracking-wider block">Pass Status</span>
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide inline-block border ${
                data?.registration.pass_status === 'Checked-in' 
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300' 
                  : 'bg-yellow-500/25 border-yellow-400 text-yellow-300'
              }`}>
                {data?.registration.pass_status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
          {data?.registration.payment_method && (
            <div className="w-full text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Paid via {data.registration.payment_method} • Transaction ID: <span className="font-mono text-slate-700">{data.registration.transaction_id}</span>
            </div>
          )}
          <a
            href="http://localhost:5173"
            className="py-2.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer"
          >
            Go to Homepage
          </a>
        </div>

      </div>
    </div>
  );
}
