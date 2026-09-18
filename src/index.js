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

    //Aquí defino la ruta para uso de los recursos estáticos
    app.use(express.static(path.join(__dirname, "..", "public")));

    //Configuración de Formularios URL-encoded
    app.use(express.urlencoded({ extended: false }));

    //Aquí defino la ruta para la lista de mascotas en formato JSON
    app.get("/api/mascotas", (req, res) => {
        res.json(mascotas);
    });

    //Aquí defino la ruta para el renderizado de la página "Inicio"
    app.get("/", (req, res) => {
        res.render("inicio", { titulo: "Mascotas en Adopción" });
    });

    //Aquí defino la ruta para el renderizado del listado de mascotas en adopción
    app.get("/mascotas", (req, res) => {
        res.render("mascotas/lista", {
            titulo: "Mascotas en adopción",
            mascotas,
        });
    });

    //Aquí defino la ruta para renderizar el formulario de una mascota nueva
    app.get("/mascotas/nueva", (req, res) => {
        res.render("mascotas/nueva", {
            titulo: "Nueva mascota",
            error: null,
            valores: {},
        });
    });

    //Aquí defino la ruta para renderizar la búsqueda de un elemento por ID
    app.get("/mascotas/:id", (req, res) => {
        const id = Number(req.params.id);
        const mascota = mascotas.find((elemento) => elemento.id === id);

        if(!mascota) {
            return res.status(404).render("no-encontrado", {
                titulo: "Mascota no encontrada",
                mensaje: "No existe la mascota con ese identificador",
            });
        }

        res.render("mascotas/detalle", {
            titulo: mascota.nombre,
            mascota,
        });
    });

    //Aquí defino la ruta para el método POST - agregar una mascota nueva
    app.post("/mascotas", (req, res) => {
        const { nombre, especie, edad, descripcion, estado } = req.body;
        const nombreLimpio = String(nombre ?? "").trim();
        const especieLimpia = String(especie ?? "").trim();
        const edadNumerica = Number(edad);
        const descripcionLimpia = String(descripcion ?? "").trim();
        const estadoLimpio = String(estado ?? "").trim();
        if (
            !nombreLimpio ||
            !especieLimpia ||
            !Number.isFinite (edadNumerica) ||
            !Number.isInteger (edadNumerica) ||
            edadNumerica < 0 ||
            !descripcionLimpia ||
            !estadoLimpio
        ) {
            return res.status(400).render("mascotas/nueva", {
                titulo: "Nueva mascota",
                error: "Completa todos los campos con valores válidos",
                valores: req.body,
            });
        }
        const ultimoId = mascotas.reduce (
            (mayorID, mascota) => Math.max(mayorID, mascota.id),
            0,
        );
        mascotas.push ({
            id: ultimoId + 1,
            nombre: nombreLimpio,
            especie: especieLimpia,
            edad: edadNumerica,
            descripcion: descripcionLimpia,
            estado: estadoLimpio,
            imagen: "/img/mascota.svg",
        });
        res.redirect("/mascotas");
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