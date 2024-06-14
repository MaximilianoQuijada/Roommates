const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const nuevoGasto = async (gasto) => {
  gasto.fecha = new Date();
  gasto.id = uuidv4().slice(30);
  const gastosJSON = await fs.readFile("data/gastos.json", "utf8")
  let { gastos } = JSON.parse(gastosJSON);
  gastos.push(gasto);
  await fs.writeFile("data/gastos.json", JSON.stringify({ gastos }));
};

const deleteGasto = async (id) => {
  const gastosJSON = await fs.readFile("data/gastos.json", "utf8")
  let { gastos } = JSON.parse(gastosJSON);
  gastos = gastos.filter((g) => g.id !== id);
  await fs.writeFile("data/gastos.json", JSON.stringify({ gastos }));
};

const editGasto = async (gasto, id) => {
  const gastosJSON = await fs.readFile("data/gastos.json", "utf8")
  let { gastos } = JSON.parse(gastosJSON);
  gastos = gastos.map((g) => {
    if (g.id == id) {
      const newData = gasto;
      newData.id = id;
      return newData;
    }
    return g;
  });
  await fs.writeFile("data/gastos.json", JSON.stringify({ gastos }));
};

module.exports = {
  nuevoGasto,
  deleteGasto,
  editGasto,
};
