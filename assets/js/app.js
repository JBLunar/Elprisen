// Write cool js hwere

import { router, desktopQuery } from './controller/router.js';
import { setupHistoryEvents } from './controller/historyController.js';
import { setupSettingsEvents } from './controller/settingsController.js';

// Kør routeren første gang siden indlæses
router();

// Kør routeren igen hver gang #hash i URL'en ændrer sig
window.addEventListener('hashchange', router);

// Kør routeren igen, når vinduet skifter mellem mobil og desktop
desktopQuery.addEventListener('change', router);

// Start lytterne – KUN én gang hver
setupHistoryEvents();
setupSettingsEvents();