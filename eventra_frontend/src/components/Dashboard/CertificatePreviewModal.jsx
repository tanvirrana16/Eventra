import { useRef } from 'react';
import { X, Printer, Award, ShieldCheck } from 'lucide-react';

export default function CertificatePreviewModal({ cert, onClose }) {
  const printAreaRef = useRef();

  if (!cert) return null;

  const handlePrint = () => {
    const printContents = printAreaRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.event_name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Outfit', sans-serif;
              background: #fff;
              padding: 40px;
              color: #0C3B2E;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 80vh;
            }
            .certificate-frame {
              width: 750px;
              border: 12px double #0C3B2E;
              border-radius: 10px;
              padding: 50px;
              background: #fff;
              text-align: center;
              position: relative;
            }
            .title {
              font-size: 32px;
              font-weight: 900;
              letter-spacing: 2px;
              margin-bottom: 20px;
            }
            .recipient {
              font-size: 26px;
              font-weight: 800;
              color: #2E6F40;
              text-decoration: underline;
              margin-bottom: 20px;
            }
            .footer-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 50px;
            }
            @media print {
              body { padding: 0; }
              .certificate-frame { border-color: #0C3B2E; }
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

  const qrVerificationUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://eventra.com/verify?code=${cert.certificate_code}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in font-outfit text-left">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full border border-slate-100 flex flex-col relative max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#2E6F40]">
              <Award className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight font-outfit">Certificate Document Viewer</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Certificate frame */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex items-center justify-center bg-slate-50">
          
          <div 
            ref={printAreaRef} 
            className="w-full max-w-2xl bg-white border-[12px] border-double border-[#0C3B2E] rounded-2xl p-8 sm:p-12 text-center shadow-lg relative"
          >
            
            {/* Hologram Badge Indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-1 py-1 px-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-black tracking-wide uppercase select-none">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Authenticity</span>
            </div>

            <div className="space-y-6">
              
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0C3B2E] tracking-widest uppercase">
                  Certificate of Participation
                </h1>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  This accomplishment credential is proudly awarded to
                </p>
              </div>

              {/* Recipient Name */}
              <div className="py-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[#2E6F40] underline decoration-emerald-200 decoration-4 underline-offset-8">
                  {cert.participant_name}
                </h2>
              </div>

              {/* Event Description Text */}
              <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-lg mx-auto leading-relaxed text-justify">
                for active participation, engagement, and successful completion of the learning modules in the workshop and conference event <strong>"{cert.event_name}"</strong> managed and verify-logged on the Eventra software architecture.
              </p>

              {/* Certificate Bottom Area */}
              <div className="pt-6 mt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-0">
                
                {/* Signature stub */}
                <div className="text-left space-y-1.5 order-2 sm:order-1">
                  <div className="h-[1.5px] w-36 bg-slate-800"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Organizer Signature</p>
                    <p className="text-[9px] font-bold text-slate-400">{cert.organizer}</p>
                  </div>
                </div>

                {/* QR and Verification code stub */}
                <div className="flex items-center space-x-4 order-1 sm:order-2 text-right">
                  <div className="space-y-1 font-semibold">
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest">Certificate Number</p>
                    <p className="text-xs font-mono font-bold text-[#2E6F40] tracking-wide">{cert.certificate_code}</p>
                    <p className="text-[9px] text-slate-400">Issued on {cert.issue_date_text}</p>
                  </div>
                  <div className="bg-slate-50 p-1.5 border border-slate-100 rounded-lg shadow-inner shrink-0">
                    <img 
                      src={qrVerificationUrl} 
                      alt="Verify QR" 
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end space-x-3">
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
            <span>Print Certificate / PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
}
