@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Contact Us Management</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">Manage dynamic contact info details and view submissions from the Contact form.</p>
    </div>

    <!-- Tab Buttons -->
    <div class="flex border-b border-slate-200 gap-6">
        <button onclick="switchTab('cards')" id="tab-btn-cards" class="tab-btn pb-4 text-sm font-bold border-b-2 border-brand-accent text-brand-accent transition-all">
            Info Cards
        </button>
        <button onclick="switchTab('messages')" id="tab-btn-messages" class="tab-btn pb-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all flex items-center space-x-2">
            <span>User Messages</span>
            @if(count($messages) > 0)
                <span class="bg-brand-accent text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">{{ count($messages) }}</span>
            @endif
        </button>
    </div>

    <!-- Tab 1: Info Cards Content -->
    <div id="tab-panel-cards" class="tab-panel space-y-6">
        <div class="flex justify-between items-center">
            <h3 class="font-bold text-slate-800 text-sm">Configure Contact Details</h3>
            <button onclick="toggleModal('add-info-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors flex items-center space-x-2">
                <i data-lucide="plus" class="h-4 w-4"></i>
                <span>Add Info Card</span>
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @forelse($info as $index => $item)
                <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 flex flex-col justify-between space-y-6">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="p-3.5 rounded-2xl border {{ $item['color'] ?? 'text-emerald-700 bg-emerald-50 border-emerald-100' }}">
                                <i data-lucide="{{ $item['icon'] ?? 'mail' }}" class="h-6 w-6"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-bold text-slate-900">{{ $item['title'] ?? '' }}</h4>
                                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Icon: {{ $item['icon'] ?? 'mail' }}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-1.5">
                            <button onclick="editInfo({{ $index }}, {{ json_encode($item) }})" class="p-1.5 text-slate-400 hover:text-brand-accent transition-colors">
                                <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                            </button>
                            <form action="{{ route('admin.contact.delete', ['info', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this info card?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                                    <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Card Details -->
                    <div class="space-y-1.5 pt-2 border-t border-slate-50 text-xs font-semibold text-slate-600">
                        @if(isset($item['details']) && is_array($item['details']))
                            @foreach($item['details'] as $line)
                                <div class="flex items-center space-x-2">
                                    <span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                                    <span>{{ $line }}</span>
                                </div>
                            @endforeach
                        @else
                            <p class="text-slate-400">No details added.</p>
                        @endif
                    </div>

                    <!-- Theme / Color Classes badge -->
                    <div class="text-[10px] font-bold text-slate-400 select-none bg-slate-50 self-start px-2.5 py-1 rounded-lg">
                        Theme Colors: <code class="text-[9px] bg-white px-1 py-0.5 rounded border border-slate-100">{{ $item['color'] ?? '' }}</code>
                    </div>
                </div>
            @empty
                <div class="col-span-full bg-white rounded-3xl border border-slate-200/60 shadow-sm p-12 text-center text-slate-400 font-medium">
                    No info cards found. Add some to get started!
                </div>
            @endforelse
        </div>
    </div>

    <!-- Tab 2: User Messages Content -->
    <div id="tab-panel-messages" class="tab-panel hidden space-y-6">
        <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-100">
                <h3 class="font-bold text-slate-800 text-sm">Inbox messages</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th class="px-6 py-3.5">Date</th>
                            <th class="px-6 py-3.5">Name</th>
                            <th class="px-6 py-3.5">Email</th>
                            <th class="px-6 py-3.5 w-1/3">Subject</th>
                            <th class="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        @forelse($messages as $msg)
                            <tr class="hover:bg-slate-50/40 transition-colors">
                                <td class="px-6 py-4 text-slate-400 font-bold">
                                    {{ $msg->created_at->format('M j, Y g:i A') }}
                                </td>
                                <td class="px-6 py-4 font-bold text-slate-900 text-sm">
                                    {{ $msg->name }}
                                </td>
                                <td class="px-6 py-4 text-slate-500 font-medium select-all">
                                    {{ $msg->email }}
                                </td>
                                <td class="px-6 py-4 text-slate-500 font-medium truncate max-w-[200px]">
                                    {{ $msg->subject ?? '(No Subject)' }}
                                </td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <button onclick="viewMessage({{ json_encode($msg) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                        <i data-lucide="eye" class="h-4.5 w-4.5"></i>
                                    </button>
                                    <form action="{{ route('admin.contact.messages.delete', $msg->id) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this message?');">
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
                                <td colspan="5" class="px-6 py-12 text-center text-slate-400 font-medium">
                                    Inbox is clean! No user messages yet.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- ==================== MODALS ==================== -->

