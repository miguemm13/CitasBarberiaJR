/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Paleta "barbería clásica": azul marino + plata, look profesional.
        // Se mantienen los nombres de los tokens usados en toda la app
        // (negro-mate, gris-carbon, dorado...) aunque ahora representen
        // azul marino y plata, para no tener que renombrar cada clase.
        'negro-mate': '#081f37', // fondo principal de la tarjeta/app (azul marino)
        'gris-carbon': '#0F2C4D', // superficies / tarjetas
        'gris-carbon-claro': '#1A3F6B', // superficies claras, barras de progreso
        dorado: '#C7D0DC', // acento principal (plata / blanco frío)
        'dorado-suave': '#AAB6C7', // acento hover (plata un poco más oscura)
        'fondo-pagina': '#04101F', // telón de fondo detrás de la tarjeta centrada
        crema: '#ffffff', // color de texto (blanco)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
