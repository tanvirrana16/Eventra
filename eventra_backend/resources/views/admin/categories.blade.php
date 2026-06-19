@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Event Categories</h1>
            <p class="text-sm text-slate-500 mt-1 font-medium">Add, modify, or delete categories used to organize platform events.</p>
        </div>
        <button onclick="toggleModal('add-category-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors self-start">
            + New Category
        </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
            <h3 class="font-bold text-slate-800">Available Categories</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th class="px-6 py-3.5">Category Name</th>
                        <th class="px-6 py-3.5">Slug</th>
                        <th class="px-6 py-3.5">Icon Name</th>
                        <th class="px-6 py-3.5">Linked Events</th>
                        <th class="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    @forelse($categories as $cat)
                        <tr>
                            <td class="px-6 py-4 flex items-center space-x-3.5">
                                <div class="p-2 bg-slate-100 text-slate-500 rounded-lg">
                                    <i data-lucide="{{ $cat->icon_name ?? 'grid' }}" class="h-4.5 w-4.5"></i>
                                </div>
                                <span class="text-sm font-bold text-slate-800">{{ $cat->name }}</span>
                            </td>
                            <td class="px-6 py-4 text-slate-500">{{ $cat->slug }}</td>
                            <td class="px-6 py-4">
                                <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{{ $cat->icon_name }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-bold text-slate-800">{{ $cat->events_count }}</span> published events
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button onclick="editCategory({{ json_encode($cat) }})" class="text-slate-500 hover:text-brand-accent transition-colors">
                                    <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                </button>
                                <form action="{{ route('admin.categories.destroy', $cat) }}" method="POST" class="inline" onsubmit="return confirm('Delete this category and all its events?');">
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
                            <td colspan="5" class="px-6 py-8 text-center text-slate-400 font-medium">No categories seeded.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add Category Modal -->
<div id="add-category-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Create Event Category</h3>
            <button onclick="toggleModal('add-category-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.categories.store') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <!-- Name -->
            <div class="space-y-1">
                <label for="name" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Category Name</label>
                <input type="text" name="name" id="name" required placeholder="e.g. Hackathons" class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Icon Name -->
            <div class="space-y-1">
                <label for="icon_name" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon Reference</label>
                <input type="text" name="icon_name" id="icon_name" required placeholder="e.g. Laptop, Music, Trophy" class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
                <p class="text-[10px] text-slate-400 mt-1 font-medium">Input a valid icon from Lucide (Laptop, Activity, Music, Award, etc.)</p>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-category-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Category</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Category Modal -->
<div id="edit-category-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Modify Event Category</h3>
            <button onclick="toggleModal('edit-category-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-category-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <!-- Name -->
            <div class="space-y-1">
                <label for="edit_name" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Category Name</label>
                <input type="text" name="name" id="edit_name" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Icon Name -->
            <div class="space-y-1">
                <label for="edit_icon_name" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Lucide Icon Reference</label>
                <input type="text" name="icon_name" id="edit_icon_name" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-category-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
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

    function editCategory(cat) {
        const form = document.getElementById('edit-category-form');
        form.action = `/admin/categories/${cat.id}`;

        document.getElementById('edit_name').value = cat.name;
        document.getElementById('edit_icon_name').value = cat.icon_name || 'grid';

        toggleModal('edit-category-modal');
    }
</script>
@endsection
