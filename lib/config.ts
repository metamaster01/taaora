// Feature flags. Toggle here — no need to touch component or route logic
// elsewhere when flipping a feature on or off.

// Cash on Delivery is currently disabled per client request. To re-enable,
// change this to `true` — the UI and the /api/checkout route both read
// from this single source of truth, so nothing else needs to change.
export const COD_ENABLED = false