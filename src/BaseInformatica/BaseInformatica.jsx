import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BaseInformatica.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const BaseInformatica = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [solicitacoesCount, setSolicitacoesCount] = useState(0); // Estado para o número de solicitações
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchToken, setSearchToken] = useState("");

  const handleInputChange = (event) => {
    setSearchToken(event.target.value);
  };

  const options = ["Informatica", "Multidisciplinar", "Equipamento"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `https://unime-pdr.vercel.app/auth/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            console.log(response.data);
            setUsername(response.data.user.name);
            setRole(response.data.user.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]); // Add id to the dependency array

  useEffect(() => {
    const fetchInformaticaData = async () => {
      try {
        const response = await axios.get(
          `https://unime-pdr.vercel.app/informatica`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching informatica data:", error);
      }
    };

    fetchInformaticaData();
  }, []); // Empty dependency array to run only once

  const handleSelect = (option) => {
    setSelectedOption(option);
    switch (option.value) {
      case "Informatica":
        navigate(`/informatica/${id}`);
        break;
      case "Multidisciplinar":
        navigate(`/multidisciplinar/${id}`);
        break;
      case "Equipamento":
        navigate(`/equipamento/${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="containerDashboard">
      <header>
        <div className="dashboardLeft">
          <img src="/logotipo.svg" alt="Logotipo" />
          <div className="groupPesquisa">
            <input
              type="text"
              placeholder="Pesquise o seu token..."
              value={searchToken}
              onChange={handleInputChange}
            />
            <button>
              <Link to={`/buscartoken/${id}/${searchToken}`}>Buscar</Link>
            </button>
          </div>
        </div>
        <div className="dashboardRight">
          <ul>
            <Dropdown
              className="dropdownX"
              options={options}
              onChange={handleSelect}
              value={selectedOption}
              placeholder="Realizar Solicitações"
            />
            {role === "ti" && (
              <li>
                <Link to="#">Solicitações</Link>
              </li>
            )}
            <li>Orientações</li>
          </ul>
          <div className="profile">
            <img src="/profile.png" alt="Perfil" />
            <p>{username}</p>
          </div>
        </div>
      </header>
      <section className="mainStyle-Container">
        <div className="mainStyle">
          <h1>
            Vem por aqui: reserve seu espaço no laboratório e transforme vidas
          </h1>
          <button>Realizar Reserva</button>
        </div>
        <img src="/image.svg" alt="Imagem" />
      </section>
      <section className="conhecalabs">
        <h1>Conheça nossos Laboratórios</h1>
        <img src="/arrow.svg" alt="Seta" />
      </section>

      <div>
        <h2>Dados de Informática</h2>
        <table id="displayTable">
          <thead>
            <tr>
              <th>Professor</th>
              <th>Email</th>
              <th>Data</th>
              <th>Modalidade</th>
              <th>Alunos</th>
              <th>Laboratório</th>
              <th>Software</th>
              <th>Equipamento</th>
              <th>Observação</th>
              <th>Token</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) => {
                if (role === "user") {
                  return item.userID === id;
                } else if (role === "ti") {
                  return true; // Mostra todos os itens se a role for "ti"
                }
                return false; // Caso padrão, não mostra nada
              })
              .map((item, index) => (
                <tr key={index}>
                  <td>{item.professor}</td>
                  <td>{item.email}</td>
                  <td>{item.data}</td>
                  <td>{item.modalidade}</td>
                  <td>{item.alunos}</td>
                  <td>{item.laboratorio}</td>
                  <td>{item.software}</td>
                  <td>{item.equipamento}</td>
                  <td>{item.observacao}</td>
                  <td>{item.token}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <section className="footerContainer">
        <img src="/Footer.svg" alt="Rodapé" />
        <p>
          Desenvolvido por: <Link to={"#"}>Luis Eduardo Andrade</Link>
        </p>
      </section>
    </div>
  );
};

export default BaseInformatica;
