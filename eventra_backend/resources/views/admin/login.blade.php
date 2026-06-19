<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eventra Admin Login</title>
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
                        }
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-slate-100 font-outfit min-h-screen flex items-center justify-center p-4">

    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/50">
        <!-- Brand Header Banner -->
        <div class="bg-gradient-to-br from-brand-sidebar to-brand-accent p-8 text-center text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            <h1 class="text-3xl font-black tracking-widest uppercase">EVENTRA</h1>
            <p class="text-xs text-emerald-200 mt-1 font-semibold tracking-wider">ADMINISTRATOR CONTROL PANEL</p>
        </div>

        <!-- Form content -->
        <div class="p-8 space-y-6">
            <div class="text-center">
                <h2 class="text-xl font-bold text-slate-800">Welcome Back</h2>
                <p class="text-xs text-slate-500 mt-1 font-medium">Please enter your credentials to access the admin panel.</p>
            </div>

            @if ($errors->any())
                <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1 font-semibold">
                    @foreach ($errors->all() as $error)
                        <div class="flex items-center space-x-2">
                            <i data-lucide="alert-circle" class="h-4 w-4 text-rose-600 shrink-0"></i>
                            <span>{{ $error }}</span>
                        </div>
                    @endforeach
                </div>
            @endif

            <form action="{{ route('admin.login.submit') }}" method="POST" class="space-y-4">
                @csrf

                <!-- Email Input -->
                <div class="space-y-1 text-left">
                    <label for="email" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Email Address</label>
                    <div class="relative">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="admin@eventra.com"
                            value="{{ old('email') }}"
                            required
                            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                        />
                        <i data-lucide="mail" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"></i>
                    </div>
                </div>

                <!-- Password Input -->
                <div class="space-y-1 text-left">
                    <label for="password" class="block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
                    <div class="relative">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            required
                            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent rounded-xl text-sm font-semibold transition-all"
                        />
                        <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"></i>
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="w-full bg-brand-accent hover:bg-brand-sidebar text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-300 hover:shadow-lg active:translate-y-0 transform hover:-translate-y-0.5"
                >
                    Sign In to Dashboard
                </button>
            </form>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
