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
</script>
@endsection
