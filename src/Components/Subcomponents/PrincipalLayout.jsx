import { useContext } from "react";
import Contexts from "../../Sources/Contexts";
import Nav from "./Nav.jsx";
import { useMatch } from "react-router-dom";
import { Toaster } from "@medusajs/ui";

export default function PrincipalLayout({ children, viewAvailable }) {
  const matchLogin = useMatch("/login");
  const matchRegister = useMatch("/register");

  const { darkMode } = useContext(Contexts.globalContext);

  const shouldRenderNav = !matchLogin && !matchRegister;

  return viewAvailable ? (
    <div
      className={`layout-window ${
        shouldRenderNav &&
        `${
          darkMode ? "dark bg-neutral-900 text-white" : "bg-neutral-50"
        } bg-neutral-100 pb-5`
      }`}
    >
      {shouldRenderNav && <Nav />}
      <div
        className={`flex-grow ${
          darkMode &&
          shouldRenderNav &&
          "[&_.text-ui-fg-subtle]:text-neutral-100 [&_.text-ui-fg-base:not(button)]:text-neutral-200 hover:[&_.text-ui-fg-base]:text-black"
        } ${
          shouldRenderNav
            ? `p-8 mt-8 mb-4 md:my-4 mr-4 ml-4 md:ml-0 shadow-md border  rounded-2xl ${
                darkMode && shouldRenderNav
                  ? "bg-neutral-800 border-slate-900"
                  : "bg-neutral-50 border-slate-200"
              }`
            : ""
        } max-w-[100vwx] md:max-h-screen md:overflow-y-auto`}
      >
        {children}
        <Toaster position="bottom-right" pauseWhenPageIsHidden={true} className="text-black" />
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}
