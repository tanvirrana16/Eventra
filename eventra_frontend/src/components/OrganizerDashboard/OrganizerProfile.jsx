import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Globe, 
  Upload, 
  Trash2,
  Check, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function OrganizerProfile({ user, onProfileUpdate, API_BASE_URL, token }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization_name: user?.organization_name || user?.organizationName || '',
    address: user?.address || '',
    website: user?.website || '',
    social_links: user?.social_links || { facebook: '', linkedin: '' },
    profile_photo: user?.profile_photo || '',
  });

  const [photoPreview, setPhotoPreview] = useState(user?.profile_photo || null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [errors, setErrors] = useState({});

  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      organization_name: user?.organization_name || user?.organizationName || '',
      address: user?.address || '',
      website: user?.website || '',
      social_links: user?.social_links || { facebook: '', linkedin: '' },
      profile_photo: user?.profile_photo || '',
    });
    setPhotoPreview(user?.profile_photo || null);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const field = name.replace('social_', '');
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profile_photo: 'File size must be under 2MB.' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, profile_photo: reader.result }));
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, profile_photo: '' }));
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, profile_photo: 'remove' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    setErrors({});

    fetch(`${API_BASE_URL}/organizer/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        organizationName: formData.organization_name,
        address: formData.address,
        website: formData.website,
        socialLinks: formData.social_links,
        profile_photo: formData.profile_photo,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        setIsLoading(false);
        if (res.ok) {
          setStatus('success');
          setStatusMsg(data.message || 'Profile updated successfully.');
          onProfileUpdate(data.user);
        } else {
          setStatus('error');
          if (data.errors) {
            setErrors(data.errors);
            setStatusMsg('Validation failed. Please check the fields.');
          } else {
            setStatusMsg(data.message || 'Update failed.');
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setStatus('error');
        setStatusMsg('Network error. Failed to save profile.');
        console.error(err);
      });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in select-none">
      
      <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Organization Profile</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Update your organization details, logo/photo, website, and public social links.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Organizer ID: {user?.id}</span>
      </div>

      {status && (
        <div className={`p-4 rounded-xl border mt-5 flex items-start space-x-3 text-sm animate-fade-in shadow-sm ${
          status === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="shrink-0 mt-0.5">
            {status === 'success' ? (
              <Check className="h-5 w-5 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600" />
            )}
          </div>
          <div className="font-semibold">{statusMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        
        {/* Profile Picture Management */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="relative shrink-0">
            <img
              src={photoPreview || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&h=150&q=80'}
              alt="Profile Preview"
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />
            {photoPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-all hover:scale-105"
                title="Remove Photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">Organization Logo / Cover Photo</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-sm text-justify">
              Upload a logo or organization image. PNG, JPG, or JPEG accepted, maximum 2MB size limit.
            </p>
            <div className="pt-2.5 flex items-center justify-center sm:justify-start space-x-3">
              <label className="flex items-center space-x-1.5 py-2 px-4 border border-[#2E6F40] hover:bg-[#2E6F40] hover:text-white text-[#2E6F40] rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.profile_photo && (
              <p className="text-xs text-rose-600 font-bold mt-1">✔ {errors.profile_photo}</p>
            )}
          </div>
        </div>

        {/* Editable Information Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-text">
          
          {/* Contact Person Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Representative Name
            </label>
            <div className="relative group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="Representative / Contact Name"
                required
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.name && <p className="text-xs text-rose-600 font-bold">✔ {errors.name[0]}</p>}
          </div>

          {/* Email Address - disabled */}
          <div className="space-y-1 opacity-70">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-sm font-semibold outline-none cursor-not-allowed"
                disabled
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          {/* Organization / Company Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Organization Name
            </label>
            <div className="relative group">
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="e.g. Acme Tech Events Ltd."
                required
              />
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.organization_name && <p className="text-xs text-rose-600 font-bold">✔ {errors.organization_name[0]}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Contact Phone
            </label>
            <div className="relative group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="Phone Number"
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.phone && <p className="text-xs text-rose-600 font-bold">✔ {errors.phone[0]}</p>}
          </div>

          {/* Website Link */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Website
            </label>
            <div className="relative group">
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="https://yourorganization.com"
              />
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.website && <p className="text-xs text-rose-600 font-bold">✔ {errors.website[0]}</p>}
          </div>

          {/* Location Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Office Address
            </label>
            <div className="relative group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="Full Office Address"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.address && <p className="text-xs text-rose-600 font-bold">✔ {errors.address[0]}</p>}
          </div>

          {/* Facebook URL */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Facebook Profile / Page
            </label>
            <div className="relative group">
              <input
                type="url"
                name="social_facebook"
                value={formData.social_links?.facebook || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="https://facebook.com/yourpage"
              />
              <FacebookIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              LinkedIn Profile / Company Page
            </label>
            <div className="relative group">
              <input
                type="url"
                name="social_linkedin"
                value={formData.social_links?.linkedin || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="https://linkedin.com/company/yourpage"
              />
              <LinkedinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
          </div>

        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-[#2E6F40] hover:bg-[#235431] text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#2E6F40]/10 hover:shadow-lg transition-all duration-200 disabled:opacity-80 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
