// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  runtimeConfig: {
    // Server-only (never sent to the client)
    // Override via NUXT_GEMINI_API_KEY env var (or set GEMINI_API_KEY and reference here)
    geminiApiKey: process.env.GEMINI_API_KEY ?? "",
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    public: {
      APPLICATION_CREDENTIALS: process.env.APPLICATION_CREDENTIALS,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      SHEET_ID: process.env.SHEET_ID,
      PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
    },
  },
  modules: [
    [
      "@nuxtjs/supabase",
      {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_GEN_KEY,
        redirect: false,
      },
    ],
    "@nuxt/fonts",
    "nuxt-mail",
    "nuxt-gtag",
  ],

  // nuxt-mail SMTP configuration
  mail: {
    message: {
      to: process.env.EMAIL,
    },
    smtp: {
      // host: "smtp.gmail.com",
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
      },
    },
  },
  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "assets/style/main.css",
  ],
  fonts: {
    families: [{ name: "Inter", provider: "google" }],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ["vuetify", "@vuepic/vue-datepicker"],
  },
  devtools: { enabled: true },
});
