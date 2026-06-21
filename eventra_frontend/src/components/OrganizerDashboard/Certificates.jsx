import { useState } from 'react';
import { 
  Award, 
  Send, 
  Loader2
} from 'lucide-react';

export default function Certificates({ 
  certificates, 
  events, 
  API_BASE_URL, 
  token, 
  onGenerateSuccess 
}) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // Template Designer state (for premium look)
  const [signeeName, setSigneeName] = useState('Prof. Samantha Smith');
  const [signeeTitle, setSigneeTitle] = useState('Eventra Director');
  const [certificateTheme, setCertificateTheme] = useState('dark-emerald');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      alert('Please select an event.');
      return;
    }

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
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-700">Signee Name</label>
                  <input 
                    type="text" 
                    value={signeeName}
                    onChange={(e) => setSigneeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-700">Signee Title</label>
                  <input 
                    type="text" 
                    value={signeeTitle}
                    onChange={(e) => setSigneeTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
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
                      className={`py-2 px-3 border rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer text-center transition-all ${
                        certificateTheme === theme.id 
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

            <button
              type="submit"
              disabled={isGenerating || !selectedEventId}
              className="w-full mt-4 flex items-center justify-center space-x-2 bg-[#2E6F40] hover:bg-[#235431] text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-md shadow-[#2E6F40]/10 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Generating credentials...</span>
                </>
              ) : (
                <>
                  <Award className="h-4.5 w-4.5" />
                  <span>Generate Certificates</span>
                </>
              )}
            </button>
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
          <div className="my-6 relative border-8 border-slate-800/80 rounded-2xl bg-white p-8 overflow-hidden aspect-[4/3] max-w-md mx-auto shadow-inner flex flex-col justify-between items-center text-center">
            {/* Background design ornaments */}
            <div className={`absolute -top-10 -left-10 w-28 h-28 rounded-full opacity-10 blur-xl ${
              certificateTheme === 'dark-emerald' ? 'bg-emerald-500' : (certificateTheme === 'gold-lux' ? 'bg-amber-500' : 'bg-blue-500')
            }`} />
            <div className={`absolute -bottom-10 -right-10 w-28 h-28 rounded-full opacity-10 blur-xl ${
              certificateTheme === 'dark-emerald' ? 'bg-emerald-500' : (certificateTheme === 'gold-lux' ? 'bg-amber-500' : 'bg-blue-500')
            }`} />

            {/* Inner Border */}
            <div className={`w-full h-full border border-dashed rounded-lg p-6 flex flex-col justify-between items-center ${
              certificateTheme === 'dark-emerald' ? 'border-emerald-300/40' : (certificateTheme === 'gold-lux' ? 'border-amber-300/40' : 'border-blue-300/40')
            }`}>
              
              {/* Header Badge */}
              <div className="flex flex-col items-center space-y-1 mt-2">
                <Award className={`h-8 w-8 ${
                  certificateTheme === 'dark-emerald' ? 'text-emerald-700' : (certificateTheme === 'gold-lux' ? 'text-amber-500' : 'text-blue-700')
                }`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Certificate of Participation</span>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-400 uppercase italic">This is proudly presented to</span>
                <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-1 px-8 min-w-[200px]">John Doe</h2>
                <p className="text-[9px] text-slate-400 leading-normal max-w-xs px-4">
                  For actively participating and completing the hosted workshop program, satisfying all requirements of the program coordinator.
                </p>
              </div>

              {/* Signatures */}
              <div className="w-full flex items-center justify-between px-6 mb-2">
                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-16 border-b border-slate-300 font-mono text-[9px] italic text-slate-400 flex items-end justify-center">Eventra Team</div>
                  <span className="text-[8px] font-extrabold text-slate-400 mt-1 uppercase">Coordinator</span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-20 border-b border-slate-300 font-mono text-[9px] italic text-emerald-800 flex items-end justify-center font-bold">
                    {signeeName || 'Representative'}
                  </div>
                  <span className="text-[8px] font-extrabold text-slate-400 mt-1 uppercase truncate max-w-[90px]">{signeeTitle || 'Director'}</span>
                </div>
              </div>

            </div>
          </div>
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
