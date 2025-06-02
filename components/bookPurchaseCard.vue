<script setup>
import paystack from 'vue3-paystack';
const client = useSupabaseClient();
const user = useSupabaseUser();
const config = useRuntimeConfig();
const profile = await client.from('profiles').select('*').eq('id', user.value.id);
const amount = 10;
const publicKey = config.public.PAYSTACK_PUBLIC_KEY;

const price = ref('GHS 10.00');
const fullName = profile.data[0].fullName;
const email = user.value.email;
const reference = ref("");

const book1 = profile.data[0].onePurchase;
const book2 = profile.data[0].twoPurchase;
const book3 = profile.data[0].threePurchase;

const { grade, assignment, image } = defineProps([
    'grade',
    'assignment',
    'image'
]);

const onSuccessfulPayment = async (response) => {
    if (book1 === null) {
        const { data, error } = await client.from('profiles').update({ onePurchase: true }).eq('id', user.value.id).single();
    } else if (book2 === null) {
        const { data, error } = await client.from('profiles').update({ twoPurchase: true }).eq('id', user.value.id).single();
    } else if (book3 === null) {
        const { data, error } = await client.from('profiles').update({ threePurchase: true }).eq('id', user.value.id).single();
    }
    if (error) {
        console.error('Error updating purchase status:', error);
    } else {
        console.log('Purchase status updated successfully:', data);
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
                        {{ assignment }}
                    </h3>
                    <div class="font-weight-light text-black text-h6 mb-2">
                        {{ grade }}
                    </div>
                    <div>
                        <paystack buttonText="Buy Now"
                            style="background-color: #37474F; height: 2em; width: 8em; border: #37474F; border-radius: 5%; border-style: solid; color: white; font-weight: bold;"
                            :amount="amount * 100" :email="email" :fullName="fullName" :currency="'GHS'"
                            :onSuccess="onSuccessfulPayment" :publicKey="publicKey" :onCancel="onCancelPayment"
                            :reference="reference"></paystack>
                    </div>
                </v-card-text>
            </v-card>
        </v-hover>
    </div>
</template>