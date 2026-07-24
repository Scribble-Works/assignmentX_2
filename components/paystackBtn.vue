<script setup>
import paystack from "vue3-paystack";

const props = defineProps({
  // Amount in GHS (will be converted to pesewas * 100 for Paystack)
  amount: { type: Number, required: true },
  btnText: { type: String, default: "Pay" },
  // Optional payer details (used when the user is not yet logged in, e.g. pricing page)
  email: { type: String, default: "" },
  fullName: { type: String, default: "" },
  onSuccessfulPayment: { type: Function, default: () => {} },
  onCancelPayment: { type: Function, default: () => {} },
});

const user = useSupabaseUser();
const config = useRuntimeConfig();
const publicKey = config.public.PAYSTACK_PUBLIC_KEY;

// Unique reference generated once per component instance
const reference = computed(
  () => "AX_" + Date.now() + "_" + Math.floor(Math.random() * 1e9),
);

// Resolve payer identity: prop > logged-in user > empty
const payerEmail = computed(() => props.email || user.value?.email || "");
const payerName = computed(
  () =>
    props.fullName ||
    user.value?.user_metadata?.full_name ||
    user.value?.email ||
    "",
);
</script>

<template>
  <ClientOnly>
    <paystack
      v-if="payerEmail"
      :buttonText="btnText"
      :amount="amount * 100"
      :email="payerEmail"
      :fullName="payerName"
      class="btnPay"
      currency="GHS"
      :publicKey="publicKey"
      :reference="reference"
      :onSuccess="onSuccessfulPayment"
      :onCancel="onCancelPayment"
    />
    <span v-else class="text-caption text-error">
      Enter your email to continue to payment.
    </span>
    <template #fallback>
      <span class="text-caption text-grey">Loading payment…</span>
    </template>
  </ClientOnly>
</template>

<style>
.btnPay {
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  height: 3.25rem !important;
  width: 100% !important;
  color: white !important;
  font-family: "Inter", sans-serif !important;
  border-radius: 10px !important;
}
</style>
