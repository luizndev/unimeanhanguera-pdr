import { RiCloseLargeFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./MultidisciplinarInfo.css";
import { FaCheck } from "react-icons/fa";
import Menu from "../Header/Header.jsx"; // Verifique se o caminho está correto

const MultidisciplinarInfo = () => {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState({});
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const { id } = useParams();

  // Função para buscar dados da API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://unime-pdr.vercel.app/multidisciplinar"
      ); // Ajuste a URL conforme necessário
      setFaqs(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

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

  const fetchInformaticaData = async () => {
    try {
      const response = await axios.get(
        `https://unime-pdr.vercel.app/multidisciplinar`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setData(response.data);
        setFilteredData(response.data); // Inicialmente, mostra todos os dados
      }
    } catch (error) {
      console.error("Error fetching informatica data:", error);
    }
  };

  const toggleAccordion = (index) => {
    setOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filterByDate = () => {
    if (selectedDate) {
      const filtered = data.filter((item) => item.data === selectedDate);
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Se nenhuma data for selecionada, mostra todos os dados
    }
  };

  const handleConfirm = async (item) => {
    // Enviar email para Outlook
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

      // Atualizar status para "Confirmação"
      await axios.put(
        `https://unime-pdr.vercel.app/multidisciplinar/${item.id}`,
        {
          status: "Confirmação",
        }
      );

      // Atualizar a lista de dados para refletir a mudança
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
    // Atualizar status para "Negado"
    try {
      await axios.put(
        `https://unime-pdr.vercel.app/multidisciplinar/${item.id}`,
        {
          status: "Negado",
        }
      );

      // Atualizar a lista de dados para refletir a mudança
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

  useEffect(() => {
    fetchData();
    fetchUserData();
    fetchInformaticaData();
  }, [id]); // Adicione 'id' ao array de dependências

  useEffect(() => {
    filterByDate();
  }, [selectedDate, data]); // Atualiza quando selectedDate ou data mudam

  return (
    <div className="containerDashboard">
      <Menu />
      <div className="dados">
        <h2>Dados de Multidisciplinar</h2>
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
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Professor</th>
                <th>Email</th>
                <th>Data</th>
                <th>Modalidade</th>
                <th>Alunos</th>
                <th>Laboratório</th>
                <th>Curso</th>
                <th>Semestre</th>
                <th>Disciplinar</th>
                <th>Tema</th>
                <th>Roteiro</th>
                <th>Observação</th>
                <th>Token</th>
                <th>Botões de Ação</th>
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
                    <td className="no-wrap" title={item.professor}>
                      {item.professor}
                    </td>
                    <td title={item.email}>{item.email}</td>
                    <td title={item.data}>{item.data}</td>
                    <td title={item.modalidade}>{item.modalidade}</td>
                    <td title={item.alunos}>{item.alunos}</td>
                    <td title={item.laboratorio}>{item.laboratorio}</td>
                    <td title={item.curso}>{item.curso}</td>
                    <td title={item.semestre}>{item.semestre}</td>
                    <td title={item.disciplina}>{item.disciplina}</td>
                    <td title={item.tema}>{item.tema}</td>
                    <td className="no-wrap" id="buttonRoteiro">
                      <Link to={item.roteiro}>Ver Roteiro</Link>
                    </td>
                    <td title={item.observacao}>{item.observacao}</td>
                    <td className="no-wrap" title={item.token}>
                      {item.token}
                    </td>
                    <td className="buttonOption">
                      <button onClick={() => handleConfirm(item)}>
                        <FaCheck />
                      </button>
                      <button
                        className="negado"
                        onClick={() => handleDeny(item)}
                      >
                        <RiCloseLargeFill />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MultidisciplinarInfo;
