<template>
  <div class="auth-layout">
    <div class="auth-layout__panel">
      <span class="auth-layout__brand">Food</span>
      <div class="auth-layout__illustration">🍔</div>
    </div>

    <div class="auth-layout__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.auth-layout__panel {
  background: #fde8e8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.auth-layout__brand {
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #e63946;
}

.auth-layout__illustration {
  font-size: 8rem;
}

.auth-layout__content {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

@media (max-width: 768px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
  .auth-layout__panel {
    display: none;
  }
}
</style>
