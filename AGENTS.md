<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep customer and operations data behind typed interfaces. Use local mock data for development and Cloudflare Workers APIs backed by D1, KV, and R2 in production.
- Do not add hosted database, authentication, or storage providers outside Cloudflare. Staff operations stay disabled until Cloudflare authentication and authorization are implemented.
- Keep public destination menus, route content, and category-based detail routes in shared typed modules so every menu entry has a working page.
