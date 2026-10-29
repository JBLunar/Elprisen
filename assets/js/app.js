// Write cool js hwere

import { router } from './controller/router.js';

// Kør routeren første gang siden indlæses
router();

// Kør routeren igen hver gang #hash i URL'en ændrer sig (når man klikker på et link)
window.addEventListener('hashchange', router);