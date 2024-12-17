import { useParams } from "react-router-dom";
import "./Sucesso.css";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx"; // Corrected path
import { FaCopy } from "react-icons/fa6";

const Dashboard = () => {
  const { token } = useParams();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        alert(`Você copiou: "${token}"`);
      })
      .catch((err) => {
        console.error("Erro ao copiar texto: ", err);
      });
  };
  return (
    <div className="containerDashboard">
      <Menu props={useParams()} />
      <section className="mainStyle-Container">
        <div className="card">
          <div className="checkmarkContainer">
            <i id="ihere" className="checkmark">
              ✓
            </i>
          </div>
          <h1 id="h1here">Reserva feita com sucesso.</h1>
          <p className="phehe">
            Em até 72 horas, iremos retornar no e-mail que colocou nos campos do
            formulario.
          </p>
          <h2 id="h2here">
            Token: <span id="tokenTxt">{token}</span>{" "}
            <span onClick={handleCopy} id="copyToken">
              <FaCopy />
            </span>
          </h2>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
