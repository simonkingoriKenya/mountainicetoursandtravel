import { createFileRoute } from "@tanstack/react-router";
import { DestinationIndexPage } from "@/components/DestinationPages";
import { safariMenu } from "@/lib/site-content";

export const Route = createFileRoute("/safaris/")({
  head: () => ({ meta: [
    { title: "Kenya & Tanzania Wildlife Safaris | MountainIceMikes" },
    { name: "description", content: "Explore Kenya wildlife safaris, Maasai Mara, Amboseli, Northern Kenya and Tanzania journeys planned around your dates." },
    { property: "og:title", content: "East African Safaris | MountainIceMikes Tours and Travel" },
    { property: "og:description", content: "Wildlife journeys planned with local knowledge and practical field support." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DestinationIndexPage category="safaris" title="Safaris, at their own pace" eyebrow="Wildlife · Kenya & Tanzania" summary="Explore the landscapes, wildlife and trip lengths that suit your time in East Africa." entries={safariMenu} />,
});