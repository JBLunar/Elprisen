// Navigationen øverst. Linkene ændrer #hash, og så skifter routeren side
export function navbar() {
  return `
    <header class="navbar">
      <!-- Logoet: et lyn i en cirkel. aria-label fortæller skærmlæsere hvad linket gør -->
      <a href="#lige-nu" class="navbar__logo" aria-label="Elprisen – gå til forsiden">
        <i class="fa-solid fa-bolt" aria-hidden="true"></i>
      </a>

      <!-- Kun synlig på desktop (styres med CSS) -->
      <span class="navbar__title">ELPrisen.nu</span>

      <nav>
        <ul class="navbar__links">
          <li><a href="#oversigt" class="navbar__link">Oversigt</a></li>
          <li><a href="#lige-nu" class="navbar__link">Lige nu</a></li>
          <li><a href="#historik" class="navbar__link">Historik</a></li>
        </ul>
      </nav>

      <!-- Tandhjulet. Ikonet alene giver ingen tekst, derfor aria-label -->
      <a href="#indstillinger" class="navbar__settings" aria-label="Indstillinger">
        <i class="fa-solid fa-gear" aria-hidden="true"></i>
      </a>
    </header>
  `;
}