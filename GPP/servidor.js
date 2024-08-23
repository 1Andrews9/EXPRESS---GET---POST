const express = require('express');
const mod_fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/datosform", (req, res) => {
    const filePath = path.join(__dirname, 'datos.html');

    try {
        let datos_html = mod_fs.readFileSync(filePath, 'utf8');
        datos_html = datos_html.replace("%nombre%", req.body.nombre || "");
        datos_html = datos_html.replace("%apellido%", req.body.apellido || "");

        return res.send(datos_html);
    } catch (error) {
        return res.status(500).send("Error procesando la plantilla: " + error.message);
    }
});

app.get("/formconGet", (req, res) => {
    let nombre = req.query.nombre || ""; 
    let apellido = req.query.apellido || ""; 

    if (nombre.length <= 0 || apellido.length <= 0) {
        return res.status(400).json({ mensaje: "Debe capturar nombre y apellido" });
    }

    return res.status(200).json({
        mensaje: "Datos del formulario con GET",
        datos: { nombre, apellido }
    });
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
