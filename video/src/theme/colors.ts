// Brand palette, taken verbatim from config/company.json > branding, plus
// atmospheric tones derived from the assets/reference/ mood boards (warm
// golden-hour horizon against a deep dusk-blue sky).
export const colors = {
	primary: "#0B1F3A", // deep navy
	secondary: "#0F766E", // teal
	accent: "#D4AF37", // gold
	background: "#050A12", // near-black navy
	text: "#FFFFFF",

	horizonWarm: "#E8A857", // low golden-hour glow
	horizonEmber: "#B5713A", // deeper amber, closer to the skyline
	haze: "#7C8FA6", // desaturated blue-grey atmospheric haze
	cloud: "#9FB2C9",
	windowWarm: "#F2C879",
	windowCool: "#8FE0D3",
} as const;

export const gradients = {
	duskSky: `linear-gradient(180deg, ${colors.background} 0%, #0a1c33 32%, ${colors.primary} 55%, #2c4a5e 75%, #6b5645 90%, ${colors.horizonEmber} 100%)`,
	horizonGlow: `linear-gradient(180deg, rgba(232,168,87,0) 0%, rgba(232,168,87,0.16) 55%, rgba(232,168,87,0.34) 100%)`,
	cityGlowFog: `linear-gradient(180deg, rgba(5,10,18,0) 0%, rgba(5,10,18,0.5) 68%, rgba(5,10,18,0.94) 100%)`,
	vignette:
		"radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.28) 75%, rgba(0,0,0,0.72) 100%)",
} as const;
