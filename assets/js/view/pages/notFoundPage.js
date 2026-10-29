import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';

// Vises når routeren ikke kan finde en side der passer til #hash'en
export async function notFoundPage() {
  return `
    ${navbar()}
    <main>
      ${pageHeading('Siden findes ikke')}
      <!-- Link tilbage til forsiden -->
      <p><a href="#lige-nu">Gå til forsiden</a></p>
    </main>
  `;
}