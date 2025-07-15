<script setup>
const yr = new Date().getFullYear();

const icons = [{ icon: 'mdi-facebook', src: '' }, { icon: 'mdi-github', src: '' }, { icon: 'mdi-twitter', src: '' }, { icon: 'mdi-instagram', src: '' }, { icon: 'mdi-linkedin', src: '' }];
const links = [{ name: 'Privacy Policy', href: '/privacy-policy' }, { name: 'Terms of Service', href: '/terms-of-service' }, { name: 'Sales and Refunds', href: '/terms-of-service' }, { name: 'Legal', href: '/terms-of-service' }, { name: 'Site Map', href: '/contact-us' }];
</script>
<template>
    <div class="mt-0">
        <footer class="bg-gray-800 text-white py-6">
            <v-row>
                <v-col cols="" lg="4" md="4" sm="6" class="text-center">
                    <div class="flex mr-10">
                        <v-img class="ml-100" src="/img/logo.png" height="90" alt="SWPH"></v-img>
                        <div class="text-h4 mt-5">AssignmentX</div>

                    </div>
                </v-col>
                <v-spacer></v-spacer>
                
                    <v-col v-for="icon in icons" :key="icon.icon" col="1">
                        <NuxtLink :href="icon.src"><v-icon>{{ icon.icon }}</v-icon></NuxtLink>
                    </v-col>
                

            </v-row><br>
            <v-divider class="mx-auto" :thickness="3" color="white" style="width: 70%;"></v-divider><br>
            <div class="d-flex flex-column align-center">
                <v-row>
                    <v-col v-for="link in links" :key="link.name" cols="2" class="text-center">
                        <NuxtLink :href="link.href" class="text-white">{{ link.name }}</NuxtLink>
                    </v-col>
                </v-row><br>
                <p class="text-muted">&copy; {{ yr }} AssignmentX. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>