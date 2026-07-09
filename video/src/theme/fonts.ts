import { continueRender, delayRender } from "remotion";
import { cairoBase64 } from "./cairoFontData.generated";

export const cairo = "Cairo";

// Fonts are embedded as base64 data URIs (rather than fetched over the
// network via @remotion/google-fonts or staticFile()) so loading a
// FontFace never depends on a network round-trip during rendering — data
// URI decoding is local and near-instant, avoiding the flakiness seen
// with network-backed font loads in this environment.
export const fontsLoaded = Promise.all(
	Object.entries(cairoBase64).map(([weight, base64]) => {
		const handle = delayRender(`Loading Cairo ${weight}`);
		const face = new FontFace(cairo, `url(data:font/ttf;base64,${base64}) format("truetype")`, {
			weight,
			style: "normal",
		});
		return face
			.load()
			.then((loaded) => {
				document.fonts.add(loaded);
				continueRender(handle);
			})
			.catch((err) => {
				continueRender(handle);
				throw err;
			});
	}),
);
