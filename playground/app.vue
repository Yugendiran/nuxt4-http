<template>
  <div>Playground</div>
</template>

<script>
export default {
  async mounted() {
    const response = await this.$http.get("/status");
  },
};
</script>
