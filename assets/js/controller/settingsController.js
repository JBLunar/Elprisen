// "./" = samme mappe (controller/)
import { router } from './router.js';
// "../" = op til js/, ned i model/
import { saveSetting } from '../model/settings.js';

export function setupSettingsEvents() {
  // Event delegation igen: én lytter på hele dokumentet
  document.addEventListener('change', (event) => {
    const felt = event.target;

    // Har feltet ikke en data-setting? Så er det ikke en indstilling – ignorér det
    if (!felt.dataset.setting) return;

    // Checkbox: brug true/false. Dropdown: brug den valgte værdi ("DK1"/"DK2")
    const vaerdi = felt.type === 'checkbox' ? felt.checked : felt.value;

    // Gem indstillingen under det navn der står i data-setting
    saveSetting(felt.dataset.setting, vaerdi);

    // Tegn siden igen, så alt (fx info-teksten) viser de nye indstillinger
    router();
  });
}