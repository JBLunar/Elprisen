// Model
import { getSettings } from '../../model/settings.js';
// View
import { navbar } from '../components/navbar.js';
import { infoText } from '../components/infoText.js';
import { frontContent } from './frontPage.js';
import { overviewCircles, overviewContent } from './overviewPage.js';
import { historieContent } from './historiePage.js';
import { settingsModal } from './settingsPage.js';

// Desktop: alle tre sider side om side, + indstillinger som modal
export async function dashboardPage() {
  const { momsOn, region } = getSettings();

  // Promise.all starter ALLE fire på én gang og venter til alle er færdige
  // Resultaterne kommer tilbage i samme rækkefølge som vi sendte dem afsted
  const [front, cirkler, oversigt, historik] = await Promise.all([
    frontContent(),
    overviewCircles(),
    overviewContent(false),  // false = uden cirkler, de sidder i kolonne 1
    historieContent(),
  ]);

  return `
    ${navbar()}
    <main class="dashboard">
      <!-- Kolonne 1: Lige nu + de små cirkler + info-tekst -->
      <div class="dashboard__col">
        ${front}
        ${cirkler}
        ${infoText(momsOn, region)}
      </div>
      <!-- Kolonne 2: Oversigt (kun listen) -->
      <div class="dashboard__col">
        ${oversigt}
      </div>
      <!-- Kolonne 3: Historik -->
      <div class="dashboard__col">
        ${historik}
      </div>
    </main>
    ${settingsModal()}
  `;
}