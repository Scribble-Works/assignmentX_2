<template>
  <div
    class="flex border-b p-5 my-2 sm:flex-row flex-col mb-10 sm:text-left justify-between items-center"
  >
    <div class="flex gap-8 py-4">
      <div class="flex-col items-center justify-center">
        <p class="text-sm font-medium mb-1">{{ dayName }}</p>
        <p class="text-5xl font-bold mb-1 md:text-4xl">
          {{ dateNumber }}
        </p>
        <p class="text-sm font-semibold tracking-wide">
          {{ month }}
        </p>
      </div>

      <div class="flex-1 flex flex-col justify-between">
        <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
        <div class="flex text-sm text-gray-600 mb-1 sm:justify-start">
          <img src="/img/clock.png" alt="Clock" class="w-4 h-4 mr-2" />
          {{ time }}
        </div>
        <div class="text-sm text-gray-600 sm:text-left">
          Hosted by {{ host }}
        </div>
      </div>
    </div>

    <div class="flex gap-3 items-center sm:flex-row">
      <div>
        <v-btn
          to="/workbook/"
          size="large"
          class="text-white rounded-sm text-subtitle-1"
          style="background-color: #2563eb"
        >
          Register
        </v-btn>
      </div>
      <div>
        <NuxtLink class="hover:text-blue-500 py-2" to="/"
          >+ Add to calendar</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalendarEventBlock",
  props: {
    dayName: {
      type: String,
      default: "Wed",
    },
    dateNumber: {
      type: String,
      default: "30",
    },
    month: {
      type: String,
      default: "JUL",
    },
    title: {
      type: String,
      default: "Number and Numeration Systems",
    },
    time: {
      type: String,
      default: "3:00PM - 4:00PM",
    },
    host: {
      type: String,
      default: "Miss Lomo",
    },
  },
};
</script>

<style scoped>
/* Any custom styles if needed */
</style>
