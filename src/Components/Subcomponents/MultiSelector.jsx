import { Badge } from "@medusajs/ui";
import InputLabel from "./Label";
import multiSelectDataList from "../Utilities/multiSelectDataList";
import Contexts from "../../Sources/Contexts";
import { useContext } from "react";

export default function MultiSelector({
  showValue,
  getData,
  onChange,
  label,
  value,
  placeholder,
  callbackData,
  selectorData = [],
}) {
  const { darkMode, t } = useContext(Contexts.globalContext);

  return (
    <InputLabel className={"flex flex-col gap-[0.25rem]"} label={label}>
      <Badge
        onClick={async () => {
          const arr = await getData(callbackData);

          let data, indexes;

          if (Array.isArray(arr) && arr.length === 2 && Array.isArray(arr[0])) {
            data = arr[0];
            indexes = arr[1];
          } else {
            data = arr;
            console.log(data, value);
            indexes = value.map((itm) =>
              data
                .map(
                  (itm2) =>
                    itm2.id ||
                    itm2[
                      Object.keys(itm2).find((it) => it.includes("unique"))
                    ] ||
                    JSON.stringify(itm2),
                )
                .indexOf(
                  itm.id ||
                    itm[Object.keys(itm).find((it) => it.includes("unique"))] ||
                    JSON.stringify(itm),
                ),
            );
          }

          console.log(indexes);

          const selected = await multiSelectDataList({
            data: data,
            getData,
            noItems: t("no_items"),
            saveButtonText: t("save"),
            addButtonText: t("add"),
            cancelButtonText: t("cancel"),
            selectedTitle: t("selected_title"),
            noSelectedTitle: t("no_selected_title"),
            alreadySelectedIndexes: indexes,
            ...selectorData,
          });
          if (selected) {
            onChange(selected);
          }
        }}
        className={darkMode ? "pseudo-button-dark" : "pseudo-button"}
      >
        {(showValue && `${t("selected")} ${showValue}`) || placeholder}
      </Badge>
    </InputLabel>
  );
}
