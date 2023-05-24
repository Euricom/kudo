import React, {
  useRef,
  type MutableRefObject,
  useEffect,
  useState,
} from "react";
import { Transformer, Text } from "react-konva";
import type Konva from "konva";
import { editText } from "../editText";
import { EditorFunctions, type CanvasTextProps, type Shapes } from "~/types";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { type Vector2d } from "konva/lib/types";

const CanvasText = ({
  shapeProps,
  scale,
  isSelected,
  editorFunction,
  dialog,
  isScalable,
  onSelect,
  onChange,
  onDelete,
  onChangeEnd,
  setScalingShape,
}: CanvasTextProps) => {
  const shapeRef = useRef<Konva.Text>() as MutableRefObject<Konva.Text>;
  const trRef =
    useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;
  const viewport = useWindowDimensions().width;

  const [lastDist, setLastDist] = useState(0);
  const [lastAngle, setLastAngle] = useState(0);
  const isScaling = useRef(false);

  function getDistance(p1: Vector2d, p2: Vector2d) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  function getAngle(p1: Vector2d, p2: Vector2d) {
    const deltaX = p2.x - p1.x;
    const deltaY = p2.y - p1.y;
    const radians = Math.atan2(deltaY, deltaX);
    return radians * (180 / Math.PI);
  }

  const onChangeMixed = (newProps: Shapes) => {
    onChange(newProps);
    onChangeEnd(newProps);
  };

  useEffect(() => {
    if (isSelected) {
      if (editorFunction === EditorFunctions.Clear) {
        onDelete(shapeProps.id);
      }

      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected, onDelete, shapeProps, editorFunction]);

  useEffect(() => {
    if (shapeRef.current) {
      const shapeWidth = shapeRef.current.width();
      const shapeHeight = shapeRef.current.height();
      const xOffset = shapeWidth / 2;
      const yOffset = shapeHeight / 2;
      shapeRef.current.offset({ x: xOffset, y: yOffset });
    }
  });

  const onEditText = () => {
    shapeRef.current.hide();
    trRef.current?.hide();
    dialog?.showModal();
    editText(shapeRef.current, trRef.current, scale, onTextChange, dialog);
  };

  const handleClick = () => {
    if (
      EditorFunctions.Draw === editorFunction ||
      EditorFunctions.Erase === editorFunction
    ) {
      return;
    }
    onSelect();
    if (viewport > 1024) {
      if (isSelected) onEditText();
    } else onEditText();
  };

  const onTextChange = (text: string) => {
    onChangeMixed({
      ...shapeProps,
      text: text,
    });
  };

  return (
    <React.Fragment>
      <Text
        onClick={handleClick}
        onTap={handleClick}
        ref={shapeRef}
        {...shapeProps}
        draggable={
          shapeProps.draggable &&
          isScalable &&
          EditorFunctions.Draw !== editorFunction &&
          EditorFunctions.Erase !== editorFunction
        }
        onDragMove={(e) => {
          if ((e.evt as unknown as TouchEvent).touches?.length > 1) {
            shapeRef.current?.stopDrag();
          }
        }}
        onTouchMove={(e) => {
          if (!isScalable) return;
          e.evt.preventDefault();
          const touch1 = e.evt.touches[0];
          const touch2 = e.evt.touches[1];
          if (touch1 && touch2) {
            setScalingShape(shapeProps.id);
            shapeRef.current?.stopDrag();
            const p1 = {
              x: touch1.clientX,
              y: touch1.clientY,
            };
            const p2 = {
              x: touch2.clientX,
              y: touch2.clientY,
            };
            const dist = getDistance(p1, p2);
            setLastDist(dist);
            const angle = getAngle(p1, p2);
            setLastAngle(angle);
            if (!isScaling.current) {
              isScaling.current = true;
              return;
            }
            const scale = (shapeProps.scale?.x ?? 1) * (dist / lastDist);
            const rotation = angle - lastAngle + (shapeProps.rotation ?? 0);
            onChange({
              ...shapeProps,
              rotation: rotation,
              scale: {
                x: scale,
                y: scale,
              },
            });
          } else {
            shapeRef.current?.startDrag();
          }
        }}
        onTouchEnd={() => {
          onChangeEnd(shapeProps);
          isScaling.current = false;
          setLastDist(0);
          setLastAngle(0);
        }}
        onDragEnd={(e) => {
          onChangeMixed({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          // transformer is changing scale of the node
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          onChange({
            ...shapeProps,
            rotation: node.rotation(),
            scale: node.scale(),
            x: node.x(),
            y: node.y(),
          });
        }}
        onTransformEnd={() => {
          onChangeEnd(shapeProps);
        }}
      />
      {isSelected && viewport > 1024 && (
        <Transformer
          ref={trRef}
          anchorX={0.5}
          anchorY={0.5}
          enabledAnchors={
            shapeProps.draggable
              ? [
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "middle-left",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ]
              : []
          }
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default CanvasText;
