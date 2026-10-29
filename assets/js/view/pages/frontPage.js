// Model
import { getCurrentData } from '../../model/getCurrentData.js';
import { formatTime, formatPrice, addMoms, getCurrentPrice } from '../../model/priceHelpers.js';
import { getSettings } from '../../model/settings.js';
// View
import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';
import { priceCircle } from '../components/priceCircle.js';
import { infoText } from '../components/infoText.js';

// KUN indholdet af Lige nu – genbruges som kolonne 1 på desktop
export async function frontContent() {
  const { momsOn, region } = getSettings();

  // Hent dagens priser for den valgte region
  const data = await getCurrentData(new Date(), region);

  // Find prisen for den nuværende time
  const nu = getCurrentPrice(data);

  // Sikkerhed: hvis vi ikke kan finde en pris, vis en besked i stedet for at crashe
  if (!nu) {
    return `
      <section class="front">
        ${pageHeading('Elprisen lige nu')}
        <p>Kunne ikke finde prisen for lige nu.</p>
      </section>
    `;
  }

  // Beregn først (tal), og formatér til sidst (tekst)
  const pris = formatPrice(addMoms(nu.DKK_per_kWh, momsOn));
  const tidsrum = `${formatTime(nu.time_start)} - ${formatTime(nu.time_end)}`;

  return `
    <section class="front">
      ${pageHeading('Elprisen lige nu')}
      ${priceCircle(pris, 'large')}
      <p class="time-range">${tidsrum}</p>
    </section>
  `;
}

// Hele siden på mobil: navbar + indhold + info-tekst
export async function frontPage() {
  const { momsOn, region } = getSettings();

  return `
    ${navbar()}
    <main class="page page--front">
      ${await frontContent()}
    </main>
    ${infoText(momsOn, region)}
  `;
}