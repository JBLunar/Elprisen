// "../" = op fra controller/ til js/, ned i model/
import { getCurrentData } from '../model/getCurrentData.js';
import { getSettings, saveSetting } from '../model/settings.js';
import { getLowestPrice, addMoms, formatPrice, formatTime } from '../model/priceHelpers.js';

// Hvor ofte der sendes en notifikation: 1 time i millisekunder
// TIP: sæt den midlertidigt til 60 * 1000 (1 minut) når du tester
const INTERVAL = 60 * 60 * 1000;

// Her gemmer vi timerens id, så vi kan stoppe den igen
let timer = null;

// Understøtter browseren overhovedet notifikationer?
function supported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

// Finder dagens laveste pris og sender den som en notifikation
async function sendLowestPrice() {
  const { momsOn, region } = getSettings();

  try {
    const data = await getCurrentData(new Date(), region);

    // Find den laveste pris, og derefter den time den hører til
    const lavest = getLowestPrice(data);
    const time = data.find((item) => item.DKK_per_kWh === lavest);

    const pris = formatPrice(addMoms(lavest, momsOn));
    const tidsrum = `${formatTime(time.time_start)} - ${formatTime(time.time_end)}`;

    // Vent til service workeren er klar, og lad den vise notifikationen
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification('Dagens laveste elpris', {
      body: `${pris} kr pr. kWh kl. ${tidsrum}`,
      icon: './assets/icons/icon-192.png',
      // tag: en ny notifikation ERSTATTER den gamle i stedet for at stable sig op
      tag: 'laveste-pris',
    });
  } catch (fejl) {
    // Fx offline uden gemte priser – så springer vi bare denne time over
    console.log('Kunne ikke sende notifikation:', fejl);
  }
}

// Start: send én med det samme (som bekræftelse), og derefter hver time
function startAlarm() {
  // Stop en evt. gammel timer først, så der aldrig kører to på én gang
  stopAlarm();
  sendLowestPrice();
  timer = setInterval(sendLowestPrice, INTERVAL);
}

// Stop timeren
function stopAlarm() {
  clearInterval(timer);
  timer = null;
}

// Kaldes når brugeren slår "Laveste pris alarm" til eller fra
export async function handleAlarmToggle(on) {
  // Slået fra? Så stop og færdig
  if (!on) {
    stopAlarm();
    return;
  }

  // Kan browseren ikke vise notifikationer, slår vi indstillingen fra igen
  if (!supported()) {
    alert('Din browser understøtter ikke notifikationer.');
    saveSetting('alarmOn', false);
    return;
  }

  // Spørg om tilladelse (browseren viser kun spørgsmålet, hvis den ikke er besvaret før)
  const svar = await Notification.requestPermission();

  if (svar === 'granted') {
    startAlarm();
  } else {
    // Brugeren sagde nej – slå indstillingen fra igen, så toggle'en ikke "lyver"
    alert('Notifikationer er blokeret. Du kan tillade dem i browserens indstillinger.');
    saveSetting('alarmOn', false);
  }
}

// Kaldes når appen starter: var alarmen slået til sidst, så start den igen
export function setupNotifications() {
  const { alarmOn } = getSettings();

  if (alarmOn && supported() && Notification.permission === 'granted') {
    startAlarm();
  }
}