// Combat rewards are deliberately light: exploration stays more important than grinding.
EntityEvents.death(event => {
  const e = event.entity
  // Blood-moon and boss mods remain responsible for spawn difficulty.
  // Keep this hook intentionally conservative to avoid destabilizing third-party mob IDs.
})
