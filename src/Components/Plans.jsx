
// Plans.jsx
import { Badge, Button, Heading, toast } from "@medusajs/ui";
import * as medusaIcons from "@medusajs/icons";
import PageHeader from "./Subcomponents/PageHeader.jsx";
import AdaptableTable from "./Subcomponents/AdaptableTable.jsx";
import AdaptableDropDown from "./Subcomponents/DropDown.jsx";
import Contexts from "../Sources/Contexts.js";
import { useContext, useEffect, useState } from "react";
import api from "../Sources/Api.js";
import promptWithComponent from "./Utilities/promptWithComponent.jsx";
import FormPromptComponent from "./Subcomponents/FormPromptComponent.jsx";
import LoadAnimation from "./Utilities/loadAnimation.js";

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const { t, variantButtonColor } = useContext(Contexts.globalContext);

    const fetchData = async () => {
        let { data } = await api.get("/plans/all");
        data = data.map((row) => ({ ...row, dropdown: row }));
        setPlans(data);
    };

    useEffect(() => { fetchData(); }, []);

    const createPlan = async () => {
        LoadAnimation.show();
        LoadAnimation.hide();

        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("create_plan")}
                allWithTopLabel
                fields={[
                    { nameProp: "name", type: "text", label: t("name") },
                    { nameProp: "details", type: "text", label: t("details") },
                    { nameProp: "price", type: "number", label: t("price") },
                ]}
            />
        ));

        if (!response) return;
        const { name, details, price } = response;

        if (name?.trim()) {
            const res = await api.post("/plans", { name, details, price });
            if (res?.status === 201) {
                toast.success(t("success_created_plan"));
                fetchData();
            } else {
                toast.error(t("error_created_plan"));
            }
            fetchData();
        }
    };

    const editPlan = async ({ id, name, details, price }) => {
        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("edit_plan")}
                allWithTopLabel
                fields={[
                    { nameProp: "name", type: "text", label: t("name"), defaultValue: name },
                    { nameProp: "details", type: "text", label: t("details"), defaultValue: details },
                    { nameProp: "price", type: "number", label: t("price"), defaultValue: price },
                ]}
            />
        ));

        if (!response) return;
        const { name: newName, details: newDetails, price: newPrice } = response;

        if (newName?.trim()) {
            const res = await api.patch("/plans/" + id, { name: newName, details: newDetails, price: newPrice });
            if (res?.status === 200) {
                toast.success(t("success_updated_plan"));
                fetchData();
            } else {
                toast.error(t("error_updated_plan"));
            }
            fetchData();
        }
    };

    return (
        <>
            <PageHeader className={"flex !justify-between"}>
                <Heading level="h1">{t("plans")}</Heading>
            </PageHeader>
            <div className="flex flex-col gap-4 h-auto py-10">
                <AdaptableTable
                    data={plans}
                    pageSize={25}
                    useSearch={["id", "name", "details"]}
                    usePagination={true}
                    columnModel={[
                        { access: "id", header: t("id") },
                        { access: "name", header: t("name") },
                        { access: "details", header: t("details") },
                        { access: "price", header: t("price") },
                        {
                            access: "status_id",
                            header: t("status"),
                            cell: (info) => (
                                <Badge rounded="full" color={info.getValue() == 1 ? "green" : "red"}>
                                    {info.getValue() == 1 ? t("active") : t("inactive")}
                                </Badge>
                            ),
                        },
                        {
                            access: "dropdown",
                            header: "",
                            cell: (info) => (
                                <AdaptableDropDown
                                    functions={[
                                        { icon: <medusaIcons.PencilSquare />, label: t("edit_plan"), operation: () => editPlan(info.getValue()) },
                                        {
                                            icon: info.getValue().status_id == 1 ? <medusaIcons.CircleDottedLine /> : <medusaIcons.CircleFilledSolid />,
                                            label: info.getValue().status_id == 1 ? t("deactivate_plan") : t("activate_plan"),
                                            operation: async () => {
                                                let res = await api.patch("/plans/active_deactive/" + info.getValue().id);
                                                if (!res) toast.error(t("error_updated_plan"));
                                                else fetchData();
                                            },
                                        },
                                    ]}
                                />
                            ),
                        },
                    ]}
                >
                    <Button variant={variantButtonColor} onClick={createPlan}>
                        <medusaIcons.Plus />
                        {t("create_plan")}
                    </Button>
                </AdaptableTable>
            </div>
        </>
    );
}
