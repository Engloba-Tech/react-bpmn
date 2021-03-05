import React, { useEffect, useState } from 'react';
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
	additionalModules,
	moddleExtensions,
	withPannel = true,
	linting,
}) {
	const [bpmnModeler, setBpmnModeler] = useState(null);

	useEffect(() => {
		if (!bpmnModeler) {
			setBpmnModeler((prevBpmnModeler) => {
				if (prevBpmnModeler) {
					return prevBpmnModeler;
				}

				const modeler = new Modeler({
					container: '#modeler-bpmn-react-container',
					keyboard: {
						bindTo: keyboardBind || document,
					},
					linting: {
						bpmnlint: linting,
					},
					additionalModules: withPannel
						? additionalModules
							? [propertiesPanelModule, propertiesProviderModule].concat(
									additionalModules
							  )
							: [propertiesPanelModule, propertiesProviderModule]
						: undefined,
					propertiesPanel: withPannel
						? {
								parent: '#properties-bpmn-react-panel-parent',
						  }
						: undefined,
					moddleExtensions: withPannel ? moddleExtensions : undefined,
				});

				if (diagramXML) {
					modeler
						.importXML(diagramXML)
						.then(({ warnings }) => {
							if (warnings.length) {
								handleWarning(warnings);
							}

							const canvas = modeler.get('canvas');

							canvas.zoom('fit-viewport');
						})
						.catch((err) => {
							handleError(err);
						});
				}

				modelerRef && typeof modelerRef === 'function' && modelerRef(modeler);
			});
		}

		return () => {
			setBpmnModeler((prevModeler) => {
				if (prevModeler) {
					bpmnModeler.destroy();
					return null;
				}
				return prevModeler;
			});
		};
	}, [
		modelerRef,
		bpmnModeler,
		withPannel,
		linting,
		diagramXML,
		handleWarning,
		handleError,
		keyboardBind,
		additionalModules,
		moddleExtensions,
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
	withPannel: PropTypes.bool,
	modelerRef: PropTypes.func,
	diagramXML: PropTypes.string,
	handleWarning: PropTypes.func,
	handleError: PropTypes.func,
	keyboardBind: PropTypes.element,
	additionalModules: PropTypes.array,
	moddleExtensions: PropTypes.object,
	linting: PropTypes.object,
};
