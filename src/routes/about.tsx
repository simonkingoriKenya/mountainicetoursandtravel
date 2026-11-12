import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/DestinationPages";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About MountainIceMikes | Local Mountain & Safari Guides" },
    { name: "description", content: "Meet the Nanyuki team behind MountainIceMikes Tours and Travel, and learn about our guiding, safety and crew-welfare approach." },
    { property: "og:title", content: "About MountainIceMikes Tours and Travel" },
    { property: "og:description", content: "Local knowledge, careful guiding and respect for the people behind every journey." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});