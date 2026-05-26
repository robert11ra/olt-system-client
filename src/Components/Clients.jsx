// Clients.jsx
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

export default function Clients() {
    const [clients, setClients] = useState([]);
    const { t, variantButtonColor } = useContext(Contexts.globalContext);

    const fetchData = async () => {
        let { data } = await api.get("/clients/all");
        data = data.map((row) => ({ ...row, dropdown: row }));
        setClients(data);
    };

    useEffect(() => { fetchData(); }, []);

    const createClient = async () => {
        LoadAnimation.show();
        LoadAnimation.hide();

        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("create_client")}
                allWithTopLabel
                fields={[
                    { nameProp: "name", type: "text", label: t("name") },
                    { nameProp: "cedula", type: "text", label: t("cedula") },
                    { nameProp: "contract", type: "text", label: t("contract") },
                    { nameProp: "onu_id", type: "number", label: t("onu_id") },
                    { nameProp: "plan_id", type: "number", label: t("plan_id") },
                    { nameProp: "ssid", type: "text", label: t("ssid") },
                    { nameProp: "wifi_password", type: "text", label: t("wifi_password") },
                    { nameProp: "ssid_5g", type: "text", label: t("ssid_5g") },
                    { nameProp: "wifi_5g_password", type: "text", label: t("wifi_5g_password") },
                ]}
            />
        ));

        if (!response) return;

        if (response.name?.trim() && response.cedula?.trim()) {
            const res = await api.post("/clients", response);
            if (res?.status === 201) {
                toast.success(t("success_created_client"));
                fetchData();
            } else {
                toast.error(t("error_created_client"));
            }
            fetchData();
        }
    };

    const editClient = async (currentData) => {
        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("edit_client")}
                allWithTopLabel
                fields={[
                    { nameProp: "name", type: "text", label: t("name"), defaultValue: currentData.name },
                    { nameProp: "cedula", type: "text", label: t("cedula"), defaultValue: currentData.cedula },
                    { nameProp: "contract", type: "text", label: t("contract"), defaultValue: currentData.contract },
                    { nameProp: "onu_id", type: "number", label: t("onu_id"), defaultValue: currentData.onu_id },
                    { nameProp: "plan_id", type: "number", label: t("plan_id"), defaultValue: currentData.plan_id },
                    { nameProp: "ssid", type: "text", label: t("ssid"), defaultValue: currentData.ssid },
                    { nameProp: "wifi_password", type: "text", label: t("wifi_password"), defaultValue: currentData.wifi_password },
                    { nameProp: "ssid_5g", type: "text", label: t("ssid_5g"), defaultValue: currentData.ssid_5g },
                    { nameProp: "wifi_5g_password", type: "text", label: t("wifi_5g_password"), defaultValue: currentData.wifi_5g_password },
                ]}
            />
        ));

        if (!response) return;

        if (response.name?.trim() || response.cedula?.trim()) {
            const res = await api.patch("/clients/" + currentData.id, response);
            if (res?.status === 200) {
                toast.success(t("success_updated_client"));
                fetchData();
            } else {
                toast.error(t("error_updated_client"));
            }
            fetchData();
        }
    };

    return (
        <>
            <PageHeader className={"flex !justify-between"}>
                <Heading level="h1">{t("clients")}</Heading>
            </PageHeader>
            <div className="flex flex-col gap-4 h-auto py-10">
                <AdaptableTable
                    data={clients}
                    pageSize={25}
                    useSearch={["id", "name", "cedula", "contract"]}
                    usePagination={true}
                    columnModel={[
                        { access: "id", header: t("id") },
                        { access: "name", header: t("name") },
                        { access: "cedula", header: t("cedula") },
                        { access: "contract", header: t("contract") },
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
                                        { icon: <medusaIcons.PencilSquare />, label: t("edit_client"), operation: () => editClient(info.getValue()) },
                                        {
                                            icon: info.getValue().status_id == 1 ? <medusaIcons.CircleDottedLine /> : <medusaIcons.CircleFilledSolid />,
                                            label: info.getValue().status_id == 1 ? t("deactivate_client") : t("activate_client"),
                                            operation: async () => {
                                                let res = await api.patch("/clients/active_deactive/" + info.getValue().id);
                                                if (!res) toast.error(t("error_updated_client"));
                                                else fetchData();
                                            },
                                        },
                                    ]}
                                />
                            ),
                        },
                    ]}
                >
                    <Button variant={variantButtonColor} onClick={createClient}>
                        <medusaIcons.Plus />
                        {t("create_client")}
                    </Button>
                </AdaptableTable>
            </div>
        </>
    );
}
