/* Yo Reparo Corrientes — orientación preliminar por síntomas.
   Los únicos precios publicados son los confirmados por el negocio para aire acondicionado.
   La detección de síntomas de esta versión es orientativa y local; no sustituye una IA conectada ni un diagnóstico profesional. */
const WHATSAPP_NUMBER = "3794272383"; // Confirmar que sea el número comercial correcto.
const FIXED_PRICES = {
  aire: { instalacion: 150000, desinstalacion: 100000 }
};
const SERVICES = {
  aire: { label: "Aire acondicionado", tasks: [["diagnostico","Revisión / diagnóstico"],["limpieza","Limpieza y mantenimiento"],["instalacion","Instalación"],["desinstalacion","Desinstalación"],["reparacion","Reparación de falla"]] },
  electro: { label: "Electrodomésticos", tasks: [["diagnostico","Revisión / diagnóstico"],["mantenimiento","Mantenimiento preventivo"],["reparacion","Reparación"]] },
  plomeria: { label: "Plomería", tasks: [["diagnostico","Revisión de problema"],["perdida","Reparación de pérdida"],["instalacion","Instalación / recambio"],["destapacion","Destapación"]] },
  herreria: { label: "Herrería", tasks: [["reparacion","Reparación metálica"],["fabricacion","Fabricación a medida"],["instalacion","Instalación / colocación"]] },
  celular: { label: "Servicio técnico de celulares", tasks: [["diagnostico","Diagnóstico del equipo"],["pantalla","Cambio de pantalla"],["carga","Falla de carga / pin"],["mantenimiento","Mantenimiento de software o equipo"]] },
  termotanque: { label: "Termotanque / gas", tasks: [["diagnostico","Revisión / diagnóstico"],["mantenimiento","Mantenimiento"],["instalacion","Instalación"]] },
  pintura: { label: "Pintura", tasks: [["ambiente","Pintura de ambiente"],["superficie","Pintura por superficie"],["reparacion","Preparación / reparación de pared"]] },
  otro: { label: "Otro servicio", tasks: [["consulta","Consulta general"]] }
};
const $ = (selector) => document.querySelector(selector);
function money(value) { return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value); }
function openWhatsApp(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number === "0000000000") { alert("Falta configurar el número de WhatsApp comercial en script.js."); return; }
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}
function symptomGuidance(category, task, rawDescription) {
  const text = rawDescription.toLocaleLowerCase("es-AR");
  const suggestions = [];
  const add = (possible, recommendation) => suggestions.push({ possible, recommendation });
  const has = (...words) => words.some(word => text.includes(word));

  if (category === "aire") {
    if (has("no enfría", "no enfria", "tira aire caliente", "no calienta", "poco frío", "poco frio")) add("Filtro sucio, falta de mantenimiento, configuración incorrecta o un problema en el circuito de refrigeración.", "Verificá el modo y la temperatura del control y, si es accesible sin desmontar el equipo, observá si el filtro necesita limpieza según el manual. No manipules cañerías ni refrigerante.");
    if (has("pierde agua", "gotea", "agua adentro", "chorrea")) add("Desagüe obstruido, bandeja con suciedad o drenaje mal colocado; requiere revisión para confirmar.", "Apagá el equipo si el agua alcanza enchufes o componentes eléctricos y solicitá una revisión.");
    if (has("no prende", "no enciende", "no arranca", "no funciona")) add("Puede tratarse de alimentación eléctrica, pilas del control, configuración o una falla interna.", "Comprobá el control remoto y que el suministro del ambiente funcione de forma segura. No abras la unidad ni manipules el cableado.");
    if (has("hace ruido", "ruido", "vibra", "golpea")) add("Puede haber vibración de soportes, piezas flojas, suciedad o un problema en el ventilador.", "Apagalo si el ruido es fuerte, aparece de golpe o hay olor a quemado; pedí una inspección técnica.");
    if (has("hielo", "congel", "escarcha")) add("Filtro obstruido, circulación de aire insuficiente o un problema del sistema de refrigeración.", "Apagá el equipo y dejá que se descongele naturalmente. No retires el hielo con herramientas ni manipules el circuito.");
  } else if (category === "electro") {
    if (has("no prende", "no enciende", "no arranca", "no funciona")) add("Puede deberse al suministro eléctrico, cable, interruptor, protección interna o una pieza averiada.", "Desenchufá el equipo antes de revisarlo externamente. Si hay olor a quemado, chispas o cable dañado, no lo uses.");
    if (has("pierde agua", "gotea", "fuga")) add("Puede haber una manguera, junta, conexión o sello deteriorado, según el aparato.", "Cortá el suministro de agua y desconectá el equipo solo si es seguro; evitá usarlo hasta revisarlo.");
    if (has("no enfría", "no enfria", "no calienta", "calienta poco")) add("Podría haber un problema de configuración, ventilación, sensor o componente de calentamiento/refrigeración.", "Anotá el modelo y cualquier código de error. No desmontes el aparato para buscar la falla.");
    if (has("hace ruido", "vibra", "golpea")) add("Puede estar desnivelado, tener un objeto suelto o presentar desgaste en alguna pieza móvil.", "Apagalo y revisá únicamente que esté estable y que no haya objetos externos obstruyéndolo.");
  } else if (category === "plomeria") {
    if (has("pérdida", "perdida", "pierde agua", "gotea", "humedad", "filtración", "filtracion")) add("Posible junta gastada, conexión floja, grifería deteriorada o pérdida en una cañería; la ubicación exacta requiere inspección.", "Si podés hacerlo sin riesgo, cerrá la llave de paso correspondiente y mantené el agua lejos de enchufes. Si la pérdida es importante, pedí asistencia pronto.");
    if (has("tapado", "tapada", "destapar", "desagüe", "desague", "drena lento", "no traga")) add("Puede haber acumulación de residuos u obstrucción en el sifón o la cañería.", "Evitá mezclar productos químicos destapacañerías. Indicá qué artefacto está afectado y desde cuándo.");
    if (has("poca presión", "poca presion", "sin presión", "sin presion")) add("Podría haber una obstrucción, aire en la instalación, una llave parcialmente cerrada o un problema de suministro.", "Consultá si sucede en un solo artefacto o en toda la vivienda; ese dato ayuda a orientar la revisión.");
  } else if (category === "herreria") {
    if (has("óxido", "oxido", "oxidado", "oxidada")) add("Puede haber corrosión superficial o pérdida de material en la pieza metálica.", "Evitá cargar peso sobre la pieza si está debilitada. Una foto y las medidas ayudan a evaluar el trabajo.");
    if (has("no cierra", "trabada", "se traba", "bisagra", "reja", "portón", "porton", "puerta")) add("Puede haber desalineación, bisagras desgastadas, deformación o un cierre deteriorado.", "No fuerces el mecanismo si puede desprenderse o caer. Indicá el tipo de pieza, medidas aproximadas y material si lo conocés.");
    if (has("rota", "roto", "quebrada", "rajada", "soldadura")) add("Puede requerir soldadura, refuerzo o reemplazo parcial, dependiendo del material y de la carga que soporte.", "No uses una estructura dañada para sostener peso hasta que un profesional evalúe su seguridad.");
  } else if (category === "celular") {
    if (has("no carga", "no carga", "pin de carga", "cargar", "carga lento")) add("Posible cable o cargador defectuoso, suciedad en el puerto, desgaste del conector o batería degradada.", "Probá un cable y cargador compatibles que sepas que funcionan. No introduzcas objetos metálicos ni líquidos en el puerto.");
    if (has("batería", "bateria", "se descarga", "se apaga", "hinchada")) add("Puede haber desgaste de batería, consumo elevado de una aplicación o una falla de alimentación. Una batería hinchada necesita atención urgente.", "Si la batería está hinchada, el equipo se calienta demasiado o desprende olor, dejá de usarlo y cargarlo; no presiones ni perfores la batería.");
    if (has("pantalla", "vidrio", "display", "táctil", "tactil", "manchas", "líneas", "lineas")) add("Puede haber daño en el vidrio, panel de pantalla o conexión interna, incluso si el táctil todavía responde.", "Evitá presionar la pantalla rota y hacé una copia de seguridad si el teléfono todavía funciona.");
    if (has("mojado", "agua", "humedad", "se mojó", "se mojo")) add("La humedad puede causar corrosión o cortocircuitos, aunque el teléfono parezca funcionar.", "Apagalo, no lo cargues y no uses calor para secarlo. Llevá el equipo a revisión cuanto antes.");
    if (has("lento", "se traba", "se cuelga", "reinicia", "reiniciándose", "reiniciandose")) add("Podría relacionarse con poco espacio, una aplicación, el sistema operativo o una falla de batería/almacenamiento.", "Si es posible, respaldá tus datos y anotá cuándo sucede. No compartas contraseñas ni códigos de desbloqueo por WhatsApp.");
  } else if (category === "termotanque") {
    if (has("no calienta", "agua fría", "agua fria", "no enciende", "no prende")) add("La causa depende del tipo de equipo: podría involucrar alimentación, termostato, resistencia o sistema de encendido.", "No retires tapas ni manipules conexiones eléctricas o de gas. Coordiná una revisión profesional; los trabajos de gas requieren un gasista matriculado cuando corresponda.");
    if (has("pierde agua", "gotea", "fuga")) add("Puede haber una conexión, válvula o tanque con pérdida; la gravedad depende del punto de origen.", "Si hay agua cerca de componentes eléctricos, no los toques. Cerrá el suministro solo si es seguro y pedí asistencia.");
    if (has("olor a gas", "huele a gas", "pérdida de gas", "perdida de gas")) add("El olor puede indicar una fuga de gas y debe tratarse como una emergencia potencial.", "No enciendas llamas ni interruptores, no uses el teléfono dentro del lugar, salí a un sitio seguro y contactá desde afuera al servicio de emergencias o proveedor de gas de tu zona. No intentes repararlo.");
  } else if (category === "pintura") {
    if (has("humedad", "moho", "hongos", "se descascara", "descascarada", "ampollas")) add("La pintura puede estar afectada por humedad, filtración, preparación insuficiente o incompatibilidad de materiales.", "Conviene identificar y resolver la causa de la humedad antes de pintar; pintar encima puede ocultar el problema temporalmente.");
    if (has("grieta", "rajadura", "fisura")) add("Puede ser una fisura superficial de pintura/revoque o una grieta que requiera evaluación según tamaño y evolución.", "Tomá una foto y anotá si crece o reaparece. Si es grande, progresiva o atraviesa la pared, pedí una evaluación antes de cubrirla.");
  }
  if (!suggestions.length) {
    suggestions.push({ possible: "Con la descripción actual no es posible acotar una causa concreta. Puede haber varias causas distintas para un mismo síntoma.", recommendation: "Contá cuándo empezó, qué sucede justo antes de la falla, si ocurre siempre o a veces, y si aparece algún código, ruido, olor o pérdida. Si podés, adjuntá fotos por WhatsApp sin incluir datos personales." });
  }
  return suggestions;
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character])); }
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = $("#menu-toggle"); const navLinks = $("#nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => { const open = navLinks.classList.toggle("open"); menuToggle.setAttribute("aria-expanded", String(open)); menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú"); menuToggle.textContent = open ? "✕" : "☰"; });
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { navLinks.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); menuToggle.textContent = "☰"; }));
  }
  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();
  const category = $("#category"); const task = $("#task"); const form = $("#estimate-form"); const result = $("#estimate-result");
  function setCategory(value) {
    category.value = value; task.innerHTML = '<option value="">Seleccioná el tipo de trabajo</option>';
    (SERVICES[value]?.tasks || []).forEach(([key,label]) => { const option = document.createElement("option"); option.value = key; option.textContent = label; task.appendChild(option); });
    task.disabled = !value; if (result) result.hidden = true;
  }
  category.addEventListener("change", () => setCategory(category.value));
  document.querySelectorAll(".choose-service").forEach(button => button.addEventListener("click", () => { setCategory(button.dataset.category); $("#estimador").scrollIntoView({ behavior: "smooth" }); setTimeout(() => category.focus({ preventScroll: true }), 350); }));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const serviceKey = data.get("category");
    const taskKey = data.get("task");
    const service = SERVICES[serviceKey];
    const selectedTask = service?.tasks.find(([key]) => key === taskKey)?.[1] || "Consulta general";
    const description = String(data.get("details") || "").trim();
    if (!service || !description || !taskKey) return;

    const submitButton = form.querySelector('[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = "La IA está analizando el caso…";
    result.hidden = false;
    result.innerHTML = '<p role="status">Conectando con el asistente de IA para analizar la descripción. Puede tardar unos segundos…</p>';

    const price = FIXED_PRICES[serviceKey]?.[taskKey];
    let aiAnalysis = "";
    let aiError = "";
    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: service.label,
          task: selectedTask,
          brand: String(data.get("brand") || "").trim(),
          zone: String(data.get("zone") || "").trim(),
          parts: String(data.get("parts") || "unknown"),
          description
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "No se pudo conectar con la IA.");
      aiAnalysis = String(payload.analysis || "").trim();
      if (!aiAnalysis) throw new Error("La IA no devolvió una respuesta. Intentá nuevamente.");
    } catch (error) {
      aiError = error instanceof Error ? error.message : "Error de conexión con la IA.";
    }

    const priceHtml = Number.isFinite(price)
      ? `<p><strong>Precio publicado para ${escapeHtml(selectedTask.toLowerCase())}:</strong> ${money(price)}.</p><p>Este valor fue informado por el negocio. Confirmá si el caso requiere trabajos adicionales.</p>`
      : serviceKey === "aire" && taskKey === "reparacion"
        ? '<p><strong>Precio:</strong> no hay un precio publicado para esta reparación. Se debe revisar la falla antes de presupuestar.</p>'
        : '<p><strong>Precio:</strong> a confirmar después de revisar el caso. La IA no inventa importes.</p>';

    const message = [
      "Hola, Yo Reparo Corrientes. Quisiera consultar por un trabajo.",
      `Servicio: ${service.label}`,
      `Trabajo: ${selectedTask}`,
      `Marca/modelo: ${data.get("brand") || "No especificado"}`,
      `Zona: ${data.get("zone") || "No especificada"}`,
      `Repuestos: ${{unknown:"No estoy seguro/a",no:"No, que yo sepa",yes:"Sí, probablemente"}[data.get("parts")] || "No especificado"}`,
      `Descripción: ${description}`,
      aiAnalysis ? `Orientación de la IA (preliminar):\n${aiAnalysis}` : `La IA no pudo analizar el caso: ${aiError}. Por favor, revisen la descripción manualmente.`,
      Number.isFinite(price) ? `Precio publicado: ${money(price)}.` : "Precio: pendiente de evaluación profesional.",
      "¿Podrían revisar el caso y confirmar disponibilidad y presupuesto final? Gracias."
    ].join("\n\n");

    const analysisHtml = aiAnalysis
      ? `<h4>Orientación de la IA</h4><div class="ai-analysis">${escapeHtml(aiAnalysis).replace(/\n/g, "<br>")}</div>`
      : `<h4>No se pudo conectar con la IA</h4><p>${escapeHtml(aiError)}</p><p>Verificá que el servidor esté iniciado y que la clave de API esté configurada. No se ha generado un diagnóstico de IA.</p>`;
    result.innerHTML = `<h4>Resumen de la consulta</h4><p><strong>Servicio:</strong> ${escapeHtml(service.label)} · ${escapeHtml(selectedTask)}</p>${priceHtml}${analysisHtml}<p class="disclaimer"><strong>Importante:</strong> las causas son posibilidades, no un diagnóstico confirmado. La revisión y el presupuesto final corresponden a un profesional. La IA no reemplaza técnicos matriculados ni instrucciones de seguridad.</p><p><strong>Próximo paso:</strong> podés enviar este resumen al equipo para revisar el caso.</p><div class="result-actions"><button type="button" id="send-whatsapp">Continuar por WhatsApp ↗</button><button type="button" class="secondary-action" id="copy-summary">Copiar resumen</button></div>`;
    $("#send-whatsapp").addEventListener("click", () => openWhatsApp(message));
    $("#copy-summary").addEventListener("click", async () => { try { await navigator.clipboard.writeText(message); $("#copy-summary").textContent = "Resumen copiado ✓"; } catch { alert("No se pudo copiar automáticamente. Podés continuar por WhatsApp."); } });
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  });
  $("#whatsapp-general").addEventListener("click", (event) => { event.preventDefault(); openWhatsApp("Hola, Yo Reparo Corrientes. Quisiera consultar por sus servicios y presupuestos."); });
});
