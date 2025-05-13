<script setup>
const props = defineProps({
    conceptNote: String,
});
</script>
<template>
    <v-row>
        <v-col>
            <div style="position: relative; width: 100%; height: 0; padding-top: 56.25%; padding-bottom: 0;
                        box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
                        border-radius: 8px; will-change: transform;">
                <iframe :src="conceptNote" frameborder="0" height="80%" width="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;
                    border: none; padding: 0; margin: 0;"></iframe><br>
            </div>
        </v-col>
    </v-row>
</template>