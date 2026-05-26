import { Button, Prompt, Input, TooltipProvider, IconButton, Tooltip } from "@medusajs/ui";
import { createRoot } from "react-dom/client";
import "../../assets/App.css";
import Contexts from "../../Sources/Contexts";
import { useContext, useState } from "react";
import * as medusaIcons from "@medusajs/icons";

const extractProp = (item, arr) => {
  return arr.reduce((acc, key) => acc[key], item);
};

export default async function multiSelectDataList({
  data = [],
  getData = () => {},
  drawerTitle = ["label"], // OR []
  drawerHeader = "Selecciona",
  addFunction,
  alreadySelectedIndexes = [],
  everyTimeSelected = [],
  cancelButtonText = "Cancelar",
  noSelectedTitle = "No Seleccionados",
  selectedTitle = "Seleccionados",
  addButtonText = "Añadir",
  saveButtonText = "Guardar",
  noItems = "No hay elementos",
}) {
  const procededData = data.map((item) => {
    return {
      returnValue: item,
      titleKey: extractProp(item, drawerTitle),
    };
  });

  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);
  const darkMode = localStorage.getItem("darkMode") === "true";

  return await new Promise((resolve) => {
    root.render(
      <Contexts.globalContext.Provider
        value={{
          darkMode,
          boxiconIconColor: darkMode ? "rgb(229, 229, 229)" : "black",
          variantButtonColor: darkMode ? "primary" : "secondary",
        }}
      >
        <DrawerList
          data={procededData}
          getData={async () =>
            await getData().then((data) =>
              data.map((item) => ({
                returnValue: item,
                titleKey: extractProp(item, drawerTitle),
              })),
            )
          }
          resolve={resolve}
          title={drawerHeader}
          noItems={noItems}
          cancelButtonText={cancelButtonText}
          noSelectedTitle={noSelectedTitle}
          selectedTitle={selectedTitle}
          saveButtonText={saveButtonText}
          addButtonText={addButtonText}
          addFunction={addFunction}
          alreadySelectedIndexes={alreadySelectedIndexes}
          everyTimeSelected={everyTimeSelected}
        />
      </Contexts.globalContext.Provider>,
    );
  }).then((selected) => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 200);

    return selected;
  });
}

