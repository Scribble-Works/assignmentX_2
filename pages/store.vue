<script setup>
import ProductCard from "~/components/productCard.vue";
import AppButton from "~/components/button.vue";

const products = [
  {
    title: "The First Assignment",
    level: "JHS 1",
    description:
      "The First Assignment JHS 1 Maths Workbook is a trusted tool for mastering mathematics at the junior high level. Developed in alignment with the NaCCA Common Core Programme, this workbook offers structured exercises, dedicated correction spaces, and a built-in graph sheet. It focuses on effective learning through well-defined learning standards and formative assessments, making complex topics simple and accessible.",
    price: "80",
    image: "/img/jhs1BookSpine.png",
    reverse: false,
  },
  {
    title: "The Second Assignment",
    level: "JHS 2",
    description:
      "The Second Assignment JHS 2 Maths Workbook continues to build on the foundation from JHS 1, with a focus on preparing students for higher-level concepts. This book provides a wealth of practice exercises and a clear, step-by-step approach to help learners deepen their understanding of key mathematical principles.",
    price: "80",
    image: "/img/jhs2BookSpine.png",
    reverse: true,
  },
  {
    title: "The Last Assignment",
    level: "JHS 3",
    description:
      "The Last Assignment JHS 3 Maths Workbook is the final step in the series, designed to prepare students for the BECE exams. It offers a comprehensive review of all topics, challenging practice tests, and detailed solutions to strengthen problem-solving skills and ensure students are fully prepared for success.",
    price: "80",
    image: "/img/jhs3BookSpine.png",
    reverse: false,
  },
];
const checkout = ref(null);

const scrollToCheckout = () => {
  if (checkout.value) {
    checkout.value.scrollIntoView({ behavior: "smooth" });
  }
};


</script>

<template>
  <div class="font-sans mb-15">
    <!-- Hero Section -->
    <section class="text-center py-16 bg-white">
      <h1 class="text-4xl md:text-6xl font-bold">Study Smarter!</h1>
      <p class="mt-4 text-gray-600 mx-auto">
        Stay ahead in class with your official companion books, specially
        designed for JHS1, JHS2, and JHS3 students.
      </p>
      <!-- <button
        class="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buy now
      </button> -->
      <AppButton @click="scrollToCheckout" text="Buy now" color="blue" class="mt-6" />
    </section>

    <!-- Banner Image -->
    <section>
      <img src="/img/pricing_hero.jpg" alt="Banner" class="w-full object-cover h-64 md:h-[600px]" />
    </section>

    <!-- Intro Text -->
    <section ref="checkout" class="text-center py-12 px-4">
      <h2 class="text-xl md:text-2xl font-semibold">Get Your Workbooks Now!</h2>
      <p class="hidden md:block text-gray-600 mt-4 max-w-3xl mx-auto">
        Stay ahead in class with your official companion books, specially
        designed for JHS1, JHS2, and JHS3 students. Whether you're reviewing a
        topic, preparing for exams, or just want extra practice, these books are
        your go-to guides.
      </p>
    </section>

    <!-- Product Cards -->
    <section class="container mx-auto space-y-32 p-4">
      <ProductCard v-for="(product, index) in products" :key="index" :title="product.title" :level="product.level"
        :price="product.price" :image="product.image" :reverse="product.reverse" :description="product.description" />
    </section>
  </div>
</template>
