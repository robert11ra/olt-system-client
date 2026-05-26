import { Prompt, Input } from "@medusajs/ui";
import { useState } from "react";

export default function NewNamePrompt({ resolve, title }) {
  const [name, setName] = useState("");

  return (
    <>
      <Prompt variant="confirmation" defaultOpen={true}>
        <Prompt.Content className="z-20 max-w-[90vw] md:max-w-[400px]">
          <Prompt.Header>
            <Prompt.Title>{title}</Prompt.Title>
            <Input
              className="my-4"
              onChange={(e) => setName(e.target.value)}
              />
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={() => resolve(null)}>Cancelar</Prompt.Cancel>
            <Prompt.Action onClick={() => resolve(name)}>Guardar</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}