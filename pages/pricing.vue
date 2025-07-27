<script setup>
import ProductCard from "~/components/productCard.vue";
import AppButton from "~/components/button.vue";

const products = [
  {
    title: "The First Assignment",
    level: "JHS 1",
    description:
      "Start strong with a solid foundation in all your subjects. This book introduces important concepts in Mathematics — explained in simple terms with fun examples to help you understand better. Perfect for classroom support and building good study habits.",
    price: "80",
    image: "/img/jhs1BookSpine.png",
    reverse: false,
  },
  {
    title: "The Second Assignment",
    level: "JHS 2",
    description:
      "Take your learning to the next level! This book dives deeper into the topics you've already started, with more exercises, guided explanations, and helpful revision tips. Great for reinforcing your knowledge and staying ahead in class.",
    price: "80",
    image: "/img/jhs2BookSpine.png",
    reverse: true,
  },
  {
    title: "The Last Assignment",
    level: "JHS 3",
    description:
      "Your exam prep starts here! This book is focused on helping you revise and practice for your final junior school exams. It includes key summaries, solved past questions, practice tests, and exam strategies. Covers all major subjects to help you feel confident and ready.",
    price: "80",
    image: "/img/jhs3BookSpine.png",
    reverse: false,
  },
];
</script>

<template>
  <div class="font-sans">
    <!-- Hero Section -->
    <section class="text-center py-16 bg-white">
      <h1 class="text-4xl md:text-6xl font-bold">Study Smarter!</h1>
      <p class="mt-4 text-gray-600 mx-auto">
        Stay ahead in class with your official companion books — specially
        designed for JHS1, JHS2, and JHS3 students.
      </p>
      <!-- <button
        class="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buy now
      </button> -->
      <AppButton to="/checkout" text="Buy now" color="blue" class="mt-6" />
    </section>

    <!-- Banner Image -->
    <section>
      <img
        src="/img/pricing_hero.jpg"
        alt="Banner"
        class="w-full object-cover h-64 md:h-[600px]"
      />
    </section>

    <!-- Intro Text -->
    <section class="text-center py-12 px-4">
      <h2 class="text-xl md:text-2xl font-semibold">Get Your Workbooks Now!</h2>
      <p class="hidden md:block text-gray-600 mt-4 max-w-3xl mx-auto">
        Stay ahead in class with your official companion books — specially
        designed for JSS1, JSS2, and JSS3 students. Whether you're reviewing a
        topic, preparing for exams, or just want extra practice, these books are
        your go-to guides.
      </p>
    </section>

    <!-- Product Cards -->
    <section class="product space-y-12 px-4 md:px-20 md:w-25">
      <ProductCard
        v-for="(product, index) in products"
        :key="index"
        :title="product.title"
        :level="product.level"
        :price="product.price"
        :image="product.image"
        :reverse="product.reverse"
        :description="product.description"
      />
    </section>
  </div>
</template>

<style>
.product {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
