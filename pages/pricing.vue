<script setup>
import { useMediaQuery } from "@vueuse/core";

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

// School plan is a paid, configurable plan — send the shopper to the
// dedicated checkout page (where Paystack is wired up) with their choices.
const proceedToCheckout = () => {
  router.push({
    path: "/checkout",
    query: {
      plan: "school",
      teachers: String(teachers.value),
      billing: billingCycle.value,
      amount: String(total.value),
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

    <!-- Pricing cards: toggled by the role tabs above, one plan at a time -->
    <v-container class="pb-4">
      <v-row justify="center">
        <v-col
          cols="12"
          :sm="activeRole === 'school' ? 11 : 8"
          :md="activeRole === 'school' ? 9 : 6"
          :lg="activeRole === 'school' ? 7 : 5"
          :xl="activeRole === 'school' ? 6 : 4"
        >
          <Transition name="plan-fade" mode="out-in">
            <!-- Individual Teacher -->
            <v-card
              v-if="activeRole === 'individual'"
              key="individual"
              class="plan-card"
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

            <!-- School Plan (interactive) -->
            <v-card
              v-else-if="activeRole === 'school'"
              key="school"
              class="plan-card plan-card--featured"
              rounded="xl"
              elevation="8"
            >
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

              <!-- Continue to checkout -->
              <v-btn
                color="#1d4ed8"
                size="large"
                block
                rounded="lg"
                class="mt-4"
                @click="proceedToCheckout"
              >
                Proceed to Checkout
              </v-btn>
            </v-card>

            <!-- NGO / Custom -->
            <v-card v-else key="ngo" class="plan-card" rounded="xl" elevation="3">
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
          </Transition>
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
.plan-card--featured {
  border: 2px solid #1d4ed8;
  background: #ffffff;
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
.plan-fade-enter-active,
.plan-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.plan-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.plan-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
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
