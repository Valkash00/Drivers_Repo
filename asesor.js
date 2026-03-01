const WORKER_URL = "https://asesor-ultraseco.workthingstesting.workers.dev";

async function enviarMensaje() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const mensaje = input.value.trim();

    if (!mensaje) return;

    // 1. Mostrar mensaje del usuario
    chatBox.innerHTML += `<div class="msg user"><b>Tú:</b> ${mensaje}</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Mostrar estado de carga (ID único para poder borrarlo luego)
    const tempId = "loading-" + Date.now();
    chatBox.innerHTML += `<div class="msg ai" id="${tempId}"><b>Asesor:</b> Escribiendo...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: mensaje })
        });

        if (!response.ok) throw new Error("Error en el Worker");

        const data = await response.json();
        
        // 3. Reemplazar "Escribiendo..." con la respuesta real de Groq
        const elementoAI = document.getElementById(tempId);
        if (data.reply) {
            elementoAI.innerHTML = `<b>Asesor:</b> ${data.reply}`;
        } else {
            elementoAI.innerHTML = `<b>Asesor:</b> No recibí una respuesta clara. Revisa tu API Key.`;
        }

    } catch (error) {
        console.error(error);
        const elementoError = document.getElementById(tempId);
        elementoError.innerHTML = `<b>Asesor:</b> Error de conexión. Asegúrate de que el Worker esté desplegado.`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function revisarEnter(event) {
    if (event.key === "Enter") enviarMensaje();
}
