const WORKER_URL = "https://asesor-ultraseco.workthingstesting.workers.dev"; // Ejemplo: https://asesor.tu-usuario.workers.dev

async function enviarMensaje() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const mensaje = input.value.trim();

    if (!mensaje) return;

    // 1. Mostrar mensaje del usuario
    chatBox.innerHTML += `<div class="msg user"><b>Tú:</b> ${mensaje}</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Mostrar estado de carga
    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div class="msg ai" id="${tempId}"><b>Asesor:</b> Escribiendo...</div>`;

    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: mensaje })
        });

        const data = await response.json();
        
        // 3. Reemplazar "Escribiendo..." con la respuesta real
        document.getElementById(tempId).innerHTML = `<b>Asesor:</b> ${data.reply}`;
    } catch (error) {
        document.getElementById(tempId).innerHTML = `<b>Asesor:</b> Error de conexión. Revisa el Worker.`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Permitir enviar con la tecla Enter
function revisarEnter(event) {
    if (event.key === "Enter") enviarMensaje();
}
