// Wifi.jsx
import { Button, Heading, toast, Input } from "@medusajs/ui";
import PageHeader from "./Subcomponents/PageHeader.jsx";
import InputLabel from "./Subcomponents/Label.jsx";
import Contexts from "../Sources/Contexts.js";
import { useContext, useEffect, useState } from "react";
import api from "../Sources/Api.js";

export default function Wifi() {

    const [ssid, setSsid] = useState("");
    const [ssid5g, setSsid5g] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifi5gPassword, setWifi5gPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { getUser } = useContext(Contexts.globalContext);

    const fetchData = async () => {
        try {
            const res = await api.get("/auth/validate");
            if (res.data?.userData) {
                const u = res.data.userData;
                setSsid(u.ssid || "");
                setWifiPassword(u.wifi_password || "");
                setSsid5g(u.ssid_5g || "");
                setWifi5gPassword(u.wifi_5g_password || "");
            }
        } catch (error) {
            console.error("Error al obtener los datos de WiFi:", error);
            toast.error("Error al cargar la configuración de Wi-Fi.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveChanges = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.patch("/wifi/update", {
                ssid,
                wifi_password: wifiPassword,
                ssid_5g: ssid5g,
                wifi_5g_password: wifi5gPassword
            });
            if (res.status === 200) {
                toast.success(res.data?.message || "Configuración de Wi-Fi actualizada correctamente.");
                if (getUser) {
                    await getUser(false);
                }
            } else {
                toast.error(res.data?.message || "Error al actualizar la configuración de Wi-Fi.");
            }
        } catch (error) {
            console.error("Error al actualizar Wi-Fi:", error);
            const errMsg = error.response?.data?.message || "Ocurrió un error al actualizar la configuración de Wi-Fi.";
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageHeader className={"flex !justify-between"}>
                <Heading level="h1">Cambia tu configuración WiFi</Heading>
            </PageHeader>
            <div className="flex flex-col justify-center items-center gap-4 py-10 min-h-[80vh]">
                <div className="md:w-1/3 w-full max-w-[90%]">
                    <form
                        onSubmit={handleSaveChanges}
                        className="bg-gradient-to-t pt-10 pb-10 from-slate-100/90 to-white/90 shadow-xl p-10 flex flex-col rounded-md w-full"
                    >
                        <InputLabel label="Nombre de red Wifi (2.4G)" className="flex flex-col gap-1 mb-4">
                            <Input
                                value={ssid}
                                onChange={(x) => setSsid(x.target.value)}
                                placeholder="SSID"
                                type="text"
                                autoFocus
                            />
                        </InputLabel>

                        <InputLabel label="Contraseña Wifi (2.4G)" className="flex flex-col gap-1 mb-4">
                            <Input
                                value={wifiPassword}
                                onChange={(x) => setWifiPassword(x.target.value)}
                                placeholder="Contraseña Wifi"
                                type="password"
                            />
                        </InputLabel>

                        <InputLabel label="Nombre de red Wifi (5G)" className="flex flex-col gap-1 mb-4">
                            <Input
                                value={ssid5g}
                                onChange={(x) => setSsid5g(x.target.value)}
                                placeholder="SSID 5G"
                                type="text"
                            />
                        </InputLabel>

                        <InputLabel label="Contraseña Wifi (5G)" className="flex flex-col gap-1 mb-4">
                            <Input
                                value={wifi5gPassword}
                                onChange={(x) => setWifi5gPassword(x.target.value)}
                                placeholder="Contraseña Wifi 5G"
                                type="password"
                            />
                        </InputLabel>

                        <div className="grid [&_*]:transition-all">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                disabled={isLoading}
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


