<template>
  <div>Playground</div>
</template>

<script>
export default {
  async mounted() {
    await this.$http.get("/status");
  },
};
</script>
