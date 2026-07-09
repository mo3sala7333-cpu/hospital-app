// Brand palette, taken verbatim from config/company.json > branding.
export const colors = {
	primary: "#0B1F3A", // deep navy
	secondary: "#0F766E", // teal
	accent: "#D4AF37", // gold
	background: "#050A12", // near-black navy
	text: "#FFFFFF",
} as const;

export const gradients = {
	duskSky: `linear-gradient(180deg, ${colors.background} 0%, ${colors.primary} 45%, #16324f 72%, #3a5f6b 88%, #8a7146 100%)`,
	cityGlowFog: `linear-gradient(180deg, rgba(5,10,18,0) 0%, rgba(5,10,18,0.55) 70%, rgba(5,10,18,0.95) 100%)`,
	vignette:
		"radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)",
} as const;
