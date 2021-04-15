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
	const [XMLData, setXMLData] = useState(null);
	const [urlData, setUrlData] = useState(null);

	useEffect(() => {
		const _bpmnViewer = new BpmnJS({
			container: '#bpmn-container-react',
			width,
			height,
			keyboard: {
				bindTo: document,
			},
		});

		_bpmnViewer.on('import.done', (event) => {
			const { error, warnings } = event;

			if (error) {
				return onError && onError(error);
			}

			if (warnings) {
				onShown && onShown(warnings);
			}

			const canvas = _bpmnViewer.get('canvas');
			const overlays = _bpmnViewer.get('overlays');
			const elements = _bpmnViewer.get('elementRegistry');
			canvas.zoom('fit-viewport', 'auto');

			viewSupplier({ elements, overlays });
			setOverlays(overlays);
			setElementRegistry(elements);
		});

		setBpmnViewer(_bpmnViewer);

		return () => {
			_bpmnViewer.destroy();
		};
	}, [height, width, onShown, onError, viewSupplier]);

	useEffect(() => {
		if (bpmnViewer) {
			if (url) {
				if (!urlData || urlData !== url) {
					setUrlData(url);
					onLoading && onLoading();

					fetch(url)
						.then((response) => response.text())
						.then((XMLText) => bpmnViewer.importXML(XMLText))
						.catch((err) => onError && onError(err));
				}
			}

			if (diagramXML) {
				if (!XMLData || XMLData !== diagramXML) {
					setXMLData(diagramXML);
					bpmnViewer.importXML(diagramXML);
				}
			}
		}
	}, [bpmnViewer, XMLData, urlData, url, diagramXML, onError, onLoading]);

	useEffect(() => {
		if (elementRegistry) {
			generateElementOverlays(overlays, elementRegistry, elementOverlays);
		}
	}, [elementOverlays, elementRegistry, overlays]);

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
