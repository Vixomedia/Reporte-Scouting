/* ═══════════════════════════════════════════
   VIXOMEDIA — index.js
   ═══════════════════════════════════════════ */

/* ── Firmas ─────────────────────────────────── */
const firmas = [
  { canvasId: 'canvas2', wrapperId: 'wrapper2', estadoId: 'estado2' },
];

firmas.forEach(({ canvasId, wrapperId, estadoId }) => {
  iniciarFirma(canvasId, wrapperId, estadoId);
});

function iniciarFirma(canvasId, wrapperId, estadoId) {

  const canvas = document.getElementById(canvasId);

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function ajustarTamano() {

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Guardar dibujo actual
    const temp = document.createElement('canvas');
    temp.width = canvas.width;
    temp.height = canvas.height;

    const tempCtx = temp.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    // Resetear transformaciones
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Restaurar dibujo
    ctx.drawImage(temp, 0, 0, rect.width, rect.height);
  }

  ajustarTamano();

  window.addEventListener('resize', ajustarTamano);

  let dibujando = false;

  function getPos(e) {

    const rect = canvas.getBoundingClientRect();

    const src = e.touches ? e.touches[0] : e;

    return {
      x: src.clientX - rect.left,
      y: src.clientY - rect.top
    };
  }

  function iniciar(e) {

    e.preventDefault();

    dibujando = true;

    const { x, y } = getPos(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function dibujar(e) {

    if (!dibujando) return;

    e.preventDefault();

    const { x, y } = getPos(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function terminar() {
    dibujando = false;
  }

  // Mouse
  canvas.addEventListener('mousedown', iniciar);
  canvas.addEventListener('mousemove', dibujar);
  canvas.addEventListener('mouseup', terminar);
  canvas.addEventListener('mouseleave', terminar);

  // Touch
  canvas.addEventListener('touchstart', iniciar, { passive: false });
  canvas.addEventListener('touchmove', dibujar, { passive: false });
  canvas.addEventListener('touchend', terminar);
}

/* ── Limpiar canvas ──────────────────────────── */
function limpiar(canvasId, wrapperId, estadoId) {
  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById(wrapperId).classList.remove('signed');
}

/* ── Descargar firma ─────────────────────────── */
function descargar(canvasId, nombre) {
  const canvas = document.getElementById(canvasId);
  const link   = document.createElement('a');
  link.download = nombre + '.png';
  link.href     = canvas.toDataURL('image/png');
  link.click();
}

/* ── Fotos ───────────────────────────────────── */
function mostrarFotos(input) {
  const preview = document.getElementById('fotoPreview');
  preview.innerHTML = '';

  if (!input.files) return;

  Array.from(input.files).forEach((file, index) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const container = document.createElement('div');
      container.className = 'foto-card';
      container.innerHTML = `
        <img src="${reader.result}" alt="${file.name}">
        <p>${file.name}</p>
        <input
          type="text"
          id="descripcion_${index}"
          name="descripcion_${index}"
          class="w3-input"
          placeholder="Descripción de la foto ${index + 1}"
        >
      `;
      preview.appendChild(container);
    };
    reader.readAsDataURL(file);
  });
}

/* ── Agregar técnico ─────────────────────────── */
function tenicos() {
  const filaBoton = document.getElementById('fila-tecnicos');

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td colspan="3"></td>
    <td class="label-cell">Técnico:</td>
    <td>
      <div class="fila-accion">
        <textarea class="w3-input" rows="2" placeholder="Técnicos..."></textarea>
        <button class="w3-button w3-red w3-round" onclick="this.closest('tr').remove()" title="Eliminar">✕</button>
      </div>
    </td>
  `;
  filaBoton.parentNode.insertBefore(nuevaFila, filaBoton);
}

/* ── Agregar descripción ─────────────────────── */
function descripcion() {
  const filaBoton = document.getElementById('fila-descripcion');

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>
      <div class="fila-accion">
        <textarea class="w3-input" rows="3" placeholder="Descripción del trabajo..."></textarea>
        <button class="w3-button w3-red w3-round" onclick="this.closest('tr').remove()" title="Eliminar">✕</button>
      </div>
    </td>
  `;
  filaBoton.parentNode.insertBefore(nuevaFila, filaBoton);
}

/* ── Agregar materiales ──────────────────────── */
function materiales() {
  const filaBoton = document.getElementById('fila-materiales');

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td><input class="w3-input" type="number" min="0" placeholder="0" style="width:60px;min-width:50px;"></td>
    <td><input class="w3-input" type="text"   placeholder="Servicio o equipo"></td>
    <td><input class="w3-input" type="text"   placeholder="Marca"></td>
    <td><input class="w3-input" type="text"   placeholder="Modelo"></td>
    <td>
      <div class="fila-accion">
        <input class="w3-input" type="text" placeholder="Área de instalación">
        <button class="w3-button w3-red w3-round" onclick="this.closest('tr').remove()" title="Eliminar">✕</button>
      </div>
    </td>
  `;
  filaBoton.parentNode.insertBefore(nuevaFila, filaBoton);
}

/* ── Agregar mano de obra ────────────────────── */
function manoObra() {
  const filaBoton = document.getElementById('fila-mano-obra');

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td><input class="w3-input" type="number" min="0" placeholder="0"  style="width:60px;min-width:50px;"></td>
    <td><input class="w3-input" type="text"   placeholder="Días"></td>
    <td><input class="w3-input" type="text"   placeholder="Diurno / Nocturno"></td>
    <td><input class="w3-input" type="number" placeholder="$ Misc."></td>
    <td><input class="w3-input" type="text"   placeholder="Área"></td>
    <td>
      <div class="fila-accion">
        <input class="w3-input" type="text" placeholder="Caseta, gasolina...">
        <button class="w3-button w3-red w3-round" onclick="this.closest('tr').remove()" title="Eliminar">✕</button>
      </div>
    </td>
  `;
  filaBoton.parentNode.insertBefore(nuevaFila, filaBoton);
}

/* ── Agregar misceláneos ─────────────────────── */
function miscelaneos() {
  const filaBoton = document.getElementById('fila-miscelaneos');

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td><input class="w3-input" type="text" placeholder="Concepto..."></td>
    <td>
      <div class="fila-accion">
        <textarea class="w3-input" rows="2" placeholder="Descripción detallada..."></textarea>
        <button class="w3-button w3-red w3-round" onclick="this.closest('tr').remove()" title="Eliminar">✕</button>
      </div>
    </td>
  `;
  filaBoton.parentNode.insertBefore(nuevaFila, filaBoton);
}

/* ── Imprimir / Descargar PDF ────────────────── */
function imprimir() {
  const valores = [];
  document.querySelectorAll('input, textarea').forEach(el => {
    valores.push({ el, value: el.value });
  });

  const campo1   = document.getElementById('num-reporte')?.value.trim() || '';
  const fechaRaw = document.getElementById('fecha_llenado')?.value || '';
  const campo3   = fechaRaw ? fechaRaw.split('-').reverse().join('-') : '';

  const partes       = [campo1, campo3].filter(Boolean);
  const nombreArchivo = partes.length > 0
    ? partes.join('_').replace(/\s+/g, '_')
    : 'Reporte_Vixomedia';

  const tituloOriginal = document.title;
  document.title = nombreArchivo;

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.title = tituloOriginal;
      valores.forEach(({ el, value }) => { el.value = value; });
    }, 1000);
  }, 200);
}
