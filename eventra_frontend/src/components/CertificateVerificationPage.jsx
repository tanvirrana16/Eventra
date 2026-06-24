import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Award, CheckCircle, AlertTriangle, ChevronDown, Mail, RefreshCw,
  Upload, X, ArrowRight, FileText, ShieldCheck,
  Download, ExternalLink, MessageSquare, Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const DEFAULT_FAQ_ITEMS = [
  {
    question: "Where can I find my Certificate ID?",
    answer: "Your Certificate ID is located at the bottom-left corner of the certificate document issued to you via email after the event completion. It typically follows the format EVT-2026-XXXXXX."
  },
  {
    question: "How do I verify my certificate?",
    answer: "Simply input your Certificate ID in the field above and click 'Verify Certificate'. Alternatively, upload a photo/PDF of your certificate or QR code in the drag-and-drop zone."
  },
  {
    question: "Why is my certificate not showing?",
    answer: "Verification records can take up to 24 hours after event completion to appear. If your event ended recently, please check back soon. Ensure that you have typed the ID correctly, including hyphens."
  },
  {
    question: "Can I download my certificate again?",
    answer: "Yes! Once your certificate is successfully verified above, a 'Download Certificate' action button will appear, allowing you to save it directly as a high-quality PDF."
  },
  {
    question: "Is QR code verification supported?",
    answer: "Yes, the interface supports uploading QR code images. Automated instant scanning and verification will be fully active upon backend integration."
  },
  {
    question: "Who should I contact if verification fails?",
    answer: "If you believe there is an error in our database or your name is spelled incorrectly, please click the 'Contact Support' button below or email us directly at support@eventra.com."
  }
];

