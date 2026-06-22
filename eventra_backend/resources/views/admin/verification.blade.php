@extends('admin.layout')

@section('content')
<div class="space-y-8 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Certificate Verification settings</h1>
            <p class="text-sm text-slate-500 mt-1 font-medium">Add, edit, or delete FAQ items displayed on the Certificate Verification subpage.</p>
        </div>
        <button onclick="toggleModal('add-faq-modal')" class="bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors self-start flex items-center space-x-2">
            <i data-lucide="plus" class="h-4 w-4"></i>
            <span>Add FAQ Item</span>
        </button>
    </div>

    <!-- FAQ Items List -->
    <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 flex items-center space-x-2">
                <i data-lucide="help-circle" class="h-5 w-5 text-brand-accent"></i>
                <span>Verification FAQ List</span>
            </h3>
            <span class="text-xs bg-emerald-50 text-brand-accent px-3 py-1 rounded-full font-bold">{{ count($faq) }} Items</span>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th class="px-6 py-3.5 w-16">#</th>
                        <th class="px-6 py-3.5">Question</th>
                        <th class="px-6 py-3.5 w-1/2">Answer</th>
                        <th class="px-6 py-3.5 text-right w-32">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    @forelse($faq as $index => $item)
                        <tr class="hover:bg-slate-50/40 transition-colors">
                            <td class="px-6 py-4 text-slate-400 font-bold">{{ $index + 1 }}</td>
                            <td class="px-6 py-4 font-bold text-slate-900 text-sm">{{ $item['question'] ?? '' }}</td>
                            <td class="px-6 py-4 text-slate-500 font-medium line-clamp-2 mt-2.5">{{ $item['answer'] ?? '' }}</td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button onclick="editFaq({{ $index }}, {{ json_encode($item) }})" class="text-slate-400 hover:text-brand-accent transition-colors">
                                    <i data-lucide="pencil" class="h-4.5 w-4.5"></i>
                                </button>
                                <form action="{{ route('admin.verification.delete', ['faq', $index]) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this FAQ item?');">
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
                            <td colspan="4" class="px-6 py-12 text-center text-slate-400 font-medium">No FAQ items found. Add some to get started!</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add FAQ Modal -->
<div id="add-faq-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Verification FAQ</h3>
            <button onclick="toggleModal('add-faq-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form action="{{ route('admin.verification.add', 'faq') }}" method="POST" class="p-6 space-y-4">
            @csrf
            <!-- Question -->
            <div class="space-y-1">
                <label for="question" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Question</label>
                <input type="text" name="question" id="question" required placeholder="e.g. How do I get my certificate?" class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Answer -->
            <div class="space-y-1">
                <label for="answer" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Answer</label>
                <textarea name="answer" id="answer" rows="4" required placeholder="Provide the detail answer..." class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('add-faq-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Create Item</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit FAQ Modal -->
<div id="edit-faq-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-[slideDown_0.2s_ease-out]">
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-6 text-white flex items-center justify-between">
            <h3 class="font-bold text-lg">Edit Verification FAQ</h3>
            <button onclick="toggleModal('edit-faq-modal')" class="text-emerald-200 hover:text-white"><i data-lucide="x" class="h-5 w-5"></i></button>
        </div>
        <form id="edit-faq-form" method="POST" class="p-6 space-y-4">
            @csrf
            @method('PUT')
            <!-- Question -->
            <div class="space-y-1">
                <label for="edit_question" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Question</label>
                <input type="text" name="question" id="edit_question" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold" />
            </div>
            <!-- Answer -->
            <div class="space-y-1">
                <label for="edit_answer" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Answer</label>
                <textarea name="answer" id="edit_answer" rows="4" required class="w-full px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-brand-accent rounded-xl text-sm font-semibold"></textarea>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" onclick="toggleModal('edit-faq-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-sidebar rounded-xl">Save Changes</button>
            </div>
        </form>
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

    function editFaq(index, item) {
        const form = document.getElementById('edit-faq-form');
        form.action = `/admin/verification/faq/${index}`;

        document.getElementById('edit_question').value = item.question;
        document.getElementById('edit_answer').value = item.answer;

        toggleModal('edit-faq-modal');
    }
</script>
@endsection
