import Signup from "../components/Signup";
import LogoWithGlow from "../components/LogowithGlow";
import Footer from "../components/Footer";
import NavBarAndSearch from "../components/NavBarAndSearch";

function SignUpPage() {
  return (
    <>
      <NavBarAndSearch />

      <div className="text-center pt-6 overflow-visible">
                  {/* LOGOTIPO*/}
                  <LogoWithGlow />
                  </div>

      <div className="App">
        <Signup /> <br />

      </div>
      <Footer leve />
    </>
  );
}

export default SignUpPage;
