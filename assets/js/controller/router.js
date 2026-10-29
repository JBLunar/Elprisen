// Vi importerer alle sider. "../" = op til js/, derefter ned i view/pages/
import { frontPage } from '../view/pages/frontPage.js';
import { overviewPage } from '../view/pages/overviewPage.js';
import { historiePage } from '../view/pages/historiePage.js';
import { notFoundPage } from '../view/pages/notFoundPage.js';

// Et "opslagskort": hvilken hash hører til hvilken side-funktion
const routes = {
  '': frontPage,            // ingen hash = forsiden
  '#lige-nu': frontPage,
  '#oversigt': overviewPage,
  '#historik': historiePage,
};

export async function router() {
  // Læs den nuværende hash fra URL'en, fx "#oversigt"
  const hash = window.location.hash;

  // Find siden i opslagskortet. Findes den ikke, bruger vi notFoundPage
  const page = routes[hash] || notFoundPage;

  // Kald side-funktionen, vent på HTML'en, og sæt den ind i #app
  document.querySelector('#app').innerHTML = await page();
}