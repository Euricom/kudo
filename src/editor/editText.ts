import type Konva from "konva";
import { type Vector2d } from "konva/lib/types";

type Document = {
  documentMode?: number;
}

const editText = (areaPosition: Vector2d, textNode: Konva.Text, tr: Konva.Transformer, scale: number) => {
  const textarea = createTextArea(textNode, areaPosition, tr, scale)
  textarea.focus();
}

const createTextArea = (textNode: Konva.Text, areaPosition: Vector2d, tr: Konva.Transformer, scale: number) => {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);

  // apply many styles to match text on canvas as close as possible
  // remember that text rendering on canvas and on the textarea can be different
  // and sometimes it is hard to make it 100% the same. But we will try...
  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = (areaPosition.y * scale).toString() + 'px';
  textarea.style.left = (areaPosition.x * scale).toString() + 'px';
  textarea.style.width = ((textNode.width() - textNode.padding() * 2) * scale).toString() + 'px';
  textarea.style.height =
    ((textNode.height() - textNode.padding() * 2 + 5) * scale ).toString() + 'px';
    
  textarea.style.fontSize = (textNode.fontSize() * scale).toString() + 'px';
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
    px += 2 + Math.round((textNode.fontSize()) / 20);
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
    const absScale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * absScale * scale, textNode, textarea);
    textarea.style.height = 'auto';
    textarea.style.height =
      Math.min(300, textarea.scrollHeight + textNode.fontSize()).toString() + 'px';
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


export default editText;