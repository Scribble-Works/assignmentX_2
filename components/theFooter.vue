<script setup>
const yr = new Date().getFullYear();

const icons = [{icon:'mdi-facebook', src:''}, {icon:'mdi-github', src:''}, {icon:'mdi-twitter', src:''}, {icon:'mdi-instagram', src:''},  {icon:'mdi-linkedin', src:''}];
const links = [{name: 'Privacy Policy', href: '/privacy-policy'}, {name: 'Terms of Service', href: '/terms-of-service'}, {name: 'Sales and Refunds', href: '/terms-of-service'}, {name: 'Legal', href: '/terms-of-service'}, {name: 'Site Map', href: '/contact-us'}];
</script>
<template>
    <div>
        <footer class="bg-gray-800 text-white py-6">
            <v-row>
                <v-col cols="auto" lg="4" md="4" sm="6" class="text-center">
                    <div class="d-flex flex-row mb-6">
                        <!-- <div class=""> -->
                            <v-img class="justify-center" src="/img/logo.png" height="80"></v-img>
                            <h1 class="text-h2" style="font-size: x-large; font-weight: bold;">AssignmentX</h1>
                        <!-- </div> -->
                    </div>
                </v-col>
                <v-spacer></v-spacer>
                <v-col v-for="icon in icons" :key="icon.icon" col="auto" lg="1" md="3" sm="2">
                    <NuxtLink :href="icon.src"><v-icon>{{ icon.icon }}</v-icon></NuxtLink>
                </v-col>
            </v-row>
            <v-divider class="mx-auto" :thickness="3" color="white" width="1000"></v-divider><br>
            <div class="d-flex flex-column align-center">
                <v-row>
                    <v-col v-for="link in links" :key="link.name" cols="auto" class="text-center">
                        <NuxtLink :href="link.href" class="text-white">{{ link.name }}</NuxtLink>
                    </v-col>
                </v-row><br>
                <p class="text-muted">&copy; {{ yr }} AssignmentX. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>