export default function CertificateVerificationPage() {
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [verificationTime, setVerificationTime] = useState('');
  const [faqItems, setFaqItems] = useState([]);

  // Dynamic API state
  const [heroData, setHeroData] = useState({
    title: 'Certificate Verification',
    subtitle: 'Verify the authenticity of your Eventra participation certificates quickly and securely. Enter your Certificate ID below to confirm its validity.',
    background_color: '#0C3B2E'
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/certificate-verification`)
      .then(res => {
        if (!res.ok) throw new Error('API server error');
        return res.json();
      })
      .then(data => {
        if (data.hero) {
          setHeroData(data.hero);
        }
        setFaqItems(data.faq_items || []);
        setPageLoading(false);
      })
      .catch(err => {
        console.error('Failed to load certificate verification page details', err);
        setPageLoading(false);
      });

    // Check for search query params to auto-verify
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      Promise.resolve().then(() => {
        setCertificateId(code);
        setIsLoading(true);
        setResult(null);
        setHasSearched(false);
      });

      fetch(`${API_BASE_URL}/certificates/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ certificate_code: code.toUpperCase() })
      })
        .then(res => {
          if (res.status === 404) return { error: true };
          if (!res.ok) throw new Error('API server error');
          return res.json();
        })
        .then(data => {
          setResult(data);
          setVerificationTime(new Date().toLocaleString());
          setIsLoading(false);
          setHasSearched(true);
        })
        .catch(err => {
          console.error('Failed to verify certificate', err);
          setResult({ error: true });
          setVerificationTime(new Date().toLocaleString());
          setIsLoading(false);
          setHasSearched(true);
        });
    }
  }, []);

  const handleVerify = (e) => {
    if (e) e.preventDefault();

    if (!certificateId.trim() && !uploadedFile) {
      alert("Please enter a Certificate ID or upload a certificate file first.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setHasSearched(false);

    const queryId = certificateId.trim().toUpperCase();

    fetch(`${API_BASE_URL}/certificates/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ certificate_code: queryId })
    })
      .then(res => {
        if (res.status === 404) {
          return { error: true };
        }
        if (!res.ok) throw new Error('API server error');
        return res.json();
      })
      .then(data => {
        setResult(data);
        setVerificationTime(new Date().toLocaleString());
        setIsLoading(false);
        setHasSearched(true);
      })
      .catch(err => {
        console.error('Failed to verify certificate', err);
        setResult({ error: true });
        setVerificationTime(new Date().toLocaleString());
        setIsLoading(false);
        setHasSearched(true);
      });
  };

  const handleReset = () => {
    setCertificateId('');
    setUploadedFile(null);
    setResult(null);
    setHasSearched(false);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);

      const matched = file.name.toUpperCase().match(/(EVT-\d{4}-\d{6}|CERT-[A-Z0-9]{8})/);
      if (matched) {
        setCertificateId(matched[0]);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);

      const matched = file.name.toUpperCase().match(/(EVT-\d{4}-\d{6}|CERT-[A-Z0-9]{8})/);
      if (matched) {
        setCertificateId(matched[0]);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleDownload = () => {
    if (!result) return;
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

    const qrVerificationUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://eventra.com/verify?code=${result.id}`)}`;

    const doc = iframe.contentWindow.document || iframe.contentDocument;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Certificate - ${result.eventName}</title>
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
                <span class="cert-logo-label">${result.organization_name || 'Eventra Secure Log'}</span>
                <span class="cert-supported-by">${result.supported_by || 'Supported by Eventra'}</span>
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
              <div class="cert-recipient">${result.participantName}</div>
              <div class="cert-underline-flourish"></div>

              <!-- Description -->
              <div class="cert-description">
                ${result.description || `for active participation, engagement, and successful completion of the learning modules in the workshop and conference event <strong>"${result.eventName}"</strong> hosted by <strong>${result.organization_name || 'Eventra Partner'}</strong> and verify-logged on the Eventra software architecture.`}
              </div>

              <!-- Footer -->
              <div class="cert-footer">
                <!-- Left: Chairman of Eventra Signature -->
                <div class="cert-sig-box">
                  <div class="cert-sig-handwritten">${result.chairman_name || 'Dr. Alex Carter'}</div>
                  <div class="cert-sig-line"></div>
                  <div class="cert-sig-name">${result.chairman_name || 'Dr. Alex Carter'}</div>
                  <div class="cert-sig-title">${result.chairman_title || 'Chairman of Eventra'}</div>
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
                  <div class="cert-sig-handwritten">${result.president_name || result.organizer || 'Representative'}</div>
                  <div class="cert-sig-line"></div>
                  <div class="cert-sig-name">${result.president_name || result.organizer || 'Representative'}</div>
                  <div class="cert-sig-title">${result.organization_name || 'Host Organizer'}</div>
                  <div class="cert-sig-sub">${result.president_title || 'Director'}</div>
                </div>

                <!-- Far Right: QR & Details -->
                <div class="cert-qr-container">
                  <img class="cert-qr-img" src="${qrVerificationUrl}" alt="Verification QR" />
                  <span class="cert-qr-label" style="font-size: 5.5px; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-top: 2px;">ID: ${result.id}</span>
                  <span class="cert-qr-label" style="font-size: 5.5px; font-weight: 700; color: #94A3B8; margin-top: 1px;">Date: ${result.issueDate}</span>
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

  const heroTitle = heroData?.title || '';
  const heroSubtitle = heroData?.subtitle || '';
  const heroBgColor = heroData?.background_color || '#0C3B2E';

  if (pageLoading) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center py-40 bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#2E6F40] mb-4" />
        <span className="text-sm text-gray-500 font-bold">Loading verification tools...</span>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 font-outfit select-none">

      {/* Interactive float animation stylesheet */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.45); }
        }
        .animate-float {
          animation: float-badge 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s infinite;
        }
      `}} />

      {/* SECTION 1: HERO BANNER */}
      <section
        className="w-full pt-20 pb-28 sm:pt-28 sm:pb-40 text-center text-white relative overflow-hidden"
        style={{ backgroundColor: heroBgColor }}
      >
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content container */}
        <div className="max-w-6xl mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Text Left */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Secure Verification
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-white to-emerald-100 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <div className="w-16 h-1.5 bg-[#2E6F40] rounded-full"></div>
            <p className="text-sm sm:text-base text-emerald-100/70 max-w-xl font-light leading-relaxed">
              {heroSubtitle}
            </p>
          </div>

          {/* Interactive Illustration Right */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative animate-float">

              {/* Outer Glowing Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '40s' }}></div>

              {/* Certificate Mockup Canvas */}
              <div className="absolute inset-6 bg-[#0c2a22]/80 border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-xs flex flex-col justify-between p-5 text-left font-sans select-none">

                {/* Certificate header */}
                <div className="flex justify-between items-center border-b border-emerald-950 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <Award className="h-5 w-5 text-emerald-400" />
                    <span className="text-[10px] font-black text-white tracking-widest font-outfit uppercase">EVENTRA</span>
                  </div>
                  <Shield className="h-4 w-4 text-emerald-500" />
                </div>

                {/* Certificate body */}
                <div className="my-3 space-y-2 text-center">
                  <span className="text-[7px] uppercase tracking-widest text-emerald-500/70 font-semibold block">Certificate of Participation</span>
                  <div className="h-2 w-32 bg-emerald-900/30 mx-auto rounded-full"></div>
                  <div className="h-1.5 w-24 bg-emerald-900/20 mx-auto rounded-full"></div>

                  {/* Verified tag stamp inside template */}
                  <div className="pt-2 flex justify-center">
                    <div className="flex items-center space-x-1 bg-emerald-500/20 border border-emerald-500/35 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                      <span className="text-[6px] font-black tracking-wider text-emerald-400 uppercase">SECURE VERIFIED</span>
                    </div>
                  </div>
                </div>

                {/* Certificate footer */}
                <div className="flex justify-between items-center text-[7px] text-emerald-500/60 font-mono border-t border-emerald-950 pt-2">
                  <span>ID: EVT-2026-XXXXXX</span>
                  <span>STATUS: VALID</span>
                </div>
              </div>

              {/* Floating Shield Lock badge overlay */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex flex-col items-center justify-center border border-emerald-400/40 shadow-xl animate-pulse-glow">
                <Shield className="h-8 w-8 text-white stroke-[2]" />
                <span className="text-[7px] font-black text-emerald-100 tracking-wider mt-1 uppercase">VERIFIED</span>
              </div>

              {/* Minor floating orbs */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 backdrop-blur-xs">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>

            </div>
          </div>

        </div>

        {/* Premium Curved Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg className="relative block w-full h-[60px] md:h-[120px] translate-y-[1px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C220.11,68,121.81,98.63,0,27.35V120H1200V95.8C1130.49,111.54,1059.8,111.45,985.66,92.83Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* SECTION 2: VERIFICATION FORM AND RESULTS IN ONE INTEGRATED FLOW */}
      <section className="max-w-4xl mx-auto px-4 py-20 -mt-16 sm:-mt-24 relative z-30">

        {/* Main Verification Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-10 text-center max-w-2xl mx-auto relative overflow-hidden group">

          {/* Signature Animated borders */}
          <div className="absolute top-0 left-0 w-12 h-[1.5px] bg-gradient-to-r from-emerald-400 to-transparent transition-all group-hover:w-28 duration-700"></div>
          <div className="absolute top-0 left-0 w-[1.5px] h-12 bg-gradient-to-b from-emerald-400 to-transparent transition-all group-hover:h-28 duration-700"></div>
          <div className="absolute bottom-0 right-0 w-12 h-[1.5px] bg-gradient-to-l from-emerald-400 to-transparent transition-all group-hover:w-28 duration-700"></div>
          <div className="absolute bottom-0 right-0 w-[1.5px] h-12 bg-gradient-to-t from-emerald-400 to-transparent transition-all group-hover:h-28 duration-700"></div>

          <div className="space-y-6">

            {/* Header Title inside card */}
            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Verify Your Certificate
              </h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Enter your unique Certificate ID to verify your participation certificate issued by Eventra.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleVerify} className="space-y-6 text-left">

              {/* Input ID Box */}
              <div className="space-y-2">
                <label htmlFor="certId" className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Certificate ID
                </label>
                <div className="relative">
                  <input
                    id="certId"
                    type="text"
                    required={!uploadedFile}
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g., EVT-2026-000123)"
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                  />
                  <Shield className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* OR Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* QR Upload Zone */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  QR Code / Certificate File Upload (Optional)
                </label>

                {uploadedFile ? (
                  /* File Uploaded Preview Card */
                  <div className="flex items-center justify-between p-4 bg-emerald-50/20 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 truncate max-w-xs sm:max-w-md">{uploadedFile.name}</p>
                        <p className="text-[10px] text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-gray-500 hover:text-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  /* Drag and Drop Zone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${isDragging
                      ? 'border-emerald-500 bg-emerald-50/10'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 hover:border-slate-300'
                      }`}
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer space-y-2.5 block">
                      <div className="mx-auto w-10 h-10 bg-white shadow-2xs border border-slate-100 rounded-full flex items-center justify-center text-gray-500">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-700">
                          Drag & drop certificate here, or <span className="text-emerald-700 underline decoration-dotted">Browse File</span>
                        </p>
                        <p className="text-[10px] text-gray-400">Supports PNG, JPG, or PDF (Max 5MB)</p>
                      </div>
                    </label>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 font-medium block leading-normal mt-1 italic">
                  * Note: QR code verification will be available after backend integration.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow py-3 bg-gradient-to-r from-[#2E6F40] to-emerald-600 hover:from-emerald-700 hover:to-[#2E6F40] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying Security Registry...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Certificate</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 border border-slate-200 hover:border-slate-400 text-gray-600 hover:text-black rounded-xl text-xs font-bold transition-all cursor-pointer transform active:scale-98"
                  >
                    Reset
                  </button>
                )}
              </div>

            </form>

          </div>

        </div>

        {/* SECTION 3: RESULTS BLOCK (Conditionally Rendered below form) */}
        {hasSearched && result && (
          <div className="mt-8 max-w-2xl mx-auto animate-fade-in">

            {result.error ? (

              /* INVALID ERROR CARD */
              <div className="bg-white rounded-3xl border border-rose-100 shadow-md p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl shrink-0">
                  <AlertTriangle className="h-8 w-8 stroke-[1.8]" />
                </div>
                <div className="space-y-3 flex-grow">
                  <div>
                    <span className="inline-block bg-rose-50 text-rose-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5">
                      Failed Lookup
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-900">Certificate Not Found</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    We couldn't find any certificate matching the provided Certificate ID. Please double check the ID format, symbols, and spelling before attempting to search again.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleReset}
                      className="py-2.5 px-6 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer transform active:scale-95"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>

            ) : (

              /* VALID SUCCESS CARD */
              <div className="bg-white rounded-3xl border border-emerald-100 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden text-left">
                {/* Visual Accent Top Bar */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-500 to-teal-400"></div>

                {/* Result Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <CheckCircle className="h-7 w-7 stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-1">
                        Secure Database Record Match
                      </span>
                      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-1.5">
                        Certificate Verified
                      </h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                    Verified
                  </span>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Participant Name</span>
                    <span className="text-sm font-bold text-gray-900">{result.participantName}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Certificate ID</span>
                    <span className="text-sm font-mono font-bold text-slate-800">{result.id}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 md:col-span-2">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Event Name & Category</span>
                    <span className="text-sm font-bold text-gray-900">{result.eventName} ({result.eventCategory})</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Organizer</span>
                    <span className="text-sm font-bold text-gray-900">{result.organizer}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Issue Date</span>
                    <span className="text-sm font-bold text-gray-900">{result.issueDate}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Certificate Status</span>
                    <span className="text-xs font-black text-emerald-700 uppercase block">{result.status}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Verification Timestamp</span>
                    <span className="text-xs font-semibold text-gray-600 block">{verificationTime}</span>
                  </div>

                </div>

                {/* Success Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto py-2.5 px-6 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-2 transform active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={() => {
                      if (result?.eventId) {
                        navigate(`/events?id=${result.eventId}`);
                      } else {
                        alert(`Showing event details for: ${result?.eventName}`);
                      }
                    }}
                    className="w-full sm:w-auto py-2.5 px-6 border border-slate-200 hover:border-slate-400 text-gray-800 hover:text-black text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 transform active:scale-95 bg-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Event Details</span>
                  </button>
                </div>

              </div>

            )}

          </div>
        )}

      </section>

      {/* SECTION 4: FAQ ACCORDION */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            {(faqItems.length > 0 ? faqItems : DEFAULT_FAQ_ITEMS).map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 bg-white"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-emerald-800 transition-colors bg-white cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm font-bold pr-4">{faq.question}</span>
                    <span className={`p-1 bg-slate-50 text-gray-500 rounded-lg transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-emerald-50 text-[#2E6F40]' : ''
                      }`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden bg-slate-50/50 ${isExpanded ? 'max-h-40 border-t border-gray-100 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                      }`}
                  >
                    <p className="p-5 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 5: CONTACT SUPPORT CTA */}
      <section className="w-full bg-[#0C3B2E] py-20 text-center text-white relative overflow-hidden select-none border-t border-emerald-500/10">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute inset-0 border-y border-white/5 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-20 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent">
            Need Help with Certificate Verification?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/70 max-w-lg mx-auto font-light leading-relaxed">
            Our support team is ready to assist you with certificate verification, corrections, or any related inquiries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => alert("Redirecting to support ticket portal...")}
              className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-xs cursor-pointer transform active:scale-95 flex items-center space-x-1.5"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact Support</span>
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@eventra.com?subject=Certificate%20Verification%20Inquiry'}
              className="py-3 px-8 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-full transition-all duration-300 text-xs cursor-pointer transform active:scale-95 flex items-center space-x-1.5"
            >
              <Mail className="h-4 w-4" />
              <span>Email Us</span>
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}
