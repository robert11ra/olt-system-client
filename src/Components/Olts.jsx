

// Olt.jsx
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

export default function Olt() {
    const [olts, setOlts] = useState([]);
    const { t, variantButtonColor } = useContext(Contexts.globalContext);

    const fetchData = async () => {
        let { data } = await api.get("/olt/all");
        data = data.map((row) => ({ ...row, dropdown: row }));
        setOlts(data);
    };

    useEffect(() => { fetchData(); }, []);

    const createOlt = async () => {
        LoadAnimation.show();
        LoadAnimation.hide();

        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("create_olt")}
                allWithTopLabel
                fields={[
                    { nameProp: "serial", type: "text", label: t("serial") },
                    { nameProp: "address", type: "text", label: t("address") },
                    { nameProp: "port", type: "number", label: t("port") },
                ]}
            />
        ));

        if (!response) return;
        const { serial, address, port } = response;

        if (serial?.trim()) {
            const res = await api.post("/olt", { serial, address, port });
            if (res?.status === 201) {
                toast.success(t("success_created_olt"));
                fetchData();
            } else {
                toast.error(t("error_created_olt"));
            }
            fetchData();
        }
    };

    const editOlt = async ({ id, serial, address, port }) => {
        const response = await promptWithComponent((resolve) => (
            <FormPromptComponent
                resolve={resolve}
                title={t("edit_olt")}
                allWithTopLabel
                fields={[
                    { nameProp: "serial", type: "text", label: t("serial"), defaultValue: serial },
                    { nameProp: "address", type: "text", label: t("address"), defaultValue: address },
                    { nameProp: "port", type: "number", label: t("port"), defaultValue: port },
                ]}
            />
        ));

        if (!response) return;
        const { serial: newSerial, address: newAddress, port: newPort } = response;

        if (newSerial?.trim()) {
            const res = await api.patch("/olt/" + id, { serial: newSerial, address: newAddress, port: newPort });
            if (res?.status === 200) {
                toast.success(t("success_updated_olt"));
                fetchData();
            } else {
                toast.error(t("error_updated_olt"));
            }
            fetchData();
        }
    };

    return (
        <>
            <PageHeader className={"flex !justify-between"}>
                <Heading level="h1">{t("olt")}</Heading>
            </PageHeader>
            <div className="flex flex-col gap-4 h-auto py-10">
                <AdaptableTable
                    data={olts}
                    pageSize={25}
                    useSearch={["id", "serial", "address"]}
                    usePagination={true}
                    columnModel={[
                        { access: "id", header: t("id") },
                        { access: "serial", header: t("serial") },
                        { access: "address", header: t("address") },
                        { access: "port", header: t("port") },
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
                                        { icon: <medusaIcons.PencilSquare />, label: t("edit_olt"), operation: () => editOlt(info.getValue()) },
                                        {
                                            icon: info.getValue().status_id == 1 ? <medusaIcons.CircleDottedLine /> : <medusaIcons.CircleFilledSolid />,
                                            label: info.getValue().status_id == 1 ? t("deactivate_olt") : t("activate_olt"),
                                            operation: async () => {
                                                let res = await api.patch("/olt/active_deactive/" + info.getValue().id);
                                                if (!res) toast.error(t("error_updated_olt"));
                                                else fetchData();
                                            },
                                        },
                                    ]}
                                />
                            ),
                        },
                    ]}
                >
                    <Button variant={variantButtonColor} onClick={createOlt}>
                        <medusaIcons.Plus />
                        {t("create_olt")}
                    </Button>
                </AdaptableTable>
            </div>
        </>
    );
}
