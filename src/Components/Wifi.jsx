// Wifi.jsx
import { Badge, Button, Heading, toast, Input, Label } from "@medusajs/ui";
import * as medusaIcons from "@medusajs/icons";
import PageHeader from "./Subcomponents/PageHeader.jsx";
import Contexts from "../Sources/Contexts.js";
import { useContext, useEffect, useState } from "react";
import api from "../Sources/Api.js";
import promptWithComponent from "./Utilities/promptWithComponent.jsx";
import FormPromptComponent from "./Subcomponents/FormPromptComponent.jsx";
import LoadAnimation from "./Utilities/loadAnimation.js";

export default function Companies() {

    const [ssid, setSsid] = useState("");
    const [ssid5g, setSsid5g] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifi5gPassword, setWifi5gPassword] = useState("");

    const { t, variantButtonColor } = useContext(Contexts.globalContext);

    const fetchData = async () => {
        let { data } = await api.get("/companies/all");
        data = data.map((row) => ({ ...row, dropdown: row }));
        setCompanies(data);
    };

    useEffect(() => { fetchData(); }, []);

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
                <Heading level="h1">Cambia tu configuración WiFi</Heading>
            </PageHeader>
            <div className="flex flex-col justify-center items-center gap-4 py-10 h-[80vh]">
                <div className="md:w-1/3">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="bg-gradient-to-t pt-10 pb-10 from-slate-100/90 to-white/90 shadow-xl p-10 flex flex-col rounded-md min-w-1/3 max-w-[90%]"
                    >
                        <Input
                            onChange={(x) => setSsid(x.target.value)}
                            placeholder="SSID"
                            type="text"
                            autoFocus
                            className="mb-5"
                        />
                        <Input
                            onChange={(x) => setWifiPassword(x.target.value)}
                            placeholder="Contraseña Wifi"
                            type="password"

                        />
                        <Input
                            onChange={(x) => setSsid5g(x.target.value)}
                            placeholder="SSID 5G"
                            type="text"
                            autoFocus
                            className="my-5"
                        />
                        <Input
                            onChange={(x) => setWifi5gPassword(x.target.value)}
                            placeholder="Contraseña Wifi 5G"
                            type="password"
                        />

                        <div className="grid [&_*]:transition-all">
                            <Button
                                onClick=''
                                variant="outline"
                                className="mt-5 disabled:cursor-not-allowed bg-gradient-to-r from-secondary to-primary hover:brightness-75 shadow-md w-full text-white"
                            >
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}

