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
<template class="body">
    <div class="mt-5">
        <v-container class="my-16">
            <h2 class="text-h3">Find Your Math Match</h2><br>
            <p>Explore our learning modules and learning resources to find the perfect fit for your level. Whether
                you're building a foundation or ready for a new challenge, start learning smarter with AssignmentX.</p>
            <br>
            <h4 class="text-h4">GES Carricullum</h4>
            <v-row class="mt-0">
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book3 == true">
                        <Workbookcard :grade="'Grade 4'" :assignment="'First Pre-Assignment'" :image="'/img/grade5.png'"
                            :age="'Ages 8 - 10'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'3'" :grade="'Grade 4'" :assignment="'First Pre-Assignment'"
                            :image="'/img/grade4.png'" :age="'Ages 8 - 10'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book2 == true">
                        <Workbookcard :grade="'Grade 5'" :assignment="'Second Pre-Assignment'"
                            :image="'/img/grade5.png'" :age="'Ages 9 - 11'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'2'" :grade="'Grade 5'" :assignment="'Second Pre-Assignment'"
                            :image="'/img/grade5.png'" :age="'Ages 9 - 11'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book2 == true">
                        <Workbookcard :grade="'Grade 6'" :assignment="'Third Pre-Assignment'" :image="'/img/grade6.png'"
                            :age="'Ages 10 - 12'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'2'" :grade="'Grade 6'" :assignment="'Third Pre-Assignment'"
                            :image="'/img/grade6.png'" :age="'Ages 10 - 12'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book1 == true">
                        <Workbookcard :grade="'Grade 7'" :assignment="'The First Assignment'" :image="'/img/grade7.jpg'"
                            :age="'Ages 11 - 13'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'1'" :grade="'Grade 7'" :assignment="'The First Assignment'"
                            :image="'/img/grade7.jpg'" :age="'Ages 11 - 13'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book2 == true">
                        <Workbookcard :grade="'Grade 8'" :assignment="'The Second Assignment'"
                            :image="'/img/grade8.jpg'" :age="'Ages 12 - 14'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'2'" :grade="'Grade 8'" :assignment="'The Second Assignment'"
                            :image="'/img/grade8.jpg'" :age="'Ages 12 - 14'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book3 == true">
                        <Workbookcard :grade="'Grade 9'" :assignment="'The Last Assignment'" :image="'/img/grade9.jpg'"
                            :age="'Ages 13 - 15'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'3'" :grade="'Grade 9'" :assignment="'The Last Assignment'"
                            :image="'/img/grade9.jpg'" :age="'Ages 13 - 15'" />
                    </div>
                </v-col>
            </v-row>
            <div class="mt-10">
                <h4 class="text-h4">Universal Carricullum</h4>
                <v-row class="mt-0">
                    <v-col cols="" lg="4" md="12" sm="12">
                        <div v-if="book3 == true">
                            <Workbookcard :grade="'All Grades'" :assignment="'Mathematical Notations'"
                                :image="'/img/notations.jpg'" :age="'Fundamentals'" />
                        </div>
                        <div v-else>
                            <soonCard :book-num="'3'" :grade="'All Grades'" :assignment="'Mathematical Notations'"
                                :image="'/img/notations.jpg'" :age="'Fundamentals'" />
                        </div>
                    </v-col>
                    <v-col cols="" lg="4" md="12" sm="12">
                        <div v-if="book3 == true">
                            <Workbookcard :grade="'All Grades'" :assignment="'Mathematical Illustrations'"
                                :image="'/img/equations.jpg'" :age="'Fundamentals'" />
                        </div>
                        <div v-else>
                            <soonCard :book-num="'3'" :grade="'All Grades'" :assignment="'Mathematical Illustrations'"
                                :image="'/img/equations.jpg'" :age="'Fundamentals'" />
                        </div>
                    </v-col>
                    <v-col cols="" lg="4" md="12" sm="12">
                        <div v-if="book3 == true">
                            <Workbookcard :grade="'All Grades'" :assignment="'Mathematical Tools'"
                                :image="'/img/tools.jpg'" :age="'Fundamentals'" />
                        </div>
                        <div v-else>
                            <soonCard :book-num="'3'" :grade="'All Grades'" :assignment="'Mathematical Tools'"
                                :image="'/img/tools.jpg'" :age="'Fundamentals'" />
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-container><br><br><br>
    </div>
</template>
<style>
.body {
    background-color: #F6F6F6;
}

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