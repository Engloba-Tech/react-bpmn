import { generateElementOverlays } from './overlays.generate';

export function configBpmnViewer(
	bpmnViewer,
	elementOverlays,
	elementActions,
	url,
	diagramXML,
	onError,
	onShown,
	onLoading
) {
	bpmnViewer.on('import.done', (event) => {
		const { error, warnings } = event;

		if (error) {
			return onError && onError(error);
		}

		const canvas = bpmnViewer.get('canvas');
		const overlays = bpmnViewer.get('overlays');
		const elements = bpmnViewer.get('elementRegistry');

		canvas.zoom('fit-viewport', 'auto');

		generateElementOverlays(overlays, elements, elementOverlays);

		elementActions({ elements, overlays });

		return onShown && onShown(warnings);
	});

	if (url) {
		onLoading && onLoading();

		fetch(url)
			.then((response) => response.text())
			.then((XMLText) => bpmnViewer.importXML(XMLText))
			.catch((err) => onError && onError(err));
	}

	if (diagramXML) {
		bpmnViewer.importXML(diagramXML);
	}

	return bpmnViewer;
}
