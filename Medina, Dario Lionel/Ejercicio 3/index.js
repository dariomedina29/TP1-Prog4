import express from "express";

const app = express();
const port = 3000

app.use(express.json())

let tareas = [];

app.post("/tareas", (req, res) => {
    const {nombre, lista} = req.body

    if(!nombre || (lista !== true && lista !== false)) {
        return res
        .status(400)
        .json({success: false, message: "Se requiere un nombre y el estado (listo)"})
    }

    const yaExiste = tareas.find((t) => t.nombre.trim().toLocaleLowerCase() === nombre.toLocaleLowerCase());
    if (yaExiste){
        return res
        .status(409)
        .json({success: false, message: "Ya hay una tarea con ese mismo nombre"});
    }

    const nuevo = {nombre: nombre, lista};
    tareas.push(nuevo);
    res.status(201).json(nuevo);
});

app.get("/tareas", (req,res) => {
    const {estado} = req.query;

    let validar = tareas

    if(estado === "listas") {
        validar = tareas.filter((t) => t.lista);
    } else if (estado === "porCompletar") {
        validar = tareas.filter((t) => !t.lista);
    }

    return res.json({validar});
});

app.get("/tareas/:nombre", (req, res) => {
    const nombre = req.params.nombre.trim().toLocaleLowerCase();
    const tarea = tareas.find((t) => t.nombre.trim().toLocaleLowerCase() === nombre);

    if(!tarea){
        return res
        .status(404)
        .json({success: false, message:"No se encontro esa tarea"});
    }


    res.json(tarea);
})
app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});