import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogArticlePage } from "@/components/EditorialPages";
import { fieldNotes } from "@/lib/editorial-content";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = fieldNotes.find((note) => note.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Field notes"} | MountainIceMikes` },
    { name: "description", content: loaderData?.summary ?? "Practical mountain and safari planning from MountainIceMikes." },
  ] }),
  component: () => <BlogArticlePage article={Route.useLoaderData()} />,
});
