import Login from "../components/Login Form/Login";
import NavBarHome from "../components/NavBarHome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoWithGlow from "../components/logowithGlow";

// Pagina do login do site. 
// Importante: o servidor deve estar rodando na porta 3030 para que a API funcione corretamente

function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (
      token &&
      username &&
      username !== 'null' &&
      username !== 'undefined'
    ) {
      navigate(`/profile/${username}`, { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <div className="relative min-h-screen flex flex-col align-middle justify-evenly px-6 sm:px-10 lg:px-16 py-12 pt-0">
      <header>
        <NavBarHome />
      </header>

      <div className=" text-center">
      {/* LOGOTIPO*/}
      <LogoWithGlow />
      </div >

      <div className="App">
        <Login /> <br />
      </div>
      <footer className="text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} My Deck Builder. All rights reserved.
      </footer>
      </div >
    </>
  );
}

export default LoginPage;
