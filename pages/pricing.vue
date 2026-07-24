<script setup>
import { useMediaQuery } from "@vueuse/core";
import PaystackBtn from "~/components/paystackBtn.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Pricing — AssignmentX",
  meta: [
    {
      name: "description",
      content:
        "Simple, transparent pricing for teachers and schools. Pay in Ghana Cedis with Mobile Money, Visa or Mastercard.",
    },
  ],
});

const mobile = useMediaQuery("(max-width: 600px)");

/* ───────────────────────── Role selection (top tabs) ───────────────────────── */
const activeRole = ref("school"); // 'individual' | 'school' | 'ngo'
const roles = [
  { id: "individual", label: "Individual Teacher", color: "#7c3aed" },
  { id: "school", label: "School Plan", color: "#1d4ed8" },
  { id: "ngo", label: "NGO / Custom Plan", color: "#16a34a" },
];

/* ───────────────────────── Teacher calculator ───────────────────────── */
const teachers = ref(25);
const billingCycle = ref("termly"); // 'monthly' | 'termly' | 'yearly'

// Bulk discount tiers: price per teacher (GHS) and discount % by teacher count
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

// Billing-cycle multiplier & label
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
const cycleSave = computed(() =>
  billingCycle.value === "yearly"
    ? "Save 20%"
    : billingCycle.value === "termly"
      ? "Save 10%"
      : "",
);

const subtotal = computed(() => teachers.value * pricePerTeacher.value * cycleMult.value);
const discountAmount = computed(() => Math.round(subtotal.value * (discountPct.value / 100)));
const total = computed(() => subtotal.value - discountAmount.value);
const amountSaved = computed(() => discountAmount.value);

const ghs = (n) => "GHS " + n.toLocaleString("en-GH");

const inc = () => (teachers.value = Math.min(teachers.value + 1, 500));
const dec = () => (teachers.value = Math.max(teachers.value - 1, 1));
const setBand = (b) => {
  teachers.value = b.min;
};

/* ───────────────────────── Payment / sign-up handoff ───────────────────────── */
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser();
const client = useSupabaseClient();

// Prefill school email if arriving from pricing after choosing a plan
const schoolEmail = ref(typeof route.query.email === "string" ? route.query.email : "");
const schoolName = ref(typeof route.query.school === "string" ? route.query.school : "");

// Estimated renewal date (today + ~3 months for termly)
const renewalDate = computed(() => {
  const d = new Date();
  if (billingCycle.value === "monthly") d.setMonth(d.getMonth() + 1);
  else if (billingCycle.value === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 3);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
});

const onPaymentSuccess = async (response) => {
  // Hand off to school registration, carrying plan context so the
  // admin account is created already associated with the paid plan.
  await router.push({
    path: "/school-admin/register",
    query: {
      plan: "school",
      teachers: String(teachers.value),
      billing: billingCycle.value,
      amount: String(total.value),
      reference: response?.reference || "",
      email: schoolEmail.value || "",
      school: schoolName.value || "",
    },
  });
};

const requestQuote = () => {
  router.push({
    path: "/school-admin/register",
    query: { plan: "ngo" },
  });
};

const startIndividual = () => {
  // Individual teachers go through the normal sign-up
  router.push("/sign-up");
};

/* ───────────────────────── Comparison table ───────────────────────── */
const comparisonRows = [
  { feature: "Premium lesson resources", individual: true, school: true, ngo: true },
  { feature: "Assessment generator", individual: true, school: true, ngo: true },
  { feature: "AI teaching assistant", individual: true, school: true, ngo: true },
  { feature: "Curriculum navigator", individual: true, school: true, ngo: true },
  { feature: "Resource downloads", individual: true, school: true, ngo: true },
  { feature: "Professional development", individual: true, school: true, ngo: true },
  { feature: "Multiple teacher accounts", individual: false, school: true, ngo: true },
  { feature: "School admin dashboard", individual: false, school: true, ngo: true },
  { feature: "School reports", individual: false, school: true, ngo: true },
  { feature: "Bulk teacher onboarding", individual: false, school: true, ngo: true },
  { feature: "Unlimited teacher accounts", individual: false, school: false, ngo: true },
  { feature: "Dedicated onboarding", individual: false, school: false, ngo: true },
  { feature: "Custom integrations", individual: false, school: false, ngo: true },
  { feature: "Priority support", individual: false, school: false, ngo: true },
];
</script>

