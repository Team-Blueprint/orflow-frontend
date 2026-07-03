// Direct-path re-exports for @solar-icons/react
//
// Vite 8 uses Rolldown for dependency pre-bundling (unlike Vite 6/7 which used esbuild).
// Rolldown produces a malformed cached file when processing @solar-icons/react's massive
// barrel export (1421 lines, hundreds of re-exports). The error is:
//   "Failed to parse source for import analysis because the content contains invalid JS syntax"
//
// The fix is `optimizeDeps.exclude: ["@solar-icons/react"]` in vite.config.ts,
// which bypasses Rolldown pre-bundling for this package. But without pre-bundling,
// importing from the barrel file creates a browser request waterfall as the browser
// chases hundreds of individual module imports.
//
// These direct-path imports bypass the barrel entirely — each import resolves to a
// single, self-contained .mjs file with no further dependency chain.
// The `@solar-icons/react/icons/**` paths use the package's `exports` map to resolve
// to the individual CSR component files.

export { default as AltArrowDown } from "@solar-icons/react/icons/arrows/AltArrowDown"
export { default as Bill } from "@solar-icons/react/icons/money/Bill"
export { default as Book } from "@solar-icons/react/icons/school/Book"
export { default as Card2 } from "@solar-icons/react/icons/money/Card2"
export { default as Code } from "@solar-icons/react/icons/it/Code"
export { default as DoubleAltArrowUp } from "@solar-icons/react/icons/arrows/DoubleAltArrowUp"
export { default as Gamepad } from "@solar-icons/react/icons/devices/Gamepad"
export { default as Key } from "@solar-icons/react/icons/security/Key"
export { default as Lock } from "@solar-icons/react/icons/security/Lock"
export { default as Refresh } from "@solar-icons/react/icons/arrows/Refresh"
export { default as Rocket } from "@solar-icons/react/icons/astronomy/Rocket"
export { default as ShieldCheck } from "@solar-icons/react/icons/security/ShieldCheck"
export { default as Shop } from "@solar-icons/react/icons/shopping/Shop"
export { default as Shuffle } from "@solar-icons/react/icons/video/Shuffle"
export { default as UsersGroupRounded } from "@solar-icons/react/icons/users/UsersGroupRounded"
export { default as ChartSquare } from "@solar-icons/react/icons/business/ChartSquare"
export { default as Widget3 } from "@solar-icons/react/icons/settings/Widget3"
export { default as Settings } from "@solar-icons/react/icons/settings/Settings"
