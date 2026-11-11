import { createFileRoute, notFound } from "@tanstack/react-router";
import { DestinationDetailPage } from "@/components/DestinationPages";
import { mountainPages } from "@/lib/site-content";

export const Route = createFileRoute("/mountains/$slug")({
  loader: ({ params }) => {
    const destination = mountainPages[params.slug as keyof typeof mountainPages];
    if (!destination) throw notFound();
    return destination;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData.title} | MountainIceMikes Tours and Travel` },
    { name: "description", content: loaderData.summary },
    { property: "og:title", content: `${loaderData.title} | MountainIceMikes` },
    { property: "og:description", content: loaderData.summary },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DestinationDetailPage category="mountains" groupTitle="Mountains" destination={Route.useLoaderData()} />,
});