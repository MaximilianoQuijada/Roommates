const express = require('express');
const app = express();

app.listen(3000, console.log("Server ON"))
app.use(express.json())

const fs = require("fs").promises;

const { nuevoRoommate, recalcularDeudas } = require("./roommates");
const { nuevoGasto, deleteGasto, editGasto } = require("./gastos");
// const { send } = require("./correo");


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})


app.post("/roommate", async (req, res) => {
  try {
    await nuevoRoommate();
    recalcularDeudas();
    res.send();
  } catch (e) {
    res.statusCode = 500;
    res.send(e);
  }
})


app.get("/roommates", async (req, res) => {
  const roommatesJSON = await fs.readFile("data/roommates.json", "utf8")
  const roommates = JSON.parse(roommatesJSON)
  res.json(roommates);
})


app.get("/gastos", async (req, res) => {
  const gatosJSON = await fs.readFile("data/gastos.json", "utf8")
  const gastos = JSON.parse(gatosJSON)
  res.json(gastos);
})


app.post("/gasto", async (req, res) => {
  try {
    const gasto = req.body
    // await send(gasto);
    nuevoGasto(gasto);
    recalcularDeudas();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
})


app.put("/gasto", (req, res) => {
  try {
    const gasto = req.body
    const { id } = req.query;
    editGasto(gasto, id);
    recalcularDeudas();
    res.end("Gasto editado con exito");
  } catch (e) {
    res.status(500).send(e);
  }
})

app.delete("/gasto", (req, res) => {
  const { id } = req.query;
  deleteGasto(id);
  recalcularDeudas();
  res.send("gasto eliminado");
})

