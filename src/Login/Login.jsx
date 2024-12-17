import { useState } from "react";
import LogoTypeBranco from "../assets/Logotype-Branco.png";
import { FaChevronRight } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure you have axios installed
import "./Login.css";
import { BiSolidErrorAlt } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://unime-pdr.vercel.app/auth/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        const idVerify = response.data.userId;
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("id", idVerify);
        navigate(`/dashboard/${idVerify}`);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Erro ao logar. Tente novamente.");
      }
    }
  };

  return (
    <div className="container-login">
      <div className="left">
        <img
          src={LogoTypeBranco}
          alt="Logotipo Branco"
          className="logotype-login"
        />
      </div>
      <div className="right">
        <form className="logincontainer" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <p>Preencha os campos para realizar o login</p>
          {error && (
            <p className="error-message">
              <BiSolidErrorAlt /> {error}
            </p>
          )}
          <div className="inputType">
            <MdEmail className="icone" />
            <input
              type="email"
              name="login"
              id="login"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="inputType">
            <RiLockPasswordFill className="icone" />
            <input
              type="password"
              name="senha"
              id="senha"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="containerButton">
            <button type="submit">
              Entrar <FaChevronRight />
            </button>
          </div>
          <div className="dicas">
            <p>Não tem uma conta?</p>
            <Link to="/register">Criar sua conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
