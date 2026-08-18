// Configuración del tema de Tailwind (vía CDN) para el prototipo.
// Debe cargarse DESPUÉS del script de Tailwind y ANTES de estilos.css / interactividad.js.
// Los mismos nombres y valores de color se usan en frontend/tailwind.config.js
// para que el prototipo y la app Angular luzcan idénticos.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        // Paleta "barbería clásica": azul marino + plata, look profesional.
        'negro-mate': '#081f37', // fondo principal de la tarjeta (azul marino)
        'gris-carbon': '#0F2C4D', // superficies / tarjetas
        'gris-carbon-claro': '#1A3F6B', // superficies claras, barras de progreso
        dorado: '#C7D0DC', // acento principal (plata / blanco frío)
        'dorado-suave': '#AAB6C7', // acento hover (plata un poco más oscura)
        'fondo-pagina': '#04101F', // telón de fondo detrás de la tarjeta centrada
        crema: '#ffffff', // color de texto (blanco)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
