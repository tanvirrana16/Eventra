@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Footer & Brand Management</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Configure global support link menus, site copyrights, brand logos, and branch office contacts.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Site Info & Contacts (7 cols) -->
        <div class="lg:col-span-7 space-y-8">
            <!-- Brand Section -->
            <form action="{{ route('admin.footer.update') }}" method="POST" enctype="multipart/form-data" class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-6">
                @csrf
                <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <i data-lucide="award" class="h-5 w-5 text-brand-accent"></i>
                    <span>Brand Details & Copyright</span>
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Brand Title -->
                    <div class="space-y-1">
                        <label for="brand_title" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Website Title</label>
                        <input type="text" name="brand_title" id="brand_title" value="{{ old('brand_title', $footer['brand_title']) }}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all" />
                    </div>
                    <!-- Brand Copyright -->
                    <div class="space-y-1">
                        <label for="brand_copyright" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Copyright Text</label>
                        <input type="text" name="brand_copyright" id="brand_copyright" value="{{ old('brand_copyright', $footer['brand_copyright']) }}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all" />
                    </div>
                </div>

                <!-- Brand Desc -->
                <div class="space-y-1">
                    <label for="brand_desc" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                    <textarea name="brand_desc" id="brand_desc" rows="3" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all">{{ old('brand_desc', $footer['brand_desc']) }}</textarea>
                </div>

                <!-- Logo Image file -->
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Replace Logo Image (Optional)</label>
                    <input type="file" name="logo" class="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent hover:file:bg-emerald-100" />
                </div>

                <!-- Offices Contacts -->
                <div class="border-t border-slate-100 pt-6 space-y-6">
                    <h4 class="font-bold text-slate-800 text-sm flex items-center space-x-2">
                        <i data-lucide="map-pin" class="h-4.5 w-4.5 text-brand-accent"></i>
                        <span>Contact Info Offices</span>
                    </h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Global Office -->
                        <div class="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Head Office</span>
                            <div class="space-y-2">
                                <input type="text" name="contact_global_heading" value="{{ $footer['contact_global_heading'] }}" placeholder="Heading Title" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white" />
                                <input type="text" name="contact_global_phone" value="{{ $footer['contact_global_phone'] }}" placeholder="Phone Number" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white" />
                                <input type="email" name="contact_global_email" value="{{ $footer['contact_global_email'] }}" placeholder="Email Address" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white" />
                            </div>
                        </div>

                        <!-- Bangladesh Office -->
                        <div class="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bangladesh Branch</span>
                            <div class="space-y-2">
                                <input type="text" name="contact_bd_heading" value="{{ $footer['contact_bd_heading'] }}" placeholder="Heading Title" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white" />
                                <input type="text" name="contact_bd_phone" value="{{ $footer['contact_bd_phone'] }}" placeholder="Phone Number" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white" />
                                <input type="email" name="contact_bd_email" value="{{ $footer['contact_bd_email'] }}" placeholder="Email Address" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors">
                    Save Branding Settings
                </button>
            </form>
        </div>

        <!-- Right Column: Navigation Link CRUD (5 cols) -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-6">
            <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <i data-lucide="link-2" class="h-5 w-5 text-brand-accent"></i>
                    <span>Footer Navigation Links</span>
                </h3>
                <button onclick="toggleModal('add-link-modal')" class="text-xs bg-brand-accent text-white font-bold px-3 py-1.5 rounded-xl hover:bg-brand-sidebar transition-colors">
                    + Add Link
                </button>
            </div>

            <!-- Links list divided by type -->
            <div class="space-y-6">
                <!-- Support Links -->
                <div>
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                        <i data-lucide="help-circle" class="h-4 w-4"></i>
                        <span>Support Links</span>
                    </h4>
                    <div class="space-y-2">
                        @forelse($links->where('type', 'support') as $link)
                            <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                                <div>
                                    <p class="text-xs font-bold text-slate-800">{{ $link->name }}</p>
                                    <p class="text-[9px] text-slate-400 mt-0.5 truncate max-w-[150px]">{{ $link->url }}</p>
                                </div>
                                <div class="flex items-center space-x-1.5">
                                    <span class="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md">Order: {{ $link->display_order }}</span>
                                    <button onclick="editLink({{ json_encode($link) }})" class="p-1 text-slate-500 hover:text-brand-accent"><i data-lucide="pencil" class="h-3.5 w-3.5"></i></button>
                                    <form action="{{ route('admin.footer.links.destroy', $link) }}" method="POST" class="inline" onsubmit="return confirm('Delete this link?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1 text-slate-500 hover:text-rose-600"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i></button>
                                    </form>
                                </div>
                            </div>
                        @empty
                            <p class="text-center text-[10px] text-slate-400 py-3 font-medium">No support links.</p>
                        @endforelse
                    </div>
                </div>

                <!-- Eventra Links -->
                <div>
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span>Eventra Links</span>
                    </h4>
                    <div class="space-y-2">
                        @forelse($links->where('type', 'eventra') as $link)
                            <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                                <div>
                                    <p class="text-xs font-bold text-slate-800">{{ $link->name }}</p>
                                    <p class="text-[9px] text-slate-400 mt-0.5 truncate max-w-[150px]">{{ $link->url }}</p>
                                </div>
                                <div class="flex items-center space-x-1.5">
                                    <span class="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md">Order: {{ $link->display_order }}</span>
                                    <button onclick="editLink({{ json_encode($link) }})" class="p-1 text-slate-500 hover:text-brand-accent"><i data-lucide="pencil" class="h-3.5 w-3.5"></i></button>
                                    <form action="{{ route('admin.footer.links.destroy', $link) }}" method="POST" class="inline" onsubmit="return confirm('Delete this link?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1 text-slate-500 hover:text-rose-600"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i></button>
                                    </form>
                                </div>
                            </div>
                        @empty
                            <p class="text-center text-[10px] text-slate-400 py-3 font-medium">No eventra links.</p>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Add Link Modal -->
