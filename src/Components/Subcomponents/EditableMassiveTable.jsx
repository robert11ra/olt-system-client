import { useState, useEffect, useMemo, useRef } from "react";
import AdaptableTable from "./AdaptableTable.jsx";

export default function EditableMassiveTable({ data }) {
  const [massiveData, setMassiveData] = useState(() => data)
  const refTimer = useRef();

  useEffect(() => {
    return () => {
      data = massiveData;
    }
  })

  const modelColumnKeys = useMemo(() => {
    return [{ access: "index", header: "Fila" },
    ...(massiveData[0] ? Object.keys(massiveData[0]).map((key, i) => ({
      access: key, header: key, cell: (info) => {

        return <>
          <input key={i} className="border-none p-1 rounded" defaultValue={info.getValue() ?? ''} onChange={(e) => {

            if (refTimer.current) clearTimeout(refTimer.current)

            let tempData = [...massiveData];
            tempData[info.row.index][key] = e.target.value;
            refTimer.current = setTimeout(() => setMassiveData(tempData), 100)

          }} />
        </>

      }
    })) : [])]
  }, [])

  return (<AdaptableTable
    columnModel={
      modelColumnKeys
    }
    data={data.map((row, i) => ({ ...row, index: i + 1 }))}
    usePagination={true}
    pageSize={8}
  ></AdaptableTable>)
}