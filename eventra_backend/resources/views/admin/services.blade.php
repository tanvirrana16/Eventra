@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Services Settings</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Manage all sections and dynamic datasets for the Services page.</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="w-full lg:w-64 space-y-2 shrink-0">
            <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-4 space-y-1">
                <button onclick="switchTab('core')" id="tab-btn-core" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-brand-accent bg-emerald-50 transition-colors">Core Services</button>
                <button onclick="switchTab('additional')" id="tab-btn-additional" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Additional Services</button>
                <button onclick="switchTab('timeline')" id="tab-btn-timeline" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Timeline Steps</button>
                <button onclick="switchTab('why-choose-us')" id="tab-btn-why-choose-us" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Why Choose Us</button>
                <button onclick="switchTab('portfolio')" id="tab-btn-portfolio" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Portfolio Projects</button>
                <button onclick="switchTab('pricing')" id="tab-btn-pricing" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Pricing Packages</button>
                <button onclick="switchTab('testimonials')" id="tab-btn-testimonials" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Testimonials</button>
                <button onclick="switchTab('faq')" id="tab-btn-faq" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">FAQ Items</button>
            </div>
        </div>

        <!-- Active Tab Panel Content -->
        <div class="flex-1">
            <!-- 1. Core Services Panel -->
            <div id="tab-panel-core" class="tab-panel space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Core Services</h3>
                        <button onclick="toggleModal('add-core-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Core Service</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Service Details</th>
                                    <th class="px-6 py-3.5">Theme Settings</th>
                                    <th class="px-6 py-3.5 w-1/3">Included Features</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($core as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <div class="p-1.5 bg-slate-100 rounded text-brand-accent">
                                                    <i data-lucide="{{ $item['icon'] ?? 'briefcase' }}" class="h-4 w-4"></i>
                                                </div>
                                                <h5 class="text-sm font-bold text-slate-900">{{ $item['title'] ?? '' }}</h5>
                                            </div>
                                            <p class="text-slate-500 font-medium line-clamp-2">{{ $item['description'] ?? '' }}</p>
                                        </td>
                                        <td class="px-6 py-4 space-y-1 text-[10px] text-slate-400 font-bold select-all">
                                            <div>Gradient: <code class="bg-slate-50 px-1 py-0.5 rounded border border-slate-100">{{ $item['gradient'] ?? '' }}</code></div>
                                            <div>Badge: <code class="bg-slate-50 px-1 py-0.5 rounded border border-slate-100">{{ $item['badgeBg'] ?? '' }}</code></div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="space-y-1 text-slate-600">
                                                @if(isset($item['features']) && is_array($item['features']))
                                                    @foreach($item['features'] as $feature)
                                                        <div class="flex items-center space-x-1">
                                                            <span class="h-1 w-1 bg-emerald-500 rounded-full shrink-0"></span>
                                                            <span class="truncate max-w-[200px]">{{ $feature }}</span>
                                                        </div>
                                                    @endforeach
                                                @endif
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editCore({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['core', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this core service?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No core services found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 2. Additional Services Panel -->
            <div id="tab-panel-additional" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Additional Services</h3>
                        <button onclick="toggleModal('add-additional-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Service</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Service Name</th>
                                    <th class="px-6 py-3.5">Icon Reference</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($additional as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 flex items-center space-x-2.5">
                                            <div class="p-1.5 bg-slate-100 rounded text-brand-accent">
                                                <i data-lucide="{{ $item['icon'] ?? 'plus-circle' }}" class="h-4.5 w-4.5"></i>
                                            </div>
                                            <span class="text-sm font-bold text-slate-800">{{ $item['name'] ?? '' }}</span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{{ $item['icon'] ?? '' }}</span>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editAdditional({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['additional', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this service?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3" class="px-6 py-8 text-center text-slate-400 font-medium">No additional services found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 3. Timeline Steps Panel -->
            <div id="tab-panel-timeline" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Timeline Steps</h3>
                        <button onclick="toggleModal('add-timeline-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Step</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Step / Year</th>
                                    <th class="px-6 py-3.5">Title</th>
                                    <th class="px-6 py-3.5 w-1/2">Description</th>
                                    <th class="px-6 py-3.5">Icon</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($timeline as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 font-black text-slate-900 text-sm">{{ $item['step'] ?? '' }}</td>
                                        <td class="px-6 py-4 font-bold text-slate-900">{{ $item['title'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">{{ $item['description'] ?? '' }}</td>
                                        <td class="px-6 py-4">
                                            <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] flex items-center space-x-1.5 self-start w-fit">
                                                <i data-lucide="{{ $item['icon'] ?? 'history' }}" class="h-3.5 w-3.5 text-brand-accent"></i>
                                                <span>{{ $item['icon'] ?? '' }}</span>
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editTimeline({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['timeline', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this step?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="px-6 py-8 text-center text-slate-400 font-medium">No steps found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 4. Why Choose Us Panel -->
            <div id="tab-panel-why-choose-us" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Why Choose Us Features</h3>
                        <button onclick="toggleModal('add-why-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Feature</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Feature Title</th>
                                    <th class="px-6 py-3.5 w-1/2">Description</th>
                                    <th class="px-6 py-3.5">Icon</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($why_choose_us as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 font-bold text-slate-900">{{ $item['title'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">{{ $item['description'] ?? '' }}</td>
                                        <td class="px-6 py-4">
                                            <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] flex items-center space-x-1.5 self-start w-fit">
                                                <i data-lucide="{{ $item['icon'] ?? 'check' }}" class="h-3.5 w-3.5 text-brand-accent"></i>
                                                <span>{{ $item['icon'] ?? '' }}</span>
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editWhy({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['why_choose_us', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this feature?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No features found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 5. Portfolio Projects Panel -->
            <div id="tab-panel-portfolio" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Portfolio Projects</h3>
                        <button onclick="toggleModal('add-portfolio-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Project</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Project Info</th>
                                    <th class="px-6 py-3.5">Location</th>
                                    <th class="px-6 py-3.5">Attendees</th>
                                    <th class="px-6 py-3.5">Event Date</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($portfolio as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 flex items-center space-x-3.5">
                                            <div class="h-12 w-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                                                <img src="{{ $item['image'] ?? '/assets/placeholder.png' }}" class="h-full w-full object-cover" onerror="this.src='/assets/placeholder.png'">
                                            </div>
                                            <div>
                                                <h5 class="text-sm font-bold text-slate-900 leading-snug">{{ $item['title'] ?? '' }}</h5>
                                                <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">{{ $item['category'] ?? '' }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-slate-500 font-medium">{{ $item['location'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-950 font-bold">{{ $item['attendees'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-400 font-medium">{{ $item['date'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editPortfolio({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['portfolio', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this project?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="px-6 py-8 text-center text-slate-400 font-medium">No projects found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 6. Pricing Packages Panel -->
            <div id="tab-panel-pricing" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Pricing Packages</h3>
                        <button onclick="toggleModal('add-pricing-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Package</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Package Info</th>
                                    <th class="px-6 py-3.5 w-1/3">Included Features</th>
                                    <th class="px-6 py-3.5 text-center">Status</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($pricing as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 space-y-1">
                                            <div class="flex items-baseline space-x-2">
                                                <h5 class="text-sm font-extrabold text-slate-900">{{ $item['name'] ?? '' }}</h5>
                                                <span class="text-emerald-700 font-extrabold text-sm">{{ $item['price'] ?? '' }}</span>
                                            </div>
                                            <p class="text-slate-500 font-medium leading-relaxed">{{ $item['suitable'] ?? '' }}</p>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="space-y-1 text-slate-600">
                                                @if(isset($item['features']) && is_array($item['features']))
                                                    @foreach($item['features'] as $feature)
                                                        <div class="flex items-center space-x-1">
                                                            <span class="h-1 w-1 bg-emerald-500 rounded-full shrink-0"></span>
                                                            <span class="truncate max-w-[220px]">{{ $feature }}</span>
                                                        </div>
                                                    @endforeach
                                                @endif
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                            @if($item['popular'] ?? false)
                                                <span class="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full select-none">Popular</span>
                                            @else
                                                <span class="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full select-none">Standard</span>
                                            @endif
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editPricing({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['pricing', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this package?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No pricing packages found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 7 & 8 Testimonials and FAQ sections reuse the structures -->
            <!-- Testimonials Panel -->
            <div id="tab-panel-testimonials" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Testimonials</h3>
                        <button onclick="toggleModal('add-testimonial-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Testimonial</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Author</th>
                                    <th class="px-6 py-3.5 w-1/2">Review</th>
                                    <th class="px-6 py-3.5">Rating</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($testimonials as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 flex items-center space-x-3">
                                            <div class="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                                                <img src="{{ $item['photo'] ?? '/assets/placeholder.png' }}" class="h-full w-full object-cover" onerror="this.src='/assets/placeholder.png'">
                                            </div>
                                            <div>
                                                <h5 class="text-sm font-bold text-slate-900">{{ $item['name'] ?? '' }}</h5>
                                                <span class="text-[10px] text-slate-500 font-bold">{{ $item['org'] ?? '' }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">"{{ $item['review'] ?? '' }}"</td>
                                        <td class="px-6 py-4 text-amber-500 flex items-center space-x-0.5 mt-2">
                                            @for($i = 0; $i < ($item['rating'] ?? 5); $i++)
                                                <i data-lucide="star" class="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0"></i>
                                            @endfor
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editTestimonial({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['testimonials', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this testimonial?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No testimonials found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- FAQ Panel -->
            <div id="tab-panel-faq" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">FAQ Items</h3>
                        <button onclick="toggleModal('add-faq-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New FAQ</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Question</th>
                                    <th class="px-6 py-3.5 w-1/2">Answer</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($faq as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 font-bold text-slate-900 text-sm">{{ $item['question'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">{{ $item['answer'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editFaq({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.services.delete', ['faq', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this FAQ item?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3" class="px-6 py-8 text-center text-slate-400 font-medium">No FAQs found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ==================== MODALS ==================== -->

<!-- 1. Add Core Service Modal -->
<div id="add-core-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Core Service</h3>
            <button onclick="toggleModal('add-core-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'core') }}" method="POST" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Service Title</label>
                    <input type="text" name="title" required placeholder="e.g. Wedding Coordination" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" required placeholder="e.g. Heart, Tv, Music" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Gradient Colors</label>
                    <input type="text" name="gradient" required placeholder="e.g. from-teal-500/10 to-emerald-500/5..." class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Badge Theme Classes</label>
                    <input type="text" name="badgeBg" required placeholder="e.g. bg-teal-50 text-teal-700" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" rows="2" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Included Features (One feature per line)</label>
                <textarea name="features" rows="3" required placeholder="Theme Decor&#10;VIP Seating&#10;Audio Logistcs" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" rows="3" placeholder="Enter detailed copy or highlights for the modal..." class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-core-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Service</button>
            </div>
        </form>
    </div>
</div>

<!-- 2. Edit Core Service Modal -->
<div id="edit-core-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Core Service</h3>
            <button onclick="toggleModal('edit-core-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-core-form" method="POST" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Service Title</label>
                    <input type="text" name="title" id="edit_core_title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" id="edit_core_icon" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Gradient Colors</label>
                    <input type="text" name="gradient" id="edit_core_gradient" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Badge Theme Classes</label>
                    <input type="text" name="badgeBg" id="edit_core_badgeBg" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" id="edit_core_description" rows="2" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Included Features (One feature per line)</label>
                <textarea name="features" id="edit_core_features" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" id="edit_core_details" rows="3" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-core-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 3. Add Additional Service Modal -->
<div id="add-additional-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Additional Service</h3>
            <button onclick="toggleModal('add-additional-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'additional') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Service Name</label>
                <input type="text" name="name" required placeholder="e.g. Photography & Videography" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon Reference</label>
                <input type="text" name="icon" required placeholder="e.g. Camera, Utensils, Paintbrush" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" rows="3" placeholder="Enter extra details for the detail popup..." class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-additional-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Service</button>
            </div>
        </form>
    </div>
</div>

<!-- 4. Edit Additional Service Modal -->
<div id="edit-additional-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Additional Service</h3>
            <button onclick="toggleModal('edit-additional-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-additional-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Service Name</label>
                <input type="text" name="name" id="edit_additional_name" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon Reference</label>
                <input type="text" name="icon" id="edit_additional_icon" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" id="edit_additional_details" rows="3" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-additional-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 5. Add Timeline Step Modal -->
<div id="add-timeline-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Timeline Step</h3>
            <button onclick="toggleModal('add-timeline-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'timeline') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Step Index</label>
                    <input type="text" name="step" required placeholder="e.g. Step 1" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Step Title</label>
                    <input type="text" name="title" required placeholder="e.g. Consultation" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                <input type="text" name="icon" required placeholder="e.g. MessageSquare, Calendar" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" rows="3" placeholder="Enter roadmap step extra details..." class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-timeline-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Step</button>
            </div>
        </form>
    </div>
</div>

<!-- 6. Edit Timeline Step Modal -->
<div id="edit-timeline-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Timeline Step</h3>
            <button onclick="toggleModal('edit-timeline-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-timeline-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Step Index</label>
                    <input type="text" name="step" id="edit_timeline_step" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Step Title</label>
                    <input type="text" name="title" id="edit_timeline_title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                <input type="text" name="icon" id="edit_timeline_icon" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" id="edit_timeline_description" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" id="edit_timeline_details" rows="3" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-timeline-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 7. Add Why Choose Us Modal -->
<div id="add-why-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Choose Feature</h3>
            <button onclick="toggleModal('add-why-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'why_choose_us') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Feature Title</label>
                    <input type="text" name="title" required placeholder="e.g. Professional Team" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" required placeholder="e.g. Users, PenTool, DollarSign" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" rows="3" placeholder="Enter why choose us modal details..." class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-why-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Feature</button>
            </div>
        </form>
    </div>
</div>

<!-- 8. Edit Why Choose Us Modal -->
<div id="edit-why-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Choose Feature</h3>
            <button onclick="toggleModal('edit-why-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-why-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Feature Title</label>
                    <input type="text" name="title" id="edit_why_title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" id="edit_why_icon" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" id="edit_why_description" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" id="edit_why_details" rows="3" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-why-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 9. Add Portfolio Modal -->
<div id="add-portfolio-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Portfolio Project</h3>
            <button onclick="toggleModal('add-portfolio-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'portfolio') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Project Title</label>
                    <input type="text" name="title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
                    <input type="text" name="category" required placeholder="e.g. Conferences, Concerts" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Attendees Count</label>
                    <input type="text" name="attendees" required placeholder="e.g. 1,200 Attendees" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Location</label>
                    <input type="text" name="location" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Event Date</label>
                    <input type="text" name="date" required placeholder="e.g. March 15, 2026" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Project Cover Image</label>
                    <input type="file" name="image" required class="w-full text-xs font-semibold text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Case Study Details (One point/paragraph per line)</label>
                <textarea name="details" rows="3" placeholder="Enter case study details..." class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-portfolio-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Project</button>
            </div>
        </form>
    </div>
</div>

<!-- 10. Edit Portfolio Modal -->
<div id="edit-portfolio-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Portfolio Project</h3>
            <button onclick="toggleModal('edit-portfolio-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-portfolio-form" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Project Title</label>
                    <input type="text" name="title" id="edit_portfolio_title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
                    <input type="text" name="category" id="edit_portfolio_category" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Attendees Count</label>
                    <input type="text" name="attendees" id="edit_portfolio_attendees" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Location</label>
                    <input type="text" name="location" id="edit_portfolio_location" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Event Date</label>
                    <input type="text" name="date" id="edit_portfolio_date" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Project Cover Image (Optional)</label>
                    <input type="file" name="image" class="w-full text-xs font-semibold text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Case Study Details (One point/paragraph per line)</label>
                <textarea name="details" id="edit_portfolio_details" rows="3" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-portfolio-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 11. Add Pricing Modal -->
<div id="add-pricing-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Pricing Package</h3>
            <button onclick="toggleModal('add-pricing-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'pricing') }}" method="POST" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Package Name</label>
                    <input type="text" name="name" required placeholder="e.g. Professional" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Price tag</label>
                    <input type="text" name="price" required placeholder="e.g. $4,500" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Suitable For</label>
                    <input type="text" name="suitable" required placeholder="e.g. Suitable for medium events" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Button CTA Text</label>
                    <input type="text" name="buttonText" required placeholder="e.g. Choose Plan" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="flex items-center space-x-2 py-2">
                <input type="checkbox" name="popular" id="popular_check" value="true" class="h-4 w-4 text-brand-accent border-slate-300 rounded focus:ring-brand-accent">
                <label for="popular_check" class="text-xs font-bold text-slate-700 uppercase tracking-wider">Highlight as Popular Package</label>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Included Features (One feature per line)</label>
                <textarea name="features" rows="4" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" rows="3" placeholder="Enter plan modal extra details..." class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-pricing-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Package</button>
            </div>
        </form>
    </div>
</div>

<!-- 12. Edit Pricing Modal -->
<div id="edit-pricing-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Pricing Package</h3>
            <button onclick="toggleModal('edit-pricing-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-pricing-form" method="POST" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Package Name</label>
                    <input type="text" name="name" id="edit_pricing_name" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Price tag</label>
                    <input type="text" name="price" id="edit_pricing_price" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Suitable For</label>
                    <input type="text" name="suitable" id="edit_pricing_suitable" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Button CTA Text</label>
                    <input type="text" name="buttonText" id="edit_pricing_buttonText" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="flex items-center space-x-2 py-2">
                <input type="checkbox" name="popular" id="edit_pricing_popular" value="true" class="h-4 w-4 text-brand-accent border-slate-300 rounded focus:ring-brand-accent">
                <label for="edit_pricing_popular" class="text-xs font-bold text-slate-700 uppercase tracking-wider">Highlight as Popular Package</label>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Included Features (One feature per line)</label>
                <textarea name="features" id="edit_pricing_features" rows="4" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Modal Details Description (One point/paragraph per line)</label>
                <textarea name="details" id="edit_pricing_details" rows="3" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-pricing-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 13. Add Testimonial Modal -->
<div id="add-testimonial-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Testimonial</h3>
            <button onclick="toggleModal('add-testimonial-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'testimonials') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Author Name</label>
                    <input type="text" name="name" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Organization / Role</label>
                    <input type="text" name="org" required placeholder="e.g. VP at Google" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Photo / Image</label>
                    <input type="file" name="photo" class="w-full text-xs font-semibold text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Rating (1-5 Stars)</label>
                    <select name="rating" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none bg-white">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Review text</label>
                <textarea name="review" rows="4" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-testimonial-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Testimonial</button>
            </div>
        </form>
    </div>
</div>

<!-- 14. Edit Testimonial Modal -->
<div id="edit-testimonial-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Testimonial</h3>
            <button onclick="toggleModal('edit-testimonial-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-testimonial-form" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Author Name</label>
                    <input type="text" name="name" id="edit_testimonial_name" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Organization / Role</label>
                    <input type="text" name="org" id="edit_testimonial_org" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Photo / Image (Optional)</label>
                    <input type="file" name="photo" class="w-full text-xs font-semibold text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Rating (1-5 Stars)</label>
                    <select name="rating" id="edit_testimonial_rating" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none bg-white">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Review text</label>
                <textarea name="review" id="edit_testimonial_review" rows="4" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-testimonial-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 15. Add FAQ Modal -->
<div id="add-faq-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add FAQ Item</h3>
            <button onclick="toggleModal('add-faq-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.services.add', 'faq') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Question</label>
                <input type="text" name="question" required placeholder="e.g. Can I cancel my booking?" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Answer</label>
                <textarea name="answer" rows="4" required placeholder="Provide answer details..." class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-faq-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create FAQ</button>
            </div>
        </form>
    </div>
</div>

<!-- 16. Edit FAQ Modal -->
<div id="edit-faq-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify FAQ Item</h3>
            <button onclick="toggleModal('edit-faq-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-faq-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Question</label>
                <input type="text" name="question" id="edit_faq_question" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Answer</label>
                <textarea name="answer" id="edit_faq_answer" rows="4" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-faq-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<script>
    function toggleModal(id) {
        const modal = document.getElementById(id);
        if (modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        } else {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-panel-${tabId}`).classList.remove('hidden');

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('text-brand-accent', 'bg-emerald-50');
            btn.classList.add('text-slate-500', 'hover:bg-slate-50');
        });
        const activeBtn = document.getElementById(`tab-btn-${tabId}`);
        activeBtn.classList.remove('text-slate-500', 'hover:bg-slate-50');
        activeBtn.classList.add('text-brand-accent', 'bg-emerald-50');
    }

    function editCore(index, item) {
        const form = document.getElementById('edit-core-form');
        form.action = `/admin/services/core/${index}`;

        document.getElementById('edit_core_title').value = item.title || '';
        document.getElementById('edit_core_icon').value = item.icon || '';
        document.getElementById('edit_core_gradient').value = item.gradient || '';
        document.getElementById('edit_core_badgeBg').value = item.badgeBg || '';
        document.getElementById('edit_core_description').value = item.description || '';
        
        let featuresText = '';
        if (item.features && Array.isArray(item.features)) {
            featuresText = item.features.join('\n');
        }
        document.getElementById('edit_core_features').value = featuresText;

        let detailsText = '';
        if (item.details && Array.isArray(item.details)) {
            detailsText = item.details.join('\n');
        } else if (item.details) {
            detailsText = item.details;
        }
        document.getElementById('edit_core_details').value = detailsText;

        toggleModal('edit-core-modal');
    }

    function editAdditional(index, item) {
        const form = document.getElementById('edit-additional-form');
        form.action = `/admin/services/additional/${index}`;

        document.getElementById('edit_additional_name').value = item.name || '';
        document.getElementById('edit_additional_icon').value = item.icon || '';

        let detailsText = '';
        if (item.details && Array.isArray(item.details)) {
            detailsText = item.details.join('\n');
        } else if (item.details) {
            detailsText = item.details;
        }
        document.getElementById('edit_additional_details').value = detailsText;

        toggleModal('edit-additional-modal');
    }

    function editTimeline(index, item) {
        const form = document.getElementById('edit-timeline-form');
        form.action = `/admin/services/timeline/${index}`;

        document.getElementById('edit_timeline_step').value = item.step || '';
        document.getElementById('edit_timeline_title').value = item.title || '';
        document.getElementById('edit_timeline_icon').value = item.icon || '';
        document.getElementById('edit_timeline_description').value = item.description || '';

        let detailsText = '';
        if (item.details && Array.isArray(item.details)) {
            detailsText = item.details.join('\n');
        } else if (item.details) {
            detailsText = item.details;
        }
        document.getElementById('edit_timeline_details').value = detailsText;

        toggleModal('edit-timeline-modal');
    }

    function editWhy(index, item) {
        const form = document.getElementById('edit-why-form');
        form.action = `/admin/services/why_choose_us/${index}`;

        document.getElementById('edit_why_title').value = item.title || '';
        document.getElementById('edit_why_icon').value = item.icon || '';
        document.getElementById('edit_why_description').value = item.description || '';

        let detailsText = '';
        if (item.details && Array.isArray(item.details)) {
            detailsText = item.details.join('\n');
        } else if (item.details) {
            detailsText = item.details;
        }
        document.getElementById('edit_why_details').value = detailsText;

        toggleModal('edit-why-modal');
    }

    function editPortfolio(index, item) {
        const form = document.getElementById('edit-portfolio-form');
        form.action = `/admin/services/portfolio/${index}`;

        document.getElementById('edit_portfolio_title').value = item.title || '';
        document.getElementById('edit_portfolio_category').value = item.category || '';
        document.getElementById('edit_portfolio_attendees').value = item.attendees || '';
        document.getElementById('edit_portfolio_location').value = item.location || '';
        document.getElementById('edit_portfolio_date').value = item.date || '';

        let detailsText = '';
        if (item.details && Array.isArray(item.details)) {
            detailsText = item.details.join('\n');
        } else if (item.details) {
            detailsText = item.details;
        }
        document.getElementById('edit_portfolio_details').value = detailsText;

        toggleModal('edit-portfolio-modal');
    }

    function editPricing(index, item) {
        const form = document.getElementById('edit-pricing-form');
        form.action = `/admin/services/pricing/${index}`;

        document.getElementById('edit_pricing_name').value = item.name || '';
        document.getElementById('edit_pricing_price').value = item.price || '';
        document.getElementById('edit_pricing_suitable').value = item.suitable || '';
        document.getElementById('edit_pricing_buttonText').value = item.buttonText || '';
        
        document.getElementById('edit_pricing_popular').checked = !!item.popular;

        let featuresText = '';
        if (item.features && Array.isArray(item.features)) {
            featuresText = item.features.join('\n');
        }
        document.getElementById('edit_pricing_features').value = featuresText;

        let detailsText = '';
        if (item.details && Array.isArray(item.details)) {
            detailsText = item.details.join('\n');
        } else if (item.details) {
            detailsText = item.details;
        }
        document.getElementById('edit_pricing_details').value = detailsText;

        toggleModal('edit-pricing-modal');
    }

    function editTestimonial(index, item) {
        const form = document.getElementById('edit-testimonial-form');
        form.action = `/admin/services/testimonials/${index}`;

        document.getElementById('edit_testimonial_name').value = item.name || '';
        document.getElementById('edit_testimonial_org').value = item.org || '';
        document.getElementById('edit_testimonial_rating').value = item.rating || '5';
        document.getElementById('edit_testimonial_review').value = item.review || '';

        toggleModal('edit-testimonial-modal');
    }

    function editFaq(index, item) {
        const form = document.getElementById('edit-faq-form');
        form.action = `/admin/services/faq/${index}`;

        document.getElementById('edit_faq_question').value = item.question || '';
        document.getElementById('edit_faq_answer').value = item.answer || '';

        toggleModal('edit-faq-modal');
    }
</script>
@endsection
