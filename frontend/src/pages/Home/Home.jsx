import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import Footer from "../../components/layout/Footer";

import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <HowItWorks />

      <Footer />
    </>
  );
}


export default Home;