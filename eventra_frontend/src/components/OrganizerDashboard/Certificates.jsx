import { useState, useEffect } from 'react';
import {
  Award,
  Send,
  Loader2
} from 'lucide-react';

// Helper component for matching custom border design from sample image
const CertificateBorder = ({ colors }) => (
  <div className="absolute inset-0 pointer-events-none w-full h-full">
    {/* Soft Radial Cream Gradient Background */}
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at center, #FFFFFF 50%, #FAF8F2 100%)'
      }}
    />

    {/* Faint Pinstripes Background */}
    <div
      className="absolute inset-0"
      style={{
        background: `repeating-linear-gradient(45deg, rgba(253, 253, 251, 0.4), rgba(253, 253, 251, 0.4) 2.5px, rgba(244, 246, 242, 0.4) 2.5px, rgba(244, 246, 242, 0.4) 5px)`,
        opacity: 0.85
      }}
    />

    {/* Central Medallion Watermark */}
    <div
      className="absolute inset-0 flex items-center justify-center opacity-[0.032]"
      style={{ zIndex: 1 }}
    >
      <svg className="w-[280px] h-[280px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke={colors.outerBorder} strokeWidth="1" strokeDasharray="3,3" />
        <circle cx="50" cy="50" r="38" stroke={colors.outerBorder} strokeWidth="0.5" />
        <polygon points="50,15 90,38 90,62 50,85 10,62 10,38" stroke={colors.textAccent} strokeWidth="1" />
        <path d="M50 25 L58 41 L76 44 L63 56 L66 74 L50 65 L34 74 L37 56 L24 44 L42 41 Z" fill={colors.outerBorder} />
      </svg>
    </div>

    {/* Decorative Border SVG Frame */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 780 585" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Border */}
      <rect x="18" y="18" width="744" height="549" rx="4" stroke={colors.outerBorder} strokeWidth="3" />
      {/* Inner Border */}
      <rect x="25" y="25" width="730" height="535" rx="2" stroke={colors.textAccent} strokeWidth="1.5" />
      {/* Dotted Inner Line */}
      <rect x="30" y="30" width="720" height="525" stroke={colors.outerBorder} strokeWidth="1" stroke-dasharray="3,3" />

      {/* Ornate Corner Designs (Top Left) */}
      <g transform="translate(25, 25)">
        <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill={colors.textAccent} fillOpacity="0.02" />
        <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke={colors.textAccent} strokeWidth="1.5" fill="none" />
        <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke={colors.outerBorder} strokeWidth="1" fill="none" />
        <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke={colors.outerBorder} strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="20" r="2.5" fill={colors.outerBorder} />
      </g>
      {/* Top Right */}
      <g transform="translate(755, 25) scale(-1, 1)">
        <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill={colors.textAccent} fillOpacity="0.02" />
        <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke={colors.textAccent} strokeWidth="1.5" fill="none" />
        <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke={colors.outerBorder} strokeWidth="1" fill="none" />
        <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke={colors.outerBorder} strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="20" r="2.5" fill={colors.outerBorder} />
      </g>
      {/* Bottom Left */}
      <g transform="translate(25, 560) scale(1, -1)">
        <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill={colors.textAccent} fillOpacity="0.02" />
        <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke={colors.textAccent} strokeWidth="1.5" fill="none" />
        <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke={colors.outerBorder} strokeWidth="1" fill="none" />
        <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke={colors.outerBorder} strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="20" r="2.5" fill={colors.outerBorder} />
      </g>
      {/* Bottom Right */}
      <g transform="translate(755, 560) scale(-1, -1)">
        <path d="M 0 0 L 0 50 A 50 50 0 0 1 50 0 L 0 0 Z" fill={colors.textAccent} fillOpacity="0.02" />
        <path d="M 5 5 L 5 40 C 5 25, 25 5, 40 5" stroke={colors.textAccent} strokeWidth="1.5" fill="none" />
        <path d="M 12 12 L 12 30 C 12 20, 20 12, 30 12" stroke={colors.outerBorder} strokeWidth="1" fill="none" />
        <path d="M 0 45 C 10 45, 15 35, 15 30 C 15 20, 30 15, 35 15 C 45 15, 45 0, 45 0" stroke={colors.outerBorder} strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="20" r="2.5" fill={colors.outerBorder} />
      </g>

      {/* Side flourishes (Left and Right Center) */}
      <g transform="translate(25, 292.5)">
        <path d="M 0 -25 C 12 -18, 12 18, 0 25" stroke={colors.outerBorder} strokeWidth="2" />
        <path d="M 0 -12 C 6 -8, 6 8, 0 12" stroke={colors.textAccent} strokeWidth="1.2" />
        <circle cx="8" cy="0" r="2.5" fill={colors.outerBorder} />
      </g>
      <g transform="translate(755, 292.5) scale(-1, 1)">
        <path d="M 0 -25 C 12 -18, 12 18, 0 25" stroke={colors.outerBorder} strokeWidth="2" />
        <path d="M 0 -12 C 6 -8, 6 8, 0 12" stroke={colors.textAccent} strokeWidth="1.2" />
        <circle cx="8" cy="0" r="2.5" fill={colors.outerBorder} />
      </g>
    </svg>
  </div>
);

