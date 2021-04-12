import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { configBpmnViewer } from './viewer.config';
import './index.css';

export function BpmnViewer({ elementOverlays, elementRegistry, url, diagramXML, onError, onShown, onLoading, height, width }) {
  useEffect(() => {
    const bpmnViewer = new BpmnJS({
      container: '#bpmn-container-react',
      width,
      height,
      keyboard: {
        bindTo: document
      }
    });

    configBpmnViewer(bpmnViewer, elementOverlays, elementRegistry, url, diagramXML, onError, onShown, onLoading);

    return () => {
      bpmnViewer.destroy();
    };
  }, [elementOverlays, elementRegistry, url, diagramXML, onError, onShown, onLoading, height, width]);

  return <div className="react-bpmn-diagram-container" id="bpmn-container-react"></div>;
}


BpmnViewer.propTypes = {
  elementOverlays: PropTypes.arrayOf(PropTypes.object),
  elementRegistry: PropTypes.func,
  url: PropTypes.string,
  diagramXML: PropTypes.string,
  onError: PropTypes.func,
  onShown: PropTypes.func,
  onLoading: PropTypes.func,
  height: PropTypes.string,
  width: PropTypes.string
};
