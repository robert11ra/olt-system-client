import { Button, Drawer } from "@medusajs/ui";
import { createRoot } from "react-dom/client";
import "../../assets/App.css";

export default async function seeImages(imagesArray, lang) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  return await new Promise((resolve) => {
    root.render(<SeeImages lang={lang} resolve={resolve} data={imagesArray} />);
  }).then((selected) => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 200);

    return selected;
  });
}

function SeeImages({ data, resolve, lang }) {
  return (
    <>
      <Drawer onOpenChange={() => resolve()} defaultOpen={true}>
        <Drawer.Content className="z-20">
          <Drawer.Header>
            <Drawer.Title>{lang.general.images}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex-grow overflow-y-auto flex flex-col w-full">
            {(data?.length ?? 0) > 0 ? (
                <div className="w-full grid grid-cols-2 gap-2">
                  {data?.map((image, index) => (
                    <img
                      key={index}
                      className="w-full object-cover aspect-square border shadow-borders-base rounded-lg"
                      src={image}
                      alt={"img"}
                    />
                  ))}
                </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <h1 className="text-lg font-semibold">{lang.general.noImages}</h1>
              </div>
            )}
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button variant="danger">Cerrar</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  );
}