<div id="add-link-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Footer Link</h3>
            <button onclick="toggleModal('add-link-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.footer.links.store') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <!-- Link Type -->
            <div class="space-y-1">
                <label for="type" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Menu Category</label>
                <select name="type" id="type" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold">
                    <option value="support">Support Link</option>
                    <option value="eventra">Eventra Link</option>
                </select>
            </div>
            <!-- Link Name -->
            <div class="space-y-1">
                <label for="name" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Link Name / Title</label>
                <input type="text" name="name" id="name" required placeholder="e.g. Terms & Conditions" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- URL -->
            <div class="space-y-1">
                <label for="url" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Destination URL</label>
                <input type="text" name="url" id="url" required placeholder="e.g. /terms" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Order -->
                <div class="space-y-1">
                    <label for="display_order" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Display Order</label>
                    <input type="number" name="display_order" id="display_order" value="0" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Active Toggle -->
                <div class="flex items-center space-x-2 pt-6">
                    <input type="checkbox" name="is_active" id="is_active" checked class="h-4.5 w-4.5 rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                    <label for="is_active" class="text-xs font-bold text-slate-600">Active Link</label>
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-link-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Add Link</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Link Modal -->
<div id="edit-link-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Footer Link</h3>
            <button onclick="toggleModal('edit-link-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-link-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <!-- Link Name -->
            <div class="space-y-1">
                <label for="edit_name" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Link Name / Title</label>
                <input type="text" name="name" id="edit_name" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- URL -->
            <div class="space-y-1">
                <label for="edit_url" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Destination URL</label>
                <input type="text" name="url" id="edit_url" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Order -->
                <div class="space-y-1">
                    <label for="edit_display_order" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Display Order</label>
                    <input type="number" name="display_order" id="edit_display_order" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Active Toggle -->
                <div class="flex items-center space-x-2 pt-6">
                    <input type="checkbox" name="is_active" id="edit_is_active" class="h-4.5 w-4.5 rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                    <label for="edit_is_active" class="text-xs font-bold text-slate-600">Active Link</label>
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-link-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<script>
    function toggleModal(id) {
        const modal = document.getElementById(id);
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    }

    function editLink(link) {
        const form = document.getElementById('edit-link-form');
        form.action = `/admin/footer/links/${link.id}`;

        document.getElementById('edit_name').value = link.name;
        document.getElementById('edit_url').value = link.url;
        document.getElementById('edit_display_order').value = link.display_order || 0;
        document.getElementById('edit_is_active').checked = !!link.is_active;

        toggleModal('edit-link-modal');
    }
</script>
@endsection
