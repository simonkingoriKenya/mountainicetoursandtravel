import { createFileRoute, notFound } from "@tanstack/react-router";
import { DestinationDetailPage } from "@/components/DestinationPages";
import { safariPages } from "@/lib/site-content";

export const Route = createFileRoute("/safaris/$slug")({
  loader: ({ params }) => {
    const destination = safariPages[params.slug as keyof typeof safariPages];
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
  component: () => <DestinationDetailPage category="safaris" groupTitle="Safaris" destination={Route.useLoaderData()} />,
});