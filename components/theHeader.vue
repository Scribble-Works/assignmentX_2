<template>
    <div>
        <header class="bg-white shadow">
            <nav class="container mx-auto flex items-center justify-between p-4">
                <NuxtLink class="flex items-center font-bold text-xl" to="/">
                    <img src="/img/Scribble monogram_color.png" alt="Logo" class="w-12 mr-2">
                    AssignmentX
                </NuxtLink>
                <div class="hidden md:flex space-x-4">
                    <NuxtLink class="hover:text-blue-500" to="/">Home</NuxtLink>
                    <NuxtLink class="hover:text-blue-500" to="/about">About Us</NuxtLink>
                    <NuxtLink class="btn btn-outline-primary ml-3 px-4 bg-blue-500 text-white rounded" to="login">Login
                        / Sign Up</NuxtLink>
                </div>
                <button class="md:hidden text-gray-500 focus:outline-none" id="navbar-toggler">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </nav>
            <div class="md:hidden" id="navbar-menu">
                <NuxtLink class="block px-4 py-2 hover:bg-gray-200" to="/">Home</NuxtLink>
                <NuxtLink class="block px-4 py-2 hover:bg-gray-200" to="/about">About Us</NuxtLink>
                <NuxtLink class="block px-4 py-2 bg-blue-500 text-white rounded" to="login.html">Login / Sign Up</NuxtLink>
            </div>
        </header>
    </div>
</template>