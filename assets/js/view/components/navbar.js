// Navigationen øverst. Linkene ændrer #hash, og så skifter routeren side
export function navbar() {
  return `
    <nav class="navbar">
      <ul class="navbar__links">
        <li><a href="#oversigt">Oversigt</a></li>
        <li><a href="#lige-nu">Lige nu</a></li>
        <li><a href="#historik">Historik</a></li>
      </ul>
      <!-- Tandhjulet – bliver til et ikon senere -->
      <a href="#indstillinger" class="navbar__settings">Indstillinger</a>
    </nav>
  `;
}