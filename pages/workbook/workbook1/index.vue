<script setup>
const client = useSupabaseClient();
const strands = ref([
    {
        id: 1,
        name: 'Strand 1',
        title: 'Number',
        description: 'At its core, a number is an abstract mathematical entity used to count, measure, and label. From the simple counting numbers (1, 2, 3...) to more complex concepts like real numbers, complex numbers, and beyond, numbers form the fundamental building blocks of mathematics and are essential for describing and quantifying the world around us.',
        route: 'strand1'
    },
    {
        id: 2,
        name: 'Strand 2',
        title: 'Algebra',
        description: 'Stepping beyond basic arithmetic, algebra introduces the power of symbols (variables) to represent unknown quantities and relationships. It provides a framework for formulating and solving equations, manipulating expressions, and understanding functions. Algebra is a fundamental tool for problem-solving, logical reasoning, and serves as a gateway to more advanced mathematical concepts.',
        route: 'strand2'
    },
    {
        id: 3,
        name: 'Strand 3',
        title: 'Geometry and Measurement',
        description: 'Geometry delves into the fascinating world of shapes, sizes, positions, and properties of objects in space. From the elegance of Euclidean geometry with its points, lines, and planes to more abstract concepts, it provides a visual and spatial understanding of our surroundings. Measurement complements geometry by providing the tools to quantify dimensions, areas, volumes, and angles. Together, they form a powerful framework for understanding the physical world.',
        route: 'strand3'
    },
    {
        id: 4,
        name: 'Strand 4',
        title: 'Handling Data',
        description: 'This involves the systematic process of collecting, organizing, analyzing, interpreting, and presenting information (data) to gain insights and make informed decisions. From simple tables and charts to sophisticated statistical methods, handling data is crucial in various fields for identifying patterns, trends, and drawing meaningful conclusions from raw information.',
        route: 'strand4'
    }
]);
</script>
<template>
    <div>
        <v-container>
            <introvid :intro="'https://www.youtube.com/embed/Ec7zLUi16JU'" />
            <br>
            <h2 class="text-h3">📘 Welcome to Your Math Companion!</h2><br>
            <p style="width: 70%;">Not every explanation in the textbook will make sense right away—and that’s okay.

                This site is here to give you a helping hand when math gets confusing. We break things down with simple
                steps, helpful examples, and clear visuals so you can learn at your own pace and build real confidence.
            </p><br>

            <h2 class="text-h3">📚 Topics We Cover</h2><br>
            <p>Learn and practice:</p>
            <div class="mt-10">
                <v-row v-for="strand in strands" :key="strand.id">
                    <v-col cols=12>
                        <NuxtLink :to="'/workbook/workbook1/' + strand.route">
                            <v-card class="mx-auto" color="grey-lighten-4" max-width="1200">

                                <v-card-text class="pt-6">
                                    <div class="font-weight-light text-grey text-h6 mb-2">
                                        {{ strand.name }}
                                    </div>
                                    <h3 class="text-h4 strand-title font-weight-light mb-2">
                                        {{ strand.title }}
                                    </h3>
                                    <p>{{ strand.description }}</p>
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
h2 {
    color: #3E4F5C;
    font-style: 'Inter', sans-serif;
}

p {
    font-style: 'Inter', sans-serif;
}
.strand-title{
    color: #FCC30C;
    font-style: 'Inter', sans-serif;
}
</style>