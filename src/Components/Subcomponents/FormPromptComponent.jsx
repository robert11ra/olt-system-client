import {
  Prompt,
  Input,
  Textarea,
  Select,
  CurrencyInput,
  DatePicker,
  Checkbox,
  Button,
} from "@medusajs/ui";
import { useContext, useEffect, useId, useState } from "react";
import Selector from "./Selector.jsx";
import MultiSelector from "./MultiSelector.jsx";
import Contexts from "../../Sources/Contexts";
import InputLabel from "./Label.jsx";
import ImageSelector from "./ImageSelector.jsx";

export default function FormPromptComponent({
  resolve,
  title,
  allWithTopLabel = false,
  className,
  fields = [{ nameProp: "name", label: "Nombre", type: "text" }],
  validateBeforeSave = () => true,
}) {
  const [dataFields, setDataFields] = useState(() =>
    fields
      .filter((f) => f.nameProp)
      .reduce((curr, key) => {
        return {
          ...curr,
          [key.nameProp]:
            key.defaultValue ??
            {
              checkbox: false,
              date: new Date(),
              selector: null,
              multiselector: []
            }[key.type] ??
            "",
        };
      }, {}),
  );

  const { darkMode, t } = useContext(Contexts.globalContext);

  const renderFields = () => {
    return fields.map((field, i) => {
      const components = {
        select: (
          <Select
            onValueChange={(value) => changeProp(
              field.nameProp,
              value,
              field.beforeSet,
              field.dependencies,
              field.setFirst,
            )}
            value={dataFields[field?.nameProp]}
            {...field}
          >
            <Select.Trigger>
              <Select.Value placeholder={field.label} />
            </Select.Trigger>
            <Select.Content className="z-30">
              {(typeof field?.values === "function" ? field.values(dataFields) : field.values)?.map((v, j) => (
                <Select.Item key={j} value={v.item}>
                  {v.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        ),
        currency: (
          <CurrencyInput
            onChange={(e) =>
              changeProp(field.nameProp, e.target.value, field.beforeSet)
            }
            {...field}
          />
        ),
        textarea: (
          <Textarea
            onChange={(e) =>
              changeProp(field.nameProp, e.target.value, field.beforeSet)
            }
            value={dataFields[field.nameProp]}
            placeholder={field?.label}
            {...field}
          />
        ),
        selector: (
          <Selector
            showValue={
              (field?.nameProp &&
                dataFields[field?.nameProp][
                field?.selectorData?.drawerTitle &&
                field?.selectorData.drawerTitle[0]
                ]) ||
              field.placeholder
            }
            callbackData={dataFields}
            onChange={(value) => {
              changeProp(
                field.nameProp,
                value,
                field.beforeSet,
                field.dependencies,
                field.setFirst,
              );
            }}
            {...field}
          />
        ),
        component: <>{field.component}</>,
        multiselector: (
          <MultiSelector
            {...field}
            callbackData={dataFields}
            showValue={
              dataFields[field.nameProp] && dataFields[field.nameProp]?.length
            }
            value={dataFields[field.nameProp] || []}
            onChange={(value) =>
              changeProp(
                field.nameProp,
                value,
                field.beforeSet,
                field.dependencies,
                field.setFirst,
              )
            }
          />
        ),
        checkbox: (
          <label className="flex text-[.8rem] text-ui-fg-base items-center gap-4">
            <Checkbox
              defaultChecked={field.defaultChecked ?? false}
              onCheckedChange={(checked) => {
                changeProp(field.nameProp, checked, field.beforeSet);
              }}
            />
            {field.label}
          </label>
        ),
        date: (
          <DatePicker
            value={
              isNaN(new Date(dataFields[field.nameProp]).getFullYear())
                ? new Date()
                : new Date(dataFields[field.nameProp])
            }
            shouldCloseOnSelect={true}
            onChange={(e) => changeProp(field.nameProp, e, field.beforeSet)}
            {...field}
          />
        ),
        line: (
          <>
            <hr />
          </>
        ),
        image: (
          <ImageSelector
            t={t}
            multiple={field.multiple}
            label={field.topLabel}
            count={dataFields[field.nameProp] ? 1 : 0}
            previewImg={Array.isArray(dataFields[field.nameProp]) ? dataFields[field.nameProp][0] : dataFields[field.nameProp]}
            onSelected={(selected) => {
              changeProp(field.nameProp, selected);
            }}
          />
        ),
      };

      if (
        field.topLabel ||
        (allWithTopLabel &&
          ![
            "selector",
            "checkbox",
            "line",
            "multiselector",
            "paragraph",
          ].includes(field.type))
      )
        return (
          <InputLabel
            className={"text-xs"}
            key={i}
            label={field.topLabel || field.label}
          >
            {components[field.type] ?? (
              <Input
                onChange={(e) => {
                  changeProp(field.nameProp, e.target.value, field.beforeSet);
                }}
                type={field.type}
                value={dataFields[field.nameProp]}
                placeholder={field?.label}
                {...field}
              />
            )}
          </InputLabel>
        );
      else
        return (
          components[field.type] ?? (
            <Input
              onChange={(e) =>
                changeProp(field.nameProp, e.target.value, field.beforeSet)
              }
              value={dataFields[field.nameProp]}
              type={field.type}
              placeholder={field?.label}
              {...field}
            />
          )
        );
    });
  };

  const changeProp = async (
    name,
    value,
    beforeSet,
    resetFields,
    setFirstFields,
  ) => {
    const resetFieldsObject = {};
    if (resetFields) {
      await Promise.all(
        resetFields.map(async (field) => {
          resetFieldsObject[field] = "";
          if (setFirstFields && setFirstFields.includes(field)) {
            const currentField = fields.find((f) => f.nameProp === field);
            if (currentField && currentField.nameProp === field) {
              resetFieldsObject[currentField.nameProp] = await currentField
                .getData({
                  ...dataFields,
                  [name]: beforeSet ? beforeSet(value, dataFields) : value,
                })
                .then((res) => res[0] || "");
            }
          }
        }),
      );
    }

    const hasOnChange = fields.find((f) => f.nameProp === name)?.onChange;

    setDataFields((oldDataFields) => ({
      ...oldDataFields,
      [name]: beforeSet ? beforeSet(value, dataFields) : value,
      ...resetFieldsObject,
    }));

    if (hasOnChange) {
      hasOnChange(value, dataFields, changeProp);
    }
  };

  const refId = useId();
  useEffect(() => {
    const handleKeyDown = (e) => {
      const itsSomeSelectorOpened = document.querySelector(
        ".formpromptselector",
      );
      if (itsSomeSelectorOpened) return;

      if (e.target?.tagName === "TEXTAREA") return;

      if (e.code === "Enter") {

        const refFieldsData = JSON.parse(
          document.querySelector(`[id='${refId}']`).getAttribute("data-fields"),
        );
        if (!validateBeforeSave(refFieldsData)) return;

        resolve(refFieldsData);
      }
    };
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div id={refId} data-fields={JSON.stringify(dataFields)} />
      <Prompt variant="confirmation" defaultOpen={true}>
        <Prompt.Content
          className={"z-20 max-w-[90vw] md:w-[500px] " + className}
        >
          <Prompt.Header>
            <Prompt.Title>{title}</Prompt.Title>
            <div className="grid grid-cols-1 gap-4 py-2 max-h-[75vh] px-2 overflow-y-auto">
              {renderFields(fields)}
            </div>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel
              className={darkMode ? "text-gray-300" : ""}
              onClick={() => resolve(null)}
            >
              {t("cancel")}
            </Prompt.Cancel>
            <Button
              variant="primary"
              onClick={() =>
                validateBeforeSave(dataFields) ? resolve(dataFields) : null
              }
            >
              {t("save")}
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}
