const express = require("express");
const path = require("node:path");
const { leerArchivoJson } = require("./archivos.js");

const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");

async function main() {
    const mascotas = await leerArchivoJson(rutaDatos);
    const app = express();

    app.get("/api/mascotas", (req, res) => {
        res.json(mascotas);
    });

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

main().catch((error) => {
    console.error("No se pudo conectar con el servidor:", error);
    process.exitCode = 1;
})