function DrawerList({
  data,
  getData,
  resolve,
  title,
  noSelectedTitle,
  selectedTitle,
  cancelButtonText,
  saveButtonText,
  addButtonText,
  addFunction,
  noItems,
  alreadySelectedIndexes,
  everyTimeSelected,
}) {
  const [dataState, setDataState] = useState(data);
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(undefined);
  const [selected, setSelected] = useState(() => alreadySelectedIndexes);

  const { darkMode, variantButtonColor } = useContext(Contexts.globalContext);

  return (
    <>
      <div className="formpromptselector !hidden"></div>
      <Prompt
        onOpenChange={() => {
          setOpened(false);
          setTimeout(() => resolve(null), 500);
        }}
        open={opened ?? undefined}
        defaultOpen={true}
      >
        <Prompt.Content className="z-20 md:!w-[50vw] w-[95vw] max-w-full h-[95vh] md:h-[70vh] min-h-[400px]">
          <Prompt.Header>
            <Prompt.Title className={darkMode ? "text-white" : ""}>
              {title}
            </Prompt.Title>
          </Prompt.Header>
          <Prompt.Description>
            <div className="sticky gap-5 w-full top-0 z-10 grid grid-cols-2 [&_div]:w-full p-10">
              <div className="flex gap-3">
              <TooltipProvider>
              <Tooltip content={"Seleccionar todo"} placement="top">
                <IconButton
                  onClick={() => {
                    if (selected.length === dataState.length) {
                      setSelected([]);
                      return;
                    }
                    setSelected(dataState.map((r, i) => i));
                  }}
                >
                  <medusaIcons.ListCheckbox />
                </IconButton>
              </Tooltip>
            </TooltipProvider>
              <Input
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
                placeholder={"Buscar..."}
                />
                </div>
              {addFunction && (
                <Button
                  onClick={async () => {
                    await addFunction();
                    const selectedObjs = selected.map(
                      (index) => dataState[index],
                    );
                    const newData = await getData();
                    const newSelected = selectedObjs.map((item) =>
                      newData
                        .map((x) => JSON.stringify(x))
                        .indexOf(JSON.stringify(item)),
                    );

                    setDataState(newData);
                    setSelected(newSelected);
                  }}
                  className="w-full"
                  variant={variantButtonColor}
                >
                  {addButtonText}
                </Button>
              )}
            </div>
          </Prompt.Description>
          <div className="max-h-max mb-auto grid grid-cols-2 overflow-y-auto gap-0 w-full">
            <p className={`text-center ${darkMode ? "text-white" : ""}`}>
              {noSelectedTitle}
            </p>
            <p className={`text-center ${darkMode ? "text-white" : ""}`}>
              {selectedTitle}
            </p>
            <div className="flex flex-col gap-4 h-full max-h-full overflow-auto p-4">
              {dataState
                .map((itm, index) => ({ ...itm, index }))
                .filter(
                  (item) =>
                    item.titleKey
                      .toLowerCase()
                      .includes(search.toLowerCase()) &&
                    !selected.includes(item.index),
                )
                .map((item, index) => {
                  return (
                    <Button
                      className={
                        "w-full !text-left px-4 font-normal justify-start text-sm min-h-max " +
                        (selected.includes(item.index) ||
                        everyTimeSelected.includes(index)
                          ? "shadow-borders-interactive-with-focus"
                          : "hover:!shadow-borders-interactive-with-active")
                      }
                      key={item["index"]}
                      onClick={() => {
                        if (selected.includes(item["index"])) {
                          setSelected(
                            selected.filter((i) => i !== item["index"]),
                          );
                        } else {
                          setSelected([...selected, item["index"]]);
                        }
                      }}
                      variant={variantButtonColor}
                    >
                      {item.titleKey}
                    </Button>
                  );
                })}
              {dataState.length === 0 && (
                <div
                  className={
                    (darkMode ? "text-white" : "") +
                    " w-full h-full flex justify-center items-center"
                  }
                >
                  <p>{noItems}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 h-full max-h-full overflow-auto p-4">
              {dataState
                .map((itm, index) => ({ ...itm, index }))
                .filter((item) => selected.includes(item.index))
                .map((item, index) => {
                  return (
                    <Button
                      className={
                        "w-full !text-left px-4 font-normal justify-start text-sm min-h-max " +
                        (selected.includes(item.index) ||
                        everyTimeSelected.includes(index)
                          ? "shadow-borders-interactive-with-focus"
                          : "hover:!shadow-borders-interactive-with-active")
                      }
                      key={item["index"]}
                      onClick={() => {
                        if (selected.includes(item["index"])) {
                          setSelected(
                            selected.filter((i) => i !== item["index"]),
                          );
                        } else {
                          setSelected([...selected, item["index"]]);
                        }
                      }}
                      variant={variantButtonColor}
                    >
                      {item.titleKey}
                    </Button>
                  );
                })}
              {selected.length === 0 && (
                <div
                  className={
                    (darkMode ? "text-white" : "") +
                    " w-full h-full flex justify-center items-center"
                  }
                >
                  <p>{noItems}</p>
                </div>
              )}
            </div>
          </div>
          <Prompt.Footer>
              <Button onClick={() => resolve(null)} variant="danger">
                {cancelButtonText}
              </Button>
            <Button
              onClick={() => {
                setOpened(false);
                setTimeout(
                  () => resolve(selected.map((i) => dataState[i].returnValue)),
                  500,
                );
              }}
              className={darkMode ? "text-white" : ""}
              variant="secondary"
            >
              {saveButtonText}
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}
