<script setup>
const socials = [
    { icon: 'mdi-instagram', link: 'https://www.instagram.com/swphofficial?utm_source=qr&igsh=MWQwdzVsd3drZm5wZQ==' },
    { icon: 'mdi-facebook', link: 'https://www.facebook.com/swphofficial?mibextid=ZbWKwL' },
    { icon: 'mdi-linkedin', link: 'https://www.linkedin.com/company/93656967/admin/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3B8v%2FYCZmsTDOfEk1v387o%2Bg%3D%3D' },
    { icon: 'mdi-twitter', link: 'https://x.com/swphofficial?t=ilOp8jMfAXcMkxh3DExhKw&s=08' },
];
const yr = new Date().getFullYear();
</script>
<template>
    <div class="mt-10">
        <footer class="w-100">
            <div class="px-4">
                <div class="text-center">
                    <v-row class="pa-10 justify-center">
                        <v-col cols="auto" v-for="social in socials" :key="social.icon">
                            <NuxtLink :href="social.link"><v-icon>{{ social.icon }}</v-icon></NuxtLink>
                        </v-col>
                    </v-row>
                </div>
                <div class="d-flex align-end">
                    <v-row class="pa-1">
                        <v-col cols="auto" lg="10" sm="6" md="6">
                            <p class="">
                                Powered by <NuxtLink href="https://scribbleworks.carrd.co/"> <strong>Scribble Works
                                        Publishing House</strong></NuxtLink>
                            </p>
                        </v-col>
                        <v-col cols="auto" lg="2" sm="6" md="6">
                            <img class="" src="/img/logo.png" style="height: 3.5em;" alt="SWPH">
                        </v-col>
                    </v-row>
                </div>

                <v-spacer></v-spacer>




                <v-divider></v-divider>
                <div class="w-100 px-4 py-2 text-center">
                    <p>{{ yr }} - <strong>AssignmentX</strong></p>
                </div>
            </div>
        </footer>
    </div>
</template>