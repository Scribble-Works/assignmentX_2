<script setup>
const price = ref('GHS 10.00');
const client = useSupabaseClient();
const user = useSupabaseUser();

const config = useRuntimeConfig();
const profile = await client.from('profiles').select('*').eq('id', user.value.id);

const book1 = profile.data[0].onePurchase;
const book2 = profile.data[0].twoPurchase;
const book3 = profile.data[0].threePurchase;

</script>
<template>
    <div class="mt-5">
        <v-container class="my-16">
            <v-row>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book1 == true">
                        <Workbookcard :grade="'Grade 7'" :assignment="'First Assignment'" :image="'/img/grade7.jpg'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'1'" :grade="'Grade 7'" :assignment="'First Assignment'"
                            :image="'/img/grade7.jpg'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book2 == true">
                        <Workbookcard :grade="'Grade 8'" :assignment="'Second Assignment'" :image="'/img/grade8.jpg'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'2'" :grade="'Grade 8'" :assignment="'Second Assignment'"
                            :image="'/img/grade8.jpg'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book3 == true">
                        <Workbookcard :grade="'Grade 9'" :assignment="'Last Assignment'" :image="'/img/grade9.jpg'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'3'" :grade="'Grade 9'" :assignment="'Last Assignment'"
                            :image="'/img/grade9.jpg'" />
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