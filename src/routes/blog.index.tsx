import { createFileRoute } from "@tanstack/react-router";
import { BlogIndexPage } from "@/components/EditorialPages";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [
    { title: "Mountain & Safari Field Notes | MountainIceMikes" },
    { name: "description", content: "Read practical notes on choosing a Mount Kenya route, trek preparation and planning a Kenya safari." },
  ] }),
  component: BlogIndexPage,
});
