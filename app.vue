<script setup>
import { Analytics } from '@vercel/analytics/nuxt'
</script>
<template>
  <div>
    <title>AssignmentX</title>
    <Analytics/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
body{
  background-color: #F6F6F6;
}
</style>
