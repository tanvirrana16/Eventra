import { useState } from 'react';
import { 
  KeyRound, 
  Eye, 
  EyeOff, 
  Loader2,
  Check,
  AlertCircle,
  Smartphone,
  MapPin,
  Clock
} from 'lucide-react';

export default function OrganizerAccountSettings({ 
  user, 
  onSettingsUpdate, 
  API_BASE_URL, 
  token
}) {
  // Password States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdStatus, setPwdStatus] = useState(null);
  const [pwdStatusMsg, setPwdStatusMsg] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Settings Toggles (Privacy)
  const [privacySettings, setPrivacySettings] = useState({
    twoFactorEnabled: user?.two_factor_enabled ?? false,
    emailNotifications: user?.email_notifications ?? true,
    smsNotifications: user?.sms_notifications ?? false,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwdStatus('error');
      setPwdStatusMsg('New passwords do not match.');
      return;
    }

    setPwdLoading(true);
    setPwdStatus(null);

    fetch(`${API_BASE_URL}/organizer/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(passwordForm),
    })
      .then(async (res) => {
        const data = await res.json();
        setPwdLoading(false);
        if (res.ok) {
          setPwdStatus('success');
          setPwdStatusMsg(data.message || 'Password updated successfully.');
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          setPwdStatus('error');
          let msg = data.message || 'Failed to update password.';
          if (data.errors) {
            msg = Object.values(data.errors).flat().join(' ');
          }
          setPwdStatusMsg(msg);
        }
      })
      .catch((err) => {
        setPwdLoading(false);
        setPwdStatus('error');
        setPwdStatusMsg('Network error. Failed to change password.');
        console.error(err);
      });
  };

  const handleToggle = (key) => {
    const newVal = !privacySettings[key];
    setPrivacySettings(prev => ({ ...prev, [key]: newVal }));
    setSettingsLoading(true);

    fetch(`${API_BASE_URL}/organizer/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...privacySettings, [key]: newVal }),
    })
      .then(async (res) => {
        const data = await res.json();
        setSettingsLoading(false);
        if (res.ok) {
          if (onSettingsUpdate) onSettingsUpdate(data.user);
        } else {
          alert('Failed to save settings configurations.');
        }
      })
      .catch((err) => {
        setSettingsLoading(false);
        console.error(err);
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-outfit text-left animate-fade-in pb-12 select-none">
      
      {/* Change Password Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8">
        <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Security Credentials</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
              Update your account password regularly to keep your credentials safe.
            </p>
          </div>
          <KeyRound className="h-5 w-5 text-[#2E6F40] hidden sm:block" />
        </div>

        {pwdStatus && (
          <div className={`p-4 rounded-xl border mt-5 flex items-start space-x-3 text-sm animate-fade-in shadow-sm ${
            pwdStatus === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="shrink-0 mt-0.5">
              {pwdStatus === 'success' ? (
                <Check className="h-5 w-5 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-600" />
              )}
            </div>
            <div className="font-semibold">{pwdStatusMsg}</div>
          </div>
        )}

        <form onSubmit={submitPasswordChange} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 select-text">
          {/* Current */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Password
            </label>
            <div className="relative group">
              <input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Current Password"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* New */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              New Password
            </label>
            <div className="relative group">
              <input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="New Password"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Confirm Password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={pwdLoading}
              className="flex items-center justify-center space-x-2 bg-[#2E6F40] hover:bg-[#235431] text-white py-2.5 px-6 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all duration-200 disabled:opacity-85 cursor-pointer"
            >
              {pwdLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Preferences & Toggle Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Toggle Controls */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-50">
              <h3 className="font-extrabold text-slate-800 text-base">Portal Preferences</h3>
              <p className="text-xs text-slate-400 mt-0.5">Toggle notifications and security logs.</p>
            </div>

            <div className="mt-5 space-y-4">
              
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Two-Factor Authentication</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[240px]">
                    Validate log-ins using secure secondary device verification code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('twoFactorEnabled')}
                  disabled={settingsLoading}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    privacySettings.twoFactorEnabled ? 'bg-[#2E6F40]' : 'bg-slate-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    privacySettings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Email Toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Email Alerts</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[240px]">
                    Receive registrations digests, updates, and reviews from attendees.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('emailNotifications')}
                  disabled={settingsLoading}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    privacySettings.emailNotifications ? 'bg-[#2E6F40]' : 'bg-slate-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    privacySettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* SMS Toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">SMS Broadcasts</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[240px]">
                    Instant notifications when ticket capacity limit is hit or changes happen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('smsNotifications')}
                  disabled={settingsLoading}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    privacySettings.smsNotifications ? 'bg-[#2E6F40]' : 'bg-slate-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    privacySettings.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          </div>

          {settingsLoading && (
            <p className="text-[10px] text-[#2E6F40] font-bold mt-4 uppercase animate-pulse flex items-center space-x-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving Configurations...</span>
            </p>
          )}
        </div>

        {/* Security / Activity Logs */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-4">
          <div className="pb-4 border-b border-slate-50 text-left">
            <h3 className="font-extrabold text-slate-800 text-base">Organizer Portal Session</h3>
            <p className="text-xs text-slate-400 mt-0.5">Audit trail of verified access points.</p>
          </div>

          <div className="space-y-4">
            
            {/* Device 1 */}
            <div className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <Smartphone className="h-5 w-5 text-[#2E6F40] shrink-0 mt-0.5" />
              <div className="text-left font-semibold text-xs text-slate-600">
                <p className="font-bold text-slate-800">Chrome Browser on Windows 10 PC</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="flex items-center text-[#2E6F40] font-bold uppercase text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active Session
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 text-slate-400 mr-0.5" /> Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>

            {/* Device 2 */}
            <div className="flex items-start space-x-3 p-3 bg-slate-50/50 border border-slate-100/50 rounded-xl opacity-80">
              <Smartphone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-left font-semibold text-xs text-slate-500">
                <p className="font-bold text-slate-700">Safari Browser on iOS Mobile</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 text-slate-400 mr-0.5" /> 3 days ago
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 text-slate-400 mr-0.5" /> Khulna, BD
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
