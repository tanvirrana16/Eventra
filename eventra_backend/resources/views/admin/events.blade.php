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
<div id="add-event-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl my-8 animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <div>
                <h3 class="font-bold text-lg">Create New Event</h3>
                <p class="text-xs text-emerald-100 mt-0.5">Fill in all details to display on the platform.</p>
            </div>
            <button onclick="toggleModal('add-event-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        
        <form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-left">
            @csrf
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column - General Info -->
                <div class="space-y-4">
                    <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1.5">General Information</h4>
                    
                    <div class="space-y-1">
                        <label for="title" class="block text-xs font-bold text-slate-600">Event Title <span class="text-red-500">*</span></label>
                        <input type="text" name="title" id="title" required placeholder="e.g. Annual Tech Summit 2026" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="category_id" class="block text-xs font-bold text-slate-600">Category <span class="text-red-500">*</span></label>
                            <select name="category_id" id="category_id" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white">
                                <option value="">Select Category</option>
                                @foreach($categories as $cat)
                                    <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label for="status" class="block text-xs font-bold text-slate-600">Initial Status <span class="text-red-500">*</span></label>
                            <select name="status" id="status" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white">
                                <option value="draft">Draft</option>
                                <option value="published" selected>Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label for="location" class="block text-xs font-bold text-slate-600">Location / Venue <span class="text-red-500">*</span></label>
                        <input type="text" name="location" id="location" required placeholder="e.g. Grand Ballroom, Westin, Dhaka" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        <p class="text-[9px] text-slate-400 font-medium">Tip: Format as "VenueName, Address, City" to match frontend display.</p>
                    </div>

                    <div class="space-y-1">
                        <label for="description" class="block text-xs font-bold text-slate-600">Description</label>
                        <textarea name="description" id="description" rows="3" placeholder="Describe the event, objectives, and highlights..." class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold resize-none"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="image" class="block text-xs font-bold text-slate-600">Banner Image</label>
                            <input type="file" name="image" id="image" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                        </div>
                        <div class="space-y-1">
                            <label for="gallery" class="block text-xs font-bold text-slate-600">Gallery Images (Multiple)</label>
                            <input type="file" name="gallery[]" id="gallery" accept="image/*" multiple class="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                        </div>
                    </div>
                </div>

                <!-- Right Column - Schedules & Pricing -->
                <div class="space-y-4">
                    <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1.5">Schedule, Tickets & Rules</h4>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="event_date" class="block text-xs font-bold text-slate-600">Start Date <span class="text-red-500">*</span></label>
                            <input type="date" name="event_date" id="event_date" required class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1">
                            <label for="event_time" class="block text-xs font-bold text-slate-600">Start Time <span class="text-red-500">*</span></label>
                            <input type="time" name="event_time" id="event_time" required class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="event_end_date" class="block text-xs font-bold text-slate-600">End Date</label>
                            <input type="date" name="event_end_date" id="event_end_date" class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1">
                            <label for="event_end_time" class="block text-xs font-bold text-slate-600">End Time</label>
                            <input type="time" name="event_end_time" id="event_end_time" class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="registration_deadline" class="block text-xs font-bold text-slate-600">Registration Deadline</label>
                            <input type="date" name="registration_deadline" id="registration_deadline" class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1">
                            <label for="total_seats" class="block text-xs font-bold text-slate-600">Total Seats / Capacity</label>
                            <input type="number" name="total_seats" id="total_seats" min="1" value="100" class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div class="space-y-1">
                            <label for="ticket_type" class="block text-xs font-bold text-slate-600">Ticket Type</label>
                            <select name="ticket_type" id="ticket_type" onchange="togglePricingFields('add-event-modal', this.value)" class="w-full px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white">
                                <option value="free" selected>Free</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div class="space-y-1 price-field hidden">
                            <label for="ticket_price" class="block text-xs font-bold text-slate-600">Price</label>
                            <input type="number" name="ticket_price" id="ticket_price" step="0.01" min="0" placeholder="0.00" class="w-full px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1 price-field hidden">
                            <label for="currency" class="block text-xs font-bold text-slate-600">Currency</label>
                            <input type="text" name="currency" id="currency" value="USD" placeholder="USD" class="w-full px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="space-y-1.5 price-field hidden">
                        <label class="block text-xs font-bold text-slate-600">Allowed Payment Methods</label>
                        <div class="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="online" class="rounded text-brand-accent focus:ring-brand-accent" checked />
                                <span>Online Gateway</span>
                            </label>
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="card" class="rounded text-brand-accent focus:ring-brand-accent" checked />
                                <span>Credit/Debit Card</span>
                            </label>
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="mobile_banking" class="rounded text-brand-accent focus:ring-brand-accent" checked />
                                <span>Mobile Banking</span>
                            </label>
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="cash" class="rounded text-brand-accent focus:ring-brand-accent" />
                                <span>Cash / On Spot</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Full Width Details Area -->
            <div class="space-y-4 border-t pt-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1.5">Additional Details & Metadata</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <label for="tags" class="block text-xs font-bold text-slate-600">Custom Tags (Comma Separated)</label>
                            <input type="text" name="tags" id="tags" placeholder="e.g. Workshop, WebDev, Programming" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>

                        <div class="space-y-1">
                            <label for="contact_details" class="block text-xs font-bold text-slate-600">Contact Details</label>
                            <input type="text" name="contact_details" id="contact_details" placeholder="e.g. Email: info@domain.com, Phone: +88012345" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>

                        <div class="space-y-1">
                            <label for="rules" class="block text-xs font-bold text-slate-600">Rules & Instructions (One per line)</label>
                            <textarea name="rules" id="rules" rows="3" placeholder="Bring your own laptop&#10;Be present 15 mins before schedule" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold resize-none"></textarea>
                        </div>
                    </div>

                    <div class="space-y-1 flex flex-col h-full">
                        <label for="speakers" class="block text-xs font-bold text-slate-600">Speakers List (JSON Format)</label>
                        <textarea name="speakers" id="speakers" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-mono font-medium resize-none flex-1 min-h-[140px]" placeholder='[&#10;  {&#10;    "name": "Jane Doe",&#10;    "role": "Tech Lead at Google",&#10;    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330"&#10;  }&#10;]'></textarea>
                        <p class="text-[9px] text-slate-400 mt-1 font-medium">Note: Provide speaker details as valid JSON array of objects containing "name", "role", and optional "image" (url).</p>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-event-modal')" class="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-6 py-2.5 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl transition-colors">Create Event</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Event Modal -->
