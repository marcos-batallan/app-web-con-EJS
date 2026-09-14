//Aquí realizo la importación de módulos
const express = require("express");
const path = require("node:path");
const { leerArchivoJson } = require("./archivos.js");
const expressLayouts = require("express-ejs-layouts");

//Aquí configuro el puerto y defino la ruta para la lectura del archivo JSON
const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");

//Aquí declaro la función principal de la app
async function main() {
    //Aquí realizo la lectura de datos
    const mascotas = await leerArchivoJson(rutaDatos);
    //
    const app = express();

    //Configuración del motor de vistas
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "..", "views"));

    //Activación de layouts
    app.use(expressLayouts);
    app.set("layout", "layouts/main");

    //Aquí defino la ruta para la lista de mascotas en formato JSON
    app.get("/api/mascotas", (req, res) => {
        res.json(mascotas);
    });

    //Aquí defino la ruta para el renderizado de la página "Inicio"
    app.get("/", (req, res) => {
        res.render("Inicio", { titulo: "Mascotas en Adopción" });
    });

    //Inicio la escucha del servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

//Si existe algún error en la conexión termino el proceso
main().catch((error) => {
    console.error("No se pudo conectar con el servidor:", error);
    process.exitCode = 1;
})