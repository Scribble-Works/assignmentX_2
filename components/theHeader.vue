<script setup>
const user = useSupabaseUser();
const router = useRouter();
const toggle = ref(false);
import { useMediaQuery } from '@vueuse/core';
const mobile = useMediaQuery('(max-width: 600px)');
const tablet = useMediaQuery('(min-width: 601px) and (max-width: 1024px)');

router.beforeEach((to, from, next) => {
    if (from.name && to.name !== from.name) {
        // This is equivalent to beforeRouteLeave
        if (toggle.value) {
            toggle.value = false;
        }
    }
    next();
});

</script>
<template>
    <div>
        <header class="bg-white shadow">
            <nav class="container mx-auto flex items-center justify-between p-4">
                <NuxtLink class="flex items-center font-bold text-xl" to="/">
                    <img src="/img/logo.png" alt="Logo" class="w-12 ml-n2 mt-n5 mr-2">
                    <p class="mt-n5" v-if="!tablet && !mobile && !user">AssignmentX</p>
                </NuxtLink>
                <div v-if="!tablet && mobile">
                    <div class="mt-0 ml-16" v-if="!user">
                        <v-btn color="blue" class=" text-white py-2 px-4 rounded ml-16" to="/auth">Login</v-btn>
                    </div>
                    <div class="mt-0" v-else>
                        <avartar />
                    </div><br>
                </div>
                <div class="hidden md:flex space-x-4">
                    <NuxtLink class="hover:text-blue-500 py-2" to="/">Home</NuxtLink>
                    <NuxtLink class="hover:text-blue-500 py-2" to="/about">About</NuxtLink>
                    <NuxtLink class="hover:text-blue-500 py-2" to="/resources">Facilitator Resources</NuxtLink>
                    <div v-if="!user">
                        <v-btn color="blue" class=" text-white py-2 px-4 rounded" to="/auth">Login</v-btn>
                    </div>
                    <div v-else>
                        <avartar />
                    </div>

                </div>
                <button @click.stop="toggle = !toggle" class="md:hidden text-gray-500 focus:outline-none mt-n5"
                    id="navbar-toggler">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </nav>
            <div v-if="toggle" class="md:hidden overflow-hidden transition-all duration-500 ease-in-out"
                :class="toggle ? 'max-h-40' : 'max-h-0'" id="navbar-menu">
                <NuxtLink class="block px-4 py-2 hover:bg-gray-200" to="/">Home</NuxtLink>
                <NuxtLink class="block px-4 py-2 hover:bg-gray-200" to="/about">About
                </NuxtLink>
                <NuxtLink class="hover:text-blue-500 py-2 block px-4" to="/resources">Facilitator Resources</NuxtLink>
                <!-- <div class="mt-n1" v-if="!user">
                    <v-btn color="blue" class=" text-white py-2 px-4 rounded" to="/auth">Login</v-btn>
                </div>
                <div class="mt-n1" v-else>
                    <avartar />
                </div><br> -->
            </div>
        </header>
    </div>
</template>