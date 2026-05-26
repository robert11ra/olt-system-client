import { Button, DropdownMenu, IconButton } from "@medusajs/ui";
import { Trash, PencilSquare, EllipsisHorizontal } from "@medusajs/icons";
import Contexts from "../../Sources/Contexts";
import { useContext } from "react";

export default function AdaptableDropDown({
  icon,
  text,
  className,
  mAuto=true,
  functions = [
    {
      label: "Editar",
      icon: <PencilSquare />,
      operation: () => {},
    },
    {
      label: "Eliminar",
      icon: <Trash />,
      operation: () => {},
    },
  ],
  variant="transparent",
  disabled=false
}) {
  const { darkMode, variantButtonColor } = useContext(Contexts.globalContext);

  return (
    <>
      <DropdownMenu open={disabled === true ? false : undefined}>
        <DropdownMenu.Trigger asChild>
          <div className={className ? "" : `${mAuto && "px-5 ml-auto"} w-fit flex justify-end`}>
            {text ? (
              <Button disabled={disabled} className={className} variant={variant || "transparent"}>
                {icon ? icon : <EllipsisHorizontal />}
                {text ? text : ""}
              </Button>
            ) : (
              <IconButton
                className={
                  darkMode &&
                  "bg-neutral-800 hover:bg-neutral-700 border !border-neutral-900 "
                    
                }
              >
                <EllipsisHorizontal />
              </IconButton>
            )}
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className={(darkMode && "bg-neutral-800") + " gap-1 flex flex-col !overflow-y-auto"}
        >
          {functions.map((item, i) => (
            <DropdownMenu.Item
              key={i}
              onClick={() => item.operation()}
              className={
                "gap-x-2 " +
                (darkMode && "bg-neutral-800 text-white hover:!bg-neutral-700")
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}
