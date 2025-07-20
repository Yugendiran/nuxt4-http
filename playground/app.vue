<template>
  <div>Playground</div>
</template>

<script>
export default {
  async mounted() {
    const response = await this.$http.get(
      "https://api.crackaspire.com/nexxauth/api/status"
    );
  },
};
</script>
