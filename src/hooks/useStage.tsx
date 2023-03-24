
import { type Layer } from "konva/lib/Layer";
import { type Stage } from "konva/lib/Stage";
import { useEffect, useRef, type MutableRefObject } from "react";
import { createStage } from "~/editor/setUpCanvas";

export default function useStage(container: HTMLDivElement | null) {
    const stageRef = useRef<Stage>() as MutableRefObject<Stage>;
    const layerRef = useRef<Layer>() as MutableRefObject<Layer>;
    
    useEffect(() => {
        const {stage, layer, cleanUp} = createStage(container)
        
        stageRef.current = stage
        layerRef.current = layer
        console.log(`Stage: ${stageRef.current.toJSON()}`);
        
        return () => {
            cleanUp()
        }
    }, [container]);
    
    return {stage: stageRef.current, layer: layerRef.current};
}