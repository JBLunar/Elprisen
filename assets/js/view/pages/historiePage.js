// Model
import { getCurrentData } from '../../model/getCurrentData.js';
import { formatDateDK, toInputValue } from '../../model/priceHelpers.js';
import { getSettings } from '../../model/settings.js';
// View
import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';
import { priceList } from '../components/priceList.js';
import { infoText } from '../components/infoText.js';

// Den del der skifter, når man vælger en ny dato: dato-teksten + prislisten
// Exporteres, fordi controlleren skal bruge den, når datoen ændres
export async function historieResult(dato) {
  const { momsOn, region } = getSettings();

  try {
    const data = await getCurrentData(dato, region);
    return `
      <p class="history__date-text">Elpriserne d. ${formatDateDK(dato)}</p>
      ${priceList(data, momsOn)}
    `;
  } catch (fejl) {
    // Hvis der ikke findes priser for datoen, vis en besked i stedet for at crashe
    return `<p class="history__date-text">Der findes ingen priser for d. ${formatDateDK(dato)}</p>`;
  }
}

// KUN indholdet af Historik – genbruges senere på desktop-dashboardet
export async function historieContent() {
  const iDag = new Date();

  return `
    <section class="history">
      ${pageHeading('Historik')}

      <!-- Label er vigtig for skærmlæsere. Vi skjuler den visuelt med CSS senere -->
      <label for="history-date" class="visually-hidden">Vælg dato</label>
      <!-- min = første dag API'et har data. max = i dag, så man ikke kan vælge fremtiden -->
      <input
        type="date"
        id="history-date"
        class="history__date"
        value="${toInputValue(iDag)}"
        min="2022-11-01"
        max="${toInputValue(iDag)}"
      >

      <!-- Kun indholdet i denne boks bliver udskiftet, når datoen ændres -->
      <div id="history-result" class="history__result">
        ${await historieResult(iDag)}
      </div>
    </section>
  `;
}

// Hele siden på mobil: navbar + indhold + info-tekst
export async function historiePage() {
  const { momsOn, region } = getSettings();

  return `
    ${navbar()}
    <main class="page page--history">
      ${await historieContent()}
    </main>
    ${infoText(momsOn, region)}
  `;
}