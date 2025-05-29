// import {BrowserR}
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import HeroDetail from "./pages/HeroDetail";
import HeroEdit from "./pages/HeroEdit";
import FavouriteHero from "./pages/FavouriteHero";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/register"} element={<Register />} />
        <Route path={"/login"} element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path={"/"} element={<Home />} />
          <Route path={"/heroes/:id"} element={<HeroDetail />} />
          <Route path={"/heroes/edit/:id"} element={<HeroEdit />} />
          <Route path={"/users/favourites"} element={<FavouriteHero />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
