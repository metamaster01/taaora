// Feature flags. Toggle here — no need to touch component or route logic
// elsewhere when flipping a feature on or off.

// Cash on Delivery is enabled, with a handling fee. To disable again,
// change COD_ENABLED to `false` — the UI and the /api/checkout route both
// read from this single source of truth, so nothing else needs to change.
export const COD_ENABLED = true

// ₹50 handling fee, in paise. Applied only to COD orders — change this one
// number to adjust the fee everywhere it's shown or charged.
export const COD_HANDLING_FEE_PAISE = 5000