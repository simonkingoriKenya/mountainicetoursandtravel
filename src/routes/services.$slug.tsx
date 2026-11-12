import { createFileRoute, notFound } from "@tanstack/react-router";
import { DestinationDetailPage } from "@/components/DestinationPages";
import { fieldServicePages } from "@/lib/site-content";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const destination = fieldServicePages[params.slug as keyof typeof fieldServicePages];
    if (!destination) throw notFound();
    return destination;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Field services"} | MountainIceMikes Tours and Travel` },
    { name: "description", content: loaderData?.summary ?? "Explore field services with MountainIceMikes." },
    { property: "og:title", content: `${loaderData?.title ?? "Field services"} | MountainIceMikes` },
    { property: "og:description", content: loaderData?.summary ?? "Explore field services with MountainIceMikes." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DestinationDetailPage category="services" groupTitle="Field services" destination={Route.useLoaderData()} />,
});