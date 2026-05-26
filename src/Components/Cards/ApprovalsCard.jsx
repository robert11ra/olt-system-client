import { Button, Container, Text } from "@medusajs/ui";
import { format } from "date-fns";
import * as medusaIcons from "@medusajs/icons";
import { useContext, useState } from "react";
import Contexts from "../../Sources/Contexts";

export default function MobileApprovalCard({ row, onReject, onApprove }) {
  const [expanded, setExpanded] = useState(false);
  const { t, user, boxiconIconColor } = useContext(
    Contexts.globalContext,
  );


  return (
    <Container
      className={
        "relative block pb-5 p-4 rounded-xl shadow transition-all"
      }
    >
      {" "}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((s) => !s);
        }}
        className="flex justify-between cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex gap-2">
          <medusaIcons.ChevronDown
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />{" "}
          <Text className="font-bold select-none">
            {row.supplier_name} <br/> {row.supplier_document}
          </Text>
        </div>
        <div className="flex-col">
          <Text className="text-xs">
            {t("created_by")} - {row.user}
          </Text>
          <Text className="text-xs">
            {t("dept")} - {row.department_name}
          </Text>
          <Text className="text-xs">
            {t("credit_limit")} - {row.supplier_limit}
          </Text>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 mt-3 ${expanded ? "max-h-96" : "max-h-0"}`}
      >
        <div className="flex flex-wrap justify-center mb-2 gap-2">
          <Button className="text-sm px-3 py-1" onClick={() => onApprove(row.id)}>Aprobar</Button>
          <Button className="text-sm px-3 py-1" onClick={() => onReject(row.id)}>Rechazar</Button>
        </div>
      </div>
    </Container>
  );
}
