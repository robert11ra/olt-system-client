import { Badge, Button, Heading, Text, toast } from "@medusajs/ui";
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

export default function Users() {
  const [users, setUsers] = useState([]);

  const { t, variantButtonColor } = useContext(
    Contexts.globalContext,
  );

  const fetchData = async () => {
    let { data } = await api.get("/users/all");
    data = data.map((row) => ({
      ...row,
      dropdown: row,
    }));
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createUser = async () => {
    LoadAnimation.show();

    LoadAnimation.hide();

    const userResponse = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        title={t("create_user")}
        allWithTopLabel
        fields={[
          {
            nameProp: "name",
            type: "text",
            label: t("name"),
          },
          {
            nameProp: "username",
            type: "text",
            label: t("username"),
          },
          {
            nameProp: "password",
            type: "password",
            label: t("password"),
            placeholder: t("password_placeholder"),
          },

        ]}
      />
    ));

    if (!userResponse) return;

    const {
      name,
      username,
      password,
    } = userResponse;

    if (password.length < 8) {
      return toast.error(t("error_password_length"));
    }

    if (username?.trim() && password) {
      const res = await api.post("/users", {
        username,
        password,
        name,
      });

      if (res?.status === 201) {
        toast.success(t("success_created_user"));
        fetchData();
      } else {
        toast.error(t("error_created_user"));
      }

      fetchData();
    }
  };

  const editUser = async ({
    id: userId,
    name,
    username,
  }) => {

    const userResponse = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        title={t("edit_user")}
        allWithTopLabel
        fields={[
          {
            nameProp: "name",
            type: "text",
            label: t("name"),
            defaultValue: name,
          },
          {
            nameProp: "username",
            type: "text",
            label: t("username"),
            defaultValue: username,
          },
          {
            nameProp: "password",
            type: "password",
            label: t("password"),
            placeholder: t("password_placeholder"),
          },
        ]}
      />
    ));

    if (!userResponse) return;

    const {
      name: newName,
      username: newUsername,
      password,
    } = userResponse;

    if (password) {
      if (password.length < 8) {
        return toast.error(t("error_password_length"));
      }
    }

    if (newName?.trim() || newUsername?.trim()) {
      const res = await api.patch("/users/" + userId, {
        name: newName,
        username: newUsername,
        password: password ? password : null,

      });

      if (res?.status === 200) {
        toast.success(t("success_updated_user"));
        fetchData();
      } else {
        toast.error(t("error_updated_user"));
      }

      fetchData();
    }
  };

  return (
    <>
      <PageHeader className={"flex !justify-between"}>
        <Heading level="h1">{t("users")}</Heading>
      </PageHeader>
      <div className="flex flex-col gap-4 h-auto py-10">
        <AdaptableTable
          data={users}
          pageSize={25}
          useSearch={[
            "id",
            "name",
            "username",
          ]}
          usePagination={true}
          columnModel={[
            { access: "id", header: t("id") },
            { access: "name", header: t("name") },
            { access: "username", header: t("username") },
            {
              access: "status_id",
              header: t("status"),
              cell: (info) => (
                <Badge
                  rounded="full"
                  color={info.getValue() == 1 ? "green" : "red"}
                >
                  {info.getValue() == 1 ? t("active") : t("inactive")}
                </Badge>
              ),
            },
            {
              access: "dropdown",
              header: "",
              cell: (info) => (
                <>
                  <AdaptableDropDown
                    functions={[
                      {
                        icon: <medusaIcons.PencilSquare />,
                        label: t("edit_user"),
                        operation: () => editUser(info.getValue()),
                      },
                      {
                        icon:
                          info.getValue().active == 1 ? (
                            <medusaIcons.CircleDottedLine />
                          ) : (
                            <medusaIcons.CircleFilledSolid />
                          ),
                        label:
                          info.getValue().active == 1
                            ? t("deactivate_user")
                            : t("activate_user"),
                        operation: () => {
                          let res = api
                            .patch(
                              "/users/active_deactive/" + info.getValue().id,
                            )

                          if (!res) {
                            toast.error(t("error_updated_user"));
                          } else {
                            fetchData();
                          }

                        },
                      },
                    ]}
                  />
                </>
              ),
            },
          ]}
        >
          <Button variant={variantButtonColor} onClick={createUser}>
            <medusaIcons.Plus />
            {t("create_user")}
          </Button>
        </AdaptableTable>
      </div>
    </>
  );
}
