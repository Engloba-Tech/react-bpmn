import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { generateElementOverlays } from './overlays.generate';
import './index.css';

export function BpmnViewer({
	elementOverlays,
	viewSupplier,
	url,
	diagramXML,
	onError,
	onShown,
	onLoading,
	height,
	width,
}) {
	const [bpmnViewer, setBpmnViewer] = useState(null);
	const [elementRegistry, setElementRegistry] = useState(null);
	const [overlays, setOverlays] = useState(null);

	useEffect(() => {
		const _bpmnViewer = new BpmnJS({
			container: '#bpmn-container-react',
			width,
			height,
			keyboard: {
				bindTo: document,
			},
		});

		setBpmnViewer(_bpmnViewer);

		return () => {
			_bpmnViewer.destroy();
		};
	}, [height, width]);

	useEffect(() => {
		if (bpmnViewer) {
			bpmnViewer.on('import.done', (event) => {
				const { error, warnings } = event;

				if (error) {
					return onError && onError(error);
				}

				if (warnings) {
					onShown && onShown(warnings);
				}

				const canvas = bpmnViewer.get('canvas');
				const overlays = bpmnViewer.get('overlays');
				const elements = bpmnViewer.get('elementRegistry');
				canvas.zoom('fit-viewport', 'auto');

				viewSupplier({ elements, overlays });
				setOverlays(overlays);
				setElementRegistry(elements);
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
		}
	}, [bpmnViewer, url, diagramXML, viewSupplier, onError, onLoading, onShown]);

	useEffect(() => {
		if (bpmnViewer && elementRegistry) {
			generateElementOverlays(overlays, elementRegistry, elementOverlays);
		}
	}, [bpmnViewer, elementOverlays, elementRegistry, overlays]);

	return (
		<div
			className='react-bpmn-diagram-container'
			id='bpmn-container-react'
		></div>
	);
}

BpmnViewer.propTypes = {
	elementOverlays: PropTypes.arrayOf(PropTypes.object),
	viewSupplier: PropTypes.func,
	url: PropTypes.string,
	diagramXML: PropTypes.string,
	onError: PropTypes.func,
	onShown: PropTypes.func,
	onLoading: PropTypes.func,
	height: PropTypes.string,
	width: PropTypes.string,
};
