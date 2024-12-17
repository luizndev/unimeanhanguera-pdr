import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Index.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const Buscastoken = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [data, setData] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const { searchToken } = useParams();
  const navigate = useNavigate();
  const id = localStorage.getItem("id");

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://unime-pdr.vercel.app/buscartoken/${searchToken}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setData(response.data);
        console.log(response.data);
      } else {
        console.error("Status da resposta não é 200:", response.status);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do token:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  const options = ["Informatica", "Multidisciplinar", "Equipamento"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `https://auth-6o53.onrender.com/auth/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            setUsername(response.data.user.name);
            setRole(response.data.user.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    switch (option.value) {
      case "Informatica":
        navigate(`/informatica/${id}`);
        break;
      case "Multidisciplinar":
        navigate(`/multidisciplinar`);
        break;
      case "Equipamento":
        navigate(`/equipamento`);
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
                <a href="#">Solicitações</a>
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
      <section>
        <h1>
          Token: <p>{searchToken}</p>
        </h1>
        {data && (
          <div>
            <div className="inputInformation">
              <label>Nome Professor</label>
              <input type="text" value={data.professor || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>E-mail</label>
              <input type="text" value={data.email || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>Data</label>
              <input type="text" value={data.data || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>Modalidade</label>
              <input type="text" value={data.modalidade || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>Quantidade de Alunos</label>
              <input type="text" value={data.alunos || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>Software Específico</label>
              <input type="text" value={data.software || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>Equipamento</label>
              <input type="text" value={data.equipamento || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>Observação</label>
              <input type="text" value={data.observacao || ""} readOnly />
            </div>
            <div className="inputInformation">
              <label>Status</label>
              <input type="text" value={data.status || ""} readOnly />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Buscastoken;
