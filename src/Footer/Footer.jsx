import { Link } from "react-router-dom";
import "./Footer.css";

function App() {
  return (
    <>
      <footer>
        <div className="footer-left">
          <img src="/anhangueraLogo.png" alt="" />
          <h1>
            ©2024 Unime Anhanguera Salvador - Portal de Reservas. Feito por
            <Link to={"https://github.com/luizndev"}>Luis Eduardo Andrade</Link>
          </h1>
        </div>

        <div className="footer-right">
          <Link to={"https://instagram.com/luizn.dev"}>
            <img src="/instagram.svg" alt="" />
          </Link>
          <Link to={"/"}>
            <img src="/facebook.svg" alt="" />
          </Link>
          <Link to={"https://wa.me/+5572988683102"}>
            <img src="/whatsapp.svg" alt="" />
          </Link>
        </div>
      </footer>
    </>
  );
}

export default App;
