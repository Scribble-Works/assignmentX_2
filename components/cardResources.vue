<script setup>
const props = defineProps({
    title: String,
    description: String,
    link: String
});
</script>
<template>
    <div>
        <NuxtLink :to="props.link">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col cols="2">
                            <v-icon style="font-size: 3em; color: #2096F3;">mdi-book-open-blank-variant-outline</v-icon>
                        </v-col>
                        <v-col>
                            <h4 class="text-h5">{{props.title}}</h4>
                            <p>{{ props.description }}</p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </NuxtLink>
    </div>
</template>