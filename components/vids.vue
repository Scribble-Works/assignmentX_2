<script setup>
const props = defineProps({
    url: String,
});
</script>
<template>
    <div style="position: relative; width: 100%; height: 60%; padding-top: 52.25%; padding-bottom: 0;
                        box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; overflow: hidden;
                        border-radius: 8px; will-change: transform;">
        <iframe :src="url" frameborder="0" width="100%" height="auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;
                    border: none; padding: 0; margin: 0;"></iframe><br>
    </div>
</template>