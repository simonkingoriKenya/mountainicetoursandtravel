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
- Keep customer services and operations data behind a typed provider interface that selects local mock data, Lovable Cloud, or a `/api/*` Worker adapter by configuration; this preserves portable Cloudflare/Replit handoff without changing the UI.
- Keep public destination menus, route content, and category-based detail routes in shared typed modules so every menu entry has a working page.
