import Modeler from 'bpmn-js/lib/Modeler';
import * as React from 'react';

type HoverText = {
	title: string;
	description: string;
};

declare type OVERLAYS_TYPES_DEFINED = {
	SUCCES: 'succes';
	CURRENT: 'current';
};

type ElementOverlays = {
	name: string;
	type: OVERLAYS_TYPES_DEFINED;
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

export interface BpmnModelerProps {
	className: string;
	containerClassName: string;
	panelClassName: string;
	withPannel: true;
	modelerRef: (modelerInstance: Object) => {};
	diagramXML: string;
	handleWarning: (warnings: Object) => {};
	handleError: (errors: Object) => {};
	keyboardBind: HTMLElement;
	additionalModules: Array;
	moddleExtensions: Object;
}

declare const BpmnViewer: React.ComponentType<BpmnViewerProps>;

declare const BpmnModeler: React.ComponentType<BpmnModelerProps>;

declare const OVERLAYS_TYPES: OVERLAYS_TYPES_DEFINED;

export { BpmnViewer, BpmnModeler, OVERLAYS_TYPES };
