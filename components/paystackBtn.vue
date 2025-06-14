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

const bookProps = defineProps({
    amount: Number,
    onSuccessfulPayment: function () { },
    onCancelPayment: function () { }
});




</script>
<template>
    <div>
        <paystack buttonText="Buy Now" class="paybtn"
            :amount="bookProps.amount * 100" :email="email" :fullName="fullName" :currency="'GHS'"
            :onSuccess="onSuccessfulPayment" :publicKey="publicKey" :onCancel="onCancelPayment" :reference="reference">
        </paystack>
    </div>
</template>
<style>
.paybtn{
    width: 340px;
    height: 3rem;
    text-align: center;
    background-color: #4C9F38;
    border-radius: 5px; /* Added border radius for better aesthetics */
    color: white; /* Added text color for better visibility */
    font-size: 1.2em; /* Increased font size for better readability */;
}
</style>