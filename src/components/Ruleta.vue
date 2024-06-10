<template>
  <div class="flex justify-center items-center">
    <div class="card" :class="{ flipped: ruleta.start }">
      <div class="card-front">
        <img
          src="../assets/ruleta.jpg"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div class="card-back">
        <div
          :class="`flex flex-col w-full h-full justify-center items-center ${
            resultado.color == 'negro'
              ? 'bg-slate-500 hover:bg-slate-700'
              : 'bg-red-500 hover:bg-red-700'
          }  text-white rounded-lg`"
        >
          <span class="text-4xl capitalize font-semibold">
            {{ resultado.numero ?? "Sin resultado" }}
          </span>
          <span class="text-4xl capitalize font-semibold">
            {{ resultado.tipo ?? "Sin resultado" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFetch } from "../composables/fetch";
import { watchEffect, ref } from "vue";
import { useRuleta } from "../store";

const props = defineProps({ start: { type: Boolean, default: false } });
const emit = defineEmits(["resultado"]);
const ruleta = useRuleta();

const resultado = ref({ color: null, numero: null, tipo: null });

watchEffect(() => props.start && traerResultado());

const traerResultado = async () => {
  try {
    const { result } = await useFetch({ ruta: "resultado" });
    resultado.value = result;
    ruleta.start = true;
    setTimeout(() => (ruleta.start = false), 4000);
    emit("resultado", resultado.value);
  } catch (error) {
    console.error(error);
  }
};
</script>
  
<style scoped>
.card {
  width: 150px;
  height: 150px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
}

.card-back {
  transform: rotateY(180deg);
}
</style>
  