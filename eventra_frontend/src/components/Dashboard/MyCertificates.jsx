import { 
  Award, 
  Download, 
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyCertificates({ certificates, onViewPreview }) {
  const navigate = useNavigate();

  const handleVerify = (cert) => {
    // Navigate to the verification page, passing the code in state or query params
    navigate(`/certificate-verification?code=${cert.certificate_code}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = (cert) => {
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
              box-shadow: 0 15px 35px rgba(0,0,0,0.05);
            }
            .title {
              font-size: 32px;
              font-weight: 900;
              letter-spacing: 2px;
              margin-bottom: 20px;
            }
            .subtitle {
              font-size: 16px;
              color: #64748b;
              font-weight: 600;
              margin-bottom: 40px;
            }
            .recipient {
              font-size: 26px;
              font-weight: 800;
              color: #2E6F40;
              text-decoration: underline;
              margin-bottom: 20px;
            }
            .description {
              font-size: 14px;
              color: #475569;
              font-weight: 600;
              max-width: 550px;
              margin: 0 auto 40px auto;
              line-height: 1.6;
            }
            .footer-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 30px;
            }
            .signature-line {
              width: 150px;
              border-bottom: 1.5px solid #0C3B2E;
              margin-bottom: 5px;
            }
            @media print {
              body { padding: 0; }
              .certificate-frame { box-shadow: none; border-color: #0C3B2E; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-frame">
            <div class="title">CERTIFICATE OF PARTICIPATION</div>
            <div class="subtitle">This is proudly presented to</div>
            <div class="recipient">${cert.participant_name}</div>
            <div className="description">
              for successfully registering and participating in the event <strong>"${cert.event_name}"</strong> 
              co-ordinated and verified by the host organizer <strong>"${cert.organizer}"</strong> 
              using the Eventra Event Management ecosystem.
            </div>
            <div class="footer-row">
              <div style="text-align: left;">
                <div class="signature-line"></div>
                <div style="font-size: 11px; font-weight: 800;">ORGANIZER SIGNATURE</div>
                <div style="font-size: 10px; color: #64748b; font-weight: 600;">${cert.organizer}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase;">Certificate Code</div>
                <div style="font-size: 12px; font-family: monospace; font-weight: bold; color: #2E6F40;">${cert.certificate_code}</div>
                <div style="font-size: 10px; color: #64748b; font-weight: 600; margin-top: 4px;">Issued on ${cert.issue_date_text}</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = (cert) => {
    handlePrint(cert);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in">
      
      {/* Title */}
      <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">My Certificates</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            View, download, and verify your official participation certificates.
          </p>
        </div>
        <Award className="h-6 w-6 text-[#2E6F40] hidden sm:block" />
      </div>

      {certificates.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div 
              key={cert.id}
              className="rounded-2xl border border-slate-100 hover:border-emerald-100 bg-white hover:shadow-lg p-5 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
            >
              
              {/* Corner ribbon icon */}
              <div className="absolute -top-3 -right-3 h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">
                <Award className="h-4.5 w-4.5" />
              </div>

              <div className="space-y-4">
                
                {/* ID Header */}
                <div className="space-y-0.5">
                  <p className="text-[9px] text-[#2E6F40] font-black uppercase tracking-widest">
                    ID: {cert.certificate_code}
                  </p>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-[#2E6F40] transition-colors truncate max-w-[200px]" title={cert.event_name}>
                    {cert.event_name}
                  </h3>
                </div>

                {/* Info row */}
                <div className="space-y-1 text-xs font-semibold text-slate-500">
                  <p className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Issued: {cert.issue_date_text}</span>
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    Host: {cert.organizer}
                  </p>
                </div>

              </div>

              {/* Actions row */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5">
                <button
                  onClick={() => onViewPreview(cert)}
                  className="flex-1 flex items-center justify-center space-x-1 py-2 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 text-slate-600 hover:text-[#2E6F40] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>View Certificate</span>
                </button>
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => handleVerify(cert)}
                    className="p-2 text-slate-400 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
                    title="Verify Certificate validity"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownload(cert)}
                    className="p-2 text-slate-400 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
                    title="Download Certificate"
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
          <p>No certificates issued yet. Certificates are generated after attending past registered events.</p>
        </div>
      )}

    </div>
  );
}
