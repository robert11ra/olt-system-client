// Mikrotik.jsx
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

export default function Mikrotik() {
    const [mikrotiks, setMikrotiks] = useState([]);
    const { t, variantButtonColor } = useContext(Contexts.globalContext);

    const fetchData = async () => {
        let { data } = await api.get("/mikrotik/all");
        data = data.map((row) => ({ ...row, dropdown: row }));
        setMikrotiks(data);
    };

    useEffect(() => { fetchData(); }, []);

    const createMikrotik = async () => {
        LoadAnimation.show();
        LoadAnimation.hide();

        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("create_mikrotik")}
                allWithTopLabel
                fields={[
                    { nameProp: "info", type: "text", label: t("info") },
                ]}
            />
        ));

        if (!response) return;
        const { info } = response;

        if (info?.trim()) {
            const res = await api.post("/mikrotik", { info });
            if (res?.status === 201) {
                toast.success(t("success_created_mikrotik"));
                fetchData();
            } else {
                toast.error(t("error_created_mikrotik"));
            }
            fetchData();
        }
    };

    const editMikrotik = async ({ id, info }) => {
        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("edit_mikrotik")}
                allWithTopLabel
                fields={[
                    { nameProp: "info", type: "text", label: t("info"), defaultValue: info },
                ]}
            />
        ));

        if (!response) return;
        const { info: newInfo } = response;

        if (newInfo?.trim()) {
            const res = await api.patch("/mikrotik/" + id, { info: newInfo });
            if (res?.status === 200) {
                toast.success(t("success_updated_mikrotik"));
                fetchData();
            } else {
                toast.error(t("error_updated_mikrotik"));
            }
            fetchData();
        }
    };

    return (
        <>
            <PageHeader className={"flex !justify-between"}>
                <Heading level="h1">{t("mikrotik")}</Heading>
            </PageHeader>
            <div className="flex flex-col gap-4 h-auto py-10">
                <AdaptableTable
                    data={mikrotiks}
                    pageSize={25}
                    useSearch={["id", "info"]}
                    usePagination={true}
                    columnModel={[
                        { access: "id", header: t("id") },
                        { access: "info", header: t("info") },
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
                                        { icon: <medusaIcons.PencilSquare />, label: t("edit_mikrotik"), operation: () => editMikrotik(info.getValue()) },
                                        {
                                            icon: info.getValue().status_id == 1 ? <medusaIcons.CircleDottedLine /> : <medusaIcons.CircleFilledSolid />,
                                            label: info.getValue().status_id == 1 ? t("deactivate_mikrotik") : t("activate_mikrotik"),
                                            operation: async () => {
                                                let res = await api.patch("/mikrotik/active_deactive/" + info.getValue().id);
                                                if (!res) toast.error(t("error_updated_mikrotik"));
                                                else fetchData();
                                            },
                                        },
                                    ]}
                                />
                            ),
                        },
                    ]}
                >
                    <Button variant={variantButtonColor} onClick={createMikrotik}>
                        <medusaIcons.Plus />
                        {t("create_mikrotik")}
                    </Button>
                </AdaptableTable>
            </div>
        </>
    );
}
