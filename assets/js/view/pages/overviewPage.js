// Model
import { getCurrentData, getTomorrowData } from '../../model/getCurrentData.js';
import { formatPrice, addMoms, getLowestPrice, getHighestPrice, getUpcomingPrices } from '../../model/priceHelpers.js';
import { getSettings } from '../../model/settings.js';
// View
import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';
import { priceCircle } from '../components/priceCircle.js';
import { priceList } from '../components/priceList.js';
import { infoText } from '../components/infoText.js';

// De to små cirkler (laveste og højeste pris i dag)
// Egen funktion, fordi de på desktop sidder i Lige nu-kolonnen i stedet
export async function overviewCircles() {
  const { momsOn, region } = getSettings();
  const iDag = await getCurrentData(new Date(), region);

  // Laveste og højeste beregnes ud fra I DAG (opgavekravet: "dagens" priser)
  const lavest = formatPrice(addMoms(getLowestPrice(iDag), momsOn));
  const hoejest = formatPrice(addMoms(getHighestPrice(iDag), momsOn));

  return `
    <div class="overview__circles">
      ${priceCircle(lavest, 'small', 'Laveste pris')}
      ${priceCircle(hoejest, 'small', 'Højeste pris')}
    </div>
  `;
}

// Indholdet af Oversigt
// visCirkler: true på mobil, false på desktop (der sidder cirklerne i kolonne 1)
export async function overviewContent(visCirkler = true) {
  const { momsOn, region } = getSettings();

  // Hent dagens og morgendagens priser
  const iDag = await getCurrentData(new Date(), region);
  const iMorgen = await getTomorrowData(region);

  // Sæt de to arrays sammen til ét, og fjern de timer der er overstået
  const kommende = getUpcomingPrices([...iDag, ...iMorgen]);

  return `
    <section class="overview">
      ${pageHeading('Oversigt')}
      ${visCirkler ? await overviewCircles() : ''}
      ${priceList(kommende, momsOn)}
    </section>
  `;
}

// Hele siden på mobil: navbar + indhold + info-tekst
export async function overviewPage() {
  const { momsOn, region } = getSettings();

  return `
    ${navbar()}
    <main class="page page--overview">
      ${await overviewContent()}
    </main>
    ${infoText(momsOn, region)}
  `;
}