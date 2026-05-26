import { Prompt } from "@medusajs/ui";
import { useContext } from "react";
import Contexts from "../../Sources/Contexts";
import { he } from "date-fns/locale";

export default function AlertMessage({
  resolve,
  text = "",
  title = "",
  buttonText,
  className = "md:w-[65vw] max-h-[90vh] md:max-h-none",
}) {
  const { t } = useContext(Contexts.globalContext);

  return (
    <>
      <Prompt
        onOpenChange={() => resolve()}
        variant="confirmation"
        defaultOpen={true}
      >
        <Prompt.Content className={`z-20 w-[90vw] ${className} max-w-[90vw]`}>
          <Prompt.Header>
            <Prompt.Title>{title}</Prompt.Title>
            <Prompt.Description>{text}</Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Action id="componentalert_id" onClick={() => resolve()}>
              {buttonText || t("accept")}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}
