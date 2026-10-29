// "../../" = op fra components/ og view/, ned i model/
import {
  formatTime,
  formatPrice,
  addMoms,
  getLowestPrice,
  getHighestPrice,
  getPriceColor,
} from '../../model/priceHelpers.js';

// Listen med "kl. 19.00 – 0.524 kr" rækker – bruges på både Oversigt og Historik
// referenceData: den dag farverne skal regnes ud fra (standard: listen selv)
export function priceList(data, momsOn, referenceData = data) {
  // Dagens laveste og højeste pris – bruges til at farvelægge
  const min = getLowestPrice(referenceData);
  const max = getHighestPrice(referenceData);

  // Lav hvert pris-objekt om til en HTML-række
  const rows = data.map((item) => {
    const pris = formatPrice(addMoms(item.DKK_per_kWh, momsOn));
    // Farven regnes ud fra prisen UDEN moms – moms ændrer ikke placeringen mellem min og max
    const farve = getPriceColor(item.DKK_per_kWh, min, max);

    return `
      <li class="price-list__item">
        <span class="price-list__time">kl. ${formatTime(item.time_start)}</span>
        <!-- Farven sendes til CSS som en variabel -->
        <span class="price-list__price" style="--price-color: ${farve}">${pris} kr</span>
      </li>
    `;
  });

  // join('') sætter alle rækkerne sammen til én lang tekst
  return `<ul class="price-list">${rows.join('')}</ul>`;
}