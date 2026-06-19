@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Subpage Hero Banners</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Customize the header banners displayed on subpages like Events, Services, and About Us.</p>
    </div>

    <!-- Grid of Page Heroes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        @foreach($heroes as $hero)
            <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between">
                <!-- Preview banner area -->
                <div class="p-6 text-white relative flex flex-col justify-between min-h-[140px]" style="background-color: {{ $hero->background_color }}; background-image: url('{{ $hero->background_image_path }}'); background-size: cover; background-position: center;">
                    <div class="absolute inset-0 bg-slate-950/20 pointer-events-none"></div>
                    <span class="relative z-10 self-start text-[9px] font-extrabold uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full tracking-wider">{{ strtoupper(str_replace('-', ' ', $hero->page)) }} PAGE</span>
                    
                    <div class="relative z-10 mt-4">
                        <h4 class="font-extrabold text-lg leading-tight">{{ $hero->title }}</h4>
                        <p class="text-xs text-white/80 line-clamp-2 mt-1">{{ $hero->subtitle }}</p>
                    </div>
                </div>

                <!-- Form block -->
                <form action="{{ route('admin.pages.update', $hero) }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-4">
                    @csrf
                    @method('PUT')
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Title -->
                        <div class="space-y-1">
                            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Banner Title</label>
                            <input type="text" name="title" value="{{ $hero->title }}" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <!-- Background Color -->
                        <div class="space-y-1">
                            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Background Color</label>
                            <input type="text" name="background_color" value="{{ $hero->background_color }}" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <!-- Subtitle -->
                    <div class="space-y-1">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Banner Subtitle</label>
                        <textarea name="subtitle" rows="2" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold">{{ $hero->subtitle }}</textarea>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- CTA Text -->
                        <div class="space-y-1">
                            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">CTA Button Text (Optional)</label>
                            <input type="text" name="cta_text" value="{{ $hero->cta_text }}" class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <!-- CTA Link -->
                        <div class="space-y-1">
                            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">CTA Button Link (Optional)</label>
                            <input type="text" name="cta_link" value="{{ $hero->cta_link }}" class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <!-- Background Image File -->
                    <div class="space-y-1">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Background Image (Optional)</label>
                        <input type="file" name="background_image" class="w-full text-[10px] font-semibold text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-brand-accent hover:file:bg-emerald-100" />
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full bg-brand-accent hover:bg-brand-sidebar text-white text-xs font-bold py-2 rounded-xl transition-colors">
                            Update Banner Details
                        </button>
                    </div>
                </form>
            </div>
        @endforeach
    </div>
</div>
@endsection
