import { useParams } from "react-router-dom";
import "./Visualizacao.css";
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
      <iframe
        className="planilha"
        src="https://docs.google.com/spreadsheets/d/1gwvaK-dQYNrbUppO4gZghkQ7GWjgSwTZ2Dc1E_7cZCQ/edit?usp=sharing"
        style={{ border: "none" }} // Substitui o frameborder
        title="Planilha do Google"
      ></iframe>
    </div>
  );
};

export default Dashboard;
