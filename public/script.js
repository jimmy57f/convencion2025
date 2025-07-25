// Estado de la aplicación
let currentPage = 'grupos';
let selectedGroup = null;
let selectedDay = 0;
let mobileMenuOpen = false;

// Datos
let gruposData = null;
let horariosData = null;
let himnoData = null;

// Iconos SVG
const icons = {
  users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  music: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  menu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  x: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>`,
  crown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18h20l-3-6 3-6-5 3L12 2 7 9l-5-3 3 6-3 6z"/></svg>`,
  user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
  mapPin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  star: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>`
};

// Funciones de utilidad
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getGradientClass(color) {
  const gradientMap = {
    'from-yellow-400 to-orange-500': 'gradient-yellow-orange',
    'from-blue-400 to-purple-500': 'gradient-blue-purple',
    'from-green-400 to-teal-500': 'gradient-green-teal',
    'from-pink-400 to-red-500': 'gradient-pink-red',
    'from-indigo-400 to-blue-600': 'gradient-indigo-blue',
    'from-cyan-400 to-blue-500': 'gradient-cyan-blue'
  };
  return gradientMap[color] || 'gradient-yellow-orange';
}

function getTipoClass(tipo) {
  return `tipo-${tipo}`;
}

// Cargar datos JSON
async function loadData() {
  try {
    const [gruposResponse, horariosResponse, himnoResponse] = await Promise.all([
      fetch('data/grupos.json'),
      fetch('data/horarios.json'),
      fetch('data/himno.json')
    ]);

    gruposData = await gruposResponse.json();
    horariosData = await horariosResponse.json();
    himnoData = await himnoResponse.json();

    renderApp();
  } catch (error) {
    console.error('Error cargando datos:', error);
    document.getElementById('app').innerHTML = `
      <div class="loading">
        <p>Error cargando la aplicación. Por favor, recarga la página.</p>
      </div>
    `;
  }
}

// Renderizar header
function renderHeader() {
  const navItems = [
    { id: 'grupos', label: 'Grupos', icon: 'users' },
    { id: 'horarios', label: 'Horarios', icon: 'calendar' },
    { id: 'himno', label: 'Himno Lema', icon: 'music' }
  ];

  return `
    <header class="header">
      <div class="header-container">
        <div class="logo-section">
          <div class="logo-icon">♪</div>
          <h1 class="logo-text">Convención 2024</h1>
        </div>

        <nav class="nav-desktop">
          ${navItems.map(item => `
            <button 
              class="nav-button ${currentPage === item.id ? 'active' : ''}" 
              onclick="changePage('${item.id}')"
            >
              ${icons[item.icon]}
              <span>${item.label}</span>
            </button>
          `).join('')}
        </nav>

        <button class="menu-toggle" onclick="toggleMobileMenu()">
          ${mobileMenuOpen ? icons.x : icons.menu}
        </button>
      </div>

      ${mobileMenuOpen ? `
        <div class="nav-mobile">
          ${navItems.map(item => `
            <button 
              class="nav-button ${currentPage === item.id ? 'active' : ''}" 
              onclick="changePage('${item.id}'); toggleMobileMenu()"
            >
              ${icons[item.icon]}
              <span>${item.label}</span>
            </button>
          `).join('')}
        </div>
      ` : ''}
    </header>
  `;
}

// Renderizar página de grupos
function renderGruposPage() {
  if (selectedGroup) {
    const grupo = gruposData.grupos.find(g => g.id === selectedGroup);
    return `
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <button class="btn" onclick="selectedGroup = null; renderApp()">
            ${icons.arrowLeft}
            <span>Volver a grupos</span>
          </button>
        </div>

        <div class="card">
          <div class="section-header ${getGradientClass(grupo.color)}">
            <h1>${grupo.nombre}</h1>
          </div>

          <div class="card-content space-y-6">
            <div>
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                ${icons.crown}
                <span>Líderes del Grupo</span>
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${grupo.lideres.map(lider => `
                  <div class="card" style="background: rgba(237, 137, 54, 0.05); border-color: rgba(237, 137, 54, 0.2);">
                    <div class="card-content p-4 flex items-center gap-3">
                      <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(237, 137, 54, 0.2); display: flex; align-items: center; justify-content: center;">
                        ${icons.crown}
                      </div>
                      <span class="font-medium">${lider}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                ${icons.users}
                <span>Miembros del Grupo</span>
                <span class="badge badge-secondary">${grupo.miembros.length}</span>
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                ${grupo.miembros.map(miembro => `
                  <div class="card">
                    <div class="card-content p-4 flex items-center gap-3">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--muted); display: flex; align-items: center; justify-content: center;">
                        ${icons.user}
                      </div>
                      <span class="text-sm font-medium">${miembro.nombre}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold">Grupos de la Convención</h1>
        <p style="color: var(--muted-foreground);">Selecciona un grupo para ver sus líderes y miembros</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${gruposData.grupos.map(grupo => `
          <div class="card cursor-pointer" onclick="selectedGroup = ${grupo.id}; renderApp()">
            <div class="${getGradientClass(grupo.color)} flex items-center justify-center" style="height: 96px; color: white;">
              ${icons.users.replace('width="16" height="16"', 'width="32" height="32"')}
            </div>
            <div class="card-header text-center">
              <h3 class="card-title text-lg">${grupo.nombre}</h3>
              <div class="card-description flex items-center justify-center gap-4">
                <span class="flex items-center gap-1">
                  ${icons.crown}
                  <span>${grupo.lideres.length} líderes</span>
                </span>
                <span class="flex items-center gap-1">
                  ${icons.users}
                  <span>${grupo.miembros.length} miembros</span>
                </span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Renderizar página de horarios
function renderHorariosPage() {
  const selectedSchedule = horariosData.horarios[selectedDay];
  
  return `
    <div class="space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold">Horarios de la Convención</h1>
        <p style="color: var(--muted-foreground);">Selecciona un día para ver las actividades programadas</p>
      </div>

      <div class="flex gap-3 justify-center" style="flex-wrap: wrap;">
        ${horariosData.horarios.map((dia, index) => `
          <button 
            class="btn ${selectedDay === index ? 'btn-primary' : ''}" 
            onclick="selectedDay = ${index}; renderApp()"
            style="min-width: 200px;"
          >
            ${icons.calendar}
            ${dia.nombre}
          </button>
        `).join('')}
      </div>

      <div class="card">
        <div class="section-header">
          <h1>${selectedSchedule.nombre}</h1>
          <p>${formatDate(selectedSchedule.fecha)}</p>
        </div>

        <div class="card-content space-y-4">
          ${selectedSchedule.actividades.map(actividad => `
            <div class="card">
              <div class="card-content p-4">
                <div class="flex justify-between gap-4" style="flex-direction: column;">
                  <div class="space-y-2" style="flex: 1;">
                    <div class="flex items-center gap-3" style="flex-wrap: wrap;">
                      <span class="badge badge-primary" style="font-family: monospace; font-size: 1rem; padding: 0.5rem 0.75rem;">
                        ${actividad.hora}
                      </span>
                      <span class="badge ${getTipoClass(actividad.tipo)}">
                        ${horariosData.tipoIcons[actividad.tipo]} ${actividad.tipo.charAt(0).toUpperCase() + actividad.tipo.slice(1)}
                      </span>
                    </div>
                    
                    <h3 class="text-lg font-semibold">
                      ${actividad.nombre}
                    </h3>
                    
                    <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                      ${actividad.descripcion}
                    </p>
                    
                    <div class="flex items-center gap-1" style="color: var(--muted-foreground); font-size: 0.875rem;">
                      ${icons.mapPin}
                      ${actividad.ubicacion}
                    </div>
                  </div>

                  <div class="text-center">
                    ${icons.clock.replace('width="16" height="16"', 'width="32" height="32"').replace('currentColor', 'var(--primary)')}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card" style="background: var(--muted);">
        <div class="card-header">
          <h3 class="text-lg font-bold">Tipos de Actividades</h3>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            ${Object.entries(horariosData.tipoColors).map(([tipo, className]) => `
              <div class="flex items-center gap-2">
                <span class="badge ${getTipoClass(tipo)}">
                  ${horariosData.tipoIcons[tipo]} ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Renderizar página del himno
function renderHimnoPage() {
  const himno = himnoData.himno;
  
  return `
    <div class="himno-container space-y-6">
      <div class="text-center space-y-4">
        <div class="himno-icon">♪</div>
        <h1 class="text-4xl font-bold">${himno.titulo}</h1>
        <p class="text-xl" style="color: var(--muted-foreground);">${himno.subtitulo}</p>
      </div>

      <div class="card">
        <div class="section-header">
          <h1>${himno.titulo}</h1>
          <p>${himno.subtitulo}</p>
        </div>

        <div class="card-content space-y-6" style="padding: 2rem;">
          ${himno.letra.map((seccion, index) => `
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                ${seccion.estrofa === "Coro" || seccion.estrofa === "Coro Final" ? icons.star : icons.heart}
                <h3 class="text-lg font-semibold" style="color: var(--primary);">
                  ${typeof seccion.estrofa === 'number' ? `Estrofa ${seccion.estrofa}` : seccion.estrofa}
                </h3>
              </div>
              
              <div class="${seccion.estrofa === "Coro" || seccion.estrofa === "Coro Final" ? 'coro-card' : 'estrofa-card'}">
                <div class="space-y-2">
                  ${seccion.versos.map(verso => `
                    <p class="verso ${seccion.estrofa === "Coro" || seccion.estrofa === "Coro Final" ? 'coro-verso' : ''}">
                      ${verso}
                    </p>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}

          <div class="mt-6 pt-6 text-center space-y-2" style="border-top: 1px solid var(--border);">
            <p style="color: var(--muted-foreground);">
              <span class="font-medium">Autor:</span> ${himno.autor}
            </p>
            <p style="color: var(--muted-foreground);">
              <span class="font-medium">Año:</span> ${himno.año}
            </p>
          </div>
        </div>
      </div>

      <div class="card" style="background: rgba(237, 137, 54, 0.1); border-color: rgba(237, 137, 54, 0.3);">
        <div class="card-content text-center">
          <div style="width: 24px; height: 24px; color: var(--primary); margin: 0 auto 0.75rem;">${icons.music}</div>
          <p class="font-medium mb-2" style="color: var(--primary);">
            "Que este himno sea el eco de nuestros corazones unidos en Cristo"
          </p>
          <p class="text-sm" style="color: var(--muted-foreground);">
            Cantemos juntos con gozo y celebremos la unidad en nuestro Salvador
          </p>
        </div>
      </div>
    </div>
  `;
}

// Renderizar página actual
function renderCurrentPage() {
  switch (currentPage) {
    case 'grupos':
      return renderGruposPage();
    case 'horarios':
      return renderHorariosPage();
    case 'himno':
      return renderHimnoPage();
    default:
      return renderGruposPage();
  }
}

// Renderizar aplicación completa
function renderApp() {
  if (!gruposData || !horariosData || !himnoData) {
    document.getElementById('app').innerHTML = `
      <div class="loading">
        <p>Cargando aplicación...</p>
      </div>
    `;
    return;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <main class="main-container">
      <div class="page-transition active">
        ${renderCurrentPage()}
      </div>
    </main>
  `;
}

// Funciones de navegación
function changePage(page) {
  currentPage = page;
  selectedGroup = null;
  selectedDay = 0;
  renderApp();
}

function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  renderApp();
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

// Cerrar menú móvil al hacer click fuera
document.addEventListener('click', (e) => {
  if (mobileMenuOpen && !e.target.closest('.header')) {
    mobileMenuOpen = false;
    renderApp();
  }
});