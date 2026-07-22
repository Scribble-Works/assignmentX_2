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

const current = ref(0);
const hasPages = computed(() => pages.value.length > 0);

function next() {
  if (current.value < pages.value.length - 1) current.value++;
}
function prev() {
  if (current.value > 0) current.value--;
}
</script>

<template>
  <div>
    <h2
      class="text-h5 font-weight-bold mb-1"
      style="font-family: &quot;Inter&quot;, sans-serif"
    >
      BECE Past Questions {{ data?.year ? "— " + data.year : "" }}
    </h2>
    <p v-if="data?.description" class="text-body-2 text-grey mb-6">
      {{ data?.description }}
    </p>

    <!-- Carousel of page images mapped from the `images.img` column -->
    <div v-if="hasPages">
      <v-window :model-value="current" class="rounded-lg overflow-hidden">
        <v-window-item v-for="(page, i) in pages" :key="i" :value="i">
          <v-img
            :src="page.src"
            :alt="page.id"
            contain
            max-height="85vh"
            class="bg-grey-lighten-3"
          />
        </v-window-item>
      </v-window>

      <!-- Page counter + manual controls -->
      <div class="d-flex align-center justify-center mt-4 ga-4">
        <v-btn
          icon="mdi-chevron-left"
          variant="tonal"
          size="small"
          aria-label="Previous page"
          :disabled="current === 0"
          @click="prev"
        />
        <span class="text-body-2 text-grey-darken-2">
          Page {{ current + 1 }} of {{ pages.length }}
        </span>
        <v-btn
          icon="mdi-chevron-right"
          variant="tonal"
          size="small"
          aria-label="Next page"
          :disabled="current === pages.length - 1"
          @click="next"
        />
      </div>
    </div>

    <!-- Fallback when no page images are available -->
    <div v-else class="text-center py-16 text-grey">
      <v-icon size="48" class="mb-3">mdi-image-off-outline</v-icon>
      <p>No page images available for this entry.</p>
    </div>
  </div>
</template>
