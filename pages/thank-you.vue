<script setup>
definePageMeta({ layout: "default" });
useHead({ title: "Thank you — AssignmentX" });

const route = useRoute();
const user = useSupabaseUser();

// Payment details carried over from checkout (all optional).
const plan = computed(() => (typeof route.query.plan === "string" ? route.query.plan : ""));
const teachers = computed(() => (typeof route.query.teachers === "string" ? route.query.teachers : ""));
const billing = computed(() => (typeof route.query.billing === "string" ? route.query.billing : ""));
const amount = computed(() => (typeof route.query.amount === "string" ? route.query.amount : ""));
const reference = computed(() => (typeof route.query.reference === "string" ? route.query.reference : ""));

const planLabel = computed(() =>
  plan.value === "school" ? "School Plan" : plan.value === "ngo" ? "NGO / Enterprise Plan" : (plan.value || "Your plan"),
);
</script>

<template>
  <div class="thankyou-page">
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="7" lg="6">
          <v-card class="ty-card text-center" rounded="xl" elevation="6">
            <div class="ty-check">
              <v-icon size="56" color="white">mdi-check-bold</v-icon>
            </div>

            <h1 class="ty-title">Payment successful</h1>
            <p class="ty-sub">
              Thank you for subscribing to AssignmentX. Your {{ planLabel }} is now active.
            </p>

            <!-- Receipt summary (only shows the fields we received) -->
            <div v-if="amount || reference" class="ty-receipt">
              <div v-if="planLabel" class="ty-row"><span>Plan</span><span>{{ planLabel }}</span></div>
              <div v-if="teachers" class="ty-row"><span>Teachers</span><span>{{ teachers }}</span></div>
              <div v-if="billing" class="ty-row"><span>Billing</span><span class="text-capitalize">{{ billing }}</span></div>
              <div v-if="amount" class="ty-row"><span>Amount paid</span><span>GHS {{ amount }}</span></div>
              <div v-if="reference" class="ty-row"><span>Reference</span><span class="ty-ref">{{ reference }}</span></div>
            </div>

            <p class="ty-note">
              A receipt has been sent to your email. Keep your reference number for your records.
            </p>

            <div class="ty-actions">
              <NuxtLink to="/" class="no-underline">
                <v-btn color="blue-darken-2" size="large" variant="flat" prepend-icon="mdi-home">
                  Back to Home
                </v-btn>
              </NuxtLink>
              <NuxtLink v-if="user" to="/school-admin/dashboard" class="no-underline">
                <v-btn color="blue-darken-2" size="large" variant="tonal" prepend-icon="mdi-view-dashboard">
                  Go to Dashboard
                </v-btn>
              </NuxtLink>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.thankyou-page { background: linear-gradient(180deg, #f5f9ff 0%, #ffffff 45%); min-height: 100vh; }
.no-underline { text-decoration: none; }
.ty-card { padding: 40px 28px; }
.ty-check {
  width: 92px; height: 92px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px; box-shadow: 0 8px 24px rgba(34,197,94,.35);
}
.ty-title { font-size: 1.7rem; font-weight: 800; color: #0f172a; font-family: "Inter", sans-serif; }
.ty-sub { color: #475569; margin: 8px auto 0; max-width: 420px; }
.ty-receipt {
  text-align: left; background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 12px; padding: 14px 18px; margin: 22px auto; max-width: 420px;
}
.ty-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: .95rem; color: #334155; }
.ty-ref { font-family: monospace; font-size: .82rem; word-break: break-all; }
.ty-note { color: #64748b; font-size: .85rem; margin: 4px auto 0; max-width: 420px; }
.ty-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 26px; }
</style>
