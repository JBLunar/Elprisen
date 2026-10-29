import { navbar } from '../components/navbar.js';
import { pageHeading } from '../components/pageHeading.js';

// Midlertidig version – vi bygger indholdet i trin 4
export async function overviewPage() {
  return `
    ${navbar()}
    <main>${pageHeading('Oversigt')}</main>
  `;
}