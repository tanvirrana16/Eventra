@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Organizer Approvals</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Verify and manage organizer accounts to authorize event hosting rights.</p>
    </div>

    <!-- Tab Layout -->
    <div class="space-y-6">
        <!-- Tab Headers -->
        <div class="flex border-b border-slate-200 text-sm font-bold text-slate-500">
            <button onclick="switchTab('pending-tab')" class="tab-btn px-6 py-3 border-b-2 border-brand-accent text-brand-accent focus:outline-none" id="pending-tab-btn">
                Pending Applications ({{ $pending->count() }})
            </button>
            <button onclick="switchTab('approved-tab')" class="tab-btn px-6 py-3 border-b-2 border-transparent hover:text-slate-800 focus:outline-none" id="approved-tab-btn">
                Approved Hosts ({{ $approved->count() }})
            </button>
            <button onclick="switchTab('rejected-tab')" class="tab-btn px-6 py-3 border-b-2 border-transparent hover:text-slate-800 focus:outline-none" id="rejected-tab-btn">
                Rejected Applications ({{ $rejected->count() }})
            </button>
        </div>

        <!-- Tab Contents -->
        <!-- 1. Pending Tab -->
        <div id="pending-tab" class="tab-content bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden block">
            <div class="p-6 border-b border-slate-100">
                <h3 class="font-bold text-slate-800">Pending Organizer Approvals</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-6 py-3.5">Host Name</th>
                            <th class="px-6 py-3.5">Organization</th>
                            <th class="px-6 py-3.5">Contact Info</th>
                            <th class="px-6 py-3.5">Signed Up</th>
                            <th class="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        @forelse($pending as $org)
                            <tr>
                                <td class="px-6 py-4 flex items-center space-x-3.5">
                                    <div class="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                        {{ substr($org->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-800">{{ $org->name }}</p>
                                        <p class="text-[10px] text-slate-400 mt-0.5">{{ $org->email }} • {{ $org->phone }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4">{{ $org->organization_name ?? '—' }}</td>
                                <td class="px-6 py-4 truncate max-w-[150px]">{{ $org->contact_info ?? '—' }}</td>
                                <td class="px-6 py-4">{{ $org->created_at->format('M j, Y') }}</td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <button type="button" data-organizer="{{ json_encode($org) }}" onclick="showOrganizerDetails(this)" class="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                                        View Details
                                    </button>
                                    <form action="{{ route('admin.organizers.approve', $org) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                                            Approve
                                        </button>
                                    </form>
                                    <form action="{{ route('admin.organizers.reject', $org) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                                            Reject
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-slate-400 font-medium">No pending registration requests.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 2. Approved Tab -->
        <div id="approved-tab" class="tab-content bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden hidden">
            <div class="p-6 border-b border-slate-100">
                <h3 class="font-bold text-slate-800">Approved Organizers</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-6 py-3.5">Host Name</th>
                            <th class="px-6 py-3.5">Organization</th>
                            <th class="px-6 py-3.5">Contact Info</th>
                            <th class="px-6 py-3.5">Approved On</th>
                            <th class="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        @forelse($approved as $org)
                            <tr>
                                <td class="px-6 py-4 flex items-center space-x-3.5">
                                    <div class="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                        {{ substr($org->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-800">{{ $org->name }}</p>
                                        <p class="text-[10px] text-slate-400 mt-0.5">{{ $org->email }} • {{ $org->phone }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4">{{ $org->organization_name ?? '—' }}</td>
                                <td class="px-6 py-4 truncate max-w-[150px]">{{ $org->contact_info ?? '—' }}</td>
                                <td class="px-6 py-4">{{ $org->updated_at->format('M j, Y') }}</td>
                                <td class="px-6 py-4 text-right">
                                    <button type="button" data-organizer="{{ json_encode($org) }}" onclick="showOrganizerDetails(this)" class="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors mr-2">
                                        View Details
                                    </button>
                                    <form action="{{ route('admin.organizers.reject', $org) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="border border-rose-250 hover:bg-rose-50 text-rose-600 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                                            Suspend
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-slate-400 font-medium">No approved organizers.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 3. Rejected Tab -->
        <div id="rejected-tab" class="tab-content bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden hidden">
            <div class="p-6 border-b border-slate-100">
                <h3 class="font-bold text-slate-800">Rejected Applications</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-6 py-3.5">Host Name</th>
                            <th class="px-6 py-3.5">Organization</th>
                            <th class="px-6 py-3.5">Contact Info</th>
                            <th class="px-6 py-3.5">Date Processed</th>
                            <th class="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        @forelse($rejected as $org)
                            <tr>
                                <td class="px-6 py-4 flex items-center space-x-3.5">
                                    <div class="h-8 w-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                                        {{ substr($org->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-800">{{ $org->name }}</p>
                                        <p class="text-[10px] text-slate-400 mt-0.5">{{ $org->email }} • {{ $org->phone }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4">{{ $org->organization_name ?? '—' }}</td>
                                <td class="px-6 py-4 truncate max-w-[150px]">{{ $org->contact_info ?? '—' }}</td>
                                <td class="px-6 py-4">{{ $org->updated_at->format('M j, Y') }}</td>
                                <td class="px-6 py-4 text-right">
                                    <button type="button" data-organizer="{{ json_encode($org) }}" onclick="showOrganizerDetails(this)" class="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors mr-2">
                                        View Details
                                    </button>
                                    <form action="{{ route('admin.organizers.approve', $org) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                                            Approve Account
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-slate-400 font-medium">No rejected organizers.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Organizer Details Modal -->
<div id="organizer-details-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out] font-outfit border border-slate-100">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <div>
                <h3 class="font-bold text-lg" id="org-modal-title">Organization Details</h3>
                <p class="text-xs text-emerald-100 font-semibold mt-0.5">Profile overview and credentials</p>
            </div>
            <button onclick="toggleOrganizerModal()" class="text-emerald-200 hover:text-white transition-colors">
                <i data-lucide="x" class="h-6 w-6"></i>
            </button>
        </div>
        <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Representative</label>
                    <div class="flex items-center space-x-2 text-slate-700">
                        <i data-lucide="user" class="h-4 w-4 text-brand-accent"></i>
                        <span class="text-sm font-semibold" id="org-modal-name">—</span>
                    </div>
                </div>
                <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <div class="flex items-center space-x-2 text-slate-700">
                        <i data-lucide="mail" class="h-4 w-4 text-brand-accent"></i>
                        <span class="text-sm font-semibold text-wrap break-all" id="org-modal-email">—</span>
                    </div>
                </div>
                <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                    <div class="flex items-center space-x-2 text-slate-700">
                        <i data-lucide="phone" class="h-4 w-4 text-brand-accent"></i>
                        <span class="text-sm font-semibold" id="org-modal-phone">—</span>
                    </div>
                </div>
                <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Website</label>
                    <div class="flex items-center space-x-2 text-slate-700">
                        <i data-lucide="globe" class="h-4 w-4 text-brand-accent"></i>
                        <a href="#" target="_blank" id="org-modal-website-link" class="text-sm font-semibold text-brand-accent hover:underline flex items-center space-x-0.5">
                            <span id="org-modal-website">—</span>
                            <i data-lucide="external-link" class="h-3.5 w-3.5"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Address -->
            <div class="space-y-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Office Address</label>
                <div class="flex items-start space-x-2 text-slate-700">
                    <i data-lucide="map-pin" class="h-4 w-4 text-brand-accent mt-0.5"></i>
                    <span class="text-sm font-semibold" id="org-modal-address">—</span>
                </div>
            </div>

            <!-- Biography / Contact Info -->
            <div class="space-y-1.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Biography / Description</label>
                <p class="text-xs text-slate-600 leading-relaxed font-medium text-justify whitespace-pre-line" id="org-modal-bio">
                    —
                </p>
            </div>

            <!-- Social Media Handles -->
            <div class="space-y-2">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Social Connections</label>
                <div class="flex space-x-3">
                    <a id="org-modal-fb" href="#" target="_blank" class="flex items-center space-x-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                        <span>Facebook</span>
                    </a>
                    <a id="org-modal-li" href="#" target="_blank" class="flex items-center space-x-1.5 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 hover:bg-sky-100 px-3 py-1.5 rounded-xl transition-all">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect x="2" y="9" width="4" height="12"/>
                            <circle cx="4" cy="4" r="2"/>
                        </svg>
                        <span>LinkedIn</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="p-6 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
            <button type="button" onclick="toggleOrganizerModal()" class="px-5 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Close View</button>
        </div>
    </div>
</div>

<script>
    function switchTab(tabId) {
        // Hide all tab contents
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('block');
        });

        // Show selected tab content
        const activeContent = document.getElementById(tabId);
        activeContent.classList.remove('hidden');
        activeContent.classList.add('block');

        // Reset all button styles
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            btn.classList.remove('border-brand-accent', 'text-brand-accent');
            btn.classList.add('border-transparent');
        });

        // Set active button style
        const activeBtn = document.getElementById(tabId + '-btn');
        activeBtn.classList.remove('border-transparent');
        activeBtn.classList.add('border-brand-accent', 'text-brand-accent');
    }

    function showOrganizerDetails(button) {
        const org = JSON.parse(button.getAttribute('data-organizer'));
        document.getElementById('org-modal-title').textContent = org.organization_name || org.name || 'Organization Details';
        document.getElementById('org-modal-name').textContent = org.name || '—';
        document.getElementById('org-modal-email').textContent = org.email || '—';
        document.getElementById('org-modal-phone').textContent = org.phone || '—';
        
        const websiteVal = org.website || '';
        const websiteSpan = document.getElementById('org-modal-website');
        const websiteLink = document.getElementById('org-modal-website-link');
        if (websiteVal) {
            websiteSpan.textContent = websiteVal;
            websiteLink.href = websiteVal;
            websiteLink.style.display = 'inline-flex';
        } else {
            websiteSpan.textContent = '—';
            websiteLink.href = '#';
            websiteLink.style.display = 'none';
        }
        
        document.getElementById('org-modal-address').textContent = org.address || '—';
        document.getElementById('org-modal-bio').textContent = org.contact_info || '—';
        
        let social = org.social_links;
        if (typeof social === 'string') {
            try {
                social = JSON.parse(social);
            } catch(e) {
                social = {};
            }
        }
        
        const fbLink = document.getElementById('org-modal-fb');
        if (social && social.facebook) {
            fbLink.href = social.facebook;
            fbLink.style.display = 'inline-flex';
        } else {
            fbLink.style.display = 'none';
        }
        
        const liLink = document.getElementById('org-modal-li');
        if (social && social.linkedin) {
            liLink.href = social.linkedin;
            liLink.style.display = 'inline-flex';
        } else {
            liLink.style.display = 'none';
        }
        
        const modal = document.getElementById('organizer-details-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    
    function toggleOrganizerModal() {
        const modal = document.getElementById('organizer-details-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
</script>
@endsection
