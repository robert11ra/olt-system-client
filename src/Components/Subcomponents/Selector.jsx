import { Badge } from "@medusajs/ui";
import InputLabel from "./Label.jsx";
import selectDataList from "../Utilities/selectDataList.jsx";
import Contexts from "../../Sources/Contexts";
import { useContext, useState } from "react";

export default function Selector({
  showValue,
  getData,
  disabled,
  onChange = () => {},
  label,
  callbackData,
  placeholder,
  selectorData = {
    drawerTitle: ["name"],
    drawerHeader: "Selecciona",
    addFunction: null,
    cancelButtonText: "Cancelar",
    addButtonText: "Añadir",
    searchInputPlaceholder: "Buscar...",
    noItems: "No hay elementos",
  },
  defaultValue,
}) {
  const { darkMode, t } = useContext(Contexts.globalContext);
  const [inactive, setInactive] = useState(false);

  return (
    <InputLabel className={"flex flex-col gap-[0.25rem]"} label={label}>
      <Badge
        tabIndex={0}
        onKeyDown={async (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (inactive) return;
            setInactive(true);

            selectDataList({
              data: await getData(callbackData),
              noItems: t("no_items"),
              saveButtonText: t("save"),
              addButtonText: t("add"),
              cancelButtonText: t("cancel"),
              callbackData,
              getData,
              ...selectorData,
            }).then((selected) => {
              if (selected) {
                onChange(selected);
              }
              setInactive(false);
            });
          }
        }}
        onClick={async () => {
          if (inactive) return;
          if (disabled) return;

          setInactive(true);

          const selected = await selectDataList({
            data: await getData(callbackData),
            getData,
            noItems: t("no_items"),
            saveButtonText: t("save"),
            addButtonText: t("add"),
            cancelButtonText: t("cancel"),
            ...selectorData,
          });

          if (selected) {
            onChange(selected);
          }

          setInactive(false);
        }}
        className={darkMode ? "pseudo-button-dark" : "pseudo-button"}
      >
        {showValue ?? (defaultValue ? defaultValue : placeholder)}
      </Badge>
    </InputLabel>
  );
}
