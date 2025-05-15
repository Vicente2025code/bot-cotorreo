require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para leer application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar cualquier solicitud entrante
app.all('*', (req, res, next) => {
    console.log(`➡️ Recibida solicitud ${req.method} en ${req.path}`);
    next();
});

// Ruta principal para recibir mensajes de Twilio (WhatsApp)
app.post('/webhook', (req, res) => {
    const mensaje = req.body.Body?.toLowerCase() || '';
    const numero = req.body.From;

    console.log(`✅ POST recibido en /webhook`);
    console.log(`📩 Mensaje recibido de ${numero}: ${mensaje}`);

    let respuesta = "Hola, soy el bot de Grupo Cotorreo. ¿En qué te puedo ayudar?";

    if (mensaje.includes("promocion") || mensaje.includes("promo")) {
        respuesta = "¡Tenemos elotes 2x1 los martes, hamburguesas 3x2 los jueves y más!";
    } else if (mensaje.includes("ubicacion") || mensaje.includes("donde") || mensaje.includes("direccion")) {
        respuesta = "Estamos en Plaza El Encuentro (Food Spot) y Plaza Cotorreo, Barrio Lourdes.";
    } else if (mensaje.includes("cancha") || mensaje.includes("alpadel")) {
        respuesta = "Reservá tu cancha en https://playtomic.io.";
    } else if (mensaje.includes("menu") || mensaje.includes("comida")) {
        respuesta = "¿Qué se te antoja? Tenemos tacos, sushi, hamburguesas, ceviches y más.";
    }

    // Respuesta en formato XML como Twilio espera
    res.type('text/xml');
    res.send(`
        <Response>
            <Message>${respuesta}</Message>
        </Response>
    `);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Bot escuchando en http://localhost:${port}`);
});
