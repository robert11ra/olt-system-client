import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrincipalLayout from "./Components/Subcomponents/PrincipalLayout.jsx";
import Users from "./Components/Users.jsx";
import Clients from "./Components/Clients.jsx";
import Companies from "./Components/Companies.jsx";
import Mikrotiks from "./Components/Mikrotiks.jsx";
import Olts from "./Components/Olts.jsx";
import Plans from "./Components/Plans.jsx";
import Login from "./Components/Login.jsx";
import Contexts from "./Sources/Contexts.js";
import api from "./Sources/Api.js";
import { useEffect, useState } from "react";
import es from "./Languajes/es.js";
import zh from "./Languajes/zh.js";

const langList = {
  es,
  zh,
};

function App() {
  // LOGGED USER
  const [user, setUser] = useState({});
  //const [configurations, setConfigurations] = useState({});
  // const [rate, setRate] = useState(0);
  const [viewAvailable, setViewAvailable] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    () => langList[localStorage.getItem("language") || "es"] ?? es,
  );

  // DARK MODE
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  const getUser = async (initial = true) => {
    const { userData } = await api.get("/auth/validate").then((x) => x.data);

    if (initial) {
      setUser(userData);
      //setConfigurations(configurations);
    } else {
      return setUser(userData);
    }

    if (!userData && window.location.pathname !== "/login") {
      return (window.location.href = "/login");
    }

    setViewAvailable(true);

    if (userData && window.location.pathname === "/login") {
      return (window.location.href = "/");
    }

    // if(userData && window.location.pathname !== "/login") {
    // getRates();}
  };

  // const getRates = async () => {
  //   const currencies = await api.get("/currencies").then((x) => x.data);
  //   currencies.forEach((currency) => {
  //     if (currency.code === "$") {
  //       setRate(currency.rate);
  //     }
  //   });
  // };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("language", selectedLanguage["key"]);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode === true ? "true" : "false");
  }, [darkMode]);

  return (
    <>
      <div>
        <BrowserRouter basename="/">
          <Contexts.globalContext.Provider
            value={{
              user,
              //configurations,
              setUser,
              getUser,
              darkMode,
              setDarkMode,
              boxiconIconColor: darkMode ? "rgb(229, 229, 229)" : "black",
              variantButtonColor: darkMode ? "primary" : "secondary",
              t: (key) => selectedLanguage[key],
              selectedLanguage,
              //checkRoles: (...roles) => roles.includes(user.rol_unique_roles),
              setSelectedLanguage: (language) =>
                setSelectedLanguage(langList[language]),
            }}
          >
            <PrincipalLayout viewAvailable={viewAvailable}>
              <Routes>
                <Route path="/login" element={<Login />} />

                {viewAvailable && (
                  <>
                    <Route path="/" element={<Users />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/mikrotiks" element={<Mikrotiks />} />
                    <Route path ="/olts" element={<Olts />} />
                    <Route path="/plans" element={<Plans />} />
                  </>
                )}

                <Route path="*" element={<h1>404</h1>} />
              </Routes>
            </PrincipalLayout>
          </Contexts.globalContext.Provider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
