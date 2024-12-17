import { RiCloseLargeFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./MinhasSolicitacoes.css";
import { FaCheck } from "react-icons/fa";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx";

const MinhasSolicitacoes = () => {
  const [role, setRole] = useState("");
  const [informaticaData, setInformaticaData] = useState([]);
  const [multidisciplinarData, setMultidisciplinarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedToken, setSelectedToken] = useState(""); // Estado para o token selecionado
  const { id, email } = useParams();

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

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
            setRole(response.data.user.role);
            console.log(response.data.user.name);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchInformaticaData = async () => {
      try {
        if (email) {
          const response = await axios.get(
            `https://unime-pdr.vercel.app/minhassolicitacoes/${email}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            const informatica = response.data.informatica || [];
            const multidisciplinar = response.data.multidisciplinar || [];

            const combinedData = [
              ...informatica.map((item) => ({
                email: item.email,
                data: item.data,
                laboratorio: item.laboratorio,
                token: item.token,
                status: item.status,
              })),
              ...multidisciplinar.map((item) => ({
                email: item.email,
                data: item.data,
                laboratorio: item.laboratorio,
                token: item.token,
                status: item.status,
              })),
            ];

            setInformaticaData(informatica);
            setMultidisciplinarData(multidisciplinar);
            setFilteredData(combinedData);
          }
        }
      } catch (error) {
        console.error("Error fetching informatica data:", error);
      }
    };

    fetchInformaticaData();
  }, [email]);

  useEffect(() => {
    const filterData = () => {
      let filtered = [...informaticaData, ...multidisciplinarData];

      if (selectedDate) {
        filtered = filtered.filter((item) => item.data === selectedDate);
      }

      if (selectedToken) {
        filtered = filtered.filter((item) =>
          item.token.includes(selectedToken)
        );
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [selectedDate, selectedToken, informaticaData, multidisciplinarData]);

  return (
    <div className="containerDashboard">
      <Menu />
      <div className="dados">
        <div className="boasVindas">
          <p className="boasVindasTexto">
            Acompanhe suas solicitações de laboratórios abaixo:
          </p>
          <h2 className="subtitulo">Minhas Solicitações de Laboratórios</h2>
        </div>

        <div className="inputFilterContainer">
          <input
            className="inputFilter"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Filtrar por data"
          />
          <input
            className="inputFilter"
            type="text"
            value={selectedToken}
            onChange={handleTokenChange}
            placeholder="Filtrar por token"
          />
        </div>
        <table id="tableView">
          <thead>
            <tr>
              <th>Data</th>
              <th>Laboratório</th>
              <th>Token</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.data)}</td>
                  <td>{item.laboratorio}</td>
                  <td>{item.token}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhuma solicitação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MinhasSolicitacoes;
