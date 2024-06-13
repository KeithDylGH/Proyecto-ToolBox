const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Definir el esquema del usuario
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
    unique: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

usuarioSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

usuarioSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;