// Henter elpriser for en bestemt dato og region (DK1 = Vest, DK2 = Øst)
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

// Henter morgendagens priser. Er de ikke udgivet endnu, får vi et tomt array
export async function getTomorrowData(region = 'DK1') {
  // Lav en dato og ryk den én dag frem
  const iMorgen = new Date();
  iMorgen.setDate(iMorgen.getDate() + 1);

  // try/catch: "prøv dette – og hvis det fejler, så gør det i catch i stedet for at crashe"
  try {
    return await getCurrentData(iMorgen, region);
  } catch (fejl) {
    console.log('Morgendagens priser er ikke udgivet endnu');
    return [];
  }
}