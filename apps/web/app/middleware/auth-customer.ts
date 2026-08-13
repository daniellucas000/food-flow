export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('customer_token');
  const slug = to.params.slug;

  if (!token.value) {
    return navigateTo(`/${slug}/login`);
  }
});
