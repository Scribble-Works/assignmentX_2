<script setup>
const price = ref('Available');
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const { grade, assignment, image, bookNum } = defineProps([
    'grade',
    'assignment',
    'image',
    'bookNum',
    'age'
]);
// if(bookNum == '1'){
//     document.paybtn.style.backgroundColor = '#FFCDD2'; // Light Red
// } else if (bookNum == '2') {
//     document.paybtn.style.backgroundColor = '#BBDEFB';
// } else if (bookNum == '3') {
//     document.paybtn.style.backgroundColor = '#C8E6C9';
// }


const onSuccessfulPayment = async () => {
    if (!user.value) {
        router.push('/login');
        return;
    } else {
        if (bookNum === '1') {
            await client.from('profiles').update({ onePurchase: true }).eq('id', user.value.id);
        } else if (bookNum === '2') {
            await client.from('profiles').update({ twoPurchase: true }).eq('id', user.value.id);
        } else if (bookNum === '3') {
            await client.from('profiles').update({ threePurchase: true }).eq('id', user.value.id);
        }
        window.location.reload();
    }

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
                        {{ grade }}
                    </h3>
                    <div class="font-weight-light text-black text-h6 mb-2">
                        {{ assignment }}
                    </div>
                    <p class="text-muted font-weight-bold mb-5">{{ age }}</p>
                    <div>
                        <v-btn class="paybtn" style="color: white; width: 100%;" :amount="10"
                            @click="onSuccessfulPayment">Enroll For Free</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-hover>
    </div>
</template>
<style>
.paybtn {
    text-align: center;
    background-color: #2096F3;
    border-radius: 5px;
}
</style>