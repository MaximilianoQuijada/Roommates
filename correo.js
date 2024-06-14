const nodemailer = require("nodemailer");
const fs = require("fs");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nodemailerADL@gmail.com",
    pass: "fullstackjavascript",
  },
});

const send = async ({ monto, descripcion, roommate }) => {
  const correos = JSON.parse(
    fs.readFileSync("data/roommates.json")
  ).roommates.map((r) => r.email);
  let mailOptions = {
    from: "nodemailerADL@gmail.com",
    to: ["nodemaileradl@gmail.com"].concat(correos),
    subject: `¡Nuevo gasto entre roomies registrado!`,
    html: `<h6>${roommate} ha registrado un gasto de $${monto} por el siguiente motivo: ${descripcion}</h6>`,
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = { send };
