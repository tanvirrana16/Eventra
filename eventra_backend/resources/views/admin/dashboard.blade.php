@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Top Greeting Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
            <p class="text-sm text-slate-500 mt-1 font-medium">Real-time summaries of Eventra registrations, events, and milestones.</p>
        </div>
        <div class="bg-brand-light/35 border border-brand-light text-brand-accent px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent"></span>
            </span>
            <span>Platform Live Data</span>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Event Count -->
        <div onclick="openDetailModal('events')" class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 select-none">
            <div class="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <i data-lucide="calendar-days" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Events</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ $stats['total_events'] }}</p>
                <div class="text-[10px] text-slate-500 mt-1">
                    <span class="font-bold text-emerald-600">{{ $stats['published_events'] }}</span> published • 
                    <span class="font-bold text-amber-600">{{ $stats['draft_events'] }}</span> draft
                </div>
            </div>
        </div>

        <!-- Participants Count -->
        <div onclick="openDetailModal('participants')" class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 select-none">
            <div class="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <i data-lucide="users" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Participants</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ $stats['total_participants'] }}</p>
                <p class="text-[10px] text-slate-500 mt-1">
                    <span class="font-bold text-blue-600">{{ $stats['total_registrations'] }}</span> signups across events
                </p>
            </div>
        </div>

        <!-- Organizers Count -->
        <div onclick="openDetailModal('organizers')" class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 select-none">
            <div class="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <i data-lucide="shield-check" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Hosts / Organizers</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ $stats['total_organizers'] }}</p>
                <p class="text-[10px] text-slate-500 mt-1">
                    @if($stats['pending_organizers'] > 0)
                        <span class="font-bold text-amber-500 underline" onclick="event.stopPropagation();"><a href="{{ route('admin.organizers') }}">{{ $stats['pending_organizers'] }} pending approval</a></span>
                    @else
                        All organizer accounts approved
                    @endif
                </p>
            </div>
        </div>

        <!-- Certificates Count -->
        <div onclick="openDetailModal('certificates')" class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 select-none">
            <div class="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                <i data-lucide="award" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Certificates Issued</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ $stats['total_certificates'] }}</p>
                <p class="text-[10px] text-slate-500 mt-1">Milestones generated on platform</p>
            </div>
        </div>
    </div>

    <!-- Data Lists Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Events Table -->
        <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-800">Recent Events Created</h3>
                <a href="{{ route('admin.events') }}" class="text-xs font-bold text-brand-accent hover:underline">View All Events</a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-6 py-3.5">Title</th>
                            <th class="px-6 py-3.5">Category</th>
                            <th class="px-6 py-3.5">Date</th>
                            <th class="px-6 py-3.5">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        @forelse($recentEvents as $event)
                            <tr>
                                <td class="px-6 py-4 truncate max-w-[180px]">{{ $event->title }}</td>
                                <td class="px-6 py-4">
                                    <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{{ $event->category->name }}</span>
                                </td>
                                <td class="px-6 py-4">{{ $event->event_date->format('M j, Y') }}</td>
                                <td class="px-6 py-4">
                                    @if($event->status === 'published')
                                        <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Published</span>
                                    @elseif($event->status === 'draft')
                                        <span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Draft</span>
                                    @else
                                        <span class="text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full text-[10px]">Archived</span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No events found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Recent Organizers List -->
        <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-bold text-slate-800">Hosts / Organizers Status</h3>
                <a href="{{ route('admin.organizers') }}" class="text-xs font-bold text-brand-accent hover:underline">Manage Applications</a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-6 py-3.5">Organizer Name</th>
                            <th class="px-6 py-3.5">Organization</th>
                            <th class="px-6 py-3.5">Joined</th>
                            <th class="px-6 py-3.5">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        @forelse($recentOrganizers as $org)
                            <tr>
                                <td class="px-6 py-4 flex items-center space-x-3.5">
                                    <div class="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                        {{ substr($org->name, 0, 1) }}
                                    </div>
                                    <span>{{ $org->name }}</span>
                                </td>
                                <td class="px-6 py-4 truncate max-w-[150px]">{{ $org->organization_name ?? '—' }}</td>
                                <td class="px-6 py-4">{{ $org->created_at->format('M j, Y') }}</td>
                                <td class="px-6 py-4">
                                    @if($org->status === 'approved')
                                        <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Approved</span>
                                    @elseif($org->status === 'pending')
                                        <span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Pending</span>
                                    @else
                                        <span class="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">Rejected</span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-8 text-center text-slate-400 font-medium">No organizers found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- ==================== DETAILS VIEW MODAL ==================== -->
