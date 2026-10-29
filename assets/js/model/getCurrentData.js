// Henter elpriser. Hvis man ikke sender dato/region med, bruges standardværdierne
export async function getCurrentData(dato = new Date(), region = 'DK1') {
  const aar = dato.getFullYear();
  // getMonth() starter på 0, derfor +1. padStart gør 5 til "05"
  const maaned = String(dato.getMonth() + 1).padStart(2, '0');
  const dag = String(dato.getDate()).padStart(2, '0');

  const url = `https://www.elprisenligenu.dk/api/v1/prices/${aar}/${maaned}-${dag}_${region}.json`;

  const svar = await fetch(url);

  // Stop hvis serveren svarer med en fejl
  if (!svar.ok) {
    throw new Error('Kunne ikke hente priser: ' + svar.status);
  }

  return await svar.json();
}