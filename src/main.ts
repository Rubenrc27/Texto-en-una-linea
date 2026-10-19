import './style.css';
import { convertText, type ConvertOptions } from './converter';

// Referencias a los elementos del DOM
const entrada = document.getElementById('entrada') as HTMLTextAreaElement;
const salida = document.getElementById('salida') as HTMLTextAreaElement;
const sepSelect = document.getElementById('sep') as HTMLSelectElement;
const customSepInput = document.getElementById('otro') as HTMLInputElement;
const customSepGroup = document.getElementById('custom-sep-group') as HTMLElement;
const espaciosCheck = document.getElementById('espacios') as HTMLInputElement;
const vaciasCheck = document.getElementById('vacias') as HTMLInputElement;
const recortarCheck = document.getElementById('recortar') as HTMLInputElement;

const statsEntrada = document.getElementById('stats-entrada') as HTMLElement;
const statsSalida = document.getElementById('stats-salida') as HTMLElement;

const btnCopiar = document.getElementById('copiar') as HTMLButtonElement;
const btnLimpiar = document.getElementById('limpiar') as HTMLButtonElement;
const btnSwap = document.getElementById('intercambiar') as HTMLButtonElement;
const btnEjemplo = document.getElementById('ejemplo') as HTMLButtonElement;
const btnTheme = document.getElementById('theme-toggle') as HTMLButtonElement;

// Helper para guardar / cargar preferencias
const STORAGE_KEY_THEME = 'texto_en_linea_theme';
const STORAGE_KEY_OPTIONS = 'texto_en_linea_opts';

interface StoredOptions {
  separator: string;
  customSeparator: string;
  removeSpaces: boolean;
  trimLines: boolean;
  ignoreEmptyLines: boolean;
}

function loadSavedOptions(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OPTIONS);
    if (raw) {
      const opts: Partial<StoredOptions> = JSON.parse(raw);
      if (opts.separator !== undefined) sepSelect.value = opts.separator;
      if (opts.customSeparator !== undefined) customSepInput.value = opts.customSeparator;
      if (opts.removeSpaces !== undefined) espaciosCheck.checked = opts.removeSpaces;
      if (opts.trimLines !== undefined) recortarCheck.checked = opts.trimLines;
      if (opts.ignoreEmptyLines !== undefined) vaciasCheck.checked = opts.ignoreEmptyLines;
    }
  } catch {
    // Si falla el parseo, se usan los valores por defecto del HTML
  }
}

function saveOptions(opts: ConvertOptions): void {
  try {
    const data: StoredOptions = {
      separator: opts.separator,
      customSeparator: opts.customSeparator ?? '',
      removeSpaces: opts.removeSpaces,
      trimLines: opts.trimLines,
      ignoreEmptyLines: opts.ignoreEmptyLines,
    };
    localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(data));
  } catch {
    // localStorage puede fallar en entornos restrictivos
  }
}

function getOptions(): ConvertOptions {
  return {
    separator: sepSelect.value,
    customSeparator: customSepInput.value,
    removeSpaces: espaciosCheck.checked,
    trimLines: recortarCheck.checked,
    ignoreEmptyLines: vaciasCheck.checked,
  };
}

function updateConverter(): void {
  const isCustom = sepSelect.value === '__otro';
  if (customSepGroup) {
    customSepGroup.style.display = isCustom ? 'inline-flex' : 'none';
  }

  const options = getOptions();
  saveOptions(options);

  const result = convertText(entrada.value, options);
  salida.value = result.text;

  // Actualizar estadísticas de entrada
  const inLines = result.stats.inputLines;
  const inChars = result.stats.inputChars;
  statsEntrada.textContent = `${inLines} ${inLines === 1 ? 'línea' : 'líneas'} • ${inChars} car.`;

  // Actualizar estadísticas de salida
  const outChars = result.stats.outputChars;
  const outWords = result.stats.outputWords;
  statsSalida.textContent = `${outChars} ${outChars === 1 ? 'carácter' : 'caracteres'} • ${outWords} ${outWords === 1 ? 'palabra' : 'palabras'}`;
}

// Retroalimentación visual al copiar
let copyTimeout: number | undefined;

