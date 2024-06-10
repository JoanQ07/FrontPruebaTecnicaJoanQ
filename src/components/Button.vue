<template>
  <button class="w-20 h-10 rounded font-semibold">{{ label }}</button>
</template>

<script setup>
const props = defineProps(["label"]);
</script>
