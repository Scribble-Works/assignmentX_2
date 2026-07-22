<script setup>
definePageMeta({
  layout: "resources",
});

const route = useRoute();
const client = useSupabaseClient();

const { data } = await client
  .from("bece_past_questions")
  .select("*")
  .eq("route", route.params.route)
  .single();

// Normalize the `images` column into a flat list of page objects.
// The DB stores: { img: [{ id, src }, ...] }  (sometimes a bare array).
const pages = computed(() => {
  const raw = data?.images;
  if (!raw) return [];

  const list = Array.isArray(raw) ? raw : raw.img;
  if (!Array.isArray(list)) return [];

  return list
    .map((item, i) => {
      if (typeof item === "string") {
        return { id: `Page ${i + 1}`, src: item };
      }
      return {
        id: item.id || `Page ${i + 1}`,
        src: item.src || item.url || "",
      };
    })
    .filter((p) => p.src);
});

const hasPages = computed(() => pages.value.length > 0);
</script>

<template>
  <div>
    <h2
      class="text-h5 font-weight-bold mb-6"
      style="font-family: &quot;Inter&quot;, sans-serif"
    >
      BECE Past Questions {{ data?.year ? "— " + data.year : "" }}
    </h2>

    <!-- Carousel of page images mapped from the `images.img` column -->
    <v-carousel
      v-if="hasPages"
      hide-delimiters
      height="950"
      show-arrows="hover"
      class="rounded-l shadow-lg"
    >
      <v-carousel-item v-for="(page, i) in pages" :key="i">
        <img
          :src="page.src"
          :alt="page.id"
          class="w-full h-full rounded-l shadow-lg object-contain"
        />
      </v-carousel-item>
    </v-carousel>

    <!-- Fallback when no page images are available -->
    <div v-else class="text-center py-16 text-grey">
      <v-icon size="48" class="mb-3">mdi-image-off-outline</v-icon>
      <p>No page images available for this entry.</p>
    </div>
  </div>
</template>
