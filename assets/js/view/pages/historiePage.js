// Kun "../" fordi components/ ligger inde i view/ (samme niveau som pages/)
import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';

// Midlertidig version – vi bygger listen og datovælgeren i trin 4
export async function historiePage() {
  return `
    ${navbar()}
    <main>
      ${pageHeading('Historik')}
    </main>
  `;
}