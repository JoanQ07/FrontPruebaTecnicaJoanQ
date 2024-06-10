<template>
  <button class="w-20 h-10 rounded font-semibold disabled:opacity-25" :disabled="isDisabled">{{ label }}</button>
</template>

<script setup>
const props = defineProps(["label", "isDisabled"]);
</script>