<script setup>
import paystack from 'vue3-paystack';

const client = useSupabaseClient();
const user = useSupabaseUser();
const config = useRuntimeConfig();
const profile = await client.from('profiles').select('*').eq('id', user.value.id);
const amount = 10;
const publicKey = config.public.PAYSTACK_PUBLIC_KEY;

const fullName = profile.data[0].fullName;
const email = user.value.email;
const reference = ref("");

const book1 = profile.data[0].onePurchase;
const book2 = profile.data[0].twoPurchase;
const book3 = profile.data[0].threePurchase;

const bookProps = defineProps({
    bookNum: String,
    onSuccessfulPayment: {
        type: Function,
        required: true
    },
    onCancelPayment: function () { }
});

const onSuccessfulPayment = async () => {
    if (bookProps.bookNum === '1') {
        await client.from('profiles').update({ onePurchase: true }).eq('id', user.value.id);
    } else if (bookProps.bookNum === '2') {
        await client.from('profiles').update({ twoPurchase: true }).eq('id', user.value.id);
    } else if (bookProps.bookNum === '3') {
        await client.from('profiles').update({ threePurchase: true }).eq('id', user.value.id);
    }
};


</script>
<template>
    <div>
        <paystack buttonText="Buy Now"
            style="background-color: #37474F; height: 2em; width: 8em; border: #37474F; border-radius: 5%; border-style: solid; color: white; font-weight: bold;"
            :amount="amount * 100" :email="email" :fullName="fullName" :currency="'GHS'"
            :onSuccess="onSuccessfulPayment" :publicKey="publicKey" :onCancel="onCancelPayment" :reference="reference">
        </paystack>
    </div>
</template>