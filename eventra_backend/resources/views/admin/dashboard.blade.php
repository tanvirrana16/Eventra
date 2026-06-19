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
        <div class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4">
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
        <div class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4">
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
        <div class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4">
            <div class="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <i data-lucide="shield-check" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Hosts / Organizers</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ $stats['total_organizers'] }}</p>
                <p class="text-[10px] text-slate-500 mt-1">
                    @if($stats['pending_organizers'] > 0)
                        <span class="font-bold text-amber-500 underline"><a href="{{ route('admin.organizers') }}">{{ $stats['pending_organizers'] }} pending approval</a></span>
                    @else
                        All organizer accounts approved
                    @endif
                </p>
            </div>
        </div>

        <!-- Certificates Count -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-center space-x-4">
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
@endsection
