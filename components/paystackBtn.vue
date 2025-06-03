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

const onSuccessfulPayment = async () => {
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
        <paystack buttonText="Buy Now"
            style="background-color: #37474F; height: 2em; width: 8em; border: #37474F; border-radius: 5%; border-style: solid; color: white; font-weight: bold;"
            :amount="amount * 100" :email="email" :fullName="fullName" :currency="'GHS'"
            :onSuccess="onSuccessfulPayment" :publicKey="publicKey" :onCancel="onCancelPayment" :reference="reference">
        </paystack>
    </div>
</template>