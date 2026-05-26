import { Button, Input } from "@medusajs/ui";
import InputLabel from "./Label.jsx";
// import selectDataGrid from "../Utilities/selectDataGrid.jsx";
// import api from "../../Sources/Api";
import selectImages, { convertFileToBase64 } from "../Utilities/selectImage";

export default function ImageSelector({
  onSelected,
  label,
  count = null,
  previewImg,
  multiple,
  t,
}) {
  // const getData = async () => {
  //   return await api.get("/images").then((data) => data.data.reverse());
  // };

  return (
    <div className="w-full flex flex-col gap-1 items-center justify-center">
      {(previewImg && previewImg.includes("data:image")) && <img src={previewImg} alt="" className="h-16 aspect-square object-contain" />}
      <div className="grid grid-cols-[2fr_1fr] gap-2 [&_div:has(>input)]:self-end w-full">
        <InputLabel className={"flex flex-col gap-[0.25rem]"} label={label}>
          <Button
            variant="secondary"
            onClick={async () => {
              const selected = await selectImages(multiple);

              if (selected && selected[0]) {
                const base64 = await convertFileToBase64(selected[0]);

                onSelected(base64);
              }
            }}
            className="w-full"
          >
            {t("images")} {count !== null && `(${count})`}
          </Button>
        </InputLabel>
        <Input
          value={""}
          placeholder={t("paste_image_here")}
          onPaste={async (event) => {
            const items = event.clipboardData?.items;

            if (!items || !items.length) {
              return;
            }

            const imageItem = Array.from(items).find((item) =>
              item.type.startsWith("image/"),
            );

            if (!imageItem) {
              return;
            }

            event.preventDefault();

            const file = imageItem.getAsFile();

            if (!file) {
              return;
            }

            const base64 = await convertFileToBase64(file);
            onSelected(base64);
          }}
          type="text"
          className="w-full"
        />
      </div>
    </div>
  );
}
