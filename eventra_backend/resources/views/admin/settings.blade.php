@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">System Configurations</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Manage payment gateways, host regulations, and broadcast notifications to users.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Rule Settings & Payment Methods Config (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
            
            <!-- Rules Form Card -->
            <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6 text-left">
                <div>
                    <h3 class="text-lg font-black text-slate-800 tracking-tight">Organizer Regulations & Gateways</h3>
                    <p class="text-xs text-slate-400 font-semibold mt-0.5">Rules will be appended to approval emails. Payment methods will be active on checkout options.</p>
                </div>

                <form action="{{ route('admin.settings.rules') }}" method="POST" class="space-y-6">
                    @csrf

                    <!-- Rules Input -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Rules & Guidelines (Markdown/List format)</label>
                        <textarea 
                            name="organizer_rules_regulations" 
                            rows="8"
                            placeholder="Enter rules to attach to organizer welcome emails..."
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-slate-700 placeholder-slate-400 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all font-mono"
                        >{{ old('organizer_rules_regulations', $rules) }}</textarea>
                    </div>

                    <!-- Payment Toggles -->
                    <div class="space-y-3">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Payment Methods</label>
                        <div class="grid grid-cols-2 gap-3.5">
                            @foreach(['Visa', 'MasterCard', 'bKash', 'Nagad'] as $method)
                                <label class="flex items-center space-x-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl transition-all cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="payment_methods[]" 
                                        value="{{ $method }}"
                                        {{ in_array($method, $activeMethods) ? 'checked' : '' }}
                                        class="rounded border-slate-350 text-[#2E6F40] focus:ring-[#2E6F40]/20 h-4.5 w-4.5"
                                    />
                                    <span class="text-xs font-bold text-slate-700">{{ $method }}</span>
                                </label>
                            @endforeach
                        </div>
                    </div>

                    <!-- Submit -->
                    <div class="pt-4 border-t border-slate-100 flex justify-end">
                        <button type="submit" class="py-3 px-8 bg-[#2E6F40] hover:bg-[#2E6F40]/90 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer">
                            Save Configurations
                        </button>
                    </div>

                </form>
            </div>

        </div>

        <!-- Right: Broadcaster Form (5 cols) -->
        <div class="lg:col-span-5">
            
            <!-- Broadcaster Notification Card -->
            <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6 text-left">
                <div>
                    <h3 class="text-lg font-black text-slate-800 tracking-tight">System Broadcaster</h3>
                    <p class="text-xs text-slate-400 font-semibold mt-0.5">Send real-time alerts or emails to the chosen user accounts directories instantly.</p>
                </div>

                <form action="{{ route('admin.settings.notify') }}" method="POST" class="space-y-4">
                    @csrf

                    <!-- Target Audiance -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Target Audience</label>
                        <select 
                            name="target_role"
                            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all cursor-pointer"
                        >
                            <option value="all">All Accounts</option>
                            <option value="participant">Participants Directory</option>
                            <option value="organizer">Hosts Directory</option>
                        </select>
                    </div>

                    <!-- Title -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Notification Title</label>
                        <input 
                            type="text" 
                            name="title"
                            placeholder="Broadcasting Alert Title..."
                            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                            required
                        />
                    </div>

                    <!-- Message Body -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Alert Message</label>
                        <textarea 
                            name="message" 
                            rows="4"
                            placeholder="Write your system alert notification details here..."
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
                            required
                        ></textarea>
                    </div>

                    <!-- Broadcast button -->
                    <div class="pt-4 border-t border-slate-100">
                        <button type="submit" class="w-full py-3 px-6 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer flex items-center justify-center space-x-2">
                            <i data-lucide="bell" class="h-4 w-4 text-amber-400"></i>
                            <span>Broadcast Alert</span>
                        </button>
                    </div>

                </form>
            </div>

        </div>

    </div>

</div>
@endsection
