<script setup>
const client = useSupabaseClient()

const { data: unsortedStrands } = await client.from('assignment_workbook_2').select();

// Sort the strands array based on the id property
const strands = computed(() => {
  if (unsortedStrands) {
    return [...unsortedStrands].sort((a, b) => a.id - b.id);
  }
  return [];
});

console.log(strands)

</script>
<template>
    <div class="body">
        <v-container>
            <introvid :intro="'https://www.youtube.com/embed/Ec7zLUi16JU'" />
            <br>
            <h2 class="text-h3">Welcome to Your Math Companion!</h2><br>
            <p style="width: 100%;">Not every explanation in the textbook will make sense right away, and that’s okay.

                This site is here to give you a helping hand when math gets confusing. We break things down with simple
                steps, helpful examples, and clear visuals so you can learn at your own pace and build real confidence.
            </p><br>

            <h2 class="text-h3">Topics We Cover</h2><br>
            <p>Learn and practice:</p>
            <div class="mt-10">
                <v-row v-for="strand in strands" :key="strand.id">
                    <v-col cols=12>
                        <NuxtLink :to="'/learning-modules/assignment_workbook2/strand-' + strand.id + '/'">
                            <v-card class="mx-auto" color="white" max-width="1200">

                                <v-card-text class="pt-6">
                                    <div style="color: #2096f3;" class="font-weight-light text-h6 mb-2">
                                        {{ strand.title }}
                                    </div>
                                    <h3 class="text-h4 strand-title font-weight-light mb-2">
                                        {{ strand.strand_name }}
                                    </h3>
                                    <p>{{ strand.descriptions }}</p>
                                </v-card-text>
                            </v-card>
                        </NuxtLink>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>
<style>
.body {
    background-color: #F6F6F6;
}
h2 {
    color: #3E4F5C;
    font-style: 'Inter', sans-serif;
}

p {
    font-style: 'Inter', sans-serif;
}

.strand-title {
    color: #3E4F5C;
    font-style: 'Inter', sans-serif;
}
</style>