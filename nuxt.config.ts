// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: [
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/supabase', {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY,
      redirect: false
    }]
  ],
  css: [
    // '~/assets/style/styles.css', 
    // '~/assets/style/profile.css', 
    // '~/assets/style/pc.css', 
    // '~/assets/style/notes&questions.css', 
    // '~/assets/style/myBooks.css', 
    // '~/assets/style/index.css', 
    // '~/assets/style/forms.css', 
    // '~/assets/style/form.css', 
    // '~/assets/style/bece1.css', 
    // '~/assets/style/algebra.css', 
    // '~/assets/style/about.css'
  ],
  devtools: { enabled: true }
});
