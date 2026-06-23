@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Registrations & Payments</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Monitor participant event enrollments, payment transaction statuses, and check-in metrics.</p>
    </div>

    <!-- Analytics Dashboard widgets -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Total Registrations Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center space-x-4">
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <i data-lucide="users" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                <p class="text-2xl font-black text-slate-800 mt-0.5">{{ $metrics['total_registrations'] }}</p>
            </div>
        </div>

        <!-- Total Revenue Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center space-x-4">
            <div class="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
                <i data-lucide="dollar-sign" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <p class="text-2xl font-black text-slate-800 mt-0.5">${{ number_format($metrics['total_revenue'], 2) }}</p>
            </div>
        </div>

        <!-- Total Check-ins Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center space-x-4">
            <div class="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                <i data-lucide="shield-check" class="h-6 w-6"></i>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Checked-in Entries</p>
                <p class="text-2xl font-black text-slate-800 mt-0.5">{{ $metrics['checked_in_count'] }}</p>
            </div>
        </div>

        <!-- Revenue by Gateways Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Revenue Share</span>
            </div>
            <div class="mt-2 space-y-1 text-xs">
                <div class="flex justify-between text-slate-600 font-bold">
                    <span>bKash:</span>
                    <span>${{ number_format($metrics['bKash_revenue'], 2) }}</span>
                </div>
                <div class="flex justify-between text-slate-600 font-bold">
                    <span>Nagad:</span>
                    <span>${{ number_format($metrics['nagad_revenue'], 2) }}</span>
                </div>
                <div class="flex justify-between text-slate-600 font-bold">
                    <span>Cards:</span>
                    <span>${{ number_format($metrics['card_revenue'], 2) }}</span>
                </div>
            </div>
        </div>

    </div>

    <!-- Filters & List Log -->
    <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        
        <!-- Filter Form -->
        <div class="p-6 border-b border-slate-100">
            <form action="{{ route('admin.registrations') }}" method="GET" class="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Search query input */}
                <div class="relative w-full sm:max-w-md group">
                    <input 
                        type="text" 
                        name="search"
                        placeholder="Search registrations, transaction IDs, names..."
                        value="{{ request()->query('search') }}"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                    />
                    <i data-lucide="search" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors"></i>
                </div>

                {/* Gateway selection and filters */}
                <div class="flex w-full sm:w-auto items-center space-x-3">
                    <select 
                        name="method"
                        onchange="this.form.submit()"
                        class="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all cursor-pointer"
                    >
                        <option value="">All Gateways</option>
                        <option value="Visa" {{ request()->query('method') === 'Visa' ? 'selected' : '' }}>Visa Card</option>
                        <option value="MasterCard" {{ request()->query('method') === 'MasterCard' ? 'selected' : '' }}>MasterCard</option>
                        <option value="bKash" {{ request()->query('method') === 'bKash' ? 'selected' : '' }}>bKash</option>
                        <option value="Nagad" {{ request()->query('method') === 'Nagad' ? 'selected' : '' }}>Nagad</option>
                    </select>

                    @if(request()->filled('search') || request()->filled('method'))
                        <a href="{{ route('admin.registrations') }}" class="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer flex items-center space-x-1.5">
                            <i data-lucide="refresh-cw" class="h-3.5 w-3.5"></i>
                            <span>Reset</span>
                        </a>
                    @endif
                </div>

            </form>
        </div>

        <!-- Table Listing -->
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th class="px-6 py-3.5">Registration Info</th>
                        <th class="px-6 py-3.5">Participant Details</th>
                        <th class="px-6 py-3.5">Event details</th>
                        <th class="px-6 py-3.5">Transaction ID</th>
                        <th class="px-6 py-3.5">Payment details</th>
                        <th class="px-6 py-3.5">Pass Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    @forelse($registrations as $reg)
                        <tr class="hover:bg-slate-50/30 transition-all">
                            
                            <!-- Registration Code -->
                            <td class="px-6 py-4">
                                <p class="font-extrabold text-slate-800">{{ $reg->registration_code ?? 'REG-N/A' }}</p>
                                <p class="text-[10px] text-slate-400 mt-0.5">Registered: {{ $reg->registered_at ? $reg->registered_at->format('M j, Y H:i') : 'N/A' }}</p>
                            </td>

                            <!-- Participant -->
                            <td class="px-6 py-4">
                                <p class="font-bold text-slate-800">{{ $reg->user->name ?? 'Unknown User' }}</p>
                                <p class="text-[10px] text-slate-400 font-mono">{{ $reg->user->email ?? 'N/A' }}</p>
                            </td>

                            <!-- Event booked -->
                            <td class="px-6 py-4 truncate max-w-[200px]" title="{{ $reg->event->title ?? 'N/A' }}">
                                <p class="font-bold text-slate-800">{{ $reg->event->title ?? 'N/A' }}</p>
                                <p class="text-[10px] text-slate-400">{{ $reg->event->event_date->format('M j, Y') }}</p>
                            </td>

                            <!-- Transaction ID -->
                            <td class="px-6 py-4 font-mono font-bold text-slate-700">
                                {{ $reg->transaction_id ?? 'N/A' }}
                            </td>

                            <!-- Billing detail -->
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-1.5">
                                    <span class="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase {{
                                        $reg->payment_method === 'bKash' ? 'bg-pink-50 text-pink-700' :
                                        ($reg->payment_method === 'Nagad' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700')
                                    }}">
                                        {{ $reg->payment_method ?? 'Free' }}
                                    </span>
                                    <span class="font-black text-slate-800">${{ number_format($reg->payment_amount, 2) }}</span>
                                </div>
                            </td>

                            <!-- Pass entry status -->
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border {{
                                    $reg->pass_status === 'Checked-in' 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                        : ($reg->pass_status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100')
                                }}">
                                    <span class="w-1.5 h-1.5 rounded-full {{
                                        $reg->pass_status === 'Checked-in' 
                                            ? 'bg-emerald-500' 
                                            : ($reg->pass_status === 'Cancelled' ? 'bg-rose-500' : 'bg-blue-500')
                                    }}"></span>
                                    <span>{{ $reg->pass_status }}</span>
                                </span>
                            </td>

                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-8 text-center text-slate-400 font-medium">No registrations or payment transactions recorded.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($registrations->hasPages())
            <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                {{ $registrations->links() }}
            </div>
        @endif

    </div>

</div>
@endsection