function showCopiedFeedback(): void {
  const originalHtml = btnCopiar.innerHTML;
  btnCopiar.classList.add('copied');
  btnCopiar.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>¡Copiado!</span>
  `;

  if (copyTimeout) window.clearTimeout(copyTimeout);
  copyTimeout = window.setTimeout(() => {
    btnCopiar.classList.remove('copied');
    btnCopiar.innerHTML = originalHtml;
  }, 1800);
}

// Copiar al portapapeles con fallback robusto
async function copyToClipboard(): Promise<void> {
  const text = salida.value;
  if (!text) return;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      showCopiedFeedback();
      return;
    } catch {
      // Si falla la API moderna, intenta el fallback
    }
  }

  // Fallback para navegadores antiguos o contextos no seguros
  salida.focus();
  salida.select();
  try {
    const success = document.execCommand('copy');
    if (success) {
      showCopiedFeedback();
    }
  } catch (err) {
    console.error('Error al copiar:', err);
  }
}

// Ejemplo de texto para probar rápido
const SAMPLE_TEXT = `El Principito
Antoine de Saint-Exupéry

"He aquí mi secreto.
Es muy simple:
no se ve bien sino con el corazón.
Lo esencial es invisible a los ojos."`;

function loadSample(): void {
  entrada.value = SAMPLE_TEXT;
  updateConverter();
  entrada.focus();
}

function clearAll(): void {
  entrada.value = '';
  updateConverter();
  entrada.focus();
}

function swapText(): void {
  if (!salida.value) return;
  entrada.value = salida.value;
  updateConverter();
  entrada.focus();
}

// Manejo de temas (Oscuro / Claro)
function initTheme(): void {
  const saved = localStorage.getItem(STORAGE_KEY_THEME);
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    // Seguir preferencia del sistema operativo
    document.documentElement.removeAttribute('data-theme');
  }
  updateThemeButtonIcon();
}

function toggleTheme(): void {
  const current = document.documentElement.getAttribute('data-theme');
  let next = 'dark';

  if (current === 'dark') {
    next = 'light';
  } else if (current === 'light') {
    next = 'dark';
  } else {
    // Si no está seteado explícitamente, alternar respecto al prefers-color-scheme actual
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    next = prefersDark ? 'light' : 'dark';
  }

  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(STORAGE_KEY_THEME, next);
  } catch {
    // Ignorar si localStorage está deshabilitado
  }
  updateThemeButtonIcon();
}

function updateThemeButtonIcon(): void {
  const current = document.documentElement.getAttribute('data-theme');
  const isDark =
    current === 'dark' ||
    (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    // Icono de sol (para cambiar a modo claro)
    btnTheme.setAttribute('aria-label', 'Cambiar a modo claro');
    btnTheme.title = 'Cambiar a modo claro';
    btnTheme.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    // Icono de luna (para cambiar a modo oscuro)
    btnTheme.setAttribute('aria-label', 'Cambiar a modo oscuro');
    btnTheme.title = 'Cambiar a modo oscuro';
    btnTheme.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

// Inicialización de Eventos
function initEvents(): void {
  // Entradas y controles
  const inputsToListen = [entrada, sepSelect, customSepInput, espaciosCheck, vaciasCheck, recortarCheck];
  inputsToListen.forEach(elem => {
    elem.addEventListener('input', updateConverter);
    elem.addEventListener('change', updateConverter);
  });

  // Botones
  btnCopiar.addEventListener('click', copyToClipboard);
  btnLimpiar.addEventListener('click', clearAll);
  btnSwap.addEventListener('click', swapText);
  btnEjemplo.addEventListener('click', loadSample);
  btnTheme.addEventListener('click', toggleTheme);

  // Atajos de teclado útiles
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    // Ctrl+Enter o Cmd+Enter: Copiar resultado
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      copyToClipboard();
    }
  });

  // Escuchar cambios en la preferencia del sistema operativo si no se fijó tema manual
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem(STORAGE_KEY_THEME)) {
      updateThemeButtonIcon();
    }
  });
}

// Arranque
loadSavedOptions();
initTheme();
initEvents();
updateConverter();
