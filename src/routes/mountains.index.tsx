import { createFileRoute } from "@tanstack/react-router";
import { DestinationIndexPage } from "@/components/DestinationPages";
import { mountainMenu } from "@/lib/site-content";

export const Route = createFileRoute("/mountains/")({
  head: () => ({ meta: [
    { title: "Mount Kenya & East Africa Mountain Treks | MountainIceMikes" },
    { name: "description", content: "Explore private and group treks, technical Mount Kenya climbs, Kilimanjaro, Mount Elgon and scenic mountain experiences." },
    { property: "og:title", content: "Mountain Treks | MountainIceMikes Tours and Travel" },
    { property: "og:description", content: "Find a mountain route with local guides and careful field planning." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DestinationIndexPage category="mountains" title="Mountain journeys" eyebrow="High places · Local mountain crew" summary="Choose a route that fits your time, experience and way of travelling." entries={mountainMenu} />,
});