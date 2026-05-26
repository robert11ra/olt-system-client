import { useContext } from "react";
import Contexts from "../../Sources/Contexts";

export default function InputLabel({ label, children, className, element="label" }) {
  const { darkMode } = useContext(Contexts.globalContext);

  return (
    <>
      {element == "label" ? <label className={(darkMode ? "text-neutral-300" : "text-gray-800") + " font-medium " + (className ?? "")}>
        <span className="text-[.8rem] ml-1">{label}</span>
        {children}
      </label> : <div className={(darkMode ? "text-neutral-300" : "text-gray-800") + " font-medium " + (className ?? "")}>
        <span className="text-[.8rem] ml-1">{label}</span>
        {children}
      </div>}
    </>
  );
}
