<template>
  <div class="flex flex-col justify-center p-5 m-1 rounded-2xl bg-green-900">
    <div class="flex justify-center gap-2">
      <Button
        :class="`font-semibold text-white border ${bgSeleccion('par')}`"
        @click="toggleSeleccion('par')"
        label="Par"
      />
      <Button
        :class="`bg-red-500 hover:bg-red-700 text-white ${bgSeleccion('rojo')}`"
        @click="toggleSeleccion('rojo')"
      />
      <Button
        :class="`bg-slate-500 hover:bg-slate-700 text-white ${bgSeleccion('negro')}`"
        @click="toggleSeleccion('negro')"
      />
      <Button
        :class="`font-semibold border text-white ${bgSeleccion('impar')}`"
        @click="toggleSeleccion('impar')"
        label="Impar"
      />
    </div>
    <div class="grid grid-rows-3 grid-flow-col gap-1 p-4">
      <Button
        :class="`${bgTarjeta(numero)} ${bgSeleccion(numero)} text-white`"
        @click="toggleSeleccion(numero)"
        v-for="numero in numeros"
        :label="numero"
        :key="numero"
      />
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import { useTablero } from "../store";

const Button = defineAsyncComponent(() => import("./Button.vue"));

const numeros = ref(Array.from({ length: 37 }, (_, i) => i));
const emit = defineEmits(["seleccion"]);
const tablero = useTablero();

const bgTarjeta = (val) => {
  return val % 2 === 0
    ? "bg-slate-500 hover:bg-slate-700"
    : "bg-red-500 hover:bg-red-700";
};

const bgSeleccion = (val) => {
  return tablero.seleccion.includes(val) ? "border-2 border-yellow-500" : "";
};

const toggleSeleccion = (valor) => {
  const colores = ["negro", "rojo"];
  const tipo = ["par", "impar"];
  
  if (tablero.seleccion.includes(valor)) {
    tablero.seleccion = tablero.seleccion.filter((item) => item !== valor);
  } else {
    if (!isNaN(tablero.seleccion[0])) return;
    else if (tipo.includes(tablero?.seleccion[0]) && (!colores.includes(valor) || tablero?.seleccion[1] != undefined)) return;
    else if (colores.includes(tablero?.seleccion[0])) return;

    tablero.seleccion.push(valor);
  }
};
</script>