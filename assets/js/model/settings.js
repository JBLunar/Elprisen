// Navnet vi gemmer indstillingerne under i localStorage
const STORAGE_KEY = 'elprisen-settings';

// Standardværdier – bruges første gang, før brugeren har ændret noget
const DEFAULTS = {
  momsOn: false,   // true = vis priser inkl. moms
  alarmOn: false,  // true = send notifikation med laveste pris (bonus, sidste trin)
  region: 'DK1',   // 'DK1' = Vestdanmark, 'DK2' = Østdanmark
};

// Henter brugerens indstillinger fra localStorage
export function getSettings() {
  try {
    // Læs den gemte tekst. Findes den ikke, får vi null
    const gemt = localStorage.getItem(STORAGE_KEY);

    // Intet gemt endnu? Så brug standardværdierne
    if (!gemt) return { ...DEFAULTS };

    // Lav teksten om til et objekt, og flet det sammen med standardværdierne
    return { ...DEFAULTS, ...JSON.parse(gemt) };
  } catch (fejl) {
    // Hvis localStorage er blokeret eller teksten er ødelagt, brug standardværdierne
    return { ...DEFAULTS };
  }
}

// Gemmer ÉN indstilling, fx saveSetting('momsOn', true)
export function saveSetting(navn, vaerdi) {
  // Hent alle de nuværende indstillinger
  const settings = getSettings();

  // Ændr kun den ene indstilling
  settings[navn] = vaerdi;

  try {
    // Lav objektet om til tekst og gem det
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (fejl) {
    console.log('Kunne ikke gemme indstillingen');
  }
}

// Laver regionskoden om til tekst brugeren forstår
export function getRegionName(region) {
  return region === 'DK1' ? 'Vest Danmark' : 'Øst Danmark';
}