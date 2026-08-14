<script setup>
import PaystackBtn from "~/components/paystackBtn.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Checkout — AssignmentX",
  meta: [
    {
      name: "description",
      content: "Review your plan and complete payment securely with Paystack.",
    },
  ],
});

const router = useRouter();
const route = useRoute();

/* ───────────────────────── Plan handed off from the pricing page ───────────────────────── */
const plan = computed(() => (typeof route.query.plan === "string" ? route.query.plan : "school"));
const teachers = computed(() => {
  const n = parseInt(route.query.teachers, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
});
const billingCycle = computed(() =>
  ["monthly", "termly", "yearly"].includes(route.query.billing) ? route.query.billing : "termly",
);

const planLabel = computed(() => (plan.value === "school" ? "School Plan" : plan.value));

// Recompute pricing from teachers + billing cycle so the total shown here
// can't be tampered with via the URL's `amount` param.
const bands = [
  { min: 1, max: 10, price: 100, discount: 0, label: "1–10" },
  { min: 11, max: 30, price: 95, discount: 5, label: "11–30" },
  { min: 31, max: 60, price: 80, discount: 10, label: "31–60" },
  { min: 61, max: Infinity, price: 65, discount: 15, label: "61+" },
];
const activeBand = computed(
  () => bands.find((b) => teachers.value >= b.min && teachers.value <= b.max) || bands[0],
);
const pricePerTeacher = computed(() => activeBand.value.price);
const discountPct = computed(() => activeBand.value.discount);
const cycleMult = computed(() =>
  billingCycle.value === "monthly" ? 1 : billingCycle.value === "termly" ? 1 : 0.8,
);
const cycleLabel = computed(() =>
  billingCycle.value === "monthly"
    ? "Monthly"
    : billingCycle.value === "termly"
      ? "Termly"
      : "Yearly",
);

const subtotal = computed(() => teachers.value * pricePerTeacher.value * cycleMult.value);
const discountAmount = computed(() => Math.round(subtotal.value * (discountPct.value / 100)));
const total = computed(() => subtotal.value - discountAmount.value);

const ghs = (n) => "GHS " + n.toLocaleString("en-GH");

// Estimated renewal date (today + ~3 months for termly)
const renewalDate = computed(() => {
  const d = new Date();
  if (billingCycle.value === "monthly") d.setMonth(d.getMonth() + 1);
  else if (billingCycle.value === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 3);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
});

/* ───────────────────────── Payment ───────────────────────── */
const email = ref("");

const onPaymentSuccess = async (response) => {
  // Hand off to school registration, carrying plan context so the
  // admin account is created already associated with the paid plan.
  await router.push({
    path: "/school-admin/register",
    query: {
      plan: plan.value,
      teachers: String(teachers.value),
      billing: billingCycle.value,
      amount: String(total.value),
      reference: response?.reference || "",
      email: email.value || "",
    },
  });
};
</script>

<template>
  <div class="checkout-page">
    <v-container class="pt-8 pb-12">
      <div class="text-center mb-8">
        <h1 class="checkout-heading">Complete your purchase</h1>
        <p class="checkout-sub">
          Review your plan below, then pay securely with Mobile Money, Visa or Mastercard.
        </p>
        <NuxtLink to="/pricing" class="back-link">
          <v-icon size="18">mdi-arrow-left</v-icon> Back to pricing
        </NuxtLink>
      </div>

      <v-row class="mt-2" justify="center">
        <!-- Checkout summary card -->
        <v-col cols="12" md="5" lg="4">
          <v-card class="checkout-card" rounded="xl" elevation="6">
            <h3 class="checkout-title">Checkout Summary</h3>
            <div class="summary-row"><span>Selected plan</span><span>{{ planLabel }}</span></div>
            <div class="summary-row"><span>Teachers</span><span>{{ teachers }}</span></div>
            <div class="summary-row"><span>Billing cycle</span><span>{{ cycleLabel }}</span></div>
            <div class="summary-row"><span>Price / teacher</span><span>{{ ghs(pricePerTeacher) }}</span></div>
            <div class="summary-row"><span>Discount</span><span>{{ discountPct }}%</span></div>
            <v-divider class="my-2" />
            <div class="summary-row summary-row--total text-white">
              <span>Total Payable</span><span>{{ ghs(total) }}</span>
            </div>
            <p class="renewal-note">
              <v-icon size="16" class="mr-1">mdi-calendar-clock</v-icon>
              Est. renewal: {{ renewalDate }}
            </p>

            <div class="mt-4">
              <v-text-field
                v-model="email"
                label="Email for receipt"
                type="email"
                placeholder="school@email.com"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                hide-details
                class="mb-3 checkout-input"
              />
              <!-- Paystack integration -->
              <PaystackBtn
                :amount="total"
                btn-text="Complete Payment"
                :email="email"
                :full-name="''"
                :on-successful-payment="onPaymentSuccess"
              />
            </div>
          </v-card>
        </v-col>

        <!-- Payment methods -->
        <v-col cols="12" md="6" lg="6">
          <v-card class="paymethods-card h-100" rounded="xl" elevation="3">
            <h3 class="pm-title">
              <v-icon class="mr-2" color="blue-darken-3">mdi-shield-lock</v-icon>
              Secure Payment Options
            </h3>
            <p class="pm-sub">Your payment information is secure and encrypted.</p>
            <v-row class="mt-2" dense>
              <v-col cols="12" sm="4">
                <div class="pm-item">
                  <div class="pm-logo pm-logo--momo">MoMo</div>
                  <p class="pm-text">Pay with Mobile Money (MoMo)</p>
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="pm-item">
                  <div class="pm-logo pm-logo--visa">VISA</div>
                  <p class="pm-text">Pay with Visa Card</p>
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="pm-item">
                  <div class="pm-logo pm-logo--mc">&#9733;&#9733;</div>
                  <p class="pm-text">Pay with Mastercard</p>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="trust-badges d-flex flex-wrap ga-3">
              <div class="trust-badge"><v-icon color="blue-darken-3">mdi-lock-check</v-icon> Secure Payment</div>
              <div class="trust-badge"><v-icon color="blue-darken-3">mdi-account-school</v-icon> Built for Teachers</div>
              <div class="trust-badge"><v-icon color="blue-darken-3">mdi-book-check</v-icon> Curriculum Aligned</div>
              <div class="trust-badge"><v-icon color="blue-darken-3">mdi-flag</v-icon> Made in Ghana</div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.checkout-page {
  background: linear-gradient(180deg, #f5f9ff 0%, #ffffff 40%);
  min-height: 100vh;
  padding: 32px 0 0;
}
.checkout-heading {
  font-size: clamp(1.6rem, 3.5vw, 2.25rem);
  font-weight: 800;
  color: #0f172a;
  font-family: "Inter", sans-serif;
}
.checkout-sub {
  max-width: 560px;
  margin: 10px auto 0;
  color: #475569;
  font-size: 1rem;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 14px;
  color: #1d4ed8;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.95rem;
}
.summary-row--total {
  font-weight: 800;
  font-size: 1.1rem;
  border-top: 1px dashed #cbd5e1;
  margin-top: 4px;
  padding-top: 8px;
}
.checkout-card {
  background: #0f172a;
  color: #e2e8f0;
  padding: 22px;
}
.checkout-title {
  color: #fff;
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 1.2rem;
}
.checkout-card .summary-row {
  color: #cbd5e1;
}
.checkout-card .summary-row--total {
  color: #fff;
}
.checkout-input :deep(input) {
  color: #0f172a;
}
.renewal-note {
  color: #94a3b8;
  font-size: 0.82rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.paymethods-card {
  padding: 22px;
}
.pm-title {
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
}
.pm-sub {
  color: #64748b;
  margin: 4px 0 8px;
}
.pm-item {
  text-align: center;
  padding: 10px;
}
.pm-logo {
  font-weight: 800;
  border-radius: 10px;
  padding: 12px 0;
  margin-bottom: 6px;
}
.pm-logo--momo {
  background: #ffcc00;
  color: #5a3e00;
}
.pm-logo--visa {
  background: #1a1f71;
  color: #fff;
}
.pm-logo--mc {
  background: #eb001b;
  color: #f79e1b;
  font-size: 1.2rem;
}
.pm-text {
  font-size: 0.82rem;
  color: #475569;
}
.trust-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  color: #1e3a8a;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
