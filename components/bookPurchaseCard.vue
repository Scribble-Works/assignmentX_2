<script setup>
const price = ref('GHS 10.00');
const client = useSupabaseClient();
const user = useSupabaseUser();
const { grade, assignment, image, bookNum } = defineProps([
    'grade',
    'assignment',
    'image',
    'bookNum'
]);
// if(bookNum == '1'){
//     document.paybtn.style.backgroundColor = '#FFCDD2'; // Light Red
// } else if (bookNum == '2') {
//     document.paybtn.style.backgroundColor = '#BBDEFB';
// } else if (bookNum == '3') {
//     document.paybtn.style.backgroundColor = '#C8E6C9';
// }


const onSuccessfulPayment = async () => {
    if (bookNum === '1') {
        await client.from('profiles').update({ onePurchase: true }).eq('id', user.value.id);
    } else if (bookNum === '2') {
        await client.from('profiles').update({ twoPurchase: true }).eq('id', user.value.id);
    } else if (bookNum === '3') {
        await client.from('profiles').update({ threePurchase: true }).eq('id', user.value.id);
    }
    window.location.reload();
};
</script>
<template>
    <div>
        <v-hover v-slot="{ isHovering, props }">
            <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
                <v-img :aspect-ratio="16 / 9" :src="image" cover>
                    <v-expand-transition>
                        <div v-if="isHovering" class="d-flex bg-blue-grey-darken-1 v-card--reveal text-h2"
                            style="height: 100%;">
                            {{ price }}
                        </div>
                    </v-expand-transition>
                </v-img>

                <v-card-text class="pt-6">
                    <h3 class="text-h4 font-weight-light text-black mb-2">
                        {{ assignment }}
                    </h3>
                    <div class="font-weight-light text-black text-h6 mb-2">
                        {{ grade }}
                    </div>
                    <div>
                        <PaystackBtn class="paybtn" :btn-text="'Enroll Now'" :amount="10" :onSuccessfulPayment="onSuccessfulPayment" />
                    </div>
                </v-card-text>
            </v-card>
        </v-hover>
    </div>
</template>
<style>
.paybtn{
    text-align: center;
    background-color: #2096F3;
    border-radius: 5px; 
}
</style>