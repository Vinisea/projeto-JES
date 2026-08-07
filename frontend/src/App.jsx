import { NavBar } from "./components/NavBar/NavBar.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout/MainLayout.jsx";

export const App = () => {
  <>
    <NavBar />
    <Routes>
      <Route path={"/"} element={<MainLayout />} />
      <Route path={"/*"} element={<MainLayout />} /> {/*Completar depois*/}
      <Route path={"/*"} element={<MainLayout />} /> {/*Completar depois*/}
    </Routes>
    <Footer />
  </>;
};