<div id="edit-event-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl my-8 animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <div>
                <h3 class="font-bold text-lg">Modify Event</h3>
                <p class="text-xs text-emerald-100 mt-0.5">Edit event configurations, pricing and speakers details.</p>
            </div>
            <button onclick="toggleModal('edit-event-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        
        <form id="edit-event-form" method="POST" enctype="multipart/form-data" class="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-left">
            @csrf
            @method('PUT')
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column - General Info -->
                <div class="space-y-4">
                    <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1.5">General Information</h4>
                    
                    <div class="space-y-1">
                        <label for="edit_title" class="block text-xs font-bold text-slate-600">Event Title <span class="text-red-500">*</span></label>
                        <input type="text" name="title" id="edit_title" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="edit_category_id" class="block text-xs font-bold text-slate-600">Category <span class="text-red-500">*</span></label>
                            <select name="category_id" id="edit_category_id" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white">
                                @foreach($categories as $cat)
                                    <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label for="edit_status" class="block text-xs font-bold text-slate-600">Status <span class="text-red-500">*</span></label>
                            <select name="status" id="edit_status" required class="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label for="edit_location" class="block text-xs font-bold text-slate-600">Location / Venue <span class="text-red-500">*</span></label>
                        <input type="text" name="location" id="edit_location" required class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                    </div>

                    <div class="space-y-1">
                        <label for="edit_description" class="block text-xs font-bold text-slate-600">Description</label>
                        <textarea name="description" id="edit_description" rows="3" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold resize-none"></textarea>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-600">Current Banner Image Preview</label>
                        <img id="edit_image_preview" src="" class="h-20 w-32 object-cover rounded-lg border border-slate-200 bg-slate-50" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="edit_image" class="block text-xs font-bold text-slate-600">Update Banner Image</label>
                            <input type="file" name="image" id="edit_image" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                        </div>
                        <div class="space-y-1">
                            <label for="edit_gallery" class="block text-xs font-bold text-slate-600">Add Gallery Images</label>
                            <input type="file" name="gallery[]" id="edit_gallery" accept="image/*" multiple class="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                        </div>
                    </div>
                </div>

                <!-- Right Column - Schedules & Pricing -->
                <div class="space-y-4">
                    <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1.5">Schedule, Tickets & Rules</h4>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="edit_event_date" class="block text-xs font-bold text-slate-600">Start Date <span class="text-red-500">*</span></label>
                            <input type="date" name="event_date" id="edit_event_date" required class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1">
                            <label for="edit_event_time" class="block text-xs font-bold text-slate-600">Start Time <span class="text-red-500">*</span></label>
                            <input type="time" name="event_time" id="edit_event_time" required class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="edit_event_end_date" class="block text-xs font-bold text-slate-600">End Date</label>
                            <input type="date" name="event_end_date" id="edit_event_end_date" class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1">
                            <label for="edit_event_end_time" class="block text-xs font-bold text-slate-600">End Time</label>
                            <input type="time" name="edit_event_end_time" id="edit_event_end_time" class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="edit_registration_deadline" class="block text-xs font-bold text-slate-600">Registration Deadline</label>
                            <input type="date" name="registration_deadline" id="edit_registration_deadline" class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1">
                            <label for="edit_total_seats" class="block text-xs font-bold text-slate-600">Total Seats / Capacity <span class="text-red-500">*</span></label>
                            <input type="number" name="total_seats" id="edit_total_seats" min="1" required class="w-full px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div class="space-y-1">
                            <label for="edit_ticket_type" class="block text-xs font-bold text-slate-600">Ticket Type <span class="text-red-500">*</span></label>
                            <select name="ticket_type" id="edit_ticket_type" onchange="togglePricingFields('edit-event-modal', this.value)" class="w-full px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold bg-white">
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div class="space-y-1 price-field hidden">
                            <label for="edit_ticket_price" class="block text-xs font-bold text-slate-600">Price</label>
                            <input type="number" name="ticket_price" id="edit_ticket_price" step="0.01" min="0" class="w-full px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                        <div class="space-y-1 price-field hidden">
                            <label for="edit_currency" class="block text-xs font-bold text-slate-600">Currency</label>
                            <input type="text" name="currency" id="edit_currency" value="USD" class="w-full px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>
                    </div>

                    <div class="space-y-1.5 price-field hidden">
                        <label class="block text-xs font-bold text-slate-600">Allowed Payment Methods</label>
                        <div class="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="online" id="edit_pay_online" class="rounded text-brand-accent focus:ring-brand-accent" />
                                <span>Online Gateway</span>
                            </label>
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="card" id="edit_pay_card" class="rounded text-brand-accent focus:ring-brand-accent" />
                                <span>Credit/Debit Card</span>
                            </label>
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="mobile_banking" id="edit_pay_mb" class="rounded text-brand-accent focus:ring-brand-accent" />
                                <span>Mobile Banking</span>
                            </label>
                            <label class="flex items-center space-x-1.5 cursor-pointer">
                                <input type="checkbox" name="payment_methods[]" value="cash" id="edit_pay_cash" class="rounded text-brand-accent focus:ring-brand-accent" />
                                <span>Cash / On Spot</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Full Width Details Area -->
            <div class="space-y-4 border-t pt-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1.5">Additional Details & Metadata</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <label for="edit_tags" class="block text-xs font-bold text-slate-600">Custom Tags (Comma Separated)</label>
                            <input type="text" name="tags" id="edit_tags" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>

                        <div class="space-y-1">
                            <label for="edit_contact_details" class="block text-xs font-bold text-slate-600">Contact Details</label>
                            <input type="text" name="contact_details" id="edit_contact_details" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold" />
                        </div>

                        <div class="space-y-1">
                            <label for="edit_rules" class="block text-xs font-bold text-slate-600">Rules & Instructions (One per line)</label>
                            <textarea name="rules" id="edit_rules" rows="3" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-semibold resize-none"></textarea>
                        </div>
                    </div>

                    <div class="space-y-1 flex flex-col h-full">
                        <label for="edit_speakers" class="block text-xs font-bold text-slate-600">Speakers List (JSON Format)</label>
                        <textarea name="speakers" id="edit_speakers" class="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-xs font-mono font-medium resize-none flex-1 min-h-[140px]"></textarea>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-event-modal')" class="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-6 py-2.5 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl transition-colors">Save Changes</button>
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

    function togglePricingFields(modalId, type) {
        const modal = document.getElementById(modalId);
        const priceFields = modal.querySelectorAll('.price-field');
        priceFields.forEach(el => {
            if (type === 'paid') {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    }

    function editEvent(event) {
        const form = document.getElementById('edit-event-form');
        form.action = `/admin/events/${event.id}`;

        // Populate fields
        document.getElementById('edit_title').value = event.title || '';
        document.getElementById('edit_category_id').value = event.category_id || '';
        document.getElementById('edit_status').value = event.status || 'draft';
        document.getElementById('edit_location').value = event.location || '';
        document.getElementById('edit_description').value = event.description || '';
        
        // Image preview
        document.getElementById('edit_image_preview').src = event.image_path || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

        // Dates formatting
        if (event.event_date) {
            document.getElementById('edit_event_date').value = event.event_date.split('T')[0];
        } else {
            document.getElementById('edit_event_date').value = '';
        }
        
        document.getElementById('edit_event_time').value = event.event_time ? event.event_time.substring(0, 5) : '';

        if (event.event_end_date) {
            document.getElementById('edit_event_end_date').value = event.event_end_date.split('T')[0];
        } else {
            document.getElementById('edit_event_end_date').value = '';
        }

        document.getElementById('edit_event_end_time').value = event.event_end_time ? event.event_end_time.substring(0, 5) : '';

        if (event.registration_deadline) {
            document.getElementById('edit_registration_deadline').value = event.registration_deadline.split('T')[0];
        } else {
            document.getElementById('edit_registration_deadline').value = '';
        }

        document.getElementById('edit_total_seats').value = event.total_seats || 100;
        
        // Ticket type selection & pricing toggle
        const ticketType = event.ticket_type || 'free';
        document.getElementById('edit_ticket_type').value = ticketType;
        togglePricingFields('edit-event-modal', ticketType);
        
        document.getElementById('edit_ticket_price').value = event.ticket_price || '';
        document.getElementById('edit_currency').value = event.currency || 'USD';

        // Checkboxes for payment methods
        const payMethods = event.payment_methods || [];
        document.getElementById('edit_pay_online').checked = payMethods.includes('online');
        document.getElementById('edit_pay_card').checked = payMethods.includes('card');
        document.getElementById('edit_pay_mb').checked = payMethods.includes('mobile_banking');
        document.getElementById('edit_pay_cash').checked = payMethods.includes('cash');

        // Tags
        if (Array.isArray(event.tags)) {
            document.getElementById('edit_tags').value = event.tags.join(', ');
        } else {
            document.getElementById('edit_tags').value = event.tags || '';
        }

        // Contact info
        document.getElementById('edit_contact_details').value = event.contact_details || '';

        // Rules
        if (Array.isArray(event.rules)) {
            document.getElementById('edit_rules').value = event.rules.join('\n');
        } else {
            document.getElementById('edit_rules').value = event.rules || '';
        }

        // Speakers
        if (event.speakers) {
            document.getElementById('edit_speakers').value = JSON.stringify(event.speakers, null, 2);
        } else {
            document.getElementById('edit_speakers').value = '[]';
        }

        toggleModal('edit-event-modal');
    }
</script>
@endsection
