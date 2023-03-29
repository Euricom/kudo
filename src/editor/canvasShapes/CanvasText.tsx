import React, { useRef, type MutableRefObject, useState, useEffect } from 'react';
import { Transformer, Text } from 'react-konva';
import type Konva from 'konva';
import { type Vector2d } from 'konva/lib/types';
import { type CanvasShapes } from '../KonvaCanvas';
import editText from '../editText';

type TextProps = {
  id: string,
  type: CanvasShapes,
  text?: string,
  x: number,
  y: number,
  width?: number,
  height?: number,
}

type CanvasTextProps = {
  shapeProps: TextProps,
  scale: number,
  isSelected: boolean,
  onSelect: () => void,
  onChange: (shapeProps: TextProps) => void,
  areaPosition: Vector2d,
  fontSize: number,
}

const CanvasText = ({ shapeProps, scale, isSelected, onSelect, onChange, areaPosition, fontSize }: CanvasTextProps) => {
  const shapeRef = useRef<Konva.Text>() as MutableRefObject<Konva.Text>;
  const trRef = useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;
  // const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const onDoubleClick = () => {
    shapeRef.current.hide();
    trRef.current.hide();
    editText(areaPosition, shapeRef.current, trRef.current, scale)
  }

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
        ref={shapeRef}
        {...shapeProps}
        fontSize={fontSize}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorX={0.5}
          anchorY={0.5}
          enabledAnchors={['middle-left', 'middle-right', 'bottom-center']}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
      {/* {isEditing && (
        <TextEdit textNode={shapeRef.current} tr={trRef.current} areaPosition={areaPosition}/>
      )} */}
    </React.Fragment>
  );
};

type EditProps = {
  textNode: Konva.Text,
  tr: Konva.Transformer
  areaPosition: Vector2d
}

type Document = {
  documentMode?: number;
}

const TextEdit = ({ textNode, tr, areaPosition }: EditProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>() as MutableRefObject<HTMLTextAreaElement>

  const style = {
    top: areaPosition.y.toString() + 'px',
    left: areaPosition.x.toString() + 'px',
    width: (textNode.width() - textNode.padding() * 2).toString() + 'px',
    height: (textNode.height() - textNode.padding() * 2 + 5).toString() + 'px',
    fontSize: textNode.fontSize().toString() + 'px',
    lineHeight: textNode.lineHeight().toString(),
    fontFamily: textNode.fontFamily(),
    textAlign: textNode.align(),
    color: textNode.fill(),
  };

  useEffect(() => {
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

    textAreaRef.current.style.transform = transform;

    // reset height
    textAreaRef.current.style.height = 'auto';
    // after browsers resized it we can set actual value
    textAreaRef.current.style.height = (textAreaRef.current.scrollHeight + 3).toString() + 'px';



    textAreaRef.current.addEventListener('keydown', function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.key === 'Enter' && !e.shiftKey) {
        textNode.text(textAreaRef.current?.value);
        removeTextarea(textNode, textAreaRef.current, tr);
      }
      // on esc do not set value back to node
      if (e.key === 'Escape') {
        removeTextarea(textNode, textAreaRef.current, tr);
      }
    });

    textAreaRef.current.addEventListener('keydown', function () {
      const scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale, textNode, textAreaRef.current);
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight.toString() + textNode.fontSize().toString() + 'px';
    });

    function handleOutsideClick(e: Event) {
      if (e.target !== textAreaRef.current) {
        textNode.text(textAreaRef.current.value);
        removeTextarea(textNode, textAreaRef.current, tr);
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

  }, [textNode, tr])

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

  return (
    <>
      <textarea ref={textAreaRef}
        value={textNode.text()}
        className={`absolute border-none p-0 m-0 overflow-hidden bg-none outline-none resize-none origin-top-left`}
      //style={style}
      />
    </>
  )
}

export default CanvasText;