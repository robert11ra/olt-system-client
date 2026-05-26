import { Button, Prompt, Input } from "@medusajs/ui";
import { createRoot } from "react-dom/client";
import "../../assets/App.css";
import { useState, useContext } from "react";
import Contexts from "../../Sources/Contexts";

export default async function selectDataList({
  data = [],
  getData = () => {},
  callbackData,
  drawerTitle = [],
  drawerHeader = "Selecciona",
  addFunction = null,
  cancelButtonText = "Cancelar",
  addButtonText = "Añadir",
  searchInputPlaceholder = "Buscar...",
  noItems = "No hay elementos",
}) {
  const extractProp = (item, arr) => {
    return arr.reduce((acc, key) => (acc ? acc[key] : null), item);
  };

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
            await getData(callbackData).then((data) =>
              data.map((item) => {
                return {
                  returnValue: item,
                  titleKey: extractProp(item, drawerTitle),
                };
              }),
            )
          }
          callbackData={callbackData}
          resolve={resolve}
          title={drawerHeader}
          addFunction={addFunction}
          addButtonText={addButtonText}
          searchInputPlaceholder={searchInputPlaceholder}
          cancelButtonText={cancelButtonText}
          noItems={noItems}
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
  callbackData,
  resolve,
  title,
  addFunction,
  addButtonText,
  cancelButtonText,
  searchInputPlaceholder,
  noItems,
}) {
  const [dataState, setDataState] = useState(data);
  const [search, setSearch] = useState("");
  const { darkMode, variantButtonColor } = useContext(Contexts.globalContext);
  const [opened, setOpened] = useState(true);

  return (
    <>
      {/* <div className="formpromptselector !hidden"></div> */}

      <Prompt
        onOpenChange={() => {
          setOpened(false);
          setTimeout(() => resolve(null), 500);
        }}
        open={opened ?? undefined}
        defaultOpen={true}
      >
        {" "}
        <Prompt.Content className="z-20 md:!w-[50vw] w-[95vw] max-w-full h-[95vh] md:h-[70vh] min-h-[400px]">
          <Prompt.Header>
            <Prompt.Title className={darkMode ? "text-white" : ""}>
              {title}
            </Prompt.Title>
          </Prompt.Header>
          <Prompt.Description className="max-h-min">
            <div className="sticky gap-5 w-full top-0 z-10 grid grid-cols-2 [&_div]:w-full p-10">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
                placeholder={searchInputPlaceholder}
              />
              {addFunction && (
                <Button
                  onClick={async () => {
                    await addFunction();
                    await getData(callbackData).then((data) =>
                      setDataState(data),
                    );
                  }}
                  className="w-full"
                  variant={variantButtonColor}
                >
                  {addButtonText}
                </Button>
              )}
            </div>
          </Prompt.Description>
          <hr />
          <div className="flex flex-col gap-4 h-full max-h-full overflow-auto p-4">
            {dataState
              .filter((item) =>
                item?.titleKey?.toLowerCase()?.includes(search.toLowerCase()),
              )
              .map((item, index) => (
                <>
                  <Button
                    className="w-full !text-left px-4 font-normal justify-start text-base min-h-max"
                    key={index}
                    onClick={() => {
                      setOpened(false);
                      setTimeout(() => resolve(item.returnValue), 500);
                    }}
                    variant={variantButtonColor}
                  >
                    {item.titleKey}
                  </Button>
                </>
              ))}
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
          <Prompt.Footer>
            <Button
              onClick={() => {
                setOpened(false);
                setTimeout(() => resolve(null), 500);
              }}
              variant="danger"
            >
              {cancelButtonText}
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}
