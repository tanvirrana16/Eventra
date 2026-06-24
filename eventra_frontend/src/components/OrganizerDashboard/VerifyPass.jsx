import { useState } from 'react';
import { 
  QrCode, Search, CheckCircle2, AlertCircle, Loader2, 
  MapPin, Calendar, User, ShieldCheck, CreditCard, RefreshCw 
} from 'lucide-react';

export default function VerifyPass({ 
  participants = [], 
  API_BASE_URL, 
  token, 
  onCheckInSuccess 
}) {
  const [searchToken, setSearchToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifiedPass, setVerifiedPass] = useState(null);

  // Simulated Camera Scan State
  const [isScanning, setIsScanning] = useState(false);

  // We find participant by security token or registration code
  const handleVerify = (customToken = '') => {
    const val = (customToken || searchToken).trim().toLowerCase();
    if (!val) {
      setErrorMsg('Please enter a verification security token or registration code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setVerifiedPass(null);

    // Simulate database lookup network latency
    setTimeout(() => {
      // Find matches in local participants data array (which contains security_token from backend registrations)
      const found = participants.find(p => 
        (p.registration_code && p.registration_code.toLowerCase() === val) ||
        (p.id && String(p.id) === val) ||
        (p.security_token && p.security_token.toLowerCase() === val) ||
        (p.participant_name && p.participant_name.toLowerCase().includes(val))
      );

      setIsLoading(false);
      if (found) {
        setVerifiedPass(found);
      } else {
        setErrorMsg('Pass not found or invalid security credentials. Check code spelling.');
      }
    }, 1000);
  };

  const handleSimulatedScan = (p) => {
    setIsScanning(true);
    setErrorMsg('');
    setVerifiedPass(null);

    setTimeout(() => {
      setIsScanning(false);
      setVerifiedPass(p);
    }, 1200);
  };

  const handleConfirmCheckIn = () => {
    if (!verifiedPass) return;

    setIsLoading(true);
    const isCheckedIn = verifiedPass.ticket_status === 'Checked-in';
    const url = `${API_BASE_URL}/organizer/registrations/${verifiedPass.id}/check-in${isCheckedIn ? '?action=cancel' : ''}`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(async (res) => {
        const data = await res.json();
        setIsLoading(false);
        if (res.ok) {
          alert(data.message);
          
          // Update local state status
          const updatedStatus = isCheckedIn ? 'Active' : 'Checked-in';
          setVerifiedPass(prev => ({ ...prev, ticket_status: updatedStatus }));
          
          // Propagate change
          onCheckInSuccess();
        } else {
          alert(data.message || 'Check-in failed.');
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        alert('Connection error. Verification check-in failed.');
      });
  };

  return (
    <div className="space-y-8 animate-fade-in font-outfit select-none text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">QR Entry Pass Verification</h2>
        <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
          Scan participant QR codes, verify ticket authenticity, and confirm check-ins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input and Scanner simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Lookup Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <QrCode className="h-4 w-4 text-[#2E6F40]" />
              <span>Verify Pass Credentials</span>
            </h3>

            {isScanning ? (
              <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-white overflow-hidden">
                {/* Simulated scan green line */}
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-400/80 shadow-md shadow-emerald-400 animate-[scan_2s_infinite]"></div>
                
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">Scanning Camera Stream...</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Enter Ticket Registration Code or Token..."
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                />
                <button
                  onClick={() => handleVerify()}
                  disabled={isLoading}
                  className="py-2.5 px-6 rounded-xl bg-[#2E6F40] hover:bg-[#2E6F40]/90 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
                >
                  Verify Code
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-start space-x-2.5 text-xs font-semibold">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Simulation Select Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Simulate Ticket Scan</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Select a registered attendee from the dropdown list to mock a physical QR code scan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {participants.filter(p => p.ticket_status !== 'Cancelled').length > 0 ? (
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendee list</label>
                  <select 
                    onChange={(e) => {
                      const found = participants.find(p => String(p.id) === e.target.value);
                      if (found) handleSimulatedScan(found);
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                  >
                    <option value="">-- Choose Attendee --</option>
                    {participants
                      .filter(p => p.ticket_status !== 'Cancelled')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.participant_name} — {p.event_title} ({p.ticket_status})
                        </option>
                      ))
                    }
                  </select>
                </div>
              ) : (
                <div className="sm:col-span-2 text-center text-xs font-semibold text-slate-400 py-4">
                  No active event registrations to simulate scans.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Verification Results & Pass rendering (5 cols) */}
        <div className="lg:col-span-5">
          {isLoading ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center space-y-3.5">
              <Loader2 className="h-8 w-8 animate-spin text-[#2E6F40]" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Querying entry status...</p>
            </div>
          ) : verifiedPass ? (
            <div className="space-y-6">
              
              {/* Boarding Pass details */}
              <div className="bg-gradient-to-br from-[#0C3B2E] via-[#114E3C] to-[#2E6F40] rounded-3xl shadow-xl border border-emerald-500/20 text-white p-6 relative overflow-hidden select-none">
                
                {/* Circular cuts */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full z-20"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full z-20"></div>

                <div className="space-y-6">
                  {/* Event Title */}
                  <div className="pb-4 border-b border-white/10 space-y-1.5">
                    <span className="inline-block bg-yellow-400 text-slate-900 font-black text-[9px] uppercase px-2 py-0.5 rounded tracking-wider">
                      Entry Ticket Pass
                    </span>
                    <h4 className="text-base font-black tracking-tight leading-tight block truncate">
                      {verifiedPass.event_title}
                    </h4>
                  </div>

                  {/* Info table */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-bold uppercase tracking-wider text-[9px]">Attendee</span>
                      <span className="font-extrabold text-white">{verifiedPass.participant_name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-bold uppercase tracking-wider text-[9px]">Email</span>
                      <span className="font-semibold text-emerald-100">{verifiedPass.participant_email}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-bold uppercase tracking-wider text-[9px]">Phone</span>
                      <span className="font-semibold text-emerald-100">{verifiedPass.participant_phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-bold uppercase tracking-wider text-[9px]">Reg Date</span>
                      <span className="font-semibold text-emerald-100">{verifiedPass.registration_date}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-bold uppercase tracking-wider text-[9px]">Pass Status</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide border ${
                        verifiedPass.ticket_status === 'Checked-in' 
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                          : 'bg-blue-500/20 border-blue-400 text-blue-300'
                      }`}>
                        {verifiedPass.ticket_status}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                <button
                  onClick={handleConfirmCheckIn}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 text-white cursor-pointer ${
                    verifiedPass.ticket_status === 'Checked-in'
                      ? 'bg-slate-500 hover:bg-slate-600'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{verifiedPass.ticket_status === 'Checked-in' ? 'Cancel Entry Check-in' : 'Confirm Entry Check-in'}</span>
                </button>
                <button
                  onClick={() => setVerifiedPass(null)}
                  className="w-full py-2.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer"
                >
                  Clear Results
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs uppercase tracking-widest flex flex-col items-center justify-center space-y-3">
              <ShieldCheck className="h-8 w-8 text-slate-300" />
              <span>Pending Pass Scan Validation...</span>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