<template>
  <div class="pricing-page">
    <!-- Top nav tabs -->
    <div class="role-tabs d-flex justify-center flex-wrap ga-2 mb-8">
      <v-btn
        v-for="r in roles"
        :key="r.id"
        :variant="activeRole === r.id ? 'flat' : 'outlined'"
        :color="activeRole === r.id ? r.color : 'grey-darken-2'"
        rounded="pill"
        class="role-tab"
        @click="activeRole = r.id"
      >
        {{ r.label }}
      </v-btn>
    </div>

    <!-- Hero -->
    <section class="text-center mb-10">
      <h1 class="hero-title">Choose the plan that works for you</h1>
      <p class="hero-sub">
        All prices are in Ghana Cedis (GHS). Pricing is based on the number of
        teachers — schools receive automatic discounts as more teachers are
        onboarded.
      </p>
    </section>

    <!-- Pricing cards -->
    <v-container class="pb-4">
      <v-row class="align-stretch" justify="center">
        <!-- Individual Teacher -->
        <v-col cols="12" md="4" lg="3">
          <v-card
            class="plan-card h-100"
            :class="{ 'plan-card--active': activeRole === 'individual' }"
            rounded="xl"
            elevation="3"
          >
            <div class="plan-card__head" style="color: #7c3aed">
              <v-icon size="28">mdi-account</v-icon>
              <span class="plan-card__kicker">Individual Teacher</span>
            </div>
            <h3 class="plan-card__title">Perfect for individual educators</h3>
            <div class="price-block">
              <span class="price-amount">GHS 100</span>
              <span class="price-unit">/ teacher</span>
            </div>
            <v-list density="compact" class="feature-list">
              <v-list-item
                v-for="f in comparisonRows.filter((r) => r.individual).slice(0, 6)"
                :key="f.feature"
                prepend-icon="mdi-check-circle"
                base-color="#16a34a"
              >
                <v-list-item-title class="feature-text">{{ f.feature }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-btn
              color="#7c3aed"
              size="large"
              block
              rounded="lg"
              class="mt-auto"
              @click="startIndividual"
            >
              Get Started
            </v-btn>
            <div class="text-center mt-2">
              <span class="text-caption text-grey">Monthly · Termly · Yearly</span>
            </div>
          </v-card>
        </v-col>

        <!-- School Plan (interactive) -->
        <v-col cols="12" md="5" lg="5">
          <v-card
            class="plan-card plan-card--featured h-100"
            :class="{ 'plan-card--active': activeRole === 'school' }"
            rounded="xl"
            elevation="8"
          >
            <div class="recommended-badge">RECOMMENDED</div>
            <div class="plan-card__head" style="color: #1d4ed8">
              <v-icon size="28">mdi-school</v-icon>
              <span class="plan-card__kicker">School Plan</span>
            </div>
            <h3 class="plan-card__title">Built for schools and teaching teams</h3>

            <!-- Teacher calculator -->
            <div class="calculator mt-2">
              <p class="calc-label">How many teachers do you want to onboard?</p>
              <div class="d-flex align-center justify-space-between calc-stepper">
                <v-btn icon variant="outlined" size="small" @click="dec" :disabled="teachers <= 1">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <div class="calc-count">
                  <span class="calc-number">{{ teachers }}</span>
                  <span class="calc-number-label">Teachers</span>
                </div>
                <v-btn icon variant="outlined" size="small" @click="inc" :disabled="teachers >= 500">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <!-- Quick select bands -->
              <div class="d-flex flex-wrap ga-2 mt-3">
                <v-btn
                  v-for="b in bands"
                  :key="b.label"
                  size="small"
                  variant="tonal"
                  rounded="pill"
                  :color="activeBand.label === b.label ? 'blue-darken-3' : 'grey'"
                  @click="setBand(b)"
                >
                  {{ b.label }} · {{ ghs(b.price) }}
                </v-btn>
              </div>
            </div>

            <!-- Billing cycle toggle -->
            <div class="billing-toggle mt-4">
              <v-btn-toggle
                v-model="billingCycle"
                color="blue-darken-3"
                rounded="pill"
                mandatory
                density="comfortable"
                variant="outlined"
              >
                <v-btn value="monthly">Monthly</v-btn>
                <v-btn value="termly">Termly <small v-if="cycleSave && billingCycle==='termly'">(Save 10%)</small></v-btn>
                <v-btn value="yearly">Yearly <small v-if="cycleSave && billingCycle==='yearly'">(Save 20%)</small></v-btn>
              </v-btn-toggle>
            </div>

            <!-- Price summary -->
            <div class="summary-box mt-4">
              <div class="summary-row">
                <span>Teachers</span><span>{{ teachers }}</span>
              </div>
              <div class="summary-row">
                <span>Price per teacher</span><span>{{ ghs(pricePerTeacher) }}</span>
              </div>
              <div v-if="discountPct > 0" class="summary-row text-success">
                <span>Discount ({{ discountPct }}%)</span><span>-{{ ghs(discountAmount) }}</span>
              </div>
              <div class="summary-row summary-row--total">
                <span>Total amount</span><span>{{ ghs(total) }}</span>
              </div>
              <p v-if="amountSaved > 0" class="save-note">
                You save {{ ghs(amountSaved) }} with bulk discount!
              </p>
            </div>

            <!-- Payment -->
            <div class="mt-4">
              <v-text-field
                v-model="schoolEmail"
                label="School email for receipt"
                type="email"
                placeholder="school@email.com"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                hide-details
                class="mb-3"
              />
              <PaystackBtn
                :amount="total"
                btn-text="Proceed to Payment"
                :email="schoolEmail"
                :full-name="''"
                :on-successful-payment="onPaymentSuccess"
              />
            </div>
          </v-card>
        </v-col>

        <!-- NGO / Custom -->
        <v-col cols="12" md="3" lg="3">
          <v-card
            class="plan-card h-100"
            :class="{ 'plan-card--active': activeRole === 'ngo' }"
            rounded="xl"
            elevation="3"
          >
            <div class="plan-card__head" style="color: #16a34a">
              <v-icon size="28">mdi-account-group</v-icon>
              <span class="plan-card__kicker">NGO / Enterprise</span>
            </div>
            <h3 class="plan-card__title">
              For NGOs, school networks & government organizations
            </h3>
            <div class="price-block">
              <span class="price-amount">Custom</span>
              <span class="price-unit">pricing</span>
            </div>
            <v-list density="compact" class="feature-list">
              <v-list-item
                v-for="f in ['Unlimited teacher accounts','Dedicated onboarding','Custom integrations','Priority support','Advanced reporting']"
                :key="f"
                prepend-icon="mdi-check-circle"
                base-color="#16a34a"
              >
                <v-list-item-title class="feature-text">{{ f }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-btn
              color="#16a34a"
              size="large"
              block
              rounded="lg"
              class="mt-auto"
              @click="requestQuote"
            >
              Request a Quote
            </v-btn>
            <div class="text-center mt-2">
              <span class="text-caption text-grey">We'll get back to you.</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Checkout summary + payment methods -->
    <v-container class="pt-0">
      <v-row class="mt-6" justify="center">
        <!-- Checkout summary card -->
        <v-col cols="12" md="5" lg="4">
          <v-card class="checkout-card" rounded="xl" elevation="6">
            <h3 class="checkout-title">Checkout Summary</h3>
            <div class="summary-row"><span>Selected plan</span><span>School Plan</span></div>
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
            <v-btn
              color="white"
              variant="flat"
              size="large"
              block
              rounded="lg"
              class="checkout-btn"
              :href="`/school-admin/register?plan=school&teachers=${teachers}&billing=${billingCycle}&amount=${total}`"
            >
              Complete Payment
            </v-btn>
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

    <!-- Comparison table -->
    <v-container class="mt-10">
      <h2 class="compare-title text-center mb-6">Compare Plans</h2>
      <v-card rounded="xl" elevation="2" class="compare-card">
        <v-table class="compare-table">
          <thead>
            <tr>
              <th class="text-left">Feature</th>
              <th class="text-center">Individual Teacher</th>
              <th class="text-center">School Plan</th>
              <th class="text-center">NGO / Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in comparisonRows" :key="row.feature">
              <td class="text-left font-weight-medium">{{ row.feature }}</td>
              <td class="text-center">
                <v-icon v-if="row.individual" color="#16a34a">mdi-check</v-icon>
                <v-icon v-else color="#cbd5e1">mdi-minus</v-icon>
              </td>
              <td class="text-center">
                <v-icon v-if="row.school" color="#16a34a">mdi-check</v-icon>
                <v-icon v-else color="#cbd5e1">mdi-minus</v-icon>
              </td>
              <td class="text-center">
                <v-icon v-if="row.ngo" color="#16a34a">mdi-check</v-icon>
                <v-icon v-else color="#cbd5e1">mdi-minus</v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>

    <!-- FAQ -->
    <v-container class="mt-10 mb-12">
      <h2 class="compare-title text-center mb-6">Frequently Asked Questions</h2>
      <v-expansion-panels variant="accordion" class="faq-panels">
        <v-expansion-panel title="How do I pay?">
          <v-expansion-panel-text>
            We accept Mobile Money (MoMo), Visa and Mastercard. All payments are
            processed securely through Paystack in Ghana Cedis (GHS).
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="How does the teacher discount work?">
          <v-expansion-panel-text>
            The more teachers you onboard, the lower the price per teacher.
            Schools with 11–30 teachers save 5%, 31–60 save 10%, and 61+ save 15%.
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Can I switch plans later?">
          <v-expansion-panel-text>
            Yes. You can upgrade or adjust the number of teachers at any time from
            your school admin dashboard.
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="What happens after I pay?">
          <v-expansion-panel-text>
            You'll be taken to create your school admin account. Once confirmed,
            you can invite teachers by email and start using AssignmentX.
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<style scoped>
.pricing-page {
  background: linear-gradient(180deg, #f5f9ff 0%, #ffffff 40%);
  padding: 32px 0 0;
}
.role-tab {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.hero-title {
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  font-family: "Inter", sans-serif;
}
.hero-sub {
  max-width: 640px;
  margin: 12px auto 0;
  color: #475569;
  font-size: 1.05rem;
}
.plan-card {
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.plan-card--active {
  border-color: #93c5fd;
}
.plan-card--featured {
  border: 2px solid #1d4ed8;
  position: relative;
  background: #ffffff;
}
.recommended-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #1d4ed8;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 14px;
  border-radius: 999px;
}
.plan-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}
.plan-card__kicker {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.8rem;
}
.plan-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 8px 0 12px;
}
.price-block {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}
.price-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}
.price-unit {
  color: #64748b;
}
.feature-list {
  background: transparent;
  margin-top: 6px;
}
.feature-text {
  font-size: 0.92rem;
  color: #334155;
}
.calculator {
  background: #f1f5f9;
  border-radius: 14px;
  padding: 14px;
}
.calc-label {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}
.calc-stepper {
  gap: 12px;
}
.calc-count {
  text-align: center;
  min-width: 90px;
}
.calc-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  color: #1d4ed8;
  line-height: 1;
}
.calc-number-label {
  font-size: 0.8rem;
  color: #64748b;
}
.summary-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: #334155;
  font-size: 0.95rem;
}
.summary-row.text-success {
  color: #16a34a;
}
.summary-row--total {
  font-weight: 800;
  font-size: 1.1rem;
  color: #0f172a;
  border-top: 1px dashed #cbd5e1;
  margin-top: 4px;
  padding-top: 8px;
}
.save-note {
  color: #16a34a;
  font-weight: 600;
  font-size: 0.85rem;
  margin: 6px 0 0;
  text-align: center;
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
.renewal-note {
  color: #94a3b8;
  font-size: 0.82rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.checkout-btn {
  color: #0f172a !important;
  font-weight: 700;
  text-transform: none;
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
.compare-title {
  font-weight: 800;
  color: #0f172a;
}
.compare-card {
  overflow: hidden;
}
.compare-table th {
  background: #f1f5f9;
  font-weight: 700;
  color: #334155;
}
.compare-table td,
.compare-table th {
  padding: 10px 12px !important;
}
.faq-panels {
  max-width: 820px;
  margin: 0 auto;
}
</style>
