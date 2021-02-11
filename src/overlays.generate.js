import { SHAPE } from './overlays.const';

function getShapeType(shape) {
  if (shape.height === SHAPE.ROMBO) {
    return 'rombo';
  }

  if (shape.height === SHAPE.SQUARE) {
    return 'aquare';
  }

  return 'circle';
}

function loadTooltip(hoverTooltip) {
  return `
    <div class="tooltip-top">
      ${hoverTooltip.title ? `<h4 class="text">${hoverTooltip.title}</h4>` : ''}
      <p class="text">${hoverTooltip.description}</p>
      <i></i>
    </div>
  `;
}

function loadMultipleTooltip(hoverTooltip) {
  let multipleTooltip = '<div class="tooltip-top">';

  hoverTooltip.forEach(tooltip => {
    multipleTooltip += `${tooltip.title ? `<h4 class="text">${tooltip.title}</h4>` : ''}`;
    multipleTooltip += `<p class="text">${tooltip.description}</p>`;
  });

  multipleTooltip += '<i></i></div>';

  return multipleTooltip;
}

function overlayHTML(shape, id, type, hoverTooltip, onClick) {
  if (onClick) {
    // workaround, dont delete
    setTimeout(() => {
      const $button = document.querySelector(`#${id}`);
      $button.addEventListener('click', function () {
        onClick();
      });
    });
  }

  return `<div style="width:${shape.width}px;height:${shape.height}px">
    <div  style="width:${shape.width}px;height:${shape.height}px"
          class="highlight-overlay-${type} ${getShapeType(shape)}"></div>
    <button id="${id}"class="BPMNelement btn">
      ${
        hoverTooltip
          ? Array.isArray(hoverTooltip)
            ? loadMultipleTooltip(hoverTooltip)
            : loadTooltip(hoverTooltip)
          : ''
      }
    </button>
  <div>`;
}

export function generateElementOverlays(overlays, elementRegistry, elements, i = 0) {
  if (elements.length === i) {
    return;
  }

  const element = elements[i];
  const shape = elementRegistry.get(element.name);
  const id = element.name + i;
  const html = overlayHTML(shape, id, element.type, element.hoverTooltip, element.onClick);

  overlays.add(element.name, {
    position: {
      top: 0,
      left: 0
    },
    html
  });

  return generateElementOverlays(overlays, elementRegistry, elements, i + 1);
}
