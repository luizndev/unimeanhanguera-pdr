import { useState } from "react";
import LogoTypeBranco from "../assets/Logotype-Branco.png";
import { FaUser, FaChevronRight } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [role, setRole] = useState(""); // Estado para armazenar o valor selecionado
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificação de senhas
    if (senha !== confirmarSenha) {
      setError("As senhas não são iguais.");
      return;
    }

    const newUser = {
      name: `${nome} ${sobrenome}`,
      email: email,
      password: senha,
      confirmpassword: senha,
      role: role, // Adiciona o valor do select no JSON
    };

    try {
      const response = await fetch(
        "https://unime-pdr.vercel.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        // Sucesso
        setError("");
        alert("Registrado com sucesso!");
        navigate(`/login`);
      } else {
        // Erro do servidor
        setError("Erro ao registrar. Tente novamente mais tarde.");
      }
    } catch (error) {
      // Erro de conexão ou de outra natureza
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="container-Register">
      <div className="left">
        <img
          src={LogoTypeBranco}
          alt="Logotipo Branco"
          className="logotype-Register"
        />
      </div>
      <div className="right">
        <form className="Registercontainer" onSubmit={handleSubmit}>
          <h1>Registre-se</h1>
          <p>Preencha os campos para realizar o registro</p>
          <div className="inputType">
            <FaUser className="icone" />
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="inputType">
            <FaUser className="icone" />
            <input
              type="text"
              name="sobrenome"
              id="sobrenome"
              placeholder="Sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
            />
          </div>
          <div className="inputType">
            <MdEmail className="icone" />
            <input
              type="email"
              name="Register"
              id="Register"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="inputType">
            <RiLockPasswordFill className="icone" />
            <input
              type="password"
              name="senha"
              id="senha"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="inputType">
            <RiLockPasswordFill className="icone" />
            <input
              type="password"
              name="csenha"
              id="csenha"
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          <div className="inputType">
            <label htmlFor="role">Função</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Selecione uma função</option>
              <option value="ti">Técnico de Informática</option>
              <option value="labs">Coordenação de Laboratórios</option>
              <option value="user">Tutor/Docente</option>
            </select>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="containerButton">
            <button type="submit">
              Registrar <FaChevronRight />
            </button>
          </div>
          <div className="dicas">
            <p>Já possui uma conta?</p>
            <Link to="/login">Fazer login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
