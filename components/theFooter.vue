<script setup>
const yr = new Date().getFullYear();

const icons = [
  { icon: "mdi-facebook", src: "https://web.facebook.com/swphofficial?rdid=bhotJshXOa9DCrHI#" },
  // { icon: "mdi:tiktok", src: "" },
  { icon: "mdi-twitter", src: "https://x.com/swphofficial?t=gfZyVNORKVdhpCzMkF8M6g&s=08" },
  { icon: "mdi-instagram", src: "https://www.instagram.com/swphofficial?utm_source=qr&igsh=MWQwdzVsd3drZm5wZQ==" },
  { icon: "mdi-linkedin", src: "https://www.linkedin.com/company/93656967" },
];
const links = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/termsofservice" },
  { name: "Sales and Refunds", href: "/salesandrefunds" },
  { name: "Legal", href: "/legal" },
  { name: "Site Map", href: "/sitemap" },
];
</script>
<template>
  <div>
    <footer class="bg-gray-800 text-white py-6 px-[10%]">
      <div class="flex flex-col sm:flex-row w-full justify-between items-center w-[80%] m-auto gap-4 pb-4">
        <div class="flex items-center">
          <img class="logo" src="/img/logo.png" height="" alt="SWPH" />
          <div class="text-xl mt-5">AssignmentX</div>
        </div>

        <div class="flex gap-2 sm:gap-4 rounded">
          <div v-for="icon in icons" :key="icon.icon">
            <NuxtLink :href="icon.src" target="_blank">
              <v-icon class="text-lg sm:text-xl">{{ icon.icon }}</v-icon>
            </NuxtLink>
          </div>
        </div>
      </div>
      <v-divider
        class="mx-auto"
        :thickness="2"
        color="white"
        style="width: 100%"
      >
      </v-divider>

      <div class="flex flex-col items-center">
        <!-- Links -->
        <div class="flex flex-wrap justify-center gap-6 mb-4">
          <NuxtLink
            v-for="link in links"
            :key="link.name"
            :href="link.href"
            class="whitespace-nowrap text-sm my-8"
          >
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- Copyright -->
        <p class="text-muted text-center text-sm">
          &copy; {{ yr }} AssignmentX. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.logo {
  width: 4em;
}
</style>
