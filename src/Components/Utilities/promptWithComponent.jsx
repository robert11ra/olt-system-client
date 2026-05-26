import { createRoot } from "react-dom/client";
import "../../assets/App.css";
import Contexts from "../../Sources/Contexts";
import es from "../../Languajes/es";
import zh from "../../Languajes/zh";

const langList = {
  es,
  zh
}

export default async function promptWithComponent(component) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  if (localStorage.getItem("darkMode") == "true") {
    document.body.classList.add("dark");
  }

  const root = createRoot(div);

  const darkMode = localStorage.getItem("darkMode") === "true";

  return await new Promise((resolve) => {
    root.render(
      <Contexts.globalContext.Provider
        value={{
          darkMode,
          boxiconIconColor: darkMode ? "rgb(229, 229, 229)" : "black",
          variantButtonColor: darkMode ? "primary" : "secondary",
          t: (key) => (langList[localStorage.getItem("language") || "es"] ?? es)[key]

        }}
      >
        {component(resolve)}
      </Contexts.globalContext.Provider>
    );
  }).then((value) => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 200);
    return value;
  });
}
