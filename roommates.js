const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const nuevoRoommate = async () => {
  const data = await axios.get("https://randomuser.me/api");
  const usuario = data.data.results[0];
  const roommate = {
    id: uuidv4().slice(30),
    nombre: `${usuario.name.first} ${usuario.name.last}`,
    email: usuario.email,
    debe: 0,
    recibe: 0,
  };

  const roommatesJSON = JSON.parse(
    fs.readFileSync("data/roommates.json", "utf8")
  );
  let { roommates } = roommatesJSON;
  roommates.push(roommate);
  fs.writeFileSync("data/roommates.json", JSON.stringify({ roommates }));
};

const recalcularDeudas = () => {
  console.log("alo")
  let { roommates } = JSON.parse(
    fs.readFileSync("data/roommates.json", "utf8")
  );
  const { gastos } = JSON.parse(fs.readFileSync("data/gastos.json", "utf8"));

  roommates = roommates.map((r) => {
    r.debe = 0;
    r.recibe = 0;
    r.total = 0;
    return r;
  });

  const { length: cantidadDeRoommates } = roommates
  gastos.forEach((g) => {
    const { monto, roommate } = g
    const montoPorPersona = monto / cantidadDeRoommates
    roommates = roommates.map((r) => {
      const { nombre: nombreDeQuienHizoElGasto } = r

      if (roommate == nombreDeQuienHizoElGasto) {
        r.recibe += montoPorPersona * (cantidadDeRoommates - 1);
      } else {
        r.debe -= montoPorPersona;
      }
      r.total = r.recibe - r.debe;
      return r;
    });
  });
  fs.writeFileSync("data/roommates.json", JSON.stringify({ roommates }));
};

module.exports = {
  nuevoRoommate,
  recalcularDeudas,
};
