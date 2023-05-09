import type Konva from "konva";

const editText = (
  textNode: Konva.Text,
  tr: Konva.Transformer,
  scale: number,
  onChange: (text: string) => void,
  container?: HTMLDialogElement
) => {
  const textarea = document.createElement("span");
  if (container) {
    container.appendChild(textarea);
  } else {
    document.body.appendChild(textarea);
  }

  // apply many styles to match text on canvas as close as possible
  // remember that text rendering on canvas and on the textarea can be different
  // and sometimes it is hard to make it 100% the same. But we will try...
  textarea.contentEditable = "true";
  textarea.innerText = textNode.text();
  textarea.style.width = "auto";
  textarea.style.height =
    ((textNode.height() - textNode.padding() * 2 + 5) * scale).toString() +
    "px";

  textarea.style.fontSize = "1.5rem";
  // (textNode.fontSize() * scale * textNode.scaleX()).toString() + "px";
  textarea.style.overflow = "visible";
  textarea.style.outline = "none";
  textarea.style.lineHeight = textNode.lineHeight().toString();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.transformOrigin = "center";
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();

  // reset height
  textarea.style.height = "auto";

  // after browsers resized it we can set actual value
  textarea.style.height = (textarea.scrollHeight + 3).toString() + "px";

  textarea.focus();
  window?.getSelection()?.selectAllChildren(textarea);
  window?.getSelection()?.collapseToEnd();

  textarea.addEventListener("keydown", function (e) {
    // hide on enter
    // but don't hide on shift + enter
    if (e.key === "Enter" && !e.shiftKey) {
      textNode.text(textarea.innerText);
      onChange(textarea.innerText);
      removeTextarea(textNode, textarea, tr);
    }
    // on esc do not set value back to node
    if (e.key === "Escape") {
      removeTextarea(textNode, textarea, tr);
    }
  });

  textarea.addEventListener("keydown", function () {
    textarea.style.height = "auto";
  });

  function handleOutsideClick(e: Event) {
    if (e.target !== textarea) {
      textNode.text(textarea.innerText);
      onChange(textarea.innerText);
      removeTextarea(textNode, textarea, tr);
    }
  }

  function removeTextarea(
    textNode: Konva.Text,
    textarea: HTMLSpanElement,
    tr: Konva.Transformer
  ) {
    textarea.parentNode?.removeChild(textarea);
    window.removeEventListener("click", handleOutsideClick);
    window.removeEventListener("touchstart", handleOutsideClick);

    container?.close();
    textNode.show();
    tr?.show();
  }

  setTimeout(() => {
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("touchstart", handleOutsideClick);
  });
  textarea.focus();
};

export { editText };
