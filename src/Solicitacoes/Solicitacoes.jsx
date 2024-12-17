import { RiCloseLargeFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Solicitacoes.css";
import { FaCheck } from "react-icons/fa";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx";

const Solicitacoes = () => {
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const { id } = useParams();

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
            console.log(response.data);
            setRole(response.data.user.role);
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
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error("Error fetching informatica data:", error);
      }
    };

    fetchInformaticaData();
  }, []);

  useEffect(() => {
    const filterByDate = () => {
      if (selectedDate) {
        const filtered = data.filter((item) => item.data === selectedDate);
        setFilteredData(filtered);
      } else {
        setFilteredData(data);
      }
    };

    filterByDate();
  }, [selectedDate, data]);

  const handleConfirm = async (item) => {
    const emailBody = `
      Professor: ${item.professor}
      Email: ${item.email}
      Data: ${item.data}
      Modalidade: ${item.modalidade}
      Alunos: ${item.alunos}
      Laboratório: ${item.laboratorio}
      Software: ${item.software}
      Equipamento: ${item.equipamento}
      Observação: ${item.observacao}
      Token: ${item.token}
    `;

    try {
      await axios.post("https://unime-pdr.vercel.app/send-email", {
        to: "destinatario@outlook.com",
        subject: "Confirmação de Solicitação",
        body: emailBody,
      });

      await axios.put(`https://unime-pdr.vercel.app/informatica/${item.id}`, {
        status: "Confirmação",
      });

      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, status: "Confirmação" }
            : dataItem
        )
      );
      setFilteredData((prevFilteredData) =>
        prevFilteredData.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, status: "Confirmação" }
            : dataItem
        )
      );
    } catch (error) {
      console.error("Error confirming request:", error);
    }
  };

  const handleDeny = async (item) => {
    try {
      await axios.put(`https://unime-pdr.vercel.app/informatica/${item.id}`, {
        status: "Negado",
      });

      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, status: "Negado" } : dataItem
        )
      );
      setFilteredData((prevFilteredData) =>
        prevFilteredData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, status: "Negado" } : dataItem
        )
      );
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  return (
    <div className="containerDashboard">
      <Menu />
      <div className="dados">
        <h2>Dados de Informática</h2>
        <div className="inputFilterContainer">
          <div className="inputFilter">
            <label htmlFor="dateFilter">Filtrar por Data:</label>
            <input
              type="date"
              id="dateFilter"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <table id="tableView">
          <thead>
            <tr>
              <th id="collumProf">Professor</th>
              <th>Email</th>
              <th>Data</th>
              <th>Modalidade</th>
              <th>Alunos</th>
              <th>Laboratório</th>
              <th>Software</th>
              <th>Equipamento</th>
              <th>Observação</th>
              <th>Token</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              .filter((item) => {
                if (role === "user") {
                  return item.userID === id;
                } else if (role === "ti" || role === "labs") {
                  return true;
                }
                return false;
              })
              .map((item, index) => (
                <tr key={index}>
                  <td id="collumProf">{item.professor}</td>
                  <td id="collumEmail">{item.email}</td>
                  <td>{item.data}</td>
                  <td>{item.modalidade}</td>
                  <td>{item.alunos}</td>
                  <td>{item.laboratorio}</td>
                  <td>{item.software}</td>
                  <td>{item.equipamento}</td>
                  <td>{item.observacao}</td>
                  <td>{item.token}</td>
                  <td className="buttonOption">
                    <button onClick={() => handleConfirm(item)}>
                      <FaCheck />
                    </button>
                    <button className="negado" onClick={() => handleDeny(item)}>
                      <RiCloseLargeFill />
                    </button>
                  </td>
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

export default Solicitacoes;
