// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  app: {
    head: {
      // script: [{src:'script.js'}]
    }
  },

  runtimeConfig:{
    public:{
      APPLICATION_CREDENTIALS: process.env.APPLICATION_CREDENTIALS,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      SHEET_ID: process.env.SHEET_ID
    }
  },
  modules: [// '@nuxtjs/tailwindcss',
  ['@nuxtjs/supabase', {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false
  }]],
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    'assets/style/bece1.css',
    'assets/style/main.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ['vuetify']
  },
  devtools: { enabled: true }
});