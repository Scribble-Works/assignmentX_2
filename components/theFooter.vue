<script setup>
const yr = new Date().getFullYear();

const icons = [
  { icon: "mdi-facebook", src: "" },
  { icon: "mdi-github", src: "" },
  { icon: "mdi-twitter", src: "" },
  { icon: "mdi-instagram", src: "" },
  { icon: "mdi-linkedin", src: "" },
];
const links = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/termsofservice" },
  { name: "Sales and Refunds", href: "/salesandrefunds" },
  { name: "Legal", href: "/legal" },
  { name: "Site Map", href: "/contact-us" },
];
</script>
<template>
  <div class="mt-0">
    <footer class="bg-gray-800 text-white py-6">
      <div class="flex w-full justify-between items-center w-[80%] m-auto">
        <!-- <div class="flex"> -->
        <div class="flex">
          <img class="logo" src="/img/logo.png" height="" alt="SWPH" />
          <div class="text-xl mt-5">AssignmentX</div>
        </div>
        <!-- </div> -->

        <div class="flex gap-4 rounded">
          <div v-for="icon in icons" :key="icon.icon">
            <NuxtLink :to="icon.src" target="_blank">
              <v-icon>{{ icon.icon }}</v-icon>
            </NuxtLink>
          </div>
        </div>
      </div>
      <v-divider
        class="mx-auto"
        :thickness="2"
        color="white"
        style="width: 80%"
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
