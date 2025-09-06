import express from "express";

const app = express();
const port = 3000

app.use(express.json())

let calculos = [];
let nextId = 1;

app.post("/resultado", (req, res) => {
    const {alto, ancho} = req.body;
    let nAlto = parseFloat(alto);
    let nAncho = parseFloat(ancho);

    if (isNaN(nAlto) || isNaN(nAncho) || nAlto <= 0 || nAncho <= 0) {
        return res
        .status(400)
        .json({success: false, message: "Los valores de alto y ancho deben ser numeros positivos"})
    }

    const perimetro = 2 * (nAlto + nAncho);
    const superficie = nAlto * nAncho;
    const cal = {id: nextId++ , alto: nAlto, ancho: nAncho, perimetro, superficie};
    calculos.push(cal);
    res.json(cal);
});

app.get("/calculo", (req, res) => {
    calculos = calculos.map(calculo => {
        const tipo = (calculo.alto === calculo.ancho) ? "cuadrado" : "rectangulo";
        return {...calculo, tipo};
    }) 

    res.json(calculos)
});


app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});