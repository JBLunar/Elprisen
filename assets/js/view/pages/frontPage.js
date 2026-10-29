// "../../" = op to mapper (pages/ → view/ → js/), derefter ned i model/
import { getCurrentData } from '../assets/js/model/getCurrentData.js';
// Kun "../" her, fordi components/ ligger inde i view/
import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';

export async function frontPage() {
  const data = await getCurrentData();
  console.log('Forside data:', data);

  return `
    ${navbar()}
    <main>
      ${pageHeading('Elprisen lige nu')}
      <!-- Midlertidig test: vis den første pris i dag -->
      <p>Første pris i dag: ${data[0].DKK_per_kWh} kr</p>
    </main>
  `;
}