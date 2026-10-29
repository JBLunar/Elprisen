// Den runde pris-cirkel fra designet
// price: prisen som tekst, fx "0.242"
// size: "large" (Lige nu) eller "small" (laveste/højeste på Oversigt)
// label: valgfri tekst under cirklen, fx "Laveste pris"
export function priceCircle(price, size = 'large', label = '') {
  return `
    <div class="price-circle price-circle--${size}">
      <!-- Ringen – den stiplede indre cirkel laves med CSS senere -->
      <div class="price-circle__ring">
        <p class="price-circle__price">${price} kr</p>
        <p class="price-circle__unit">pr. kWh</p>
      </div>
      <!-- Vis kun label hvis der er sendt en med -->
      ${label ? `<p class="price-circle__label">${label}</p>` : ''}
    </div>
  `;
}