@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Homepage Hero Management</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Control the text copy, CTA buttons, and images shown on the landing page hero section.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Side: Hero Text Settings (7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-6">
            <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center space-x-2">
                <i data-lucide="edit-3" class="h-5 w-5 text-brand-accent"></i>
                <span>Hero Left Content settings</span>
            </h3>

            <form action="{{ route('admin.hero.update') }}" method="POST" class="space-y-4">
                @csrf
                <!-- Hero Title -->
                <div class="space-y-1">
                    <label for="hero_title" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Hero Title</label>
                    <input
                        type="text"
                        name="hero_title"
                        id="hero_title"
                        value="{{ old('hero_title', $hero['title']) }}"
                        required
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                    />
                </div>

                <!-- Hero Subtitle -->
                <div class="space-y-1">
                    <label for="hero_subtitle" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Hero Subtitle / Description</label>
                    <textarea
                        name="hero_subtitle"
                        id="hero_subtitle"
                        rows="5"
                        required
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                    >{{ old('hero_subtitle', $hero['subtitle']) }}</textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Btn 1 text -->
                    <div class="space-y-1">
                        <label for="hero_btn1_text" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Primary Button Text</label>
                        <input
                            type="text"
                            name="hero_btn1_text"
                            id="hero_btn1_text"
                            value="{{ old('hero_btn1_text', $hero['btn1_text']) }}"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                        />
                    </div>
                    <!-- Btn 1 url -->
                    <div class="space-y-1">
                        <label for="hero_btn1_url" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Primary Button URL</label>
                        <input
                            type="text"
                            name="hero_btn1_url"
                            id="hero_btn1_url"
                            value="{{ old('hero_btn1_url', $hero['btn1_url']) }}"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Btn 2 text -->
                    <div class="space-y-1">
                        <label for="hero_btn2_text" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Secondary Button Text</label>
                        <input
                            type="text"
                            name="hero_btn2_text"
                            id="hero_btn2_text"
                            value="{{ old('hero_btn2_text', $hero['btn2_text']) }}"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                        />
                    </div>
                    <!-- Btn 2 url -->
                    <div class="space-y-1">
                        <label for="hero_btn2_url" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Secondary Button URL</label>
                        <input
                            type="text"
                            name="hero_btn2_url"
                            id="hero_btn2_url"
                            value="{{ old('hero_btn2_url', $hero['btn2_url']) }}"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                        />
                    </div>
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all duration-300"
                >
                    Save Changes
                </button>
            </form>
        </div>

        <!-- Right Side: Hero Slides List (5 cols) -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-6">
            <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <i data-lucide="sliders" class="h-5 w-5 text-brand-accent"></i>
                    <span>Slider Carousel Items</span>
                </h3>
                <button onclick="toggleModal('add-slide-modal')" class="text-xs bg-brand-accent text-white font-bold px-3 py-1.5 rounded-xl hover:bg-brand-sidebar transition-colors">
                    + Add Slide
                </button>
            </div>

            <!-- List Slider Items -->
            <div class="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                @forelse($slides as $slide)
                    <div class="flex items-center space-x-4 p-3 bg-slate-50 rounded-2xl border border-slate-150 relative group">
                        <img src="{{ $slide->image_path }}" class="h-16 w-20 object-cover rounded-xl border border-slate-200 shrink-0" />
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-bold text-slate-800 truncate">{{ $slide->title ?? 'Untitled Slide' }}</p>
                            <p class="text-[10px] text-slate-500 truncate">{{ $slide->description ?? 'No caption details' }}</p>
                            <div class="flex items-center space-x-2 mt-1.5">
                                <span class="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md">Order: {{ $slide->display_order }}</span>
                                @if($slide->is_active)
                                    <span class="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md">Active</span>
                                @else
                                    <span class="text-[9px] font-extrabold uppercase bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md">Inactive</span>
                                @endif
                            </div>
                        </div>
                        <div class="flex items-center space-x-1 shrink-0">
                            <button onclick="editSlide({{ json_encode($slide) }})" class="p-1.5 text-slate-500 hover:text-brand-accent hover:bg-white rounded-lg transition-colors">
                                <i data-lucide="pencil" class="h-4 w-4"></i>
                            </button>
                            <form action="{{ route('admin.hero.slide.destroy', $slide) }}" method="POST" class="inline" onsubmit="return confirm('Delete this slide?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                @empty
                    <p class="text-center text-xs text-slate-400 font-medium py-8">No slides loaded.</p>
                @endforelse
            </div>
        </div>
    </div>
</div>

<!-- Add Slide Modal -->
<div id="add-slide-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add New Hero Slide</h3>
            <button onclick="toggleModal('add-slide-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.hero.slide.store') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-4">
            @csrf
            <!-- Image File -->
            <div class="space-y-1">
                <label for="image" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Select Image (Max 5MB)</label>
                <input type="file" name="image" id="image" required class="w-full text-xs font-semibold text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent hover:file:bg-emerald-100" />
            </div>
            <!-- Title -->
            <div class="space-y-1">
                <label for="title" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Title (Optional)</label>
                <input type="text" name="title" id="title" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Description -->
            <div class="space-y-1">
                <label for="description" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description (Optional)</label>
                <textarea name="description" id="description" rows="2" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Display Order -->
                <div class="space-y-1">
                    <label for="display_order" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Display Order</label>
                    <input type="number" name="display_order" id="display_order" value="0" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Active Toggle -->
                <div class="flex items-center space-x-2 pt-6">
                    <input type="checkbox" name="is_active" id="is_active" checked class="h-4.5 w-4.5 rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                    <label for="is_active" class="text-xs font-bold text-slate-600">Active Slide</label>
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-slide-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Add Slide</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Slide Modal -->
<div id="edit-slide-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Edit Hero Slide</h3>
            <button onclick="toggleModal('edit-slide-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-slide-form" method="POST" enctype="multipart/form-data" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <!-- Image File -->
            <div class="space-y-1">
                <label for="edit_image" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Replace Image (Optional)</label>
                <input type="file" name="image" id="edit_image" class="w-full text-xs font-semibold text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent hover:file:bg-emerald-100" />
            </div>
            <!-- Title -->
            <div class="space-y-1">
                <label for="edit_title" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Title</label>
                <input type="text" name="title" id="edit_title" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Description -->
            <div class="space-y-1">
                <label for="edit_description" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" id="edit_description" rows="2" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Display Order -->
                <div class="space-y-1">
                    <label for="edit_display_order" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Display Order</label>
                    <input type="number" name="display_order" id="edit_display_order" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Active Toggle -->
                <div class="flex items-center space-x-2 pt-6">
                    <input type="checkbox" name="is_active" id="edit_is_active" class="h-4.5 w-4.5 rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                    <label for="edit_is_active" class="text-xs font-bold text-slate-600">Active Slide</label>
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-slide-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Slide</button>
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

    function editSlide(slide) {
        // Populate edit modal fields
        const form = document.getElementById('edit-slide-form');
        form.action = `/admin/hero/slides/${slide.id}`;

        document.getElementById('edit_title').value = slide.title || '';
        document.getElementById('edit_description').value = slide.description || '';
        document.getElementById('edit_display_order').value = slide.display_order || 0;
        document.getElementById('edit_is_active').checked = !!slide.is_active;

        toggleModal('edit-slide-modal');
    }
</script>
@endsection
