<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eventra Admin Dashboard</title>
    <!-- Google Fonts Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        outfit: ['Outfit', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            sidebar: '#0C3B2E',
                            accent: '#2E6F40',
                            accentHover: '#1F4D2B',
                            light: '#CFFFDC',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .font-outfit { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 font-outfit text-slate-800 min-h-screen flex flex-col md:flex-row">

    <!-- Sidebar -->
    <aside id="sidebar" class="w-full md:w-64 bg-brand-sidebar text-white flex flex-col justify-between shrink-0 transition-all duration-300 md:min-h-screen relative z-30">
        <!-- Sidebar Header -->
        <div class="p-6 border-b border-emerald-800/40 flex items-center justify-between">
            <a href="{{ route('admin.dashboard') }}" class="flex items-center space-x-3">
                <span class="text-xl font-black tracking-widest text-white">EVENTRA ADMIN</span>
            </a>
            <button onclick="toggleSidebar()" class="md:hidden text-emerald-300 hover:text-white focus:outline-none">
                <i data-lucide="menu" class="h-6 w-6"></i>
            </button>
        </div>

        <!-- Sidebar Navigation Menu -->
        <nav id="nav-menu" class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto hidden md:block">
            <!-- Dashboard Overview -->
            <a href="{{ route('admin.dashboard') }}" class="flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('admin.dashboard') ? 'bg-brand-accent text-white shadow-md shadow-emerald-900/40' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white' }}">
                <i data-lucide="layout-dashboard" class="h-5 w-5"></i>
                <span>Overview</span>
            </a>

            <!-- Homepage Hero -->
            <a href="{{ route('admin.hero') }}" class="flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('admin.hero') ? 'bg-brand-accent text-white shadow-md shadow-emerald-900/40' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white' }}">
                <i data-lucide="image" class="h-5 w-5"></i>
                <span>Hero Settings</span>
            </a>

            <!-- Reusable Page Banners -->
            <a href="{{ route('admin.pages') }}" class="flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('admin.pages') ? 'bg-brand-accent text-white shadow-md shadow-emerald-900/40' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white' }}">
                <i data-lucide="notebook" class="h-5 w-5"></i>
                <span>Page Heroes</span>
            </a>

            <!-- Category Management -->
            <a href="{{ route('admin.categories') }}" class="flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('admin.categories') ? 'bg-brand-accent text-white shadow-md shadow-emerald-900/40' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white' }}">
                <i data-lucide="grid-3x3" class="h-5 w-5"></i>
                <span>Categories</span>
            </a>

            <!-- Event Management -->
            <a href="{{ route('admin.events') }}" class="flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('admin.events') ? 'bg-brand-accent text-white shadow-md shadow-emerald-900/40' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white' }}">
                <i data-lucide="calendar" class="h-5 w-5"></i>
                <span>Events</span>
            </a>

            <!-- Organizers Verification -->
            <a href="{{ route('admin.organizers') }}" class="flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('admin.organizers') ? 'bg-brand-accent text-white shadow-md shadow-emerald-900/40' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white' }}">
                <i data-lucide="shield-check" class="h-5 w-5"></i>
                <span>Organizers</span>
                @php
                    $pendingCount = \App\Models\User::where('role', 'organizer')->where('status', 'pending')->count();
                @endphp
                @if($pendingCount > 0)
                    <span class="ml-auto bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">{{ $pendingCount }}</span>
                @endif
            </a>

            <!-- Footer Details -->
            <a href="{{ route('admin.footer') }}" class="flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('admin.footer') ? 'bg-brand-accent text-white shadow-md shadow-emerald-900/40' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white' }}">
                <i data-lucide="menu-square" class="h-5 w-5"></i>
                <span>Footer Settings</span>
            </a>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-6 border-t border-emerald-800/40 hidden md:block">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold uppercase">
                        {{ substr(Auth::user()->name ?? 'A', 0, 1) }}
                    </div>
                    <div>
                        <p class="text-xs font-bold text-white truncate max-w-[120px]">{{ Auth::user()->name ?? 'Admin User' }}</p>
                        <p class="text-[10px] text-emerald-300/80">Administrator</p>
                    </div>
                </div>
                <form action="{{ route('admin.logout') }}" method="POST" class="inline">
                    @csrf
                    <button type="submit" class="text-emerald-300 hover:text-rose-400 transition-colors duration-200">
                        <i data-lucide="log-out" class="h-5 w-5"></i>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 flex flex-col min-h-screen">
        <!-- Top navbar for tablet and mobile -->
        <header class="bg-white border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-6 md:hidden relative z-20">
            <span class="text-lg font-black tracking-widest text-brand-sidebar">EVENTRA</span>
            <div class="flex items-center space-x-4">
                <button onclick="toggleSidebar()" class="text-slate-600 hover:text-slate-900 focus:outline-none">
                    <i data-lucide="align-justify" class="h-6 w-6"></i>
                </button>
            </div>
        </header>

        <!-- Dynamic Content Body -->
        <div class="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
            @if(session('success'))
                <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-sm animate-pulse">
                    <i data-lucide="check-circle-2" class="h-5 w-5 text-emerald-600 shrink-0"></i>
                    <span class="font-semibold">{{ session('success') }}</span>
                </div>
            @endif

            @if(session('error'))
                <div class="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center space-x-3 text-sm">
                    <i data-lucide="alert-circle" class="h-5 w-5 text-rose-600 shrink-0"></i>
                    <span class="font-semibold">{{ session('error') }}</span>
                </div>
            @endif

            @yield('content')
        </div>
    </main>

    <script>
        // Toggle Sidebar visibility on mobile screens
        function toggleSidebar() {
            const navMenu = document.getElementById('nav-menu');
            const sidebar = document.getElementById('sidebar');
            navMenu.classList.toggle('hidden');
        }

        // Initialize Lucide Icons
        lucide.createIcons();
    </script>
</body>
</html>
