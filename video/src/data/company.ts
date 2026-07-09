// Mirrors the canonical data in /config/company.json at the repo root.
// Values are duplicated here (rather than imported across the project
// boundary) so the Remotion bundler only ever resolves files inside
// video/. Keep this in sync if /config/company.json changes.

export type BranchStatus = "Operational" | "Under Construction";

export type FloorBreakdown = {
	name: string;
	value: number;
};

export type OperationalBranch = {
	kind: "operational";
	id: string;
	name: string;
	status: "Operational";
	assets: number;
	/** Real directory name under /assets (not the same as config's `folder` field). */
	assetDir: string;
};

export type FinaleBranch = {
	kind: "finale";
	id: string;
	name: string;
	status: "Under Construction";
	currentAssets: number;
	constructionState: string;
	expectedAdditionalValue: number;
	expectedTotalValue: number;
	floors: FloorBreakdown[];
	assetDir: string;
};

export type Branch = OperationalBranch | FinaleBranch;

export const company = {
	nameAr: "شركة الحياة للخدمات الطبية",
	nameEn: "Al Hayat Medical Services",
	tagline: "Building the Future of Healthcare",
	introTitle: "الحياة للخدمات الطبية",
};

export const financial = {
	currentTotalAssets: 195_000_000,
	capitalIncreaseAfterCompletion: 32_000_000,
	totalAssetsAfterCompletion: 227_000_000,
	expectedShareValue: 300_000,
};

// The `folder` field in config/company.json (e.g. "hayat1") does not match
// the real directory names on disk (e.g. "branch1_hayat1"). This mapping
// is the explicit, verified correspondence between the two.
export const operationalBranches: OperationalBranch[] = [
	{
		kind: "operational",
		id: "hayat1",
		name: "الحياة ١",
		status: "Operational",
		assets: 33_000_000,
		assetDir: "branch1_hayat1",
	},
	{
		kind: "operational",
		id: "hayat2",
		name: "الحياة ٢",
		status: "Operational",
		assets: 22_000_000,
		assetDir: "branch2_hayat2",
	},
	{
		kind: "operational",
		id: "pharmacy",
		name: "صيدليات الحياة",
		status: "Operational",
		assets: 12_000_000,
		assetDir: "branch3_pharmacy",
	},
	{
		kind: "operational",
		id: "tunisia",
		name: "الحياة تونس",
		status: "Operational",
		assets: 3_000_000,
		assetDir: "branch4_tunisia",
	},
	{
		kind: "operational",
		id: "psychiatry",
		name: "الحياة للطب النفسي",
		status: "Operational",
		assets: 13_000_000,
		assetDir: "branch5_psychiatry",
	},
];

export const finaleBranch: FinaleBranch = {
	kind: "finale",
	id: "new-hospital",
	name: "المبنى الجديد",
	status: "Under Construction",
	currentAssets: 112_000_000,
	constructionState: "50% Finished",
	expectedAdditionalValue: 32_000_000,
	expectedTotalValue: 144_000_000,
	floors: [
		{ name: "الدور الأرضي", value: 40_000_000 },
		{ name: "الدور الأول", value: 15_000_000 },
		{ name: "الدور الثاني", value: 15_000_000 },
		{ name: "الدور الثالث", value: 14_000_000 },
		{ name: "الدور الرابع", value: 14_000_000 },
		{ name: "الدور الخامس", value: 14_000_000 },
	],
	assetDir: "branch6_new_building",
};

export const allBranches: Branch[] = [...operationalBranches, finaleBranch];

// Real, verified file listings under /assets/<assetDir>/... (see git log).
export const branchGalleries: Record<string, { building: string[]; gallery: string[] }> = {
	branch1_hayat1: {
		building: ["01.jpeg"],
		gallery: ["01.jpg", "02.jpg", "03.jpg", "04.jpeg", "05.jpeg"],
	},
	branch2_hayat2: {
		building: ["01.jpg"],
		gallery: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpeg", "06.jpeg", "07.jpeg", "08.jpeg"],
	},
	branch3_pharmacy: {
		building: ["01.jpeg"],
		gallery: ["01.jpeg", "02.jpeg"],
	},
	branch4_tunisia: {
		building: ["01.jpg"],
		gallery: ["01.jpg"],
	},
	branch5_psychiatry: {
		building: ["01.jpg"],
		gallery: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg"],
	},
};

export const finaleAssets = {
	current: ["01.png", "02.png"],
	future: ["01.jpg", "02.jpg"],
};

export const logoPath = "assets/logo/logo.png";

export const sounds = {
	ambient: "assets/sounds/ambient.mp3",
	heartbeat: "assets/sounds/heartbeat.mp3",
	counter: "assets/sounds/counter.mp3",
	transition1: "assets/sounds/Transition1.mp3",
	transition2: "assets/sounds/Transition2.mp3",
	whoosh: "assets/sounds/whoosh.mp3",
	success: "assets/sounds/success.mp3",
	final: "assets/sounds/final.mp3",
};

export const branchAssetPath = (assetDir: string, category: string, file: string) =>
	`assets/${assetDir}/${category}/${file}`;
