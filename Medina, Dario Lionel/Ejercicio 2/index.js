import express from "express";

const app = express();
const port = 3000;

app.use(express.json());


let alumnos = []; 


app.get("/alumnos", (req, res) => {
  res.json(alumnos);
});


app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
    return res
    .status(400)
    .json({ success: false, message: "Envie un nombre y 3 notas validas" });
  }

  
  const yaExiste = alumnos.find(
    a => a.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );
  if (yaExiste) {
    return res
    .status(409)
    .json({ success: false, message: "Ese nombre ya existe." });
  }

  
  const notasNum = notas.map((n) => Number(n));
  const invalid = notasNum.find((n) => Number.isNaN(n) || n < 0 || n > 10);
  if (invalid !== undefined) {
    return res
    .status(400)
    .json({ success: false, message: "Las notas tienen que ser entre 0 y 10." });
  }

  const nuevo = { nombre: nombre.trim(), notas: notasNum };
  alumnos.push(nuevo);
  res.status(201).json(nuevo);
});


app.get("/alumnos/:nombre", (req, res) => {
  const a = alumnos.find((a2) => a2.nombre.trim().toLowerCase() === req.params.nombre.trim().toLowerCase());
  
  if (!a) return res.status(404).json({ success: false, message: "Alumno no encontrado." });

  const promedio = Math.round((a.notas[0] + a.notas[1] + a.notas[2]) / 3).toFixed(2);
  let estado = "Reprobado";
  if (promedio >= 8) estado = "Promocionado";
  else if (promedio >= 6) estado = "Aprobado";

  res.json({ nombre: a.nombre, notas: a.notas, promedio, estado });
});


app.put("/alumnos/:nombre", (req, res) => {
  const id = alumnos.findIndex((a2) => a2.nombre.trim().toLowerCase() === req.params.nombre.trim().toLowerCase());

  if (id === -1) return res
  .status(404)
  .json({ success: false, message: "Alumno no encontrado." });

  const { nuevoNombre, notas } = req.body ?? {};

  if (nuevoNombre && nuevoNombre.trim()) {
    const duplicado = alumnos.find(
      (a, i) =>
        i !== id &&
        a.nombre.trim().toLowerCase() === nuevoNombre.trim().toLowerCase()
    );
    if (duplicado) return res
    .status(409)
    .json({ success: false, message: "Ya existe un alumno con ese nombre." });
    alumnos[id].nombre = nuevoNombre.trim();
  }

  if (notas !== undefined) {
    if (!Array.isArray(notas) || notas.length !== 3) {
      return res
      .status(400)
      .json({ success: false, message: "Debe enviar 3 notas validas" });
    }
    const notasNum = notas.map(n => Number(n));
    const invalid = notasNum.find(n => Number.isNaN(n) || n < 0 || n > 10);
    if (invalid !== undefined) {
      return res
      .status(400)
      .json({ success: false, message: "Notas entre 0 y 10." });
    }
    alumnos[id].notas = notasNum;
  }

  res.json({ message: "Alumno modificado." });
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});
