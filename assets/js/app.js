// Write cool js hwere


import { router, desktopQuery } from './controller/router.js';
import { setupHistoryEvents } from './controller/historyController.js';
import { setupSettingsEvents } from './controller/settingsController.js';
import { setupNotifications } from './controller/notificationController.js';

// Kør routeren første gang siden indlæses
router();

// Kør routeren igen hver gang #hash i URL'en ændrer sig
window.addEventListener('hashchange', router);

// Kør routeren igen, når vinduet skifter mellem mobil og desktop
desktopQuery.addEventListener('change', router);

// Start lytterne – KUN én gang hver
setupHistoryEvents();
setupSettingsEvents();
setupNotifications();
// Registrér service workeren – kun hvis browseren understøtter det
if ('serviceWorker' in navigator) {
  // Stien er i forhold til index.html, derfor "./sw.js"
  navigator.serviceWorker
    .register('./sw.js')
    .then(() => console.log('Service worker registreret'))
    .catch((fejl) => console.log('Service worker fejlede:', fejl));
}

// Var alarmen slået til, da appen sidst var åben? Så start den igen
setupNotifications();