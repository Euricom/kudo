import Konva from "konva";
import { type Vector2d } from "konva/lib/types";

interface Document {
  documentMode?: number;
}

const addText = (stage: Konva.Stage, layer: Konva.Layer) => {
  const textNode = createTextNode(stage)

  layer.add(textNode);

  const tr = createTransformer(textNode)

  layer.add(tr);

  textNode.on('dblclick dbltap', () => {
    textNode.hide();
    tr.hide();

    const textPosition = textNode.absolutePosition();
    const areaPosition = getPosition(textPosition, stage);

    const textarea = createTextArea(textNode, areaPosition, tr)

    textarea.focus();
  });
}

export default addText;

const createTextNode = (stage: Konva.Stage) => {
  const textNode = new Konva.Text({
    text: 'Double click to edit',
    x: stage.getPointerPosition()?.x,
    y: stage.getPointerPosition()?.y,
    fontSize: stage.height()/(stage.scaleY() * 15),
    draggable: true,
  });

  textNode.on('transform', function () {
    // reset scale, so only with is changing by transformer
    textNode.setAttrs({
      width: textNode.width() * textNode.scaleX(),
      scaleX: 1,
    });
  });

  return textNode;
};

const createTransformer = (textNode: Konva.Text) => {
  const tr = new Konva.Transformer({
    enabledAnchors: ['middle-left', 'middle-right'],
    // set minimum width of text
    boundBoxFunc: function (oldBox, newBox) {
      newBox.width = Math.max(30, newBox.width);
      return newBox;
    },
  });

  tr.nodes([textNode]);

  return tr;
};

function getPosition(textPosition: Vector2d, stage: Konva.Stage) {
  return {
    x: stage.container().offsetLeft + textPosition.x,
    y: stage.container().offsetTop + textPosition.y,
  };
}

const createTextArea = (textNode: Konva.Text, areaPosition: Vector2d, tr: Konva.Transformer) => {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);

  // apply many styles to match text on canvas as close as possible
  // remember that text rendering on canvas and on the textarea can be different
  // and sometimes it is hard to make it 100% the same. But we will try...
  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = areaPosition.y.toString() + 'px';
  textarea.style.left = areaPosition.x.toString() + 'px';
  textarea.style.width = (textNode.width() - textNode.padding() * 2).toString() + 'px';
  textarea.style.height =
    (textNode.height() - textNode.padding() * 2 + 5).toString() + 'px';
  textarea.style.fontSize = textNode.fontSize().toString() + 'px';
  textarea.style.border = 'none';
  textarea.style.padding = '0px';
  textarea.style.margin = '0px';
  textarea.style.overflow = 'hidden';
  textarea.style.background = 'none';
  textarea.style.outline = 'none';
  textarea.style.resize = 'none';
  textarea.style.lineHeight = textNode.lineHeight().toString();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.transformOrigin = 'left top';
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();

  const rotation = textNode.rotation();
  let transform = '';
  if (rotation) {
    transform += 'rotateZ(' + rotation.toString() + 'deg)';
  }

  let px = 0;
  // also we need to slightly move textarea on firefox
  // because it jumps a bit
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    px += 2 + Math.round(textNode.fontSize() / 20);
  }
  transform += 'translateY(-' + px.toString() + 'px)';

  textarea.style.transform = transform;

  // reset height
  textarea.style.height = 'auto';
  // after browsers resized it we can set actual value
  textarea.style.height = (textarea.scrollHeight + 3).toString() + 'px';

  

  textarea.addEventListener('keydown', function (e) {
    // hide on enter
    // but don't hide on shift + enter
    if (e.key === 'Enter' && !e.shiftKey) {
      textNode.text(textarea.value);
      removeTextarea(textNode, textarea, tr);
    }
    // on esc do not set value back to node
    if (e.key === 'Escape') {
      removeTextarea(textNode, textarea, tr);
    }
  });

  textarea.addEventListener('keydown', function () {
    const scale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * scale, textNode, textarea);
    textarea.style.height = 'auto';
    textarea.style.height =
      textarea.scrollHeight.toString() + textNode.fontSize().toString() + 'px';
  });
  
  function handleOutsideClick(e: Event) {
    if (e.target !== textarea) {
      textNode.text(textarea.value);
      removeTextarea(textNode, textarea, tr);
    }
  }

  function removeTextarea(textNode: Konva.Text, textarea: HTMLTextAreaElement, tr: Konva.Transformer) {
    textarea.parentNode?.removeChild(textarea);
    window.removeEventListener('click', handleOutsideClick);
    textNode.show();
    tr.show();
    tr.forceUpdate();
  }
  
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  });

  return textarea;
};

function setTextareaWidth(newWidth: number, textNode: Konva.Text, textarea: HTMLTextAreaElement) {
  if (!newWidth) {
    // set width for placeholder
    newWidth = textNode.getTextWidth() * textNode.fontSize();
  }
  // some extra fixes on different browsers
  const isSafari = /^((?!chrome|android).)*safari/i.test(
    navigator.userAgent
  );
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isSafari || isFirefox) {
    newWidth = Math.ceil(newWidth);
  }

  const isEdge = (document as Document).documentMode || /Edge/.test(navigator.userAgent);
  if (isEdge) {
    newWidth += 1;
  }
  textarea.style.width = newWidth.toString() + 'px';
}
