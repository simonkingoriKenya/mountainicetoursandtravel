import { createFileRoute } from "@tanstack/react-router";
import { DestinationIndexPage } from "@/components/DestinationPages";
import { fieldServiceMenu } from "@/lib/site-content";

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: [
    { title: "Mountain Gear, Transport & Field Services | MountainIceMikes" },
    { name: "description", content: "Arrange mountain gear rental, transport, team hikes, production logistics and private East African itineraries." },
    { property: "og:title", content: "Field Services | MountainIceMikes Tours and Travel" },
    { property: "og:description", content: "Practical field support, from mountain equipment to ground transport and private planning." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DestinationIndexPage category="services" title="Support for the miles between" eyebrow="Field services · Practical support" summary="Bring the details together with local equipment, transport and planning support." entries={fieldServiceMenu} />,
});