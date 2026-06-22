@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">About Us Settings</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Manage all sections and dynamic datasets for the About Us page.</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="w-full lg:w-64 space-y-2 shrink-0">
            <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-4 space-y-1">
                <button onclick="switchTab('team-members')" id="tab-btn-team-members" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-brand-accent bg-emerald-50 transition-colors">Team Members</button>
                <button onclick="switchTab('choose-features')" id="tab-btn-choose-features" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Why Choose Us Features</button>
                <button onclick="switchTab('timeline-steps')" id="tab-btn-timeline-steps" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Timeline Steps</button>
                <button onclick="switchTab('partners')" id="tab-btn-partners" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Partners</button>
                <button onclick="switchTab('testimonials')" id="tab-btn-testimonials" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Testimonials</button>
                <button onclick="switchTab('faq-items')" id="tab-btn-faq-items" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">FAQ Items</button>
                <button onclick="switchTab('stats-counters')" id="tab-btn-stats-counters" class="tab-btn w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Stats Counters</button>
            </div>
        </div>

        <!-- Active Tab Panel Content -->
        <div class="flex-1">
            <!-- 1. Team Members Panel -->
            <div id="tab-panel-team-members" class="tab-panel space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Team Members</h3>
                        <button onclick="toggleModal('add-team-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Member</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Name/Role</th>
                                    <th class="px-6 py-3.5 w-1/2">Biography</th>
                                    <th class="px-6 py-3.5">Socials</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($team as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 flex items-center space-x-3">
                                            <div class="h-10 w-10 rounded-full overflow-hidden border border-slate-200/80 bg-slate-50 shrink-0">
                                                <img src="{{ $item['image'] ?? '/assets/placeholder.png' }}" class="h-full w-full object-cover" onerror="this.src='/assets/placeholder.png'">
                                            </div>
                                            <div>
                                                <h5 class="text-sm font-bold text-slate-900">{{ $item['name'] ?? '' }}</h5>
                                                <span class="text-[10px] text-slate-500 font-bold uppercase">{{ $item['role'] ?? '' }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">{{ $item['bio'] ?? '' }}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center space-x-2 text-slate-400">
                                                @foreach(['linkedin', 'twitter', 'facebook', 'github'] as $socialKey)
                                                    @if(isset($item['socials'][$socialKey]) && $item['socials'][$socialKey])
                                                        <i data-lucide="{{ $socialKey === 'linkedin' ? 'linkedin' : ($socialKey === 'twitter' ? 'twitter' : ($socialKey === 'github' ? 'github' : 'facebook')) }}" class="h-4 w-4 text-brand-accent"></i>
                                                    @endif
                                                @endforeach
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editTeam({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.about.delete', ['team_members', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this team member?');">
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
                                        <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No team members found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 2. Why Choose Us Features Panel -->
            <div id="tab-panel-choose-features" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Why Choose Us Features</h3>
                        <button onclick="toggleModal('add-feature-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Feature</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Title</th>
                                    <th class="px-6 py-3.5 w-1/2">Description</th>
                                    <th class="px-6 py-3.5">Icon</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($features as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 font-bold text-slate-900">{{ $item['title'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">{{ $item['desc'] ?? '' }}</td>
                                        <td class="px-6 py-4">
                                            <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] flex items-center space-x-1.5 self-start w-fit">
                                                <i data-lucide="{{ $item['icon'] ?? 'settings' }}" class="h-3.5 w-3.5 text-brand-accent"></i>
                                                <span>{{ $item['icon'] ?? '' }}</span>
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editFeature({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.about.delete', ['choose_features', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this feature?');">
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

            <!-- 3. Timeline Steps Panel -->
            <div id="tab-panel-timeline-steps" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Timeline Steps</h3>
                        <button onclick="toggleModal('add-timeline-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Timeline Step</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Year</th>
                                    <th class="px-6 py-3.5">Title</th>
                                    <th class="px-6 py-3.5 w-1/2">Description</th>
                                    <th class="px-6 py-3.5">Icon</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($timeline as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 font-extrabold text-slate-900 text-sm">{{ $item['year'] ?? '' }}</td>
                                        <td class="px-6 py-4 font-bold text-slate-900">{{ $item['title'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">{{ $item['desc'] ?? '' }}</td>
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
                                            <form action="{{ route('admin.about.delete', ['timeline_steps', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this step?');">
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
                                        <td colspan="5" class="px-6 py-8 text-center text-slate-400 font-medium">No timeline steps found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 4. Partners Panel -->
            <div id="tab-panel-partners" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Partners</h3>
                        <button onclick="toggleModal('add-partner-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Partner</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Logo Text</th>
                                    <th class="px-6 py-3.5">Name</th>
                                    <th class="px-6 py-3.5 w-1/2">Description</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($partners as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 font-black tracking-widest text-slate-700 bg-slate-50 text-center w-24 rounded-lg select-none">{{ $item['logoText'] ?? '' }}</td>
                                        <td class="px-6 py-4 font-bold text-slate-900">{{ $item['name'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2">{{ $item['desc'] ?? '' }}</td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editPartner({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.about.delete', ['partners', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this partner?');">
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
                                        <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No partners found.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 5. Testimonials Panel -->
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
                                            <form action="{{ route('admin.about.delete', ['testimonials', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this testimonial?');">
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

            <!-- 6. FAQ Items Panel -->
            <div id="tab-panel-faq-items" class="tab-panel hidden space-y-6">
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
                                            <form action="{{ route('admin.about.delete', ['faq_items', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this FAQ item?');">
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

            <!-- 7. Stats Counters Panel -->
            <div id="tab-panel-stats-counters" class="tab-panel hidden space-y-6">
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">Stats Counters</h3>
                        <button onclick="toggleModal('add-stat-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition-colors flex items-center space-x-1">
                            <i data-lucide="plus" class="h-3.5 w-3.5"></i>
                            <span>New Stat</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <th class="px-6 py-3.5">Counter</th>
                                    <th class="px-6 py-3.5">Label</th>
                                    <th class="px-6 py-3.5">Tailwind Classes</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                @forelse($stats as $index => $item)
                                    <tr class="hover:bg-slate-50/40">
                                        <td class="px-6 py-4 font-black text-lg text-slate-800">
                                            {{ $item['count'] ?? 0 }}{{ $item['suffix'] ?? '' }}
                                        </td>
                                        <td class="px-6 py-4 font-bold text-slate-900">{{ $item['label'] ?? '' }}</td>
                                        <td class="px-6 py-4">
                                            <span class="text-[10px] bg-slate-50 px-2 py-1 rounded font-bold text-slate-500 border border-slate-150">{{ $item['color'] ?? '' }}</span>
                                        </td>
                                        <td class="px-6 py-4 text-right space-x-2">
                                            <button onclick="editStat({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                            </button>
                                            <form action="{{ route('admin.about.delete', ['stats', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this stat counter?');">
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
                                        <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No stats counters found.</td>
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

<!-- 1. Add Team Modal -->
<div id="add-team-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Team Member</h3>
            <button onclick="toggleModal('add-team-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.about.add', 'team_members') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Full Name</label>
                    <input type="text" name="name" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Role / Designation</label>
                    <input type="text" name="role" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Avatar Image</label>
                <input type="file" name="image" class="w-full text-xs font-semibold text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Biography</label>
                <textarea name="bio" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent"></textarea>
            </div>
            <div class="border-t border-slate-100 pt-3">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Social Links</h4>
                <div class="grid grid-cols-2 gap-3">
                    <input type="text" name="social_linkedin" placeholder="LinkedIn URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                    <input type="text" name="social_twitter" placeholder="Twitter URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                    <input type="text" name="social_facebook" placeholder="Facebook URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                    <input type="text" name="social_github" placeholder="Github URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-team-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Member</button>
            </div>
        </form>
    </div>
</div>

<!-- 2. Edit Team Modal -->
<div id="edit-team-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Edit Team Member</h3>
            <button onclick="toggleModal('edit-team-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-team-form" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Full Name</label>
                    <input type="text" name="name" id="edit_team_name" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Role / Designation</label>
                    <input type="text" name="role" id="edit_team_role" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Avatar Image (Optional)</label>
                <input type="file" name="image" class="w-full text-xs font-semibold text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Biography</label>
                <textarea name="bio" id="edit_team_bio" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-accent"></textarea>
            </div>
            <div class="border-t border-slate-100 pt-3">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Social Links</h4>
                <div class="grid grid-cols-2 gap-3">
                    <input type="text" name="social_linkedin" id="edit_team_linkedin" placeholder="LinkedIn URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                    <input type="text" name="social_twitter" id="edit_team_twitter" placeholder="Twitter URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                    <input type="text" name="social_facebook" id="edit_team_facebook" placeholder="Facebook URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                    <input type="text" name="social_github" id="edit_team_github" placeholder="Github URL" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent" />
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-team-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- Add/Edit modals for other sections (Features, Timeline, Partners, Testimonials, FAQs, Stats) -->
<!-- 3. Add Feature Modal -->
<div id="add-feature-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Choose Us Feature</h3>
            <button onclick="toggleModal('add-feature-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.about.add', 'choose_features') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Feature Title</label>
                    <input type="text" name="title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" required placeholder="e.g. Search, Settings, Award" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="desc" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-feature-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Feature</button>
            </div>
        </form>
    </div>
</div>

<!-- 4. Edit Feature Modal -->
<div id="edit-feature-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Choose Us Feature</h3>
            <button onclick="toggleModal('edit-feature-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-feature-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Feature Title</label>
                    <input type="text" name="title" id="edit_feature_title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" id="edit_feature_icon" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="desc" id="edit_feature_desc" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-feature-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 5. Add Timeline Modal -->
<div id="add-timeline-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Timeline Step</h3>
            <button onclick="toggleModal('add-timeline-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.about.add', 'timeline_steps') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Year / Step</label>
                    <input type="text" name="year" required placeholder="e.g. 2025" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Title</label>
                    <input type="text" name="title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                <input type="text" name="icon" required placeholder="e.g. Trophy, Zap, Globe" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="desc" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-timeline-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Step</button>
            </div>
        </form>
    </div>
</div>

<!-- 6. Edit Timeline Modal -->
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
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Year / Step</label>
                    <input type="text" name="year" id="edit_timeline_year" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Title</label>
                    <input type="text" name="title" id="edit_timeline_title" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                <input type="text" name="icon" id="edit_timeline_icon" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="desc" id="edit_timeline_desc" rows="3" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-timeline-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 7. Add Partner Modal -->
<div id="add-partner-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Partner</h3>
            <button onclick="toggleModal('add-partner-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.about.add', 'partners') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Logo abbreviation</label>
                    <input type="text" name="logoText" required placeholder="e.g. APEX" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Partner Name</label>
                    <input type="text" name="name" required placeholder="e.g. Apex University" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description / Subtitle</label>
                <input type="text" name="desc" required placeholder="e.g. Academic Partner" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-partner-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Partner</button>
            </div>
        </form>
    </div>
</div>

<!-- 8. Edit Partner Modal -->
<div id="edit-partner-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Partner</h3>
            <button onclick="toggleModal('edit-partner-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-partner-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Logo Abbreviation</label>
                    <input type="text" name="logoText" id="edit_partner_logoText" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Partner Name</label>
                    <input type="text" name="name" id="edit_partner_name" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description / Subtitle</label>
                <input type="text" name="desc" id="edit_partner_desc" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-partner-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 9. Add Testimonial Modal -->
<div id="add-testimonial-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Testimonial</h3>
            <button onclick="toggleModal('add-testimonial-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.about.add', 'testimonials') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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

<!-- 10. Edit Testimonial Modal -->
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

<!-- 11. Add FAQ Modal -->
<div id="add-faq-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add FAQ Item</h3>
            <button onclick="toggleModal('add-faq-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.about.add', 'faq_items') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Question</label>
                <input type="text" name="question" required placeholder="e.g. What is Eventra?" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
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

<!-- 12. Edit FAQ Modal -->
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

<!-- 13. Add Stat Modal -->
<div id="add-stat-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Stat Counter</h3>
            <button onclick="toggleModal('add-stat-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.about.add', 'stats') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Number / Value</label>
                    <input type="number" name="count" required placeholder="e.g. 100" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Suffix</label>
                    <input type="text" name="suffix" placeholder="e.g. + or %" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Label Text</label>
                <input type="text" name="label" required placeholder="e.g. Events Hosted" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Tailwind Colors</label>
                <input type="text" name="color" required placeholder="text-indigo-600 bg-indigo-50 border-indigo-100" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-stat-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Stat</button>
            </div>
        </form>
    </div>
</div>

<!-- 14. Edit Stat Modal -->
<div id="edit-stat-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Stat Counter</h3>
            <button onclick="toggleModal('edit-stat-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-stat-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Number / Value</label>
                    <input type="number" name="count" id="edit_stat_count" required class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Suffix</label>
                    <input type="text" name="suffix" id="edit_stat_suffix" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                </div>
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Label Text</label>
                <input type="text" name="label" id="edit_stat_label" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Tailwind Colors</label>
                <input type="text" name="color" id="edit_stat_color" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-stat-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
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
        // Hide all panels
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
        // Show selected panel
        document.getElementById(`tab-panel-${tabId}`).classList.remove('hidden');

        // Reset all buttons style
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('text-brand-accent', 'bg-emerald-50');
            btn.classList.add('text-slate-500', 'hover:bg-slate-50');
        });
        // Select active button style
        const activeBtn = document.getElementById(`tab-btn-${tabId}`);
        activeBtn.classList.remove('text-slate-500', 'hover:bg-slate-50');
        activeBtn.classList.add('text-brand-accent', 'bg-emerald-50');
    }

    function editTeam(index, item) {
        const form = document.getElementById('edit-team-form');
        form.action = `/admin/about/team_members/${index}`;

        document.getElementById('edit_team_name').value = item.name || '';
        document.getElementById('edit_team_role').value = item.role || '';
        document.getElementById('edit_team_bio').value = item.bio || '';
        
        document.getElementById('edit_team_linkedin').value = (item.socials && item.socials.linkedin) ? item.socials.linkedin : '';
        document.getElementById('edit_team_twitter').value = (item.socials && item.socials.twitter) ? item.socials.twitter : '';
        document.getElementById('edit_team_facebook').value = (item.socials && item.socials.facebook) ? item.socials.facebook : '';
        document.getElementById('edit_team_github').value = (item.socials && item.socials.github) ? item.socials.github : '';

        toggleModal('edit-team-modal');
    }

    function editFeature(index, item) {
        const form = document.getElementById('edit-feature-form');
        form.action = `/admin/about/choose_features/${index}`;

        document.getElementById('edit_feature_title').value = item.title || '';
        document.getElementById('edit_feature_icon').value = item.icon || '';
        document.getElementById('edit_feature_desc').value = item.desc || '';

        toggleModal('edit-feature-modal');
    }

    function editTimeline(index, item) {
        const form = document.getElementById('edit-timeline-form');
        form.action = `/admin/about/timeline_steps/${index}`;

        document.getElementById('edit_timeline_year').value = item.year || '';
        document.getElementById('edit_timeline_title').value = item.title || '';
        document.getElementById('edit_timeline_icon').value = item.icon || '';
        document.getElementById('edit_timeline_desc').value = item.desc || '';

        toggleModal('edit-timeline-modal');
    }

    function editPartner(index, item) {
        const form = document.getElementById('edit-partner-form');
        form.action = `/admin/about/partners/${index}`;

        document.getElementById('edit_partner_logoText').value = item.logoText || '';
        document.getElementById('edit_partner_name').value = item.name || '';
        document.getElementById('edit_partner_desc').value = item.desc || '';

        toggleModal('edit-partner-modal');
    }

    function editTestimonial(index, item) {
        const form = document.getElementById('edit-testimonial-form');
        form.action = `/admin/about/testimonials/${index}`;

        document.getElementById('edit_testimonial_name').value = item.name || '';
        document.getElementById('edit_testimonial_org').value = item.org || '';
        document.getElementById('edit_testimonial_rating').value = item.rating || '5';
        document.getElementById('edit_testimonial_review').value = item.review || '';

        toggleModal('edit-testimonial-modal');
    }

    function editFaq(index, item) {
        const form = document.getElementById('edit-faq-form');
        form.action = `/admin/about/faq_items/${index}`;

        document.getElementById('edit_faq_question').value = item.question || '';
        document.getElementById('edit_faq_answer').value = item.answer || '';

        toggleModal('edit-faq-modal');
    }

    function editStat(index, item) {
        const form = document.getElementById('edit-stat-form');
        form.action = `/admin/about/stats/${index}`;

        document.getElementById('edit_stat_count').value = item.count || '';
        document.getElementById('edit_stat_suffix').value = item.suffix || '';
        document.getElementById('edit_stat_label').value = item.label || '';
        document.getElementById('edit_stat_color').value = item.color || '';

        toggleModal('edit-stat-modal');
    }
</script>
@endsection
