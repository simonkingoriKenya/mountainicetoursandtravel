import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { fieldNotes } from "@/lib/editorial-content";
import { fieldServiceMenu, mountainMenu, safariMenu } from "@/lib/site-content";
import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const publicPaths = [
  "/",
  "/about",
  "/reviews",
  "/blog",
  "/contact",
  "/mountains",
  ...mountainMenu.map(({ slug }) => `/mountains/${slug}`),
  "/safaris",
  ...safariMenu.map(({ slug }) => `/safaris/${slug}`),
  "/services",
  ...fieldServiceMenu.map(({ slug }) => `/services/${slug}`),
  ...fieldNotes.map(({ slug }) => `/blog/${slug}`),
];

describe("App routing", () => {
  it.each(publicPaths)("matches the public destination %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes(path);

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
