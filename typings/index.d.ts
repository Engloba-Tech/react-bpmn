import * as React from 'react';

type HoverText = {
	title: string;
	description: string;
};

declare type OVERLAYS_TYPES = {
	SUCCES: 'succes';
	CURRENT: 'current';
};

type ElementOverlays = {
	name: string;
	type: OVERLAYS_TYPES;
	hoverText: HoverText | Array<HoverText>;
	onClick: Function;
};

export interface BpmnViewerProps {
	elementOverlays: Array<ElementOverlays>;
	url: string;
	diagramXML: XMLDocument;
	onError: Function;
	onShown: Function;
	onLoading: Function;
	height: string;
	width: string;
}

declare const BpmnViewer: React.ComponentType<BpmnViewerProps>;

export { BpmnViewer, OVERLAYS_TYPES };
