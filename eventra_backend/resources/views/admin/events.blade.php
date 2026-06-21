@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Manage Events</h1>
            <p class="text-sm text-slate-500 mt-1 font-medium">Create, publish, edit, unpublish, or archive platform events.</p>
        </div>
        <button onclick="toggleModal('add-event-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors self-start">
            + New Event
        </button>
    </div>

    <!-- Events List Table -->
    <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-slate-800">Event Registry</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th class="px-6 py-3.5">Title</th>
                        <th class="px-6 py-3.5">Category</th>
                        <th class="px-6 py-3.5">Date & Time</th>
                        <th class="px-6 py-3.5">Location</th>
                        <th class="px-6 py-3.5">Status</th>
                        <th class="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    @forelse($events as $event)
                        <tr>
                            <td class="px-6 py-4 flex items-center space-x-4">
                                <img src="{{ $event->image_path }}" class="h-10 w-12 object-cover rounded-lg border border-slate-100 shrink-0" />
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-slate-800 truncate max-w-[200px]">{{ $event->title }}</p>
                                    <p class="text-[9px] text-slate-400">Created by: {{ $event->organizer->name }}</p>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{{ $event->category->name }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div>{{ $event->event_date->format('M j, Y') }}</div>
                                <div class="text-[10px] text-slate-400 mt-0.5">{{ date('h:i A', strtotime($event->event_time)) }}</div>
                            </td>
                            <td class="px-6 py-4 truncate max-w-[150px]">{{ $event->location }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-2">
                                    @if($event->status === 'published')
                                        <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Published</span>
                                    @elseif($event->status === 'draft')
                                        <span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Draft</span>
                                    @else
                                        <span class="text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full text-[10px]">Archived</span>
                                    @endif
                                    
                                    <!-- Quick State Toggle Dropdown Form -->
                                    <form action="{{ route('admin.events.toggle', $event) }}" method="POST" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <select name="status" onchange="this.form.submit()" class="text-[9px] font-bold border border-slate-200 rounded-md py-0.5 px-1 bg-white focus:outline-none cursor-pointer">
                                            <option value="">Change Status</option>
                                            <option value="draft" {{ $event->status === 'draft' ? 'disabled' : '' }}>Draft</option>
                                            <option value="published" {{ $event->status === 'published' ? 'disabled' : '' }}>Publish</option>
                                            <option value="archived" {{ $event->status === 'archived' ? 'disabled' : '' }}>Archive</option>
                                        </select>
                                    </form>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button onclick="editEvent({{ json_encode($event) }})" class="text-slate-500 hover:text-brand-accent transition-colors">
                                    <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                </button>
                                <form action="{{ route('admin.events.destroy', $event) }}" method="POST" class="inline" onsubmit="return confirm('Delete this event?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-slate-500 hover:text-rose-600 transition-colors">
                                        <i data-lucide="trash-2" class="h-4.5 w-4.5"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-8 text-center text-slate-400 font-medium">No events registered.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add Event Modal -->
<div id="add-event-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Create New Event</h3>
            <button onclick="toggleModal('add-event-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            @csrf
            <!-- Title -->
            <div class="space-y-1">
                <label for="title" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Event Title</label>
                <input type="text" name="title" id="title" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Category -->
            <div class="space-y-1">
                <label for="category_id" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
                <select name="category_id" id="category_id" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold">
                    <option value="">Select Category</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Date -->
                <div class="space-y-1">
                    <label for="event_date" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Date</label>
                    <input type="date" name="event_date" id="event_date" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Time -->
                <div class="space-y-1">
                    <label for="event_time" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Start Time</label>
                    <input type="time" name="event_time" id="event_time" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
            </div>
            <!-- Venue / Location -->
            <div class="space-y-1">
                <label for="location" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Location / Venue</label>
                <input type="text" name="location" id="location" required placeholder="e.g. Auditorium Hall, Dhaka" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Description -->
            <div class="space-y-1">
                <label for="description" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" id="description" rows="3" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <!-- Cover Image File -->
            <div class="space-y-1">
                <label for="image" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Cover Image</label>
                <input type="file" name="image" id="image" class="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent hover:file:bg-emerald-100" />
            </div>
            <!-- Initial Status -->
            <div class="space-y-1">
                <label for="status" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Status</label>
                <select name="status" id="status" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-event-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Event</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Event Modal -->
<div id="edit-event-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Edit Event Details</h3>
            <button onclick="toggleModal('edit-event-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-event-form" method="POST" enctype="multipart/form-data" class="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            @csrf
            @method('PUT')
            <!-- Title -->
            <div class="space-y-1">
                <label for="edit_title" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Event Title</label>
                <input type="text" name="title" id="edit_title" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Category -->
            <div class="space-y-1">
                <label for="edit_category_id" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
                <select name="category_id" id="edit_category_id" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold">
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <!-- Date -->
                <div class="space-y-1">
                    <label for="edit_event_date" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Date</label>
                    <input type="date" name="event_date" id="edit_event_date" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
                <!-- Time -->
                <div class="space-y-1">
                    <label for="edit_event_time" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Start Time</label>
                    <input type="time" name="event_time" id="edit_event_time" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                </div>
            </div>
            <!-- Venue / Location -->
            <div class="space-y-1">
                <label for="edit_location" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Location / Venue</label>
                <input type="text" name="location" id="edit_location" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Description -->
            <div class="space-y-1">
                <label for="edit_description" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea name="description" id="edit_description" rows="3" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <!-- Cover Image File -->
            <div class="space-y-1">
                <label for="edit_image" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Replace Cover Image (Optional)</label>
                <input type="file" name="image" id="edit_image" class="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-accent hover:file:bg-emerald-100" />
            </div>
            <!-- Status -->
            <div class="space-y-1">
                <label for="edit_status" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Status</label>
                <select name="status" id="edit_status" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-event-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<script>
    function toggleModal(id) {
        const modal = document.getElementById(id);
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    }

    function editEvent(event) {
        const form = document.getElementById('edit-event-form');
        form.action = `/admin/events/${event.id}`;

        document.getElementById('edit_title').value = event.title;
        document.getElementById('edit_category_id').value = event.category_id;
        
        // Format date string as YYYY-MM-DD (timezone-safe extraction)
        const dateString = event.event_date.split(' ')[0].split('T')[0];
        document.getElementById('edit_event_date').value = dateString;
        
        document.getElementById('edit_event_time').value = event.event_time;
        document.getElementById('edit_location').value = event.location;
        document.getElementById('edit_description').value = event.description || '';
        document.getElementById('edit_status').value = event.status;

        toggleModal('edit-event-modal');
    }
</script>
@endsection
