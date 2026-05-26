import {
  createDataTableColumnHelper,
  createDataTableFilterHelper,
  useDataTable,
  DataTable,
  Text,
  TooltipProvider,
  Heading,
  Input,
  IconButton,
  Tooltip,
} from "@medusajs/ui";
import { useContext, useEffect, useMemo, useState } from "react";
import Contexts from "../../Sources/Contexts";

const columnHelper = createDataTableColumnHelper();
const filterHelper = createDataTableFilterHelper();

function AdaptableTable({
  data = [],
  renderCard = null,
  usePagination = true,
  useSearch = null, // Search property accessor
  enableSorting = true,
  pageSize = 20,
  onRowClick = null,
  reference = null,
  filterModel = null,
  selector = null,
  exportToExcel = null,
  columnModel = [
    {
      access: "name",
      header: "Nombre",
      cell: (info) => {
        return <Text>{info.getValue()}</Text>;
      },
    },
  ],
  children,
}) {
  // PAGINATION
  const [pagination, setPagination] = useState({
    pageSize: pageSize,
    pageIndex: 0,
  });
  const [search, setSearch] = useState("");
  const [filtering, setFiltering] = useState([]);
  const [sorting, setSorting] = useState(null);
  const [rowSelection, setRowSelection] = useState();
  const { darkMode } = useContext(Contexts.globalContext);

  const sortData = (arr) => {
    try {
      if (!enableSorting) {
        return arr || [];
      }

      const sorted = arr.sort((a, b) => {
        let validated = false;

        if (!sorting) return 0;

        let aVal = a[sorting.id.split("__")[0]];
        let bVal = b[sorting.id.split("__")[0]];

        if (aVal === true || aVal === false) return aVal ? 1 : 0;

        if (bVal === null || aVal === null) return 0;

        if (
          !Number.isNaN(parseFloat(aVal)) &&
          !Number.isNaN(parseFloat(bVal))
        ) {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);

          validated = true;
        }

        if (
          new Date(aVal).toString() !== "Invalid Date" &&
          new Date(bVal).toString() !== "Invalid Date"
        ) {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();

          validated = true;
        }

        if (typeof aVal === "object" && aVal != null) {
          aVal = aVal["name"];
          bVal = bVal["name"];

          validated = true;
        }

        if (typeof aVal === "string" && aVal != null) {
          aVal = aVal?.toLowerCase();
          bVal = bVal?.toLowerCase();

          validated = true;
        }

        if (!validated) return 0;

        if (aVal < bVal) {
          return sorting.desc ? 1 : -1;
        }
        if (aVal > bVal) {
          return sorting.desc ? -1 : 1;
        }

        return 0;
      });

      return sorted;
    } catch (err) {
      console.error("Error sorting data: ", err);
      return arr || [];
    }
  };

  const filterData = (itm) => {
    return Object.keys(filtering).every((key) => {
      const value = filtering[key];

      if (!value) return true;

      if (Array.isArray(value)) {
        return value.includes(itm[key]);
      }

      if (typeof value === "string") {
        return value === itm[key];
      }

      if (typeof value === "object") {
        const date = new Date(itm[key]);

        let matching = null;
        if ("$gte" in value && value.$gte) {
          matching = date.getTime() >= new Date(value.$gte).getTime();
        }
        if ("$lte" in value && value.$lte) {
          matching =
            date.getTime() <=
            new Date(value.$lte).getTime() + 1000 * 60 * 60 * 24;
        }
        if ("$lt" in value && value.$lt) {
          matching = date.getTime() < new Date(value.$lt).getTime();
        }
        if ("$gt" in value && value.$gt) {
          matching = date.getTime() > new Date(value.$gt).getTime();
        }
        if ("$lte" in value && "$gte" in value) {
          matching =
            date.getTime() >= new Date(value.$gte).getTime() &&
            date.getTime() <=
              new Date(value.$lte).getTime() + 1000 * 60 * 60 * 24;
        }
        return matching || matching === null;
      }
    });
  };

  const [shownData, fullShownData] = useMemo(() => {
    const setData = sortData(data)
      .filter(filterData)
      .filter((itm) => {
        if (!Array.isArray(useSearch))
          return useSearch
            ? itm[useSearch]
                ?.toLowerCase()
                ?.includes(search?.toLowerCase()?.trim())
            : true;
        else if (useSearch)
          return useSearch.some((key) =>
            itm[key]
              ?.toString()
              ?.toLowerCase()
              ?.includes(search.toLowerCase().trim()),
          );
        else return true;
      });

    if (reference && !reference.current) reference.current = {};
    if (reference) reference.current.data = setData;

    return [
      setData.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize,
      ),
      setData,
    ];
  }, [pagination, data, enableSorting, sorting, filtering, search]);

  // TABLE LOGIC
  const columns = useMemo(
    () =>
      [
        selector && columnHelper.select(),
        ...columnModel.map((column, i) =>
          columnHelper.accessor(column.access, {
            id: column.access + "__" + i,
            header: column.header,
            enableSorting: column.header && enableSorting ? true : false,
            cell:
              column.cell ??
              ((info) => (
                <Text className="py-3 w-full">{info.getValue() || "-"}</Text>
              )),
          }),
        ),
      ].filter((x) => x),
    [columnModel, selector],
  );

  const filters = useMemo(() => {
    return filterModel?.map((x) => {
      return filterHelper.accessor(x.accessor, { ...x });
    });
  }, [filterModel]);

  useEffect(() => {
    if (reference) {
      reference.current = {
        data: [],
        selected: [],
      };
    }
  }, []);

  useEffect(() => {
    if (rowSelection && reference) {
      if (!reference.current) reference.current = {};
      reference.current.selected = Object.keys(rowSelection).map(
        (key) => shownData[key],
      );
    }
  }, [rowSelection]);

  const table = useDataTable({
    columns,
    data: shownData,
    filters,
    sorting: {
      state: sorting,
      onSortingChange: setSorting,
    },
    filtering: {
      state: filtering,
      onFilteringChange: setFiltering,
    },
    getRowId: (x) => data.indexOf(x),
    rowCount: fullShownData.length,
    search: useSearch && {
      state: search,
      onSearchChange: setSearch,
    },
    onRowClick,
    pagination: usePagination && {
      // Pass the pagination state and updater to the table instance
      state: pagination,
      onPaginationChange: setPagination,
    },
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    isLoading: false,
  });

  const { boxiconIconColor, t } = useContext(Contexts.globalContext);

  return (
    <>
      <div
        className={
          renderCard &&
          window.innerWidth < 768 &&
          "max-w-[100%] overflow-x-auto shadow-md rounded-2xl"
        }
      >
        <TooltipProvider>
          {renderCard && window.innerWidth < 768 ? (
            <>
              <div className="flex flex-col p-5 gap-5">
                <div>
                  {useSearch && (
                    <>
                      <Input
                        className="w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={
                          useSearch &&
                          useSearch
                            .map(
                              (field) =>
                                columnModel.find((x) => x.access === field)
                                  ?.header || t(field),
                            )
                            .join(", ")
                        }
                      />

                      <div
                        className={`border-b pb-1 [&_>*>*>*]:!bg-transparent`}
                      >
                        <DataTable instance={table}>
                          <DataTable.Toolbar
                            translations={{ clearAll: t("delete") }}
                            className={"flex flex-wrap justify-between gap-5"}
                          ></DataTable.Toolbar>
                        </DataTable>
                      </div>
                      {children && (
                        <div className="mt-3 flex items-center justify-between">
                          {children}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-5">
                  {shownData.map(renderCard)}
                  <Text className="mx-auto">
                    {shownData.length === 0 && t("nothing_here")}
                  </Text>
                </div>
                {usePagination && (
                  <div className="w-full flex items-center justify-center gap-2">
                    <IconButton
                      disabled={pagination.pageIndex === 0}
                      onClick={() => {
                        if (pagination.pageIndex > 0) {
                          setPagination({
                            ...pagination,
                            pageIndex: pagination.pageIndex - 1,
                          });
                        }
                      }}
                    >
                      <box-icon
                        color="gray"
                        name="chevron-left"
                      ></box-icon>{" "}
                    </IconButton>
                    <div className="px-5">
                      {pagination.pageIndex + 1} /{" "}
                      {Math.ceil(fullShownData.length / pagination.pageSize) ||
                        1}
                    </div>
                    <IconButton
                      disabled={
                        (pagination.pageIndex + 1) * pagination.pageSize >=
                        fullShownData.length
                      }
                      onClick={() => {
                        if (
                          (pagination.pageIndex + 1) * pagination.pageSize <
                          fullShownData.length
                        ) {
                          setPagination({
                            ...pagination,
                            pageIndex: pagination.pageIndex + 1,
                          });
                        }
                      }}
                    >
                      <box-icon
                        color="gray"
                        name="chevron-right"
                      ></box-icon>{" "}
                    </IconButton>
                  </div>
                )}
              </div>
            </>
          ) : (
            <DataTable
              instance={table}
              className={`${
                darkMode &&
                "[&_thead_tr]:!bg-black/40 bg-black/20 [&_*]:!border-neutral-500 [&_thead_th]:!bg-black/20 [&_tbody_tr.bg-ui-bg-base]:!bg-neutral-800 [&_input]:bg-black/30 border-black/40 [&_tbody_td]:!bg-black/10 [&_thead]:shadow-neutral-500"
              } [&_tr]:border-b rounded-2xl border [&_tbody_tr>*.txt-compact-small-plus]:!font-black [&_*]:overflox-y-hidden`}
            >
              <DataTable.Toolbar
                translations={{ clearAll: t("delete") }}
                className="flex flex-wrap justify-between gap-5"
              >
                {(children || useSearch) && (
                  <>
                    {useSearch && (
                      <div className="flex gap-2 items-center">
                        {/* {filters && <DataTable.FilterMenu tooltip="Filtros" />} */}
                        {useSearch && (
                          <DataTable.Search
                            placeholder={
                              useSearch &&
                              useSearch
                                .map(
                                  (field) =>
                                    columnModel.find((x) => x.access === field)
                                      ?.header || t(field),
                                )
                                .join(", ")
                            }
                            className="min-w-[80px] w-full md:w-[30vw]"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex gap-3 items-center">
                      {children}
                      {exportToExcel && (
                        <Tooltip content={t("export_excel")} placement="top">
                          <IconButton
                            onClick={() => exportToExcel(fullShownData)}
                          >
                            <box-icon
                              color={boxiconIconColor}
                              type="solid"
                              name="report"
                            ></box-icon>
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </>
                )}
              </DataTable.Toolbar>
              <DataTable.Table
                emptyState={{
                  filtered: {
                    custom: <Heading level="h2">{t("no_results")}</Heading>,
                  },
                  empty: {
                    custom: <Heading level="h2">{t("nothing_here")}</Heading>,
                  },
                }}
              />
              {usePagination ? (
                <DataTable.Pagination
                  translations={{
                    prev: (
                      <box-icon color="gray" name="chevron-left"></box-icon>
                    ),
                    next: (
                      <box-icon color="gray" name="chevron-right"></box-icon>
                    ),
                    of: " | ",
                    pages: "",
                    results: "",
                  }}
                />
              ) : (
                <></>
              )}
            </DataTable>
          )}
        </TooltipProvider>
      </div>
    </>
  );
}

export default AdaptableTable;
