import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import './index.css';

export function BpmnModeler({
	className,
	containerClassName,
	panelClassName,
	modelerRef,
	diagramXML,
	handleWarning,
	handleError,
	keyboardBind,
	additionalModulesBPMN,
}) {
	useEffect(() => {
		const bpmnModeler = new Modeler({
			container: '#modeler-bpmn-react-container',
			keyboard: {
				bindTo: keyboardBind || document,
			},
			additionalModules: additionalModulesBPMN || [
				propertiesPanelModule,
				propertiesProviderModule,
			],
			propertiesPanel: {
				parent: '#properties-bpmn-react-panel-parent',
			},
		});
		if (diagramXML) {
			bpmnModeler
				.importXML(diagramXML)
				.then(({ warnings }) => {
					if (warnings.length) {
						handleWarning(warnings);
					}

					const canvas = bpmnModeler.get('canvas');

					canvas.zoom('fit-viewport');
				})
				.catch((err) => {
					handleError(err);
				});
		}

		modelerRef && typeof modelerRef === 'function' && modelerRef(bpmnModeler);

		return () => {
			bpmnModeler.destroy();
		};
	}, [
		modelerRef,
		diagramXML,
		handleWarning,
		handleError,
		keyboardBind,
		additionalModulesBPMN,
	]);

	return (
		<div className={className}>
			<div
				className={containerClassName}
				id='modeler-bpmn-react-container'
			></div>
			<div
				className={panelClassName}
				id='properties-bpmn-react-panel-parent'
			></div>
		</div>
	);
}

BpmnModeler.propTypes = {
	className: PropTypes.string,
	containerClassName: PropTypes.string,
	panelClassName: PropTypes.string,
	modelerRef: PropTypes.func,
	diagramXML: PropTypes.string,
	handleWarning: PropTypes.func,
	handleError: PropTypes.func,
	keyboardBind: PropTypes.element,
	additionalModulesBPMN: PropTypes.array,
};
