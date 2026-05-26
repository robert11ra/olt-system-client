import { Button, Input } from "@medusajs/ui";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Sources/Api";
import LoadAnimation from "./Utilities/loadAnimation";
import Contexts from "../Sources/Contexts";

export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setError(null), 5000);
  }, [error]);

  const { getUser, t } = useContext(Contexts.globalContext);

  const handleLogin = async () => {
    let res;
    LoadAnimation.show();

    await new Promise((r) => setTimeout(r, 1000));

    try {
      res = await api.post("/auth/login?is_admin=1", {
        username,
        password,
      });
    } catch (e) {
      res = e;
      LoadAnimation.hide();
      console.error(error);
    }
    if (!res) return setError("Ha ocurrido un error");

    if (res.status != 200)
      return setError(res.response.data.message || "Error desconocido");
    if (res.status == 200) {
      getUser();
      window.location.href = "/users";
    }
    LoadAnimation.hide();
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-300 to-slate-500">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-gradient-to-t pt-10 pb-10 from-slate-100/90 to-white/90 shadow-xl p-10 flex flex-col rounded-md min-w-[300px] w-[30rem] max-w-[90%]"
      >
        <img src="/logo.svg" alt="login logo" className="h-[150px] mb-5" />
        <h1 className="flex items-end brightness-50 gap-4 text-center m-auto title-font">
          {t("login")}
        </h1>
        <p className="text-red-500 leading-none h-8 flex items-center font-medium">
          {error && error}{" "}
        </p>
        <Input
          onChange={(x) => setUsername(x.target.value)}
          placeholder={t("username")}
          type="text"
          autoFocus
          className="mb-5"
        />
        <Input
          onChange={(x) => setPassword(x.target.value)}
          placeholder={t("password")}
          type="password"
        />
        <div className="grid [&_*]:transition-all">
          <Button
            onClick={handleLogin}
            variant="outline"
            className="mt-5 disabled:cursor-not-allowed bg-gradient-to-r from-secondary to-primary hover:brightness-75 shadow-md w-full text-white"
          >
            {t("access")}
          </Button>
        </div>
      </form>
    </div>
  );
}
