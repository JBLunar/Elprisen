// "../../" = op fra components/ og view/, ned i model/
import { formatTime, formatPrice, addMoms } from '../../model/priceHelpers.js';

// Listen med "kl. 19.00 – 0.524 kr" rækker – bruges på både Oversigt og Historik
export function priceList(data, momsOn) {
  // Lav hvert pris-objekt om til en HTML-række
  const rows = data.map((item) => {
    const pris = formatPrice(addMoms(item.DKK_per_kWh, momsOn));
    return `
      <li class="price-list__item">
        <span class="price-list__time">kl. ${formatTime(item.time_start)}</span>
        <span class="price-list__price">${pris} kr</span>
      </li>
    `;
  });

  // join('') sætter alle rækkerne sammen til én lang tekst
  return `<ul class="price-list">${rows.join('')}</ul>`;
}