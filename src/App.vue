<template>
  <div
    class="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#6b0f1a] to-[#b91372]"
  >
    <div class="flex items-center justify-center gap-8">
      <!-- Sección del Juego de la Ruleta -->
      <div class="bg-white shadow-lg rounded-lg p-8">
        <h1 class="text-4xl font-bold mb-6 text-center text-gray-900">
          Juego de la ruleta
        </h1>
        <Ruleta :start="start" @resultado="traerPremio" />

        <!-- Información del Jugador -->
        <div class="mt-6 space-y-4">
          <div class="flex items-center gap-4">
            <label class="text-slate-800 font-semibold w-1/2"
              >Nombre del jugador:</label
            >
            <input
              class="border rounded px-2 text-center w-1/2"
              v-model="datosUser.nombre"
              :disabled="guardarDatos"
              ref="nombre"
              type="text"
            />
          </div>
          <div class="flex items-center gap-4">
            <label class="text-slate-800 font-semibold w-1/2"
              >Saldo actual:</label
            >
            <input
              class="border rounded px-2 text-right w-1/2"
              v-model="datosUser.saldo"
              :disabled="guardarDatos"
              type="number"
              ref="saldo"
            />
          </div>
        </div>
      </div>

      <!-- Sección de Control de la Apuesta -->
      <div class="bg-white shadow-lg rounded-lg p-8 w-64 flex flex-col gap-4">
        <div v-if="guardarDatos" class="flex flex-col gap-2">
          <label class="text-slate-800 font-semibold">Monto:</label>
          <input
            class="border rounded px-2 text-right"
            v-model="datosUser.montoApostar"
            type="text"
            ref="montoApostar"
          />
        </div>

        <Button
          class="bg-slate-900 text-blue-50 w-full"
          label="Procesar datos"
          @click="validarJugador"
          v-if="!guardarDatos"
        />
        <Button
          class="bg-black text-white border rounded w-full"
          :disabled="ruleta.start"
          @click="iniciarApuesta"
          v-if="guardarDatos"
          label="Apostar"
        />
        <Button
          class="rounded border text-slate-900 w-full"
          label="Guardar juego"
          v-if="guardarDatos"
          @click="guardarJuego"
        />
        <Button
          class="rounded border text-slate-900 w-full"
          label="Cargar usuario"
          @click="() => (guardarDatos = false)"
          v-if="guardarDatos"
        />
      </div>
    </div>

    <!-- Tablero -->
    <Tablero class="mt-8" />
  </div>
</template>
<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useTablero, useRuleta } from "./store";
import { useFetch } from "./composables/fetch";
import { useToast } from "vue-toastification";

const Tablero = defineAsyncComponent(() => import("../src/components/Tablero.vue"));
const Button = defineAsyncComponent(() => import("../src/components/Button.vue"));
const Ruleta = defineAsyncComponent(() => import("./components/Ruleta.vue"));

const tablero = useTablero();
const ruleta = useRuleta();
const toast = useToast();

let validarJugadorTimeOut = null;
const guardarDatos = ref(false);
const start = ref(false);
const datosUser = ref({
  montoApostar: 0,
  nombre: null,
  saldo: 0,
});

const montoApostar = ref();
const nombre = ref();
const saldo = ref();

onMounted(() => nombre.value.focus());

watch(
  () => datosUser.value.nombre,
  () => {
    validarJugadorTimeOut && clearTimeout(validarJugadorTimeOut);
    validarJugadorTimeOut = setTimeout(() => cargarUsuario(), 1000);
  }
);

const validarJugador = () => {
  if (!datosUser.value.nombre) {
    nombre.value.focus();
    return toast.info("Ingrese nombre del usuario");
  } else if (!datosUser.value.saldo) {
    saldo.value.focus();
    return toast.info("Ingrese saldo del usuario");
  }

  guardarDatos.value = true;
};

const iniciarApuesta = () => {
  if (!datosUser.value.montoApostar) {
    montoApostar.value.focus();
    return toast.info("Ingrese un monto para iniciar la apuesta.");
  }

  if (tablero.seleccion.length < 1) {
    return toast.info("Seleccione el objetivo a apostar.");
  }

  if (datosUser.value.montoApostar > datosUser.value.saldo) {
    montoApostar.value.focus();
    return toast.info("Saldo insuficiente, ingrese un monto válido.");
  }

  start.value = true;
  setTimeout(() => (start.value = false), 300);
};

const validarResultado = (item) => {
  let tipoApuesta = null;
  let acerto = false;

  if (!isNaN(tablero.seleccion[0])) {
    if (item.numero == tablero.seleccion[0]) {
      tipoApuesta = "numero";
      acerto = true;
    }
  } else if (["par", "impar"].includes(tablero.seleccion[0])) {
    if (
      item.tipo == tablero.seleccion[0] &&
      item.color == tablero.seleccion[1]
    ) {
      tipoApuesta = "tipo";
      acerto = true;
    }
  } else if (["negro", "rojo"].includes(tablero.seleccion[0])) {
    if (item.color == tablero.seleccion[0]) {
      acerto = true;
      tipoApuesta = "color";
    }
  }

  return { acerto, tipoApuesta };
};

const traerPremio = async (item) => {
  try {
    const { acerto, tipoApuesta } = validarResultado(item);
    if (!acerto) {
      return (datosUser.value.saldo -= datosUser.value.montoApostar);
    }

    const { result } = await useFetch({
      ruta: `premio`,
      params: {
        tipoApuesta,
        montoApostar: datosUser.value.montoApostar,
      },
    });

    datosUser.value.saldo += result;
  } catch (error) {
    console.error(error);
  }
};

const cargarUsuario = async () => {
  try {
    const { result } = await useFetch({
      ruta: `usuarios?nombre=${datosUser.value.nombre}`,
    });
    if (result) {
      datosUser.value.nombre = result.nombre;
      datosUser.value.saldo = result.saldo;
    }
  } catch (error) {
    console.error(error);
  }
};

const guardarJuego = async () => {
  try {
    await useFetch({
      ruta: `usuarios`,
      data: {
        nombre: datosUser.value.nombre,
        saldo: datosUser.value.saldo,
      },
      method: "post",
    });
  } catch (error) {
    console.error(error);
  }
};
</script>
