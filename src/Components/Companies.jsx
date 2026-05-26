// Companies.jsx
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

export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const { t, variantButtonColor } = useContext(Contexts.globalContext);

    const fetchData = async () => {
        let { data } = await api.get("/companies/all");
        data = data.map((row) => ({ ...row, dropdown: row }));
        setCompanies(data);
    };

    useEffect(() => { fetchData(); }, []);

    const createCompany = async () => {
        LoadAnimation.show();
        LoadAnimation.hide();

        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("create_company")}
                allWithTopLabel
                fields={[
                    { nameProp: "name", type: "text", label: t("name") },
                    { nameProp: "superadmin_id", type: "number", label: t("superadmin_id") },
                ]}
            />
        ));

        if (!response) return;
        const { name, superadmin_id } = response;

        if (name?.trim()) {
            const res = await api.post("/companies", { name, superadmin_id });
            if (res?.status === 201) {
                toast.success(t("success_created_company"));
                fetchData();
            } else {
                toast.error(t("error_created_company"));
            }
            fetchData();
        }
    };

    const editCompany = async ({ id, name, superadmin_id }) => {
        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("edit_company")}
                allWithTopLabel
                fields={[
                    { nameProp: "name", type: "text", label: t("name"), defaultValue: name },
                    { nameProp: "superadmin_id", type: "number", label: t("superadmin_id"), defaultValue: superadmin_id },
                ]}
            />
        ));

        if (!response) return;
        const { name: newName, superadmin_id: newSuperadmin_id } = response;

        if (newName?.trim()) {
            const res = await api.patch("/companies/" + id, { name: newName, superadmin_id: newSuperadmin_id });
            if (res?.status === 200) {
                toast.success(t("success_updated_company"));
                fetchData();
            } else {
                toast.error(t("error_updated_company"));
            }
            fetchData();
        }
    };

    return (
        <>
            <PageHeader className={"flex !justify-between"}>
                <Heading level="h1">{t("companies")}</Heading>
            </PageHeader>
            <div className="flex flex-col gap-4 h-auto py-10">
                <AdaptableTable
                    data={companies}
                    pageSize={25}
                    useSearch={["id", "name"]}
                    usePagination={true}
                    columnModel={[
                        { access: "id", header: t("id") },
                        { access: "name", header: t("name") },
                        { access: "superadmin_id", header: t("superadmin_id") },
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
                                        { icon: <medusaIcons.PencilSquare />, label: t("edit_company"), operation: () => editCompany(info.getValue()) },
                                        {
                                            icon: info.getValue().status_id == 1 ? <medusaIcons.CircleDottedLine /> : <medusaIcons.CircleFilledSolid />,
                                            label: info.getValue().status_id == 1 ? t("deactivate_company") : t("activate_company"),
                                            operation: async () => {
                                                let res = await api.patch("/companies/active_deactive/" + info.getValue().id);
                                                if (!res) toast.error(t("error_updated_company"));
                                                else fetchData();
                                            },
                                        },
                                    ]}
                                />
                            ),
                        },
                    ]}
                >
                    <Button variant={variantButtonColor} onClick={createCompany}>
                        <medusaIcons.Plus />
                        {t("create_company")}
                    </Button>
                </AdaptableTable>
            </div>
        </>
    );
}

