import { useState } from 'react';
import { 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Loader2,
  Check,
  AlertCircle,
  Smartphone,
  MapPin,
  Clock
} from 'lucide-react';

export default function AccountSettings({ 
  user, 
  onSettingsUpdate, 
  API_BASE_URL, 
  token,
  handleLogout 
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
    eventRecommendations: user?.event_recommendations ?? true,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Delete Account States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

    fetch(`${API_BASE_URL}/user/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

    fetch(`${API_BASE_URL}/user/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError('');

    fetch(`${API_BASE_URL}/user/account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password: deletePassword }),
    })
      .then(async (res) => {
        const data = await res.json();
        setDeleteLoading(false);
        if (res.ok) {
          setShowDeleteModal(false);
          alert('Your account was successfully deleted.');
          handleLogout();
        } else {
          setDeleteError(data.message || 'Incorrect password.');
        }
      })
      .catch((err) => {
        setDeleteLoading(false);
        setDeleteError('Network error. Account deletion failed.');
        console.error(err);
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-outfit text-left animate-fade-in pb-12">
      
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

        <form onSubmit={submitPasswordChange} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              <h3 className="font-extrabold text-slate-800 text-base">Privacy Preferences</h3>
              <p className="text-xs text-slate-400 mt-0.5">Toggle alert messages and system data sharing.</p>
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
                    Receive digital passes, updates, and feedback requests.
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
                    Direct messaging alerts for urgent gate schedules.
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

              {/* Recommendations */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Smart Suggestions</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[240px]">
                    Let our algorithms recommend nearby summits matching your interests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('eventRecommendations')}
                  disabled={settingsLoading}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    privacySettings.eventRecommendations ? 'bg-[#2E6F40]' : 'bg-slate-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    privacySettings.eventRecommendations ? 'translate-x-5' : 'translate-x-0'
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
            <h3 className="font-extrabold text-slate-800 text-base">Active Logins & Device Log</h3>
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
                <p className="font-bold text-slate-700">Safari Browser on Apple iPhone 15</p>
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

      {/* Danger Zone: Delete Account */}
      <div className="bg-red-50/20 border border-red-200 rounded-3xl p-6 sm:p-8 text-left space-y-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-0">
        <div className="space-y-1">
          <h3 className="font-extrabold text-red-800 text-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone - Delete Account</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl text-justify font-semibold">
            Permanently delete your account. This action **cannot be undone**. All registration files, digital passes, accomplishments, and certificates will be scrubbed from our database.
          </p>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="shrink-0 py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-red-700/20 transition-all duration-200 cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-fit mx-auto">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Are you absolutely sure?</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-4 font-semibold text-justify">
                Please enter your password below to authorize account deletion. All data will be immediately and irreversibly purged from our servers.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center space-x-1">
                <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <input
                type="password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password to confirm"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-center"
              />

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center space-x-1"
                >
                  {deleteLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
