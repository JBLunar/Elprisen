// Vi importerer alle sider. "../" = op til js/, derefter ned i view/pages/
import { frontPage } from '../view/pages/frontPage.js';
import { overviewPage } from '../view/pages/overviewPage.js';
import { historiePage } from '../view/pages/historiePage.js';
import { settingsPage } from '../view/pages/settingsPage.js';
import { notFoundPage } from '../view/pages/notFoundPage.js';
import { dashboardPage } from '../view/pages/dashboardPage.js';

// Den samme grænse som i CSS'en: fra 64rem (1024px) og op er det desktop
export const desktopQuery = window.matchMedia('(min-width: 64rem)');

// Et "opslagskort": hvilken hash hører til hvilken side-funktion (mobil)
const routes = {
  '': frontPage,            // ingen hash = forsiden
  '#lige-nu': frontPage,
  '#oversigt': overviewPage,
  '#historik': historiePage,
  '#indstillinger': settingsPage,
};

export async function router() {
  // Læs den nuværende hash fra URL'en, fx "#oversigt"
  const hash = window.location.hash;
  const app = document.querySelector('#app');

  // ----- DESKTOP: vis altid dashboardet -----
  if (desktopQuery.matches) {
    app.innerHTML = await dashboardPage();

    // Klikkede man på tandhjulet? Så åbn indstillinger som modal
    if (hash === '#indstillinger') {
      const modal = document.querySelector('#settings-modal');
      modal.showModal();

      // Når modalen lukkes (✕, Esc), fjern #indstillinger fra URL'en igen
      modal.addEventListener('close', () => {
        window.location.hash = '';
      });
    }

    // Stop her – resten af funktionen er kun til mobil
    return;
  }

  // ----- MOBIL: vis én side ad gangen -----
  // Find siden i opslagskortet. Findes den ikke, bruger vi notFoundPage
  const page = routes[hash] || notFoundPage;
  app.innerHTML = await page();

  // Markér det aktive link i navbaren (ingen hash = forsiden = "Lige nu")
  const aktivHash = hash || '#lige-nu';
  const aktivtLink = document.querySelector(`.navbar__link[href="${aktivHash}"]`);
  aktivtLink?.classList.add('navbar__link--active');
  aktivtLink?.setAttribute('aria-current', 'page');
}