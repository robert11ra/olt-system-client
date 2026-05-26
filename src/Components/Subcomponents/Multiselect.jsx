import { DropdownMenu, Checkbox, Badge } from "@medusajs/ui";
import { useContext, useState } from "react";
import Contexts from "../../Sources/Contexts";

export function MultiSelect({ data, onSelected, selecteds, children }) {
  const [open, setOpen] = useState(false);
  const { lang } = useContext(Contexts.langContext);

  return (
    <>
      <DropdownMenu open={open} modal={false}>
        <DropdownMenu.Trigger onClick={() => setOpen(!open)} asChild>
          {children}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="dropdownChild">
          <div>
            {data.map((item, i) => (
              <DropdownMenu.Item
                onClick={() => onSelected(item)}
                key={i}
                className="gap-x-2"
              >
                <Checkbox
                  id={"chkbx-" + i}
                  onClick={() => onSelected(item)}
                  checked={selecteds.includes(item.id)}
                />
                <label
                  className="w-[95%] cursor-pointer h-full"
                >
                  {item.name}
                </label>
              </DropdownMenu.Item>
            ))}
          </div>
          <DropdownMenu.Separator />
          <DropdownMenu.Shortcut
            onClick={() => setOpen(false)}
            className="w-full px-2 flex"
          >
            <Badge className="pseudo-button text-black transition-all cursor-pointer text-ui-tag-neutral-text h-6 flex-grow">
              <span className="w-full text-center">{lang.general.save}</span>
            </Badge>
          </DropdownMenu.Shortcut>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}
