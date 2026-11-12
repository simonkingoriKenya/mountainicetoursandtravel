import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "@/components/EditorialPages";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [
    { title: "Guest Reviews & Trip Feedback | MountainIceMikes" },
    { name: "description", content: "Learn how MountainIceMikes approaches safety, local guiding and crew welfare, and share feedback from a trip." },
  ] }),
  component: ReviewsPage,
});