<div id="stats-details-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out] flex flex-col max-h-[85vh]">
        <!-- Modal Header -->
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between shrink-0">
            <div>
                <h3 class="font-bold text-lg leading-tight" id="modal-title">Details View</h3>
                <p class="text-xs text-emerald-100 font-semibold mt-1" id="modal-subtitle">Details count and list view</p>
            </div>
            <button onclick="closeDetailModal()" class="text-emerald-200 hover:text-white transition-colors">
                <i data-lucide="x" class="h-5 w-5"></i>
            </button>
        </div>
        
        <!-- Search bar inside modal -->
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3 shrink-0">
            <div class="relative flex-1">
                <input type="text" id="modal-search" placeholder="Search records..." oninput="filterModalRecords()" class="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <i data-lucide="search" class="h-4.5 w-4.5"></i>
                </span>
            </div>
        </div>

        <!-- Modal Body (Scrollable Table) -->
        <div class="flex-1 overflow-y-auto p-6">
            <!-- Events Table -->
            <div id="modal-content-events" class="modal-tab-content hidden">
                <table class="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-4 py-3">Event Title</th>
                            <th class="px-4 py-3">Organizer</th>
                            <th class="px-4 py-3">Category</th>
                            <th class="px-4 py-3">Date</th>
                            <th class="px-4 py-3">Price</th>
                            <th class="px-4 py-3">Seats Left</th>
                            <th class="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach($allEvents as $event)
                            <tr class="modal-record hover:bg-slate-50/40" data-search="{{ strtolower($event->title . ' ' . ($event->organizer->name ?? '') . ' ' . $event->category->name . ' ' . $event->status) }}">
                                <td class="px-4 py-3 font-bold text-slate-900">{{ $event->title }}</td>
                                <td class="px-4 py-3 text-slate-500">{{ $event->organizer->name ?? 'Eventra Team' }}</td>
                                <td class="px-4 py-3"><span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{{ $event->category->name }}</span></td>
                                <td class="px-4 py-3">{{ $event->event_date->format('M j, Y') }}</td>
                                <td class="px-4 py-3">{{ $event->ticket_type === 'free' ? 'Free' : '$' . number_format($event->ticket_price, 2) }}</td>
                                <td class="px-4 py-3">{{ $event->seats_left }} / {{ $event->total_seats }}</td>
                                <td class="px-4 py-3">
                                    @if($event->status === 'published')
                                        <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Published</span>
                                    @elseif($event->status === 'draft')
                                        <span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Draft</span>
                                    @else
                                        <span class="text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full text-[10px]">Archived</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Participants Table -->
            <div id="modal-content-participants" class="modal-tab-content hidden">
                <table class="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-4 py-3">Name</th>
                            <th class="px-4 py-3">Email</th>
                            <th class="px-4 py-3">Phone</th>
                            <th class="px-4 py-3">Joined Date</th>
                            <th class="px-4 py-3">Events Registered</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach($allParticipants as $participant)
                            <tr class="modal-record hover:bg-slate-50/40" data-search="{{ strtolower($participant->name . ' ' . $participant->email . ' ' . $participant->phone) }}">
                                <td class="px-4 py-3 font-bold text-slate-900">{{ $participant->name }}</td>
                                <td class="px-4 py-3 text-slate-500 select-all">{{ $participant->email }}</td>
                                <td class="px-4 py-3 text-slate-500">{{ $participant->phone ?? '—' }}</td>
                                <td class="px-4 py-3">{{ $participant->created_at->format('M j, Y') }}</td>
                                <td class="px-4 py-3 font-bold text-slate-900 text-center">{{ $participant->registrations_count }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Hosts / Organizers Table -->
            <div id="modal-content-organizers" class="modal-tab-content hidden">
                <table class="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-4 py-3">Organizer Name</th>
                            <th class="px-4 py-3">Email</th>
                            <th class="px-4 py-3">Organization</th>
                            <th class="px-4 py-3">Joined</th>
                            <th class="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach($allOrganizers as $org)
                            <tr class="modal-record hover:bg-slate-50/40" data-search="{{ strtolower($org->name . ' ' . $org->email . ' ' . ($org->organization_name ?? '') . ' ' . $org->status) }}">
                                <td class="px-4 py-3 font-bold text-slate-900">{{ $org->name }}</td>
                                <td class="px-4 py-3 text-slate-500 select-all">{{ $org->email }}</td>
                                <td class="px-4 py-3 text-slate-500">{{ $org->organization_name ?? '—' }}</td>
                                <td class="px-4 py-3">{{ $org->created_at->format('M j, Y') }}</td>
                                <td class="px-4 py-3">
                                    @if($org->status === 'approved')
                                        <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Approved</span>
                                    @elseif($org->status === 'pending')
                                        <span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Pending</span>
                                    @else
                                        <span class="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">Rejected</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Certificates Table -->
            <div id="modal-content-certificates" class="modal-tab-content hidden">
                <table class="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-4 py-3">Certificate Code</th>
                            <th class="px-4 py-3">Attendee Name</th>
                            <th class="px-4 py-3">Event Name</th>
                            <th class="px-4 py-3">Issued Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach($allCertificates as $cert)
                            <tr class="modal-record hover:bg-slate-50/40" data-search="{{ strtolower($cert->certificate_code . ' ' . ($cert->user->name ?? '') . ' ' . ($cert->event->title ?? '')) }}">
                                <td class="px-4 py-3 font-mono font-bold text-emerald-700">{{ $cert->certificate_code }}</td>
                                <td class="px-4 py-3 font-bold text-slate-900">{{ $cert->user->name ?? 'Unknown User' }}</td>
                                <td class="px-4 py-3 text-slate-500">{{ $cert->event->title ?? 'N/A' }}</td>
                                <td class="px-4 py-3">{{ $cert->issued_at ? $cert->issued_at->format('M j, Y g:i A') : '—' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
            <button onclick="closeDetailModal()" class="px-5 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-100">Close</button>
        </div>
    </div>
</div>

<script>
    function openDetailModal(type) {
        // Reset search field
        document.getElementById('modal-search').value = '';
        
        // Hide all tab contents first
        document.querySelectorAll('.modal-tab-content').forEach(el => el.classList.add('hidden'));
        
        // Set titles based on selection
        let title = '';
        let subtitle = '';
        if (type === 'events') {
            title = 'Total Events';
            subtitle = 'Full list of created hackathons, workshops, and concerts';
            document.getElementById('modal-content-events').classList.remove('hidden');
        } else if (type === 'participants') {
            title = 'Total Participants';
            subtitle = 'Registered participant profiles, contact emails, and signup counts';
            document.getElementById('modal-content-participants').classList.remove('hidden');
        } else if (type === 'organizers') {
            title = 'Hosts / Organizers';
            subtitle = 'Registered dynamic event coordinators and validation status';
            document.getElementById('modal-content-organizers').classList.remove('hidden');
        } else if (type === 'certificates') {
            title = 'Certificates Issued';
            subtitle = 'Verified participant completion certificates and credentials';
            document.getElementById('modal-content-certificates').classList.remove('hidden');
        }
        
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-subtitle').innerText = subtitle;
        
        // Show all records initially
        document.querySelectorAll('.modal-record').forEach(row => row.classList.remove('hidden'));
        
        // Open modal
        const modal = document.getElementById('stats-details-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeDetailModal() {
        const modal = document.getElementById('stats-details-modal');
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }

    function filterModalRecords() {
        const query = document.getElementById('modal-search').value.toLowerCase().trim();
        document.querySelectorAll('.modal-record').forEach(row => {
            const searchText = row.getAttribute('data-search') || '';
            if (searchText.includes(query)) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }
</script>
@endsection
