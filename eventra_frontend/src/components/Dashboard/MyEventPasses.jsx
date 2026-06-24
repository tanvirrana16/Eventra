import { 
  Download, 
  Printer, 
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Ticket,
  AlertCircle
} from 'lucide-react';

export default function MyEventPasses({ passes, onViewFullPass }) {
  
  const handlePrint = (pass) => {
    // Remove any existing print iframe
    const existingFrame = document.getElementById('print-iframe');
    if (existingFrame) {
      existingFrame.remove();
    }

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document || iframe.contentDocument;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print Pass - ${pass.event_name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Outfit', sans-serif;
              background: #fff;
              padding: 40px;
              color: #1e293b;
              display: flex;
              justify-content: center;
            }
            .ticket {
              width: 600px;
              border: 2px dashed #0C3B2E;
              border-radius: 20px;
              padding: 30px;
              background: #F4FAF6;
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #0C3B2E;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .brand {
              font-size: 24px;
              font-weight: 900;
              color: #0C3B2E;
              letter-spacing: 2px;
            }
            .title {
              font-size: 20px;
              font-weight: 800;
              color: #1e293b;
              margin-bottom: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              font-size: 14px;
              font-weight: 600;
            }
            .label {
              color: #64748b;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 2px;
            }
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-top: 1px dashed #cbd5e1;
              padding-top: 20px;
            }
            .qr-code {
              width: 100px;
              height: 100px;
            }
            @media print {
              body { padding: 0; }
              .ticket { box-shadow: none; border-color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <span class="brand">EVENTRA PASS</span>
              <span style="font-weight: 800; color: #2E6F40; font-size: 14px; text-transform: uppercase;">${pass.pass_status}</span>
            </div>
            <div class="title">${pass.event_name}</div>
            <div class="info-grid">
              <div>
                <div class="label">Participant Name</div>
                <div>${pass.participant_name}</div>
              </div>
              <div>
                <div class="label">Registration Code</div>
                <div>${pass.registration_code}</div>
              </div>
              <div>
                <div class="label">Date</div>
                <div>${pass.event_date}</div>
              </div>
              <div>
                <div class="label">Time</div>
                <div>${pass.event_time}</div>
              </div>
              <div style="grid-column: span 2;">
                <div class="label">Venue</div>
                <div>${pass.venue}</div>
              </div>
              <div>
                <div class="label">Organizer</div>
                <div>${pass.organizer}</div>
              </div>
              <div>
                <div class="label">Ticket Type</div>
                <div style="text-transform: capitalize;">${pass.ticket_type} (${pass.payment_amount > 0 ? '$' + pass.payment_amount : 'Free'})</div>
              </div>
            </div>
            <div class="footer">
              <div>
                <div class="label">Verification Security Code</div>
                <div style="font-family: monospace; font-size: 11px;">${pass.verification_number}</div>
              </div>
              <img class="qr-code" src="${pass.qr_code_url}" alt="QR Pass" />
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    const handlePrintReady = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        const frame = document.getElementById('print-iframe');
        if (frame) {
          frame.remove();
        }
      }, 1000);
    };

    // Wait for the QR code image to load inside the iframe
    const img = doc.querySelector('.qr-code');
    if (img) {
      if (img.complete) {
        setTimeout(handlePrintReady, 300);
      } else {
        img.onload = () => setTimeout(handlePrintReady, 300);
        img.onerror = () => setTimeout(handlePrintReady, 300);
      }
    } else {
      setTimeout(handlePrintReady, 500);
    }
  };

  const handleDownload = (pass) => {
    handlePrint(pass);
  };

  // Only show active / non-cancelled passes in this view
  const activePasses = passes.filter(p => p.pass_status !== 'Cancelled');

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in">
      
      {/* Title */}
      <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">My Event Passes</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Access your secure digital entry passes for upcoming workshops and summits.
          </p>
        </div>
        <Ticket className="h-6 w-6 text-[#2E6F40] hidden sm:block" />
      </div>

      {activePasses.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePasses.map((pass) => (
            <div 
              key={pass.registration_id}
              className="relative overflow-hidden rounded-2xl border border-slate-100 shadow-md hover:shadow-lg bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between group transition-all duration-300"
            >
              
              {/* Top Accent Strip */}
              <div className="h-2 bg-gradient-to-r from-[#0C3B2E] via-[#2E6F40] to-emerald-500"></div>

              <div className="p-5 space-y-4">
                
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-[#2E6F40] transition-colors truncate max-w-[180px]" title={pass.event_name}>
                      {pass.event_name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Reg Code: {pass.registration_code}
                    </p>
                  </div>
                  
                  {/* Active Status badge */}
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {pass.pass_status}
                  </span>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-2 gap-3.5 text-xs font-semibold text-slate-600">
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{pass.event_date}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Time</p>
                    <p className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{pass.event_time}</span>
                    </p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Venue</p>
                    <p className="flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={pass.venue}>{pass.venue}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Participant</p>
                    <p className="text-slate-800 font-bold truncate">{pass.participant_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Organizer</p>
                    <p className="flex items-center space-x-1 text-slate-800 font-bold">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={pass.organizer}>{pass.organizer}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Ticket / QR section */}
                <div className="pt-4 border-t border-slate-200/60 dashed flex justify-between items-center">
                  
                  {/* Left QR Code payload preview */}
                  <div className="text-[9px] text-slate-400 font-mono tracking-tighter">
                    <p>SECURE VERIFICATION TOKEN</p>
                    <p className="text-slate-600 font-bold mt-0.5">{pass.verification_number}</p>
                  </div>

                  {/* QR Image */}
                  <img
                    src={pass.qr_code_url}
                    alt="Entry QR"
                    className="h-14 w-14 border border-slate-100 p-0.5 bg-white rounded-lg shadow-inner"
                  />

                </div>

              </div>

              {/* Action buttons */}
              <div className="bg-slate-50 px-4 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
                <button
                  onClick={() => onViewFullPass(pass.registration_id)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 text-slate-600 hover:text-[#2E6F40] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Full Pass</span>
                </button>
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => handlePrint(pass)}
                    className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer"
                    title="Print Pass"
                  >
                    <Printer className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownload(pass)}
                    className="p-2 text-slate-400 hover:text-[#2E6F40] bg-white border border-slate-200 hover:border-[#2E6F40]/40 rounded-xl transition-all cursor-pointer"
                    title="Download Pass"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-2.5">
          <AlertCircle className="h-8 w-8 text-slate-300" />
          <p>No active event passes found. Passes are generated upon successful registration.</p>
        </div>
      )}

    </div>
  );
}
