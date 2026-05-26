import { Badge } from "@medusajs/ui";

export default function badge (info, field, color) {
  return <DynamicBadge field={field} color={color} info={info} />
};

function DynamicBadge({ field, color, info }) {
  return (
    <Badge rounded="full" color={color || "blue"}>
      {field ? info.getValue()[field] : info.getValue()}
    </Badge>
  )
}