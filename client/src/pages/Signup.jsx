import Signup from "../components/Signup";
import NavBarHome from "../components/NavBarHome";
import LogoWithGlow from "../components/logowithGlow";

function SignUpPage() {
  return (
    <>
      <header><NavBarHome /></header>

      <div className=" text-center">
                  {/* LOGOTIPO*/}
                  <LogoWithGlow />
                  </div>

      <div className="App">
        <Signup /> <br />

      </div>
      <footer className=" text-gray-500 text-sm text-center pb-6">
        © {new Date().getFullYear()} My Deck Builder. All rights reserved.
      </footer>
    </>
  );
}

export default SignUpPage;
