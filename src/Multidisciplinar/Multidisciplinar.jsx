import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Importar useNavigate
import "./Multidisciplinar.css";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx"; // Caminho corrigido

const MultidisciplinarForm = () => {
  const [formData, setFormData] = useState({
    professor: "",
    email: "",
    data: "",
    modalidade: "",
    alunos: "",
    laboratorio: "",
    curso: "",
    turno: "",
    semestre: "",
    disciplina: "",
    tema: "",
    roteiro: "",
    observacao: "",
    token: "Não",
    status: "Não",
  });

  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState(""); // Novo estado para detalhes do erro
  const { id } = useParams(); // Obter o parâmetro ID da URL
  const navigate = useNavigate(); // Usar useNavigate para redirecionamento

  // Buscar dados quando o ID estiver disponível
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://unime-pdr.vercel.app/auth/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            setFormData((prevData) => ({
              ...prevData,
              professor: response.data.user.name,
              email: response.data.user.email,
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  // Adicionar o listener do evento após o componente ser montado
  useEffect(() => {
    const link = document.getElementById("open-new-tab");

    const handleClick = (event) => {
      event.preventDefault();
      window.open(
        "https://uploadnow.io/pt?utm_source=gads&utm_medium=pt&gclid=CjwKCAiAxP2eBhBiEiwA5puhNVrJySdfeYLebcBtvOQA3A1oiM6cFCefv2Xc0oMw1YMf1YySIDqRTxoCoCkQAvD_BwE",
        "_blank"
      );
    };

    if (link) {
      link.addEventListener("click", handleClick);
    }

    // Cleanup function
    return () => {
      if (link) {
        link.removeEventListener("click", handleClick);
      }
    };
  }, []);

  // Função para validar e ajustar a data
  const validateDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Ajustar para o início do dia

    if (selectedDate < today) {
      return today.toISOString().split("T")[0]; // Ajustar para hoje se a data estiver no passado
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 6); // Data mínima permitida é hoje + 7 dias

    if (selectedDate < minDate) {
      return minDate.toISOString().split("T")[0]; // Ajustar para a data mínima se a data estiver antes disso
    }

    return date;
  };

  const isDateValid = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return false;
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 6);

    if (selectedDate < minDate) {
      return false;
    }

    return true;
  };

  const generateToken = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "LABS-";
    for (let i = 0; i < 6; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "data" ? validateDate(value) : value;

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDateValid(formData.data)) {
      setErrorDetails(
        "A reserva deve ser feita com pelo menos 7 dias de antecedência e não pode ser para uma data no passado."
      );
      return;
    }

    const token = generateToken();
    setFormData((prevData) => ({ ...prevData, token }));

    try {
      const response = await axios.post(
        "https://unime-pdr.vercel.app/multidisciplinar/register",
        { ...formData, token }
      );
      setMessage(response.data.message);
      setErrorDetails("");
      setFormData({
        professor: "",
        email: "",
        data: "",
        modalidade: "",
        alunos: "",
        laboratorio: "",
        curso: "",
        turno: "",
        semestre: "",
        disciplina: "",
        tema: "",
        roteiro: "",
        observacao: "",
        token: "Não",
        status: "Não",
      });
      navigate(`/sucesso/${token}`);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorDetails(error.response.data.message);
      } else {
        setErrorDetails("Erro ao registrar formulário");
      }
    }
  };

  return (
    <div className="containerDashboard">
      <Menu props={useParams()} />
      <form className="multidisciplinar" onSubmit={handleSubmit}>
        <div className="title-solic">
          <h1>Laboratório DE MULTIDISCIPLINAR</h1>
          <span>
            Responda esse formulario e irá receber em seu e-mail a resposta da
            sua reserva!
          </span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Nome do Professor"
            name="professor"
            value={formData.professor}
            onChange={handleChange}
            readOnly
          />
          <span>Nome do Professor</span>
        </div>
        <div className="inputbox">
          <div className="inputContainer">
            <input
              type="text"
              placeholder="E-mail Institucional"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <span>E-mail Institucional</span>
        </div>
        <div className="inputbox">
          <input
            type="date"
            placeholder="Data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
          <span>Data (realização da aula).</span>
        </div>
        <div className="inputbox">
          <select
            name="modalidade"
            value={formData.modalidade}
            onChange={handleChange}
            required
          >
            <option value="">Qual Modalidade?</option>
            <option value="100% Online">100% Online</option>
            <option value="Semi Presencial">Semi Presencial</option>
            <option value="Presencial">Presencial</option>
          </select>
          <span>Modalidade</span>
        </div>
        <div className="inputbox">
          <input
            type="number"
            placeholder="Quantidade de Alunos"
            name="alunos"
            value={formData.alunos}
            onChange={handleChange}
            required
          />
          <span>Quantidade de Alunos</span>
        </div>
        <div className="inputbox">
          <select
            name="laboratorio"
            value={formData.laboratorio}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma opção</option>
            <option value="Agência Experimental ">Agência Experimental </option>
            <option value="Ateliê">Ateliê</option>
            <option value="Estúdio de Fotografia">Estúdio de Fotografia</option>
            <option value="Lab. de Maqueteria, Conforto e Ergonomia ">
              Lab. de Maqueteria, Conforto e Ergonomia{" "}
            </option>
            <option value="Lab. de Materiais Construções Solos e Topografia">
              Lab. de Materiais Construções Solos e Topografia
            </option>
            <option value="Lab. de Sistemas Elétricos Eletrôn. e Automação">
              Lab. de Sistemas Elétricos Eletrôn. e Automação
            </option>
            <option value="Lab. de Sistemas Hid. Pneumáticos e Térmicos">
              Lab. de Sistemas Hid. Pneumáticos e Térmicos
            </option>
            <option value="Lab. Física, Materiais E Mecânica Aplicada">
              Lab. Física, Materiais E Mecânica Aplicada
            </option>
            <option value="Lab. Morfofuncional de Medicina Veterinária ">
              Lab. Morfofuncional de Medicina Veterinária{" "}
            </option>
            <option value="Laboratório de Enfermagem I ">
              Laboratório de Enfermagem I{" "}
            </option>
            <option value="Laboratório de Enfermagem II ">
              Laboratório de Enfermagem II{" "}
            </option>
            <option value="Laboratório de Estética">
              Laboratório de Estética
            </option>
            <option value="Laboratório de Fisioterapia">
              Laboratório de Fisioterapia
            </option>
            <option value="Laboratório de Microscopia">
              Laboratório de Microscopia
            </option>
            <option value="Laboratório de Processos Químicos">
              Laboratório de Processos Químicos
            </option>
            <option value="Laboratório de Técnica Dietética">
              Laboratório de Técnica Dietética
            </option>
            <option value="Laboratório Física, Materiais e Mecânica Aplicada ">
              Laboratório Física, Materiais e Mecânica Aplicada{" "}
            </option>
            <option value="Laboratório Morfofuncional">
              Laboratório Morfofuncional
            </option>
            <option value="Laboratório Motores e Processos de Fabricação">
              Laboratório Motores e Processos de Fabricação
            </option>
            <option value="Laboratório Multidisciplinar">
              Laboratório Multidisciplinar
            </option>
            <option value="Laboratório Multidisciplinar de Química">
              Laboratório Multidisciplinar de Química
            </option>
            <option value="Laboratório Pré-Odontológico">
              Laboratório Pré-Odontológico
            </option>
            <option value="Laboratório Técnicas Farmacêuticas">
              Laboratório Técnicas Farmacêuticas
            </option>
            <option value="Sala de Atividades Multidisciplinares">
              Sala de Atividades Multidisciplinares
            </option>
            <option value="Sala de Desenho I">Sala de Desenho I</option>
            <option value="Sala de Desenho II">Sala de Desenho II</option>
          </select>
          <span>Laboratório</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Curso"
            name="curso"
            value={formData.curso}
            onChange={handleChange}
            required
          />
          <span>Curso</span>
        </div>
        <div className="inputbox">
          <select
            name="turno"
            value={formData.turno}
            onChange={handleChange}
            required
          >
            <option value="">Turno</option>
            <option value="Matutino">Matutino</option>
            <option value="Vespertino">Vespertino</option>
            <option value="Noturno">Noturno</option>
          </select>
          <span>Turno</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Semestre"
            name="semestre"
            value={formData.semestre}
            onChange={handleChange}
            required
          />
          <span>Semestre</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Disciplina"
            name="disciplina"
            value={formData.disciplina}
            onChange={handleChange}
            required
          />
          <span>Disciplina</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Tema"
            name="tema"
            value={formData.tema}
            onChange={handleChange}
            required
          />
          <span>Tema</span>
        </div>
        <div className="inputbox" id="uploaded">
          <input
            id="open-new-tab"
            type="submit"
            value="FAZER UPLOAD DO ROTEIRO"
          />
          <span>Anexar roteiro.</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Roteiro"
            name="roteiro"
            value={formData.roteiro}
            onChange={handleChange}
            required
          />
          <span>Roteiro</span>
        </div>
        <div className="inputbox">
          <input
            placeholder="Observação"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
          />
          <span>Observação</span>
        </div>
        {errorDetails && <p className="error-message">{errorDetails}</p>}
        {message && <p className="success-message">{message}</p>}
        <div className="inputbox">
          <input
            id="button-box-sucess"
            type="submit"
            value="FINALIZAR SUA SOLICITAÇÃO"
          />
        </div>
      </form>
    </div>
  );
};

export default MultidisciplinarForm;
