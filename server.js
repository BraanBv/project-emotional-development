// conexión entre MongoDB y JavaScript con HTML

// importa el framework express para crear el servidor
const express = require("express");
// constante para conectar mongo
const { MongoClient } = require("mongodb");
// importa la librería cors para permitir peticiones desde el frontend html
const cors = require("cors");

// crea una aplicación de express
const app = express();
// activa cors para que html pueda acceder al servidor
app.use(cors());

// url de conexión a mongodb (local host a pc)
const uri = "mongodb://localhost:27017/";
// crea un cliente para la bd
const client = new MongoClient(uri);

app.get("/prueba1", async (req, res) => {
    try {
        // conecta mongodb
        await client.connect();

        // seleccionamos la BD
        const db = client.db("mundi26");

        // busca todos los documentos de la colección deseada
        const computacion4 = await db.collection("equipos").find().toArray();

        // envía los documentos en formato json al frontend html
        res.json({data: computacion4});

    } catch (error) {
        console.error(error);
        // si hay un error, responde con un código 500 (error de servidor)
        res.status(500).send(error);
    }
});

// conectar el servidor en un puerto diferente (3000)
async function iniciarServidor() {
    try {
        await client.connect();
        app.listen(3000, () => {
            console.log("SERVIDOR ACTIVO EN http://localhost:3000");
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
}

iniciarServidor();
