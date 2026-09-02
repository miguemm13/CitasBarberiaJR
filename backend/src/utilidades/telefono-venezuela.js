/**
 * Utilidades para números de teléfono venezolanos.
 * En Venezuela se acostumbra escribir el número con el 0 inicial antes
 * de la operadora (ej. 0412-1234567), como se marca localmente. Para
 * WhatsApp (wa.me) hace falta el número completo con código de país
 * (+58) y SIN el 0 inicial.
 */
const CODIGO_PAIS = '58';

// Operadoras móviles venezolanas válidas (Movilnet, Movistar, Digitel).
const OPERADORAS_VALIDAS = ['412', '414', '416', '424', '426'];

/**
 * Valida y normaliza un teléfono venezolano ingresado en cualquiera de
 * estos formatos: "04121234567", "0412-1234567", "0412 1234567",
 * "+584121234567", "584121234567". Devuelve el número en formato local
 * con guion para guardar/mostrar (ej. "0412-1234567"), o null si no es
 * un número venezolano válido.
 */
function normalizarTelefonoLocal(telefono) {
  if (!telefono) return null;
  let digitos = String(telefono).replace(/\D/g, ''); // solo dígitos

  // Si viene con el código de país (58...), se lo quitamos y le
  // devolvemos el 0 inicial, para trabajar siempre en formato local.
  if (digitos.startsWith(CODIGO_PAIS) && digitos.length === 12) {
    digitos = '0' + digitos.slice(2);
  }

  // Formato esperado: 0 + operadora (3 dígitos) + 7 dígitos = 11 dígitos.
  if (digitos.length !== 11 || !digitos.startsWith('0')) return null;
  const operadora = digitos.slice(1, 4);
  if (!OPERADORAS_VALIDAS.includes(operadora)) return null;

  return `${digitos.slice(0, 4)}-${digitos.slice(4)}`; // 0412-1234567
}

/**
 * Convierte un teléfono venezolano en formato local (con o sin
 * guion/espacios, con o sin el 0 inicial) al formato que espera wa.me:
 * código de país + número, solo dígitos. Ej: "0412-1234567" -> "584121234567".
 */
function aFormatoWhatsapp(telefonoLocal) {
  const digitos = String(telefonoLocal).replace(/\D/g, '');
  const sinCero = digitos.startsWith('0') ? digitos.slice(1) : digitos;
  return `${CODIGO_PAIS}${sinCero}`;
}

module.exports = { normalizarTelefonoLocal, aFormatoWhatsapp, OPERADORAS_VALIDAS };
