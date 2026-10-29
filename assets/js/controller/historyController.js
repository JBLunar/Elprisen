// Controlleren reagerer på det brugeren gør
// "../" = op fra controller/ til js/
import { historieResult } from '../view/pages/historiePage.js';
import { parseInputDate } from '../model/priceHelpers.js';

export function setupHistoryEvents() {
  // Vi lytter på hele dokumentet – det findes altid og bliver aldrig udskiftet
  document.addEventListener('change', async (event) => {
    // Kom ændringen fra et andet felt end datofeltet? Så ignorér den
    if (event.target.id !== 'history-date') return;

    // Hvis feltet er tomt (brugeren har slettet datoen), gør ingenting
    if (!event.target.value) return;

    // Lav "2026-10-29" om til et Date-objekt
    const dato = parseInputDate(event.target.value);

    // Find boksen med resultatet og vis en "henter"-besked, mens vi venter
    const resultat = document.querySelector('#history-result');
    resultat.innerHTML = '<p class="history__date-text">Henter priser...</p>';

    // Hent den nye dags priser og udskift kun indholdet af boksen
    resultat.innerHTML = await historieResult(dato);
  });
}