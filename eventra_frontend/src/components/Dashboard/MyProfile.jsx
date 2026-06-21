import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Building2, 
  MapPin, 
  Upload, 
  Trash2,
  Check, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

export default function MyProfile({ user, onProfileUpdate, API_BASE_URL, token }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || '',
    occupation: user?.occupation || '',
    organization_name: user?.organization_name || user?.organizationName || '',
    address: user?.address || '',
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
      date_of_birth: user?.date_of_birth || '',
      gender: user?.gender || '',
      occupation: user?.occupation || '',
      organization_name: user?.organization_name || user?.organizationName || '',
      address: user?.address || '',
      profile_photo: user?.profile_photo || '',
    });
    setPhotoPreview(user?.profile_photo || null);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
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
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in">
      
      <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Profile Information</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Update your personal details, occupation, and contact address.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Account ID: {user?.id}</span>
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
              src={photoPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
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
            <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">Profile Photo</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-sm text-justify">
              Upload a premium photo of yourself. PNG, JPG, or JPEG accepted, maximum 2MB size limit.
            </p>
            <div className="pt-2.5 flex items-center justify-center sm:justify-start space-x-3">
              <label className="flex items-center space-x-1.5 py-2 px-4 border border-[#2E6F40] hover:bg-[#2E6F40] hover:text-white text-[#2E6F40] rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload New</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="Your Full Name"
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

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Phone Number
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

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Date of Birth
            </label>
            <div className="relative group">
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
              />
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.date_of_birth && <p className="text-xs text-rose-600 font-bold">✔ {errors.date_of_birth[0]}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-rose-600 font-bold">✔ {errors.gender[0]}</p>}
          </div>

          {/* Occupation */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Occupation
            </label>
            <div className="relative group">
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="e.g. Student, Software Engineer"
              />
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.occupation && <p className="text-xs text-rose-600 font-bold">✔ {errors.occupation[0]}</p>}
          </div>

          {/* Organization / University */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Organization / University
            </label>
            <div className="relative group">
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="University or Company Name"
              />
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.organization_name && <p className="text-xs text-rose-600 font-bold">✔ {errors.organization_name[0]}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Address
            </label>
            <div className="relative group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                placeholder="Full Location Address"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
            </div>
            {errors.address && <p className="text-xs text-rose-600 font-bold">✔ {errors.address[0]}</p>}
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
