<script setup>
const yr = new Date().getFullYear();
</script>
<template>
    <div>
        <footer class="bg-gray-800 text-white py-6">
            <div class="container mx-auto text-center">
                <div class="mb-4">
                    <a href="https://www.facebook.com/swphofficial?mibextid=ZbWKwL" class="mx-2"><i
                            class="fab fa-facebook"></i></a>
                    <a href="https://x.com/swphofficial?t=lqDdlhdLVqY9UYis9LlDIw&s=08" class="mx-2"><i
                            class="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com/swphofficial?igsh=Z2h1YTF6cng1ZTIz" class="mx-2"><i
                            class="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/company/swphofficial/" class="mx-2"><i
                            class="fab fa-linkedin"></i></a>
                </div>
                <p>&copy; {{ yr }} SWPH. All rights reserved.</p>
                <p class="">
                    Powered by <NuxtLink href="https://scribbleworks.carrd.co/"> <strong>Scribble Works
                            Publishing House</strong></NuxtLink>
                </p>
            </div>
        </footer>
    </div>
</template>