import AppRoutes from "../../routes/AppRoutes";

import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";

import "./App.css";
import "./variables.css";

const App = () => {
  return (
    <>
      <Navigation />
      <AppRoutes />
      <Footer />
    </>
  );
};

export default App;