<!-- 1. Add Info Card Modal -->
<div id="add-info-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Contact Info Card</h3>
            <button onclick="toggleModal('add-info-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.contact.add', 'info') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <!-- Title -->
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Card Title</label>
                <input type="text" name="title" required placeholder="e.g. Email Us" class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Details -->
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Details List (One item per line)</label>
                <textarea name="details" rows="3" required placeholder="e.g.&#10;hello@eventra.live&#10;support@eventra.live" class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Icon -->
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" required placeholder="e.g. Mail, Phone, MapPin" class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Color Theme -->
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Tailwind Color Classes</label>
                    <input type="text" name="color" required placeholder="text-indigo-600 bg-indigo-50 border-indigo-100" class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-info-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Card</button>
            </div>
        </form>
    </div>
</div>

<!-- 2. Edit Info Card Modal -->
<div id="edit-info-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Contact Info Card</h3>
            <button onclick="toggleModal('edit-info-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-info-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <!-- Title -->
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Card Title</label>
                <input type="text" name="title" id="edit_title" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Details -->
            <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Details List (One item per line)</label>
                <textarea name="details" id="edit_details" rows="3" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Icon -->
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon</label>
                    <input type="text" name="icon" id="edit_icon" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Color Theme -->
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Tailwind Color Classes</label>
                    <input type="text" name="color" id="edit_color" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-info-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<!-- 3. View User Message Details Modal -->
<div id="view-message-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <!-- Modal Header -->
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <div>
                <h3 class="font-bold text-lg leading-tight">User Contact Message</h3>
                <span class="text-[10px] text-emerald-200 font-bold uppercase tracking-widest mt-1" id="msg_date">June 23, 2026</span>
            </div>
            <button onclick="toggleModal('view-message-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        
        <!-- Modal Body -->
        <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <!-- Metadata Cards -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                    <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Sender Name</span>
                    <h5 class="text-sm font-bold text-slate-900 leading-snug" id="msg_name">Tanvir Rana</h5>
                    <span class="text-xs text-slate-500 font-medium select-all block mt-0.5" id="msg_email">tanvir@eventra.com</span>
                </div>
                <div class="bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                    <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Contact Phone</span>
                    <h5 class="text-sm font-bold text-slate-900 leading-snug" id="msg_phone">+880170000000</h5>
                    <span class="text-xs text-slate-400 font-medium block mt-0.5">Callback Number</span>
                </div>
            </div>

            <!-- Subject -->
            <div>
                <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Subject</span>
                <div class="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-xs font-semibold text-slate-900" id="msg_subject">
                    General Cooperation Inquiry
                </div>
            </div>

            <!-- Message Text -->
            <div>
                <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Message Content</span>
                <div class="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-700 font-medium whitespace-pre-wrap" id="msg_body">
                    Sample message text content.
                </div>
            </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button onclick="toggleModal('view-message-modal')" class="px-5 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-100">Close</button>
            <form id="msg_delete_form" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this message?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl">Delete Message</button>
            </form>
        </div>
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

        // Style the active button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-brand-accent', 'text-brand-accent');
            btn.classList.add('border-transparent', 'text-slate-500', 'hover:text-slate-800');
        });
        const activeBtn = document.getElementById(`tab-btn-${tabId}`);
        activeBtn.classList.remove('border-transparent', 'text-slate-500', 'hover:text-slate-800');
        activeBtn.classList.add('border-brand-accent', 'text-brand-accent');
    }

    function editInfo(index, item) {
        const form = document.getElementById('edit-info-form');
        form.action = "{{ route('admin.contact.update', ['info', ':index']) }}".replace(':index', index);

        document.getElementById('edit_title').value = item.title;
        document.getElementById('edit_icon').value = item.icon;
        document.getElementById('edit_color').value = item.color;
        
        let detailsText = '';
        if (item.details && Array.isArray(item.details)) {
            detailsText = item.details.join('\n');
        }
        document.getElementById('edit_details').value = detailsText;

        toggleModal('edit-info-modal');
    }

    function viewMessage(msg) {
        // Populate view modal fields
        document.getElementById('msg_name').innerText = msg.name;
        document.getElementById('msg_email').innerText = msg.email;
        document.getElementById('msg_phone').innerText = msg.phone || '(No Phone Number)';
        document.getElementById('msg_subject').innerText = msg.subject || '(No Subject)';
        document.getElementById('msg_body').innerText = msg.message;
        
        // Format creation date
        const dateObj = new Date(msg.created_at);
        document.getElementById('msg_date').innerText = dateObj.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // Set up the delete action on the modal
        const form = document.getElementById('msg_delete_form');
        form.action = "{{ route('admin.contact.messages.delete', ':id') }}".replace(':id', msg.id);

        toggleModal('view-message-modal');
    }
</script>
@endsection
