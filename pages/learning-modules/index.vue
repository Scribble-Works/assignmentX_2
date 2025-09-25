<script setup>
const price = ref('GHS 10.00');
const client = useSupabaseClient();
const user = useSupabaseUser();

const config = useRuntimeConfig();
let book1 = false;
let book2 = false;
let book3 = false;
let grade4 = false;
let grade5 = false;
let grade6 = false;

if (user.value && user.value.id) {
  const { data: profiles } = await client.from('profiles').select('*').eq('id', user.value.id).single();
  if (profiles) {
    book1 = profiles.onePurchase;
    book2 = profiles.twoPurchase;
    book3 = profiles.threePurchase;
    grade4 = profiles.grade4;
    grade5 = profiles.grade5;
    grade6 = profiles.grade6;
  }
};

</script>
<template>
    <div class="mt-5">
        <v-container class="my-16">
            <h2 class="text-h2">Find Your Math Match</h2><br>
            <p>Explore our learning modules and learning resources to find the perfect fit for your level. Whether
                you're building a foundation or ready for a new challenge, start learning smarter with AssignmentX.</p>
            <br>
            <h2 class="text-h3">Ghanaian Curriculum</h2>
            <v-row class="mt-5">
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="grade4 == true">
                        <Workbookcard :grade="'Grade 4'" :assignment="'The First Pre-Assignment'" :image="'/img/woman-teaching-kids-class.jpg'"
                            :age="'Ages 8 - 10'" :route="'/learning-modules/preassignment_workbook1/'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'4'" :grade="'Grade 4'" :assignment="'The First Pre-Assignment'"
                            :image="'/img/woman-teaching-kids-class.jpg'" :age="'Ages 8 - 10'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="grade5 == true">
                        <Workbookcard :grade="'Grade 5'" :assignment="'The Second Pre-Assignment'"
                            :image="'/img/children_with_tab.png'" :age="'Ages 9 - 11'" :route="'/learning-modules/preassignment_workbook2/'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'5'" :grade="'Grade 5'" :assignment="'The Second Pre-Assignment'"
                            :image="'/img/children_with_tab.png'" :age="'Ages 9 - 11'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="grade6 == true">
                        <Workbookcard :grade="'Grade 6'" :assignment="'Third Pre-Assignment'" :image="'/img/african-woman-teaching-children-class.jpg'"
                            :age="'Ages 10 - 12'" :route="'/learning-modules/preassignment_workbook3/'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'6'" :grade="'Grade 6'" :assignment="'The Last Pre-Assignment'"
                            :image="'/img/african-woman-teaching-children-class.jpg'" :age="'Ages 10 - 12'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book1 == true">
                        <Workbookcard :grade="'Grade 7'" :assignment="'The First Assignment'" :image="'/img/grade7.jpg'"
                            :age="'Ages 11 - 13'" :route="'/learning-modules/assignment_workbook1/'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'1'" :grade="'Grade 7'" :assignment="'The First Assignment'"
                            :image="'/img/grade7.jpg'" :age="'Ages 11 - 13'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book2 == true">
                        <Workbookcard :grade="'Grade 8'" :assignment="'The Second Assignment'"
                            :image="'/img/grade8.jpg'" :age="'Ages 12 - 14'" :route="'/learning-modules/assignment_workbook2/'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'2'" :grade="'Grade 8'" :assignment="'The Second Assignment'"
                            :image="'/img/grade8.jpg'" :age="'Ages 12 - 14'" />
                    </div>
                </v-col>
                <v-col cols="" lg="4" md="12" sm="12">
                    <div v-if="book3 == true">
                        <Workbookcard :grade="'Grade 9'" :assignment="'The Last Assignment'" :image="'/img/grade9.jpg'"
                            :age="'Ages 13 - 15'" :route="'/learning-modules/assignment_workbook3/'" />
                    </div>
                    <div v-else>
                        <BookPurchaseCard :book-num="'3'" :grade="'Grade 9'" :assignment="'The Last Assignment'"
                            :image="'/img/grade9.jpg'" :age="'Ages 13 - 15'" />
                    </div>
                </v-col>
            </v-row>
            <div class="mt-16">
                <h2 class="text-h3">Universal Modules</h2>
                <v-row class="mt-5">
                    <v-col cols="" lg="4" md="12" sm="12">
                        <!-- <div v-if="book3 == true">
                            <Workbookcard :grade="'All Grades'" :assignment="'Mathematical Notations'"
                                :image="'/img/notations.jpg'" :age="'Fundamentals'" />
                        </div> -->
                        <div>
                            <soonCard :book-num="'3'" :grade="'Grade 7+'" :assignment="'Mathematical Notations'"
                                :image="'/img/smilingchild.png'" :age="'Fundamentals'" />
                        </div>
                    </v-col>
                    <v-col cols="" lg="4" md="12" sm="12">
                        <!-- <div v-if="book3 == true">
                            <Workbookcard :grade="'All Grades'" :assignment="'Mathematical Illustrations'"
                                :image="'/img/equations.jpg'" :age="'Fundamentals'" />
                        </div> -->
                        <div>
                            <soon-card :book-num="'3'" :grade="'Grade 7+'" :assignment="'Mathematical Illustrations'"
                                :image="'/img/writtingman.jpg'" :age="'Fundamentals'" />
                        </div>
                    </v-col>
                    <v-col cols="" lg="4" md="12" sm="12">
                        <!-- <div v-if="book3 == true">
                            <Workbookcard :grade="'All Grades'" :assignment="'Mathematical Tools'"
                                :image="'/img/tools.jpg'" :age="'Fundamentals'" />
                        </div> -->
                        <div>
                            <soon-card :book-num="'3'" :grade="'Grade 4+'" :assignment="'Mathematical Tools'"
                                :image="'/img/abbacuss.png'" :age="'Fundamentals'" />
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-container><br><br><br>
    </div>
</template>
<style>
.body {
    background-color: #ffffff;
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