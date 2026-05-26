import api from "../../Sources/Api";
import FormPromptComponent from "../Subcomponents/FormPromptComponent.jsx";
import promptWithComponent from "./promptWithComponent.jsx";
import { toast } from "@medusajs/ui";

export async function drawerCreateClient(fetchData) {
  const newClient = await promptWithComponent((resolve) => (
    <FormPromptComponent
      className={"!w-1/3"}
      resolve={resolve}
      title="Nuevo Cliente"
      fields={[
        {
          nameProp: "rut",
          label: "RUT",
          type: "text",
        },
        {
          nameProp: "name",
          label: "Nombre",
          type: "text",
        },
        {
          nameProp: "address",
          label: "Direccion",
          type: "text",
        },
        {
          nameProp: "email",
          label: "Email",
          type: "email",
        },
        {
          nameProp: "phoneNumber",
          label: "Telefono",
          type: "text",
        },
        {
          nameProp: "haveLegalAgent",
          label: "¿Es cliente masivo?",
          type: "checkbox",
        },
      ]}
    />
  ));

  if (!newClient) return;

  const { rut, name } =
    newClient;

  if (
    [rut, name].some(
      (x) => !x
    )
  ) {
    return toast.error("RUT y Nombre son obligatorios");
  } else {
    if (newClient.haveLegalAgent) {
      const legalAgent = await promptWithComponent((resolve) => (
        <FormPromptComponent
          className={"!w-1/3"}
          resolve={resolve}
          title="Información del Cliente Masivo"
          fields={[
            {
              nameProp: "legalAgent",
              label: "Nombre de la persona jurídica",
              type: "text",
            },
            {
              nameProp: "rutLegalAgent",
              label: "RUT de la persona jurídica",
              type: "text",
              beforeSet: formatRUT,
            },
          ]}
        />
      ));

      if (!legalAgent)
        return toast.error(
          "Si es cliente masivo debe ingresar la información"
        );

      newClient.rutLegalAgent = legalAgent.rutLegalAgent;
      newClient.legalAgent = legalAgent.legalAgent;
    } else {
      newClient.rutLegalAgent = null;
      newClient.legalAgent = null;
    }

    const result = await api.post("/clients", newClient).catch((err) => {
      console.log(err);
      return err.response;
    });

    if (result.status === 200) {
      toast.success("Cliente creado exitosamente");
      fetchData && fetchData();
    } else {
      toast.error(result.data.message);
    }
  }
}

export async function drawerCreateCounterparty(fetchData) {
  const newCounterparty = await promptWithComponent((resolve) => (
    <FormPromptComponent
      className={"!w-1/3"}
      resolve={resolve}
      title="Nueva Contraparte"
      fields={[
        {
          nameProp: "rut",
          label: "RUT",
          type: "text",
          beforeSet: formatRUT,
        },
        {
          nameProp: "name",
          label: "Nombre",
          type: "text",
        },
        {
          nameProp: "address",
          label: "Direccion",
          type: "text",
        },
        {
          nameProp: "phonenumber",
          label: "Telefono",
          type: "text",
        },
      ]}
    />
  ));

  if (!newCounterparty) return;

  const { name, rut, address } = newCounterparty;

  if (!name || !rut || !address) {
    return toast.error("Dirección, RUT y Nombre son obligatorios.");
  } else {
    const result = await api
      .post("/counterparties", newCounterparty)
      .catch((err) => {
        console.log(err);
        return err.response;
      });

    if (result.status === 200) {
      toast.success("Contraparte creada con exito");
    } else {
      toast.error(result.data.message);
    }
    fetchData && fetchData();
  }
}

export async function drawerCreateCourt(fetchData) {
  const newCourt = await promptWithComponent((resolve) => (
    <FormPromptComponent
      className={"!w-1/3"}
      resolve={resolve}
      title="Nuevo Tribunal"
      fields={[
        {
          nameProp: "name",
          label: "Nombre",
          type: "text",
        },
        {
          nameProp: "province",
          label: "Seleccione Comuna",
          placeholder: "Comuna",
          type: "selector",
          selectorData: {
            drawerTitle: ["name"],
            drawerHeader: "Selecciona una comuna.",
          },
          getData: async () => {
            return await api
              .get("/provinces")
              .then((data) =>
                data.data?.map((x) => ({
                  ...x,
                  name: `${x.name} - ${x.region}`,
                }))
              )
              .catch((err) => {
                console.log(err);
                return [];
              });
          },
        },
      ]}
    />
  ));

  if (!newCourt) return;

  const { name, province } = newCourt;

  if ([name, province].some((x) => !x)) {
    return toast.error("Todos los campos son obligatorios");
  } else {
    const result = await api
      .post("/courts", {
        name,
        provinceunique: province.provinceunique,
      })
      .catch((err) => {
        console.log(err);
        return err.response;
      });

    if (result.status === 200) {
      toast.success("Tribunal creado exitosamente");
      fetchData && fetchData();
    } else {
      toast.error(result.data.message);
    }
  }
}
