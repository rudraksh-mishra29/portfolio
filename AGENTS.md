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

## Portfolio architecture
- Keep the TanStack Start bootstrap and client-only index route; browser-only rendering and lazy imports isolate WebGL from SSR.
- Store editable portfolio content in the portfolio data module; blank personal fields remain unset instead of inventing credentials or destinations.
- Define visual roles and scene palette centrally in the global design system; WebGL reads its color tokens from the document.
- Animate the infinity through seamless tube-UV light flow with bounded orientation instead of full mesh rotation, preserving its silhouette; the core wrapper exposes data-scene-ready after rendering for visual verification.
- Use one continuous index experience with section anchors; the requested cinematic scrolling connects the narrative sections.
- Contact opens an email draft only when a real recipient is configured; never simulate delivery or store visitors’ messages without a connected service.
