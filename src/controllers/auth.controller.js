import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET } from "../config.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Crear un nuevo objeto de usuario
    const newUser = new User({
      username,
      email,
      password,
    });

    // Comprobando los roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    // Guardar el objeto de usuario en Mongodb
    const savedUser = await newUser.save();

    // Registro del usuario creado en la consola
    console.log("Usuario creado:", savedUser);

    // Crear un token
    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400, // 24 horas
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const signinHandler = async (req, res) => {
  try {
    // El correo electrónico del cuerpo de la solicitud puede ser un correo electrónico o un nombre de usuario
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "roles"
    );

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Contraseña incorrecta",
      });

    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: 86400, // 24 horas
    });

    res.json({ token });
  } catch (error) {
    console.log(error);
  }
};
