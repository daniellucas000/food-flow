// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/fonts',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    public: {
      apiBase: '',
    },
  },
  fonts: {
    families: [
      {
        name: 'Poppins',
        weights: [500, 600, 700],
      },
    ],
  },
});