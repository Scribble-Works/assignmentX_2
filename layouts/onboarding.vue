<template>
  <!-- <div>
    <slot />
  </div> -->
  <v-container>
    <header class="">
      <div class="flex items-center">
        <div class="flex items-center space-x-2">
          <img src="../public/img/logo.png" alt="AssignmentX Logo" class="logo" />
          <span class="text-xl font-semibold text-gray-800">AssignmentX</span>
        </div>
      </div>
    </header>
    
    <slot />
  </v-container>
</template>

<style scoped>
.logo {
  width: 4em;
}
</style>