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

    const qrVerificationUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://eventra.com/verify?code=${cert.certificate_code}`)}`;

    const doc = iframe.contentWindow.document || iframe.contentDocument;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Certificate - ${cert.event_name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Great+Vibes&family=Alex+Brush&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            @media print {
              body {
                padding: 0;
                margin: 0;
                background: #fff;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .cert-wrapper {
                box-shadow: none !important;
              }
            }
            body {
              font-family: 'Outfit', sans-serif;
              background: #fff;
              padding: 0;
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .cert-wrapper {
              position: relative;
              width: 780px;
              height: 585px;
              background: #FFFFFF;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 0;
              box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            }
            .cert-background {
              position: absolute;
              inset: 0;
              pointer-events: none;
              background: radial-gradient(circle at center, #FFFFFF 50%, #FAF8F2 100%);
            }
            .cert-bg-stripes {
              position: absolute;
              inset: 0;
              pointer-events: none;
              background: repeating-linear-gradient(45deg, rgba(253, 253, 251, 0.4), rgba(253, 253, 251, 0.4) 2.5px, rgba(244, 246, 242, 0.4) 2.5px, rgba(244, 246, 242, 0.4) 5px);
              opacity: 0.85;
            }
            .cert-watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 300px;
              height: 300px;
              pointer-events: none;
              opacity: 0.032;
              z-index: 1;
            }
            .cert-border-svg {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 2;
            }
            .cert-inner-content {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              position: relative;
              z-index: 10;
              padding: 40px 56px 0px 56px;
              box-sizing: border-box;
            }
            .cert-logo-box {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 4px;
            }
            .cert-logo-box svg {
              width: 36px;
              height: 36px;
            }
            .cert-logo-label {
              font-size: 8px;
              font-weight: 900;
              color: #0C3B2E;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-top: 4px;
            }
            .cert-supported-by {
              font-size: 6px;
              font-weight: 800;
              color: #94A3B8;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-top: 1px;
            }
            .cert-title {
              font-family: 'Cinzel', serif;
              font-size: 20px;
              font-weight: 700;
              letter-spacing: 3.5px;
              color: #0C3B2E;
              text-transform: uppercase;
              margin-top: 10px;
              margin-bottom: 2px;
              text-align: center;
            }
            .cert-divider-svg {
              height: 10px;
              width: 160px;
              color: #C5A880;
              margin-top: 4px;
            }
            .cert-presentation {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #94A3B8;
              font-weight: 800;
              margin-top: 14px;
            }
            .cert-recipient {
              font-family: 'Great Vibes', cursive;
              font-size: 38px;
              font-weight: 400;
              text-align: center;
              background: linear-gradient(to right, #B8860B, #E2BA6E, #B8860B);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              color: #C5A880;
              margin: 4px 0;
            }
            .cert-underline-flourish {
              width: 220px;
              height: 1px;
              background: linear-gradient(90deg, transparent 0%, #C5A880 50%, transparent 100%);
              margin-bottom: 12px;
            }
            .cert-description {
              font-size: 10.5px;
              line-height: 1.65;
              color: #4A5568;
              max-width: 520px;
              text-align: center;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .cert-footer {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding: 0 30px;
              box-sizing: border-box;
              margin-bottom: 0;
            }
            .cert-footer-spacer {
              width: 100%;
              height: 32px;
              flex-shrink: 0;
            }
            .cert-sig-box {
              width: 140px;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .cert-sig-handwritten {
              font-family: 'Alex Brush', cursive;
              font-size: 24px;
              color: #0c4a3b;
              height: 32px;
              line-height: 32px;
              margin-bottom: -2px;
              white-space: nowrap;
            }
            .cert-sig-line {
              width: 100%;
              border-bottom: 1.2px solid rgba(197, 168, 128, 0.5);
              margin-bottom: 4px;
            }
            .cert-sig-name {
              font-size: 7.5px;
              font-weight: 900;
              text-transform: uppercase;
              color: #334155;
              letter-spacing: 0.5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .cert-sig-title {
              font-size: 6.5px;
              font-weight: 700;
              text-transform: uppercase;
              color: #64748B;
              letter-spacing: 0.5px;
              margin-top: 1px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .cert-sig-sub {
              font-size: 6px;
              color: #94A3B8;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 1px;
            }
            .cert-seal-box {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .cert-seal-outer {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 60px;
              height: 80px;
            }
            .cert-seal-ribbon-l {
              position: absolute;
              left: 14px;
              top: 26px;
              width: 14px;
              height: 36px;
              fill: #0C3B2E;
              filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.12));
            }
            .cert-seal-ribbon-r {
              position: absolute;
              right: 14px;
              top: 26px;
              width: 14px;
              height: 36px;
              fill: #0C3B2E;
              filter: drop-shadow(-1px 1px 1px rgba(0,0,0,0.12));
              transform: rotate(5deg);
            }
            .cert-seal-star {
              position: absolute;
              top: 2px;
              width: 44px;
              height: 44px;
              fill: #C5A880;
              filter: drop-shadow(0px 1.5px 3px rgba(0,0,0,0.15));
            }
            .cert-seal-inner {
              position: absolute;
              top: 8px;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #fff;
              border: 1px dashed rgba(197, 168, 128, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
            }
            .cert-seal-inner svg {
              width: 18px;
              height: 18px;
              fill: #C5A880;
            }
            .cert-qr-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 60px;
            }
            .cert-qr-img {
              width: 48px;
              height: 48px;
              border: 1px solid rgba(197, 168, 128, 0.3);
              padding: 2px;
              background: #fff;
              border-radius: 4px;
            }
            .cert-qr-label {
              font-size: 5.5px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #94A3B8;
              font-weight: 800;
              margin-top: 2px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="cert-wrapper">
            <div class="cert-background"></div>
            <div class="cert-bg-stripes"></div>
            
            <!-- Central Medallion Watermark -->
            <div class="cert-watermark">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#C5A880" stroke-width="1.2" stroke-dasharray="3,3" />
                <circle cx="50" cy="50" r="38" stroke="#C5A880" stroke-width="0.6" />
                <polygon points="50,15 90,38 90,62 50,85 10,62 10,38" stroke="#2E6F40" stroke-width="1.2" />
                <path d="M50 25 L58 41 L76 44 L63 56 L66 74 L50 65 L34 74 L37 56 L24 44 L42 41 Z" fill="#C5A880" />
              </svg>
            </div>

            <!-- Borders and Ornaments SVG -->
            <svg class="cert-border-svg" viewBox="0 0 780 585" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Outer Border -->
              <rect x="18" y="18" width="744" height="549" rx="4" stroke="#C5A880" stroke-width="3" />
              <!-- Inner Border -->
              <rect x="25" y="25" width="730" height="535" rx="2" stroke="#2E6F40" stroke-width="1.5" />
              <!-- Dotted Inner Line -->
              <rect x="30" y="30" width="720" height="525" stroke="#C5A880" stroke-width="1" stroke-dasharray="3,3" />

              <!-- Ornate Corner Designs (Top Left) -->
              <g transform="translate(25, 25)">
                <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill="#2E6F40" fill-opacity="0.02" />
                <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke="#2E6F40" stroke-width="1.5" fill="none" />
                <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke="#C5A880" stroke-width="1" fill="none" />
                <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke="#C5A880" stroke-width="1.2" fill="none" />
                <circle cx="20" cy="20" r="2.5" fill="#C5A880" />
              </g>
              <!-- Top Right -->
              <g transform="translate(755, 25) scale(-1, 1)">
                <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill="#2E6F40" fill-opacity="0.02" />
                <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke="#2E6F40" stroke-width="1.5" fill="none" />
                <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke="#C5A880" stroke-width="1" fill="none" />
                <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke="#C5A880" stroke-width="1.2" fill="none" />
                <circle cx="20" cy="20" r="2.5" fill="#C5A880" />
              </g>
              <!-- Bottom Left -->
              <g transform="translate(25, 560) scale(1, -1)">
                <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill="#2E6F40" fill-opacity="0.02" />
                <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke="#2E6F40" stroke-width="1.5" fill="none" />
                <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke="#C5A880" stroke-width="1" fill="none" />
                <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke="#C5A880" stroke-width="1.2" fill="none" />
                <circle cx="20" cy="20" r="2.5" fill="#C5A880" />
              </g>
              <!-- Bottom Right -->
              <g transform="translate(755, 560) scale(-1, -1)">
                <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill="#2E6F40" fill-opacity="0.02" />
                <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke="#2E6F40" stroke-width="1.5" fill="none" />
                <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke="#C5A880" stroke-width="1" fill="none" />
                <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke="#C5A880" stroke-width="1.2" fill="none" />
                <circle cx="20" cy="20" r="2.5" fill="#C5A880" />
              </g>

              <!-- Side flourishes -->
              <g transform="translate(25, 292.5)">
                <path d="M 0 -25 C 12 -18, 12 18, 0 25" stroke="#C5A880" stroke-width="2" />
                <path d="M 0 -12 C 6 -8, 6 8, 0 12" stroke="#2E6F40" stroke-width="1.2" />
                <circle cx="8" cy="0" r="2.5" fill="#C5A880" />
              </g>
              <g transform="translate(755, 292.5) scale(-1, 1)">
                <path d="M 0 -25 C 12 -18, 12 18, 0 25" stroke="#C5A880" stroke-width="2" />
                <path d="M 0 -12 C 6 -8, 6 8, 0 12" stroke="#2E6F40" stroke-width="1.2" />
                <circle cx="8" cy="0" r="2.5" fill="#C5A880" />
              </g>
            </svg>

            <div class="cert-inner-content">
              <!-- Header Logo -->
              <div class="cert-logo-box">
                <svg viewBox="0 0 100 100" fill="none">
                  <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" stroke="#C5A880" stroke-width="6" fill="#2E6F40" />
                  <path d="M50 25 L58 41 L76 44 L63 56 L66 74 L50 65 L34 74 L37 56 L24 44 L42 41 Z" fill="#C5A880" />
                </svg>
                <span class="cert-logo-label">${cert.organization_name || 'Eventra Secure Log'}</span>
                <span class="cert-supported-by">${cert.supported_by || 'Supported by Eventra'}</span>
              </div>

              <!-- Title & divider -->
              <div class="cert-title">Certificate of Participation</div>
              <svg class="cert-divider-svg" viewBox="0 0 100 10">
                <path d="M0 5 Q 25 2, 50 5 T 100 5" stroke="#C5A880" stroke-width="1.5" fill="none" />
                <circle cx="50" cy="5" r="2.5" fill="#C5A880" />
                <circle cx="43" cy="5" r="1.2" fill="#2E6F40" />
                <circle cx="57" cy="5" r="1.2" fill="#2E6F40" />
              </svg>

              <!-- Presentation Text -->
              <div class="cert-presentation">This Certificate is Presented to</div>

              <!-- Recipient -->
              <div class="cert-recipient">${cert.participant_name}</div>
              <div class="cert-underline-flourish"></div>

              <!-- Description -->
              <div class="cert-description">
                ${cert.description || `for active participation, engagement, and successful completion of the learning modules in the workshop and conference event <strong>"${cert.event_name}"</strong> hosted by <strong>${cert.organization_name || 'Eventra Partner'}</strong> and verify-logged on the Eventra software architecture.`}
              </div>

              <!-- Footer -->
              <div class="cert-footer">
                <!-- Left: Chairman of Eventra Signature -->
                <div class="cert-sig-box">
                  <div class="cert-sig-handwritten">${cert.chairman_name || 'Dr. Alex Carter'}</div>
                  <div class="cert-sig-line"></div>
                  <div class="cert-sig-name">${cert.chairman_name || 'Dr. Alex Carter'}</div>
                  <div class="cert-sig-title">${cert.chairman_title || 'Chairman of Eventra'}</div>
                  <div class="cert-sig-sub">Eventra Chairman Signature</div>
                </div>

                <!-- Center: Gold Seal -->
                <div class="cert-seal-box">
                  <div class="cert-seal-outer">
                    <svg class="cert-seal-ribbon-l" viewBox="0 0 20 50">
                      <path d="M 0 0 L 20 0 L 20 40 L 10 32 L 0 40 Z" />
                      <path d="M 3 0 L 3 34 L 10 28 L 17 34 L 17 0" fill="#C5A880" />
                    </svg>
                    <svg class="cert-seal-ribbon-r" viewBox="0 0 20 50">
                      <path d="M 0 0 L 20 0 L 20 40 L 10 32 L 0 40 Z" />
                      <path d="M 3 0 L 3 34 L 10 28 L 17 34 L 17 0" fill="#C5A880" />
                    </svg>
                    <svg class="cert-seal-star" viewBox="0 0 100 100">
                      <path d="M50 0 L55 12 L68 6 L67 20 L80 18 L75 31 L87 34 L78 45 L88 53 L76 60 L82 73 L69 74 L71 88 L58 84 L55 98 L45 92 L38 98 L35 84 L22 88 L24 74 L11 73 L17 60 L5 53 L15 45 L6 34 L18 31 L13 18 L26 20 L25 6 L38 12 Z" />
                    </svg>
                    <div class="cert-seal-inner">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#C5A880"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Right: Organization President/Director Signature -->
                <div class="cert-sig-box">
                  <div class="cert-sig-handwritten">${cert.president_name || cert.organizer || 'Representative'}</div>
                  <div class="cert-sig-line"></div>
                  <div class="cert-sig-name">${cert.president_name || cert.organizer || 'Representative'}</div>
                  <div class="cert-sig-title">${cert.organization_name || 'Host Organizer'}</div>
                  <div class="cert-sig-sub">${cert.president_title || 'Director'}</div>
                </div>

                <!-- Far Right: QR & Details -->
                <div class="cert-qr-container">
                  <img class="cert-qr-img" src="${qrVerificationUrl}" alt="Verification QR" />
                  <span class="cert-qr-label" style="font-size: 5.5px; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-top: 2px;">ID: ${cert.certificate_code}</span>
                  <span class="cert-qr-label" style="font-size: 5.5px; font-weight: 700; color: #94A3B8; margin-top: 1px;">Date: ${cert.issue_date_text}</span>
                </div>
              </div>
              <div class="cert-footer-spacer"></div>
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

    // Wait for the QR code image inside the certificate to load
    const img = doc.querySelector('img');
    if (img) {
      if (img.complete) {
        setTimeout(handlePrintReady, 300);
      } else {
        img.onload = () => setTimeout(handlePrintReady, 300);
        img.onerror = () => setTimeout(handlePrintReady, 300);
      }
    } else {
      setTimeout(handlePrintReady, 300);
    }
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
