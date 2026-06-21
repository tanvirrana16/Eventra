import { useRef } from 'react';
import { X, Printer, Calendar, Clock, MapPin, ShieldCheck, Ticket } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function PassDetailsModal({ pass, onClose }) {
  const printAreaRef = useRef();

  if (!pass) return null;

  const handlePrint = () => {
    const printContents = printAreaRef.current.innerHTML;

    // Create custom window writing to keep layout intact
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Eventra Pass - ${pass.event_name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Outfit', sans-serif;
              padding: 20px;
              background: #f8fafc;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .boarding-pass {
              width: 680px;
              background: #fff;
              border-radius: 24px;
              box-shadow: 0 15px 35px rgba(0,0,0,0.1);
              overflow: hidden;
              display: flex;
              border: 1px solid #e2e8f0;
            }
            .main-content {
              flex: 1.4;
              padding: 28px;
              position: relative;
            }
            .stub {
              flex: 0.6;
              background: #0C3B2E;
              color: white;
              padding: 28px;
              border-left: 2px dashed #cbd5e1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              position: relative;
            }
            .stub::before, .stub::after {
              content: '';
              position: absolute;
              left: -8px;
              width: 16px;
              height: 16px;
              background: #f8fafc;
              border-radius: 50%;
            }
            .stub::before { top: -8px; }
            .stub::after { bottom: -8px; }
            .brand {
              font-size: 18px;
              font-weight: 900;
              color: #0C3B2E;
              letter-spacing: 2px;
            }
            .brand-stub {
              font-size: 14px;
              font-weight: 900;
              color: #fff;
              letter-spacing: 1px;
            }
            .event-title {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              margin-top: 15px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-top: 20px;
              font-size: 13px;
              font-weight: 600;
            }
            .label {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              margin-bottom: 2px;
            }
            .label-stub {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #a7f3d0;
              margin-bottom: 2px;
            }
            .qr-container {
              background: white;
              padding: 8px;
              border-radius: 12px;
              margin-top: 15px;
            }
            @media print {
              body { background: white; padding: 0; }
              .boarding-pass { box-shadow: none; border: 1px solid #000; }
              .stub::before, .stub::after { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContents}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in font-outfit text-left">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full border border-slate-100 flex flex-col relative max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#2E6F40]">
              <Ticket className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Your Digital Event Pass</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body & Ticket Printing Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex items-center justify-center">
          
          <div ref={printAreaRef} className="w-full max-w-2xl">
            
            {/* The Premium Boarding Pass Container */}
            <div className="w-full flex flex-col sm:flex-row rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-lg shadow-slate-100 relative">
              
              {/* Pass Main Content (Left portion) */}
              <div className="flex-1 p-6 sm:p-7 space-y-6">
                
                {/* Header branding */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                    <span className="text-base font-black tracking-widest text-[#0C3B2E]">EVENTRA</span>
                  </div>
                  <span className="bg-[#2E6F40] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {pass.pass_status} PASS
                  </span>
                </div>

                {/* Event title */}
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Selected Event</p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-snug">
                    {pass.event_name}
                  </h3>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Participant</p>
                    <p className="text-slate-800 font-extrabold text-sm">{pass.participant_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Registration Code</p>
                    <p className="text-slate-800 font-extrabold text-sm font-mono">{pass.registration_code}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{pass.event_date}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Time</p>
                    <p className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{pass.event_time}</span>
                    </p>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Venue Location</p>
                    <p className="flex items-center space-x-1 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="leading-tight text-justify">{pass.venue}</span>
                    </p>
                  </div>
                </div>

                {/* Small indicator */}
                <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-3 py-1 rounded-xl self-start w-fit">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Entry Gate Verification Approved</span>
                </div>

              </div>

              {/* Dotted divider strip */}
              <div className="hidden sm:flex flex-col items-center justify-between py-4 relative z-10 w-[2px]">
                <div className="w-4 h-4 bg-slate-900/60 backdrop-blur-md rounded-full -mt-6"></div>
                <div className="w-full flex-1 border-l-2 border-dashed border-slate-200"></div>
                <div className="w-4 h-4 bg-slate-900/60 backdrop-blur-md rounded-full -mb-6"></div>
              </div>

              {/* Pass Stub (Right portion) */}
              <div className="sm:w-60 bg-[#0C3B2E] text-white p-6 sm:p-7 flex flex-col justify-between items-center text-center relative">
                
                {/* Top branding stub */}
                <div className="hidden sm:block text-center space-y-0.5 pb-3 border-b border-white/10 w-full">
                  <p className="text-xs font-black tracking-widest text-emerald-300">BOARDING PASS</p>
                  <p className="text-[9px] font-bold text-white/50">{pass.organizer}</p>
                </div>

                {/* QR Code */}
                <div className="my-4 sm:my-0 space-y-2">
                  <div className="bg-white p-2 rounded-xl shadow-md inline-block">
                    <img
                      src={pass.qr_code_url}
                      alt="Digital Entry QR"
                      className="h-28 w-28 object-contain"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest">Scan at Entrance</p>
                </div>

                {/* Security tokens info */}
                <div className="w-full space-y-1">
                  <p className="text-[9px] text-emerald-300 font-extrabold uppercase tracking-widest">Verification Token</p>
                  <p className="text-xs font-mono font-bold tracking-tight text-white/90 truncate w-full" title={pass.verification_number}>
                    {pass.verification_number}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-[#2E6F40] hover:bg-[#235431] text-white py-2.5 px-5 rounded-xl text-xs font-bold shadow-md shadow-[#2E6F40]/10 hover:shadow-lg transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Pass / PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
}
