En el proyecto se intento implementar metodos y funciones de Vue3 esto con el fin de demostrar varios conceptos de este framework, implementando estados globales, componentes, reactividad, y observadores.

Iniciar proyecto: npm run dev

El funcionamiento del tablero funciona de la siguiente manera:
- Para selecionar el par de un color primero se tiene que selecionar el tipo (par o impar) y despues si dejara selecionar el color.
- Si seleciona un numero, no dejara selecionar ningun otro item, de igual manera pasa al apostar por un color.

Al cargar un jugador por su nombre se valida haciendo una peticion a la API cuando el cliente deje de escribir en el campo.

Al guardar el juego la API se encargar de validar si el usuario existe o no, en caso de no exitir lo crea, caso contrario lo actualiza.

Al momnento de apostar la ruleta consulta la API para obtener el resultado lo cual despues de obtenerlo lo deja visualizar por 4seg