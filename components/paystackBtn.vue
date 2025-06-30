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
    btnText:String,
    onSuccessfulPayment: function () { },
    onCancelPayment: function () { }
});




</script>
<template>
    <div>
        <paystack :buttonText="bookProps.btnText" :amount="bookProps.amount * 100" :email="email" :fullName="fullName" class="btnPay"
            :currency="'GHS'" :onSuccess="onSuccessfulPayment" :publicKey="publicKey" :onCancel="onCancelPayment"
            :reference="reference">
        </paystack>
    </div>
</template>
<style>
.btnPay{
    font-size: 1.2em;
    height: 3rem;
    color: white;
    font-style: 'Inter', sans-serif;
}
</style>