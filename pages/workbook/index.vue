<script setup>
const price = ref('GHS 10.00');
const client = useSupabaseClient();
const user = useSupabaseUser();

const config = useRuntimeConfig();
const profile = await client.from('profiles').select('*').eq('id', user.value.id);

const book1 = profile.data[0].onePurchase;
const book2 = profile.data[0].twoPurchase;
const book3 = profile.data[0].threePurchase;
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
                    <div v-if="book1 == true || book2 == true || book3 == true">
                        <Workbookcard :grade="book.grade" :assignment="book.assignment" :image="book.image" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :grade="book.grade" :assignment="book.assignment" :image="book.image" />
                    </div>
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