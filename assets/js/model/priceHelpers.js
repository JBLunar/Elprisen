// Laver et tidspunkt fra API'et om til fx "19.00"
export function formatTime(isoString) {
  // new Date() forstår API'ets tidsformat og laver det om til et dato-objekt
  const dato = new Date(isoString);
  // getHours() giver timen som et tal, fx 9. padStart gør det til "09"
  const time = String(dato.getHours()).padStart(2, '0');
  return `${time}.00`;
}

// Runder en pris til 3 decimaler, fx 1.59891 bliver til "1.599"
export function formatPrice(price) {
  // toFixed(3) runder og giver altid præcis 3 decimaler (returnerer tekst)
  return price.toFixed(3);
}

// Lægger 25% moms til prisen, hvis moms er slået til
export function addMoms(price, momsOn) {
  // "? :" er en kort if/else: hvis momsOn er true, gang med 1.25, ellers returnér prisen som den er
  return momsOn ? price * 1.25 : price;
}

// Finder den pris i arrayet der passer til det nuværende tidspunkt
export function getCurrentPrice(data) {
  const nu = new Date();

  // find() gennemgår arrayet og returnerer det FØRSTE element hvor betingelsen er sand
  return data.find((item) => {
    const start = new Date(item.time_start);
    const slut = new Date(item.time_end);
    // Er "nu" efter starten OG før slutningen?
    return nu >= start && nu < slut;
  });
}

// Finder den laveste pris på dagen
export function getLowestPrice(data) {
  // map() laver et nyt array med KUN priserne: [1.59, 1.42, 0.98, ...]
  const priser = data.map((item) => item.DKK_per_kWh);
  // "..." (spread) pakker arrayet ud, så Math.min får hvert tal for sig
  return Math.min(...priser);
}

// Finder den højeste pris på dagen – samme idé som ovenfor
export function getHighestPrice(data) {
  const priser = data.map((item) => item.DKK_per_kWh);
  return Math.max(...priser);
}

// Fjerner de timer der allerede er overstået – tilbage er "nu" og fremtiden
export function getUpcomingPrices(data) {
  const nu = new Date();
  // filter() beholder kun de elementer hvor betingelsen er sand
  return data.filter((item) => new Date(item.time_end) > nu);
}

// ----- Dato-hjælpere til Historik -----

// Date-objekt → "29-10-2026" (formatet fra designet)
export function formatDateDK(dato) {
  const dag = String(dato.getDate()).padStart(2, '0');
  const maaned = String(dato.getMonth() + 1).padStart(2, '0');
  return `${dag}-${maaned}-${dato.getFullYear()}`;
}

// Date-objekt → "2026-10-29" (formatet som <input type="date"> kræver)
export function toInputValue(dato) {
  const dag = String(dato.getDate()).padStart(2, '0');
  const maaned = String(dato.getMonth() + 1).padStart(2, '0');
  return `${dato.getFullYear()}-${maaned}-${dag}`;
}

// "2026-10-29" fra datofeltet → Date-objekt
export function parseInputDate(value) {
  // split('-') deler teksten ved bindestregerne: ["2026", "10", "29"]
  const [aar, maaned, dag] = value.split('-');
  // new Date(år, måned, dag) – måned starter på 0, derfor -1
  return new Date(aar, maaned - 1, dag);
}

// ----- Prisfarver (bonus) -----

// De 8 farver fra designet, fra billigst (grøn) til dyrest (rød)
const PRIS_FARVER = [
  '#00FF29', '#33FF00', '#B8FF22', '#EDFF23',
  '#FFD645', '#FF8717', '#FF7A00', '#FF4D00',
];

// Giver en farve ud fra hvor prisen ligger mellem dagens laveste og højeste pris
export function getPriceColor(price, min, max) {
  // Er alle priser ens, kan vi ikke dele med 0 – så er alt "billigt"
  if (max === min) return PRIS_FARVER[0];

  // Hvor langt oppe ligger prisen? 0 = laveste, 1 = højeste
  let andel = (price - min) / (max - min);

  // Hold andelen mellem 0 og 1 (fx hvis morgendagens pris er højere end dagens højeste)
  andel = Math.min(Math.max(andel, 0), 1);

  // Lav andelen om til en plads i listen (0–7) og rund til nærmeste hele tal
  const index = Math.round(andel * (PRIS_FARVER.length - 1));
  return PRIS_FARVER[index];
}