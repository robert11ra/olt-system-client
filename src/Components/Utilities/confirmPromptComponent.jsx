import { Prompt } from "@medusajs/ui";
import Contexts from "../../Sources/Contexts";
import { useContext } from "react";

export default function ConfirmPrompt({ resolve, title, desc }) {
  const { t } = useContext(Contexts.globalContext);

  return (
    <>
      <Prompt onOpenChange={() => resolve(false)} variant="danger" defaultOpen={true}>
        <Prompt.Content className={"z-20 md:!w-[35vw] !w-[90vw] max-w-[90vw]"}>
          <Prompt.Header>
            <Prompt.Title>{title || t('are_u_sure')}</Prompt.Title>
            <Prompt.Description>{desc || t('this_action_cannot_be_undone')}</Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={() => resolve(false)}>
              { t('cancel') }
            </Prompt.Cancel>
            <Prompt.Action onClick={() => resolve(true)}>
              { t('im_sure') }
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}
