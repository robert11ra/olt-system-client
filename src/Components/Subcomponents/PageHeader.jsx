import { Container, Text } from "@medusajs/ui";
import { useContext } from "react";
import Contexts from "../../Sources/Contexts";
import formatMiles from "../Utilities/formatMiles";

export default function PageHeader({ children, className, totals }) {
  const { rate, t } = useContext(Contexts.globalContext);
  return (
    <div>
      <Container
        className={`bg-gradient-to-r [&_h1]:w-full md:[&_h1]:w-auto md:[&_*]:text-left [&_*]:text-center flex-wrap gap-2 md:justify-start justify-center from-slate-600 to-primary shadow-lg title-font !text-white ${className}`}
      >
        {children}
      </Container>
    </div>
  );
}
