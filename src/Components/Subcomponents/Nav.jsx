/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useMemo, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import Contexts from "../../Sources/Contexts";
import api from "../../Sources/Api";
import { Button, Switch } from "@medusajs/ui";
import logo from "../../assets/zentro-logo.png";

export default function Nav() {
  const [hidden, setHidden] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const {
    darkMode,
    setDarkMode,
    t,
    boxiconIconColor,
    user,
  } = useContext(Contexts.globalContext);
  const navigate = useNavigate();

  const routes = [
    {
      name: t("wifi"),
      path: "/wifi",
      icon: <box-icon color="gray" name="wifi"></box-icon>,
      iconBlack: (
        <box-icon
          color={darkMode ? "rgb(229, 229, 229)" : "black"}
          name="wifi"></box-icon>
      ),
    },
    {
      separator: true
    },
    // {
    //   name: t("config"),
    //   path: "/config",
    //   icon: <box-icon type="solid" color="gray" name="cog"></box-icon>,
    //   iconBlack: (
    //     <box-icon
    //       type="solid"
    //       color={darkMode ? "rgb(229, 229, 229)" : "black"}
    //       name="cog"
    //     ></box-icon>
    //   ),
    // },
  ].filter((x) => x);

  const logout = () => {
    api.get("/auth/logout").then(() => navigate("/login"));
  };

  const fullNameParsed = useMemo(() => {
    const nameWithLineBreak = user?.name
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word, index, arr) =>
        (index + 1) % 2 === 0 && index != arr.length - 1 ? word + "<br>" : word,
      )
      .join(" ")
      .replace("<br> ", "<br>");

    return nameWithLineBreak;
  }, [user]);

  return (
    <>
      <button
        onClick={() => {
          setHidden(!hidden);
        }}
        className={
          "w-20 h-10 z-10 shadow-lg justify-center items-center sticky top-4 left-8 md:hidden transition-[background] rounded-full bg-slate-600 flex"
        }
      >
        <box-icon name="menu" size="sm" color="white"></box-icon>
      </button>
      <div className="flex flex-col gap-4">
        {!collapsed && (
          <div
            className={`z-20 top-0 flex-grow flex items-center justify-center ${darkMode ? "bg-neutral-700" : "bg-neutral-50"
              } md:flex font-bold transition-[opacity] bottom-0 left-0 fixed md:static min-w-max mr-0 flex-col gap-2 p-4 md:px-6 text-end text-sm lg:text-base mt-4 ml-4 shadow-md border rounded-2xl hidden max-h-fit pb-4 pt-4 `}
          >
            <img
              src={logo}
              className={`mb-2 w-[6vw] min-w-[120px] max-w-[100%] mx-auto ${hidden ? "hidden md:block" : ""
                } ${darkMode ? "invert" : ""}`}
            />
          </div>
        )}
        <nav
          className={
            `z-20 top-0 flex-grow ${darkMode ? "bg-neutral-700" : "bg-neutral-50"
            } md:flex font-bold transition-[opacity] bottom-0 left-0 fixed md:static min-w-max w-max flex-col gap-2 p-4 md:px-6 md:py-8 text-end text-sm lg:text-base mt-4 ml-4 mb-4 shadow-md border rounded-2xl ` +
            (hidden ? "hide" : `flex shadow-xl`) +
            (collapsed ? " mt-4" : " md:mt-auto") +
            (darkMode ? " text-neutral-400" : " text-neutral-500")
          }
        >
          <button
            onClick={() => {
              setHidden(!hidden);
            }}
            className="md:hidden ml-auto mr-0 w-10 h-10 flex justify-center items-center"
          >
            <box-icon
              color={darkMode ? "rgb(229, 229, 229)" : "black"}
              size="1.5rem"
              name="x"
            ></box-icon>
          </button>
          <div
            className={
              "w-full h-8 rounded-[10px] flex transition-all " +
              (collapsed ? "justify-center " : "justify-end") +
              " items-center gap-2"
            }
          >
            <Button
              onClick={() => setCollapsed((pr) => !pr)}
              variant="transparent"
            >
              <box-icon
                type={collapsed ? "solid" : "regular"}
                color={boxiconIconColor}
                name={"dock-left"}
              ></box-icon>
            </Button>
          </div>
          {routes
            .filter((route) => !route.roles)
            .map((route, index) =>
              route.separator ? (
                <div className="mt-auto mb-0" key={index}></div>
              ) : (
                <Link
                  onClick={() => {
                    setHidden(true);
                  }}
                  className={
                    (useMatch(route.path)
                      ? `${darkMode
                        ? "bg-white/10 ml-[1px] text-neutral-200"
                        : "shadow bg-white/80 border border-slate-200 text-black"
                      }`
                      : "") +
                    " w-full h-8 rounded-[10px] flex transition-[background] relative justify-start px-3 items-center overflow-hidden gap-2 " +
                    (collapsed ? "justify-center " : "") +
                    route.css
                  }
                  key={index}
                  to={route.path ?? ".."}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-r-md transition-all ${useMatch(route.path) ? "bg-primary" : ""}`} />
                  {useMatch(route.path) ? route.iconBlack : route.icon}
                  {!collapsed && route.name}
                </Link>
              ),
            )}
          {/* {!collapsed && (
            <AdaptableDropDown
              icon={<box-icon name="world" color={boxiconIconColor}></box-icon>}
              text={{ es: "Español", zh: "中国人" }[selectedLanguage["key"]]}
              className={
                "!w-full !p-0 !px-3 !justify-start rounded-[10px] h-8 text-base !border !shadow "
              }
              functions={[
                {
                  icon: <span className="fi fi-ve"></span>,
                  label: "Español",
                  operation: () => setSelectedLanguage("es"),
                },
                {
                  icon: <span className="fi fi-cn"></span>,
                  label: "中国人",
                  operation: () => setSelectedLanguage("zh"),
                },
              ]}
            />
          )} */}
          <div
            className={
              "w-full h-8 rounded-[10px] flex transition-all justify-start pr-3 pl-3 items-center gap-2"
            }
          >
            <Switch
              checked={darkMode}
              onClick={() => setDarkMode(() => !darkMode)}
              className={`${darkMode ? "!bg-neutral-400" : "!bg-transparent"}`}
            />
            {!collapsed && (
              <span
                className="cursor-pointer"
                onClick={() => setDarkMode(() => !darkMode)}
              >
                {t("dark_mode")}
              </span>
            )}
          </div>
          {!collapsed && (
            <>
              <hr className="border-neutral-400 my-3" />
              <div
                className={`flex justify-between w-full px-4 relative gap-4 p-2 ${darkMode
                  ? "bg-white/5 border-transparent"
                  : "bg-white/80 border-slate-200"
                  } rounded-lg border shadow`}
              >
                <p
                  className="text-left capitalize"
                  dangerouslySetInnerHTML={{ __html: fullNameParsed }}
                ></p>
                <div
                  onClick={logout}
                  className="cursor-pointer top-4 right-4 transition-all flex items-center hover:scale-110"
                >
                  <box-icon
                    color={darkMode ? "rgb(229, 229, 229)" : "black"}
                    name="log-out"
                  ></box-icon>
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
