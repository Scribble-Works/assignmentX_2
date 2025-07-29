<script setup>
import EventCard from "~/components/eventCard.vue";
definePageMeta({
  layout: "resources",
});
const events = [
  {
    id: 1,
    dayName: "Wed",
    dateNumber: "30",
    month: "JUL",
    title: "Number and Numeration Systems",
    time: "3:00PM - 4:00PM",
    host: "Miss Lomo",
  },
  {
    id: 2,
    dayName: "Sat",
    dateNumber: "06",
    month: "SEPT",
    title: "Number Operations",
    time: "3:00PM - 4:00PM",
    host: "Miss Lomo",
  },
  {
    id: 3,
    dayName: "Tue",
    dateNumber: "20",
    month: "OCT",
    title: "Fractions, Decimals and Percentages",
    time: "3:00PM - 4:00PM",
    host: "Miss Lomo",
  },
  {
    id: 4,
    dayName: "Sun",
    dateNumber: "02",
    month: "NOV",
    title: "Algebra Fundamentals",
    time: "2:00PM - 3:30PM",
    host: "Dr. Smith",
  },
  {
    id: 5,
    dayName: "Thu",
    dateNumber: "18",
    month: "DEC",
    title: "Geometry and Shapes",
    time: "4:00PM - 5:00PM",
    host: "Prof. Johnson",
  },
  {
    id: 6,
    dayName: "Mon",
    dateNumber: "15",
    month: "JAN",
    title: "Statistics and Probability",
    time: "1:00PM - 2:30PM",
    host: "Ms. Davis",
  },
  {
    id: 7,
    dayName: "Fri",
    dateNumber: "08",
    month: "FEB",
    title: "Calculus Introduction",
    time: "10:00AM - 11:30AM",
    host: "Dr. Wilson",
  },
  {
    id: 8,
    dayName: "Wed",
    dateNumber: "25",
    month: "MAR",
    title: "Physics: Motion and Forces",
    time: "3:00PM - 4:30PM",
    host: "Prof. Brown",
  },
];
</script>

<template>
  <div class="bg-grey-100">
    <h2 class="text-2xl font-bold text-capitalize my-8">Join a live session</h2>
  </div>


  <EventCard
    v-for="(event, index) in events"
    :key="index"
    :dayName="event.dayName"
    :dateNumber="event.dateNumber"
    :month="event.month"
    :title="event.title"
    :time="event.time"
    :host="event.host"
  />
</template>

<style>
.product {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
