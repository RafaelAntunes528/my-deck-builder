import LifeCounter from "../components/LifeCounter";
import { FaDiceD20 } from "react-icons/fa";
import Footer from "../components/Footer";

function CounterPage() {
    return (
        <>
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-12 p-4">
            <h1 className="text-3xl font-bold text-red-500 flex items-center gap-3">
                <FaDiceD20 className="text-4xl sm:text-5xl text-red-500 drop-shadow-lg" />
                Life Counter
            </h1>
            <LifeCounter />
        </div>
        <Footer leve />
        </>
    );
}

export default CounterPage;