// Helper component for the authentic metallic seal
const GoldSeal = ({ color }) => (
  <div className="relative flex items-center justify-center shrink-0 w-11 h-11">
    <svg className="absolute w-11 h-11" viewBox="0 0 100 100" style={{ fill: color }}>
      <path d="M50 0 L58 15 L74 8 L76 25 L92 24 L88 40 L100 44 L92 58 L98 74 L82 76 L80 92 L64 88 L58 100 L44 92 L30 98 L24 82 L8 80 L12 64 L0 58 L8 44 L2 28 L18 26 L16 10 L32 14 Z" />
    </svg>
    <div className="absolute w-8.5 h-8.5 rounded-full bg-white flex items-center justify-center shadow-inner border border-dashed" style={{ borderColor: `${color}80` }}>
      <Award className="w-5.5 h-5.5" style={{ color: color }} />
    </div>
  </div>
);



export default function Certificates({
  certificates,
  events,
  API_BASE_URL,
  token,
  onGenerateSuccess
}) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // Template Designer states (customizable via sidebar)
  const [organizationName, setOrganizationName] = useState('Tech Frontiers');
  const [supportedBy, setSupportedBy] = useState('Supported by Eventra');
  const [customDescription, setCustomDescription] = useState('');
  const [presidentName, setPresidentName] = useState('Prof. Samantha Smith');
  const [presidentTitle, setPresidentTitle] = useState('Director');
  const [chairmanName, setChairmanName] = useState('Dr. Alex Carter');
  const [chairmanTitle, setChairmanTitle] = useState('Chairman of Eventra');
  const [certificateTheme, setCertificateTheme] = useState('dark-emerald');

  // Load template settings when event selection changes
  useEffect(() => {
    if (selectedEventId) {
      fetch(`${API_BASE_URL}/organizer/certificates/settings/${selectedEventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data) {
            setOrganizationName(data.organization_name || '');
            setSupportedBy(data.supported_by || 'Supported by Eventra');
            setCustomDescription(data.description || '');
            setPresidentName(data.president_name || '');
            setPresidentTitle(data.president_title || 'Director');
            setChairmanName(data.chairman_name || 'Dr. Alex Carter');
            setChairmanTitle(data.chairman_title || 'Chairman of Eventra');
            setCertificateTheme(data.theme || 'dark-emerald');
          }
        })
        .catch(err => console.error("Error loading certificate settings", err));
    }
  }, [selectedEventId]);

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    if (!selectedEventId) {
      alert('Please select an event first.');
      return;
    }

    setIsSavingSettings(true);
    fetch(`${API_BASE_URL}/organizer/certificates/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        event_id: selectedEventId,
        organization_name: organizationName,
        supported_by: supportedBy,
        description: customDescription,
        president_name: presidentName,
        president_title: presidentTitle,
        chairman_name: chairmanName,
        chairman_title: chairmanTitle,
        theme: certificateTheme
      })
    })
      .then(async (res) => {
        const data = await res.json();
        setIsSavingSettings(false);
        if (res.ok) {
          alert(data.message || 'Template settings saved successfully.');
        } else {
          alert(data.message || 'Failed to save settings.');
        }
      })
      .catch((err) => {
        setIsSavingSettings(false);
        console.error(err);
        alert('Network error. Failed to save settings.');
      });
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      alert('Please select an event.');
      return;
    }

    // Auto-save settings first
    handleSaveSettings();

    setIsGenerating(true);
    fetch(`${API_BASE_URL}/organizer/certificates/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ event_id: selectedEventId })
    })
      .then(async (res) => {
        const data = await res.json();
        setIsGenerating(false);
        if (res.ok) {
          alert(data.message || 'Certificates successfully generated.');
          setSelectedEventId('');
          onGenerateSuccess();
        } else {
          alert(data.message || 'Failed to generate certificates.');
        }
      })
      .catch((err) => {
        setIsGenerating(false);
        console.error(err);
        alert('Network error. Failed to generate certificates.');
      });
  };

  const handleSendEmail = (id) => {
    setActiveAction(`send-${id}`);
    fetch(`${API_BASE_URL}/organizer/certificates/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ certificate_id: id })
    })
      .then(async (res) => {
        const data = await res.json();
        setActiveAction(null);
        if (res.ok) {
          alert(data.message || 'Simulated certificate email dispatched.');
        } else {
          alert(data.message || 'Failed to dispatch email.');
        }
      })
      .catch((err) => {
        setActiveAction(null);
        console.error(err);
        alert('Network error. Failed to send email.');
      });
  };

  // Extract selected event details
  const selectedEvent = events && events.find(e => e.id.toString() === selectedEventId.toString());
  const selectedEventTitle = selectedEvent ? selectedEvent.title : '';

  return (
    <div className="space-y-8 font-outfit text-left animate-fade-in select-none">

      {/* ── Certificates Generator Panel & Template Designer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Generator & Settings (5/12 width) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight pb-3 border-b border-slate-50">
              Certificate Generator
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Generate credentials for all participants who registered and attended your events.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Select Event</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="">Choose a completed event...</option>
                {events && events.map(evt => (
                  <option key={evt.id} value={evt.id}>{evt.title} ({evt.registrations} Attendees)</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 pt-3 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Template Customizations</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-gray-700">Organization Name</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-gray-700">Supported By Label</label>
                  <input
                    type="text"
                    value={supportedBy}
                    onChange={(e) => setSupportedBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-gray-700">Custom Description (Optional)</label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="E.g., For active participation, engagement, and successful completion of the learning modules..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none text-[10px]"
                  />
                </div>

                <div className="space-y-1 col-span-2 border-t pt-2 border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Left: Eventra Chairman Signature</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-700">Chairman Name</label>
                  <input
                    type="text"
                    value={chairmanName}
                    onChange={(e) => setChairmanName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-700">Chairman Title</label>
                  <input
                    type="text"
                    value={chairmanTitle}
                    onChange={(e) => setChairmanTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2 border-t pt-2 border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Right: Organization President Signature</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-700">President Name</label>
                  <input
                    type="text"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-700">President Title</label>
                  <input
                    type="text"
                    value={presidentTitle}
                    onChange={(e) => setPresidentTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-gray-700">Design Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark-emerald', name: 'Emerald' },
                    { id: 'gold-lux', name: 'Lux Gold' },
                    { id: 'sapphire-blue', name: 'Sapphire' }
                  ].map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCertificateTheme(theme.id)}
                      className={`py-2 px-3 border rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer text-center transition-all ${certificateTheme === theme.id
                          ? 'border-[#2E6F40] bg-[#2E6F40]/5 text-[#2E6F40]'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSavingSettings || !selectedEventId}
                className="w-1/2 py-3 border border-slate-200 hover:border-slate-400 text-gray-600 hover:text-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Template</span>
                )}
              </button>
              <button
                type="submit"
                disabled={isGenerating || !selectedEventId}
                className="w-1/2 flex items-center justify-center space-x-1.5 bg-[#2E6F40] hover:bg-[#235431] text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-md shadow-[#2E6F40]/10 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4" />
                    <span>Generate Certs</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Design Mockup Preview (7/12 width) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight pb-3 border-b border-slate-50">
              Live Template Preview
            </h3>
          </div>

          {/* Certificate Frame preview */}
          {(() => {
            const themeColors = {
              'dark-emerald': {
                outerBorder: '#C5A880',
                textAccent: '#2E6F40',
                textPrimary: '#0C3B2E',
                sealColor: '#C5A880',
                gradientName: 'linear-gradient(to right, #B8860B, #E2BA6E, #B8860B)',
              },
              'gold-lux': {
                outerBorder: '#D4AF37',
                textAccent: '#8A6623',
                textPrimary: '#4A3B18',
                sealColor: '#D4AF37',
                gradientName: 'linear-gradient(to right, #8A6623, #D4AF37, #8A6623)',
              },
              'sapphire-blue': {
                outerBorder: '#94A3B8',
                textAccent: '#1E3A8A',
                textPrimary: '#0B1E36',
                sealColor: '#94A3B8',
                gradientName: 'linear-gradient(to right, #1E3A8A, #60A5FA, #1E3A8A)',
              }
            };
            const activeColors = themeColors[certificateTheme] || themeColors['dark-emerald'];
            return (
              <div
                className="my-6 relative rounded-2xl p-4 overflow-hidden aspect-[4/3] max-w-md mx-auto shadow-2xl flex flex-col justify-between items-center text-center transition-all duration-500"
                style={{
                  background: '#FFFFFF'
                }}
              >
                {/* Embedded styles for premium fonts */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Great+Vibes&family=Alex+Brush&display=swap');
                    .cert-font-cinzel { font-family: 'Cinzel', serif; }
                    .cert-font-signature { font-family: 'Great Vibes', cursive; }
                    .cert-font-handwritten { font-family: 'Alex Brush', cursive; white-space: nowrap; }
                  `
                }} />

                {/* Ornate Certificate Border & Pinstripes Background */}
                <CertificateBorder colors={activeColors} />

                {/* Content Container (Padded so it is inside the border frame) */}
                <div className="w-full h-full pt-[25px] px-8 pb-[42px] flex flex-col justify-between items-center z-10 relative">

                  {/* Top Logo */}
                  <div className="flex flex-col items-center mt-1">
                    <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" stroke={activeColors.outerBorder} strokeWidth="6" fill={activeColors.textAccent} />
                      <path d="M50 25 L58 41 L76 44 L63 56 L66 74 L50 65 L34 74 L37 56 L24 44 L42 41 Z" fill={activeColors.outerBorder} />
                    </svg>
                    <span className="text-[7.5px] font-black tracking-widest mt-1 uppercase" style={{ color: activeColors.textPrimary }}>{organizationName || 'ORGANIZATION NAME'}</span>
                    <span className="text-[5.5px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{supportedBy || 'SUPPORTED BY EVENTRA'}</span>
                  </div>

                  {/* Headings */}
                  <div className="space-y-1.5 mt-1">
                    <h1 className="text-[12px] font-bold tracking-widest uppercase cert-font-cinzel" style={{ color: activeColors.textPrimary }}>
                      Certificate of Participation
                    </h1>
                    {/* Decorative gold divider */}
                    <div className="flex justify-center">
                      <svg className="h-2 w-32" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 5 Q 25 2, 50 5 T 100 5" stroke={activeColors.outerBorder} strokeWidth="1.5" />
                        <circle cx="50" cy="5" r="2.5" fill={activeColors.outerBorder} />
                        <circle cx="43" cy="5" r="1.2" fill={activeColors.textAccent} />
                        <circle cx="57" cy="5" r="1.2" fill={activeColors.textAccent} />
                      </svg>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="flex flex-col items-center my-1">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">This Certificate is Presented to</span>
                    <h2
                      className="text-2xl sm:text-3xl font-normal cert-font-signature my-1 text-center"
                      style={{
                        background: activeColors.gradientName,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: activeColors.outerBorder // Fallback
                      }}
                    >
                      John Doe
                    </h2>
                    <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
                  </div>

                  {/* Description */}
                  <p className="text-[8.5px] text-slate-500 leading-relaxed max-w-xs px-2 font-semibold">
                    {customDescription || `For active participation, engagement, and successful completion of the learning modules in the workshop and conference event "${selectedEventTitle || 'Tech Innovation Seminar'}" hosted by ${organizationName || 'Tech Frontiers'} and verify-logged on the Eventra software architecture.`}
                  </p>

                  {/* Footer Row */}
                  <div className="w-full flex items-end justify-between px-2 mb-1">
                    {/* Left: Eventra Chairman Signature */}
                    <div className="text-center w-24 flex flex-col items-center">
                      <div className="cert-font-handwritten text-[13px] text-[#0C3B2E] h-5 leading-5">
                        {chairmanName || 'Dr. Alex Carter'}
                      </div>
                      <div className="w-full border-b" style={{ borderColor: `${activeColors.outerBorder}50` }} />
                      <span className="text-[5px] font-black text-slate-700 uppercase tracking-wider mt-1 truncate max-w-[80px]">
                        {chairmanName || 'Dr. Alex Carter'}
                      </span>
                      <span className="text-[4.5px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[80px]">
                        {chairmanTitle || 'Chairman of Eventra'}
                      </span>
                      <span className="text-[4px] font-bold text-slate-400 uppercase tracking-widest">
                        Eventra Chairman
                      </span>
                    </div>

                    {/* Middle: Gold Seal */}
                    <GoldSeal color={activeColors.sealColor} />

                    {/* Right: Organization President/Director Signature */}
                    <div className="text-center w-24 flex flex-col items-center">
                      <div className="cert-font-handwritten text-[13px] text-[#0C3B2E] h-5 leading-5">
                        {presidentName || 'Representative'}
                      </div>
                      <div className="w-full border-b" style={{ borderColor: `${activeColors.outerBorder}50` }} />
                      <span className="text-[5px] font-black text-slate-700 uppercase tracking-wider mt-1 truncate max-w-[80px]">
                        {presidentName || 'Representative'}
                      </span>
                      <span className="text-[4.5px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[80px]" title={organizationName}>
                        {organizationName || 'Host Organizer'}
                      </span>
                      <span className="text-[4px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[80px]">
                        {presidentTitle || 'Director'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* ── Issued Certificates List ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8">
        <div className="pb-5 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Issued Credentials Log</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Browse through credentials generated and simulate email dispatch.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto select-text">
          {certificates && certificates.length > 0 ? (
            <table className="w-full border-collapse text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pr-4">Recipient Name</th>
                  <th className="pb-3.5 px-4">Event Program</th>
                  <th className="pb-3.5 px-4">Credential Code</th>
                  <th className="pb-3.5 px-4">Issue Date</th>
                  <th className="pb-3.5 pl-4 text-right">Email Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 pr-4">
                      <p className="font-extrabold text-slate-800 text-sm">{cert.participant_name}</p>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800 max-w-[200px] truncate" title={cert.event_name}>
                      {cert.event_name}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      {cert.certificate_code}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {cert.issue_date_text || cert.issue_date}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <button
                        onClick={() => handleSendEmail(cert.id)}
                        disabled={activeAction === `send-${cert.id}`}
                        className="inline-flex items-center space-x-1.5 py-1.5 px-3 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 bg-white rounded-xl font-bold cursor-pointer transition-colors"
                      >
                        {activeAction === `send-${cert.id}` ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700" />
                        )}
                        <span>Email Certificate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-2.5">
              <Award className="h-8 w-8 text-slate-300" />
              <p>No certificates generated yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
