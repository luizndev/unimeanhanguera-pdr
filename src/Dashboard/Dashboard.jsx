import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Whatsapp from "../Whatsapp/Whatsapp.jsx";

const Dashboard = () => {
  const { id } = useParams();

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
        }
      } catch (error) {
        console.error("Error fetching informatica data:", error);
      }
    };

    fetchInformaticaData();
  }, []);

  return (
    <div className="containerDashboard">
      <Menu props={useParams()} />
      <section className="mainStyle-Container">
        <div className="mainStyle">
          <h1>
            Vem por aqui: reserve seu espaço no laboratório e transforme vidas
          </h1>
          <button>
            <Link to={`/informatica/${id}`}>Realizar Reserva</Link>
          </button>
        </div>
        <img src="/image.svg" alt="Imagem" />
      </section>
      <Whatsapp></Whatsapp>
      <Footer></Footer>
    </div>
  );
};

export default Dashboard;
