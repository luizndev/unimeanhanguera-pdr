import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const dbUser = "luisflc582";
const dbPass = "Eduardo@54321@@";
const dbName = "users"; // Substitua por seu nome de banco de dados real

const mongoURI = `mongodb+srv://${dbUser}:${dbPass}@cluster0.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB", err);
  });

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.post("/auth/register", async (req, res) => {
  const { email, nome, password, confirmpassword } = req.body;

  if (!nome) {
    return res.status(422).json({ mensagem: "O Nome é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ mensagem: "O Email é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ mensagem: "A Senha é obrigatória!" });
  }
  if (password !== confirmpassword) {
    return res.status(422).json({ mensagem: "As senhas não conferem!" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(422).json({ mensagem: "Email já cadastrado!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    nome,
    email,
    password: passwordHash,
  });

  try {
    await newUser.save();
    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar o usuário", erro: err });
  }
});

// Rota para buscar todos os usuários e retornar em JSON
app.get("/mejson", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar usuários", erro: err });
  }
});

app.listen(5003, () => {
  console.log("Servidor rodando na porta 5003");
});
