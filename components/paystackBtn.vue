<script setup>
import paystack from 'vue3-paystack';

const client = useSupabaseClient();
const user = useSupabaseUser();
const config = useRuntimeConfig();
const profile = await client.from('profiles').select('*').eq('id', user.value.id);
// const amount = 10;
const publicKey = config.public.PAYSTACK_PUBLIC_KEY;

const fullName = profile.data[0].fullName;
const email = user.value.email;
const reference = ref("");

const book1 = profile.data[0].onePurchase;
const book2 = profile.data[0].twoPurchase;
const book3 = profile.data[0].threePurchase;

const bookProps = defineProps({
    amount: Number,
    onSuccessfulPayment: function () { },
    onCancelPayment: function () { }
});




</script>
<template>
    <div>
        <paystack buttonText="Buy Now"
            style="background-color: #2096F3; height: 3.5em; width: 8em; border: #2096F3; border-radius: 10%; border-style: solid; color: white; font-weight: bold;"
            :amount="bookProps.amount * 100" :email="email" :fullName="fullName" :currency="'GHS'"
            :onSuccess="onSuccessfulPayment" :publicKey="publicKey" :onCancel="onCancelPayment" :reference="reference">
        </paystack>
    </div>
</template>