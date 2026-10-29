// "../../" = op fra components/ og view/, ned i model/
import { getRegionName } from '../../model/settings.js';

// Info-teksten i bunden af alle sider
// Teksten ændrer sig efter brugerens indstillinger
export function infoText(momsOn, region) {
  // Vælg tekst afhængigt af om moms er slået til
  const momsTekst = momsOn ? 'inkl. moms, men ex. afgifter' : 'ex. moms og afgifter';

  return `
    <footer class="info-text">
      <!-- <span> gør at vi kan farve netop disse ord grønne med CSS -->
      <p>Priserne er <span class="info-text__highlight">${momsTekst}</span></p>
      <p>Du vises lige nu priserne for <span class="info-text__highlight">${getRegionName(region)}</span></p>
    </footer>
  `;
}