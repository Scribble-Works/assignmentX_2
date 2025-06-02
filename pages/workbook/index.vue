<script setup>
const price = ref('GHS 10.00');
const client = useSupabaseClient();
const user = useSupabaseUser();
const workbooks = [
    {
        grade: 'Grade 7',
        assignment: 'First Assignment',
        image: '/img/grade7.jpg'
    },
    {
        grade: 'Grade 8',
        assignment: 'Second Assignment',
        image: '/img/grade8.jpg'
    },
    {
        grade: 'Grade 9',
        assignment: 'Last Assignment',
        image: '/img/grade9.jpg'
    }
];
</script>
<template>
    <div class="mt-5">
        <v-container class="my-16">
            <v-row>
                <v-col v-for="book in workbooks" :key="book.grade">
                    <workbookcard :grade="book.grade" :assignment="book.assignment" :image="book.image" />
                </v-col>
            </v-row>
        </v-container><br><br><br>
    </div>
</template>
<style>
.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
}

v-container {
    font-family: 'Inter', sans-serif;
}
</style>