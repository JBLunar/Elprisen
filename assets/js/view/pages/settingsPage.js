// Model
import { getSettings } from '../../model/settings.js';
// View
import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';
import { infoText } from '../components/infoText.js';

// KUN indholdet af Indstillinger – bruges både på mobil-siden og i desktop-modalen
export function settingsContent() {
  // Hent de gemte indstillinger, så felterne viser det rigtige
  const { momsOn, alarmOn, region } = getSettings();

  return `
    <section class="settings">
      ${pageHeading('Indstillinger')}

      <!-- Toggle: priser inkl. moms -->
      <div class="settings__row">
        <label for="setting-moms" class="settings__label">Priser inkl. moms</label>
        <!-- role="switch" fortæller skærmlæsere at det er en tænd/sluk-knap -->
        <input
          type="checkbox"
          role="switch"
          id="setting-moms"
          class="toggle"
          data-setting="momsOn"
          ${momsOn ? 'checked' : ''}
        >
      </div>

      <!-- Toggle: laveste pris alarm (notifikationer – bonus, sidste trin) -->
      <div class="settings__row">
        <label for="setting-alarm" class="settings__label">Laveste pris alarm</label>
        <input
          type="checkbox"
          role="switch"
          id="setting-alarm"
          class="toggle"
          data-setting="alarmOn"
          ${alarmOn ? 'checked' : ''}
        >
      </div>

      <!-- Dropdown: vælg region -->
      <div class="settings__row">
        <label for="setting-region" class="settings__label">Vælg region</label>
        <select id="setting-region" class="settings__select" data-setting="region">
          <option value="DK1" ${region === 'DK1' ? 'selected' : ''}>Region Vest</option>
          <option value="DK2" ${region === 'DK2' ? 'selected' : ''}>Region Øst</option>
        </select>
      </div>
    </section>
  `;
}

// Hele siden på mobil
export async function settingsPage() {
  const { momsOn, region } = getSettings();

  return `
    ${navbar()}
    <main class="page page--settings">
      ${settingsContent()}
    </main>
    ${infoText(momsOn, region)}
  `;
}

// Modalen på desktop – samme indhold, pakket ind i en <dialog>
export function settingsModal() {
  return `
    <dialog id="settings-modal" class="modal" aria-label="Indstillinger">
      <!-- method="dialog" gør at knappen lukker modalen helt uden JavaScript -->
      <form method="dialog">
        <button class="modal__close" aria-label="Luk indstillinger">
          <i class="fa-regular fa-circle-xmark" aria-hidden="true"></i>
        </button>
      </form>
      ${settingsContent()}
    </dialog>
  `;
}