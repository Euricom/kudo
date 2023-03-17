import Konva from 'konva';

const createStage: (container: HTMLDivElement | null) => {stage: Konva.Stage, layer: Konva.Layer, cleanUp: () => void} = (container: HTMLDivElement | null) => {
    // create the Konva stage, layer, and rectangle

    const sceneWidth = container?.offsetWidth ?? 0;
    const sceneHeight = container?.offsetHeight ?? 0;

    const newStage = new Konva.Stage({
        container: container ?? 'kudo',
        width: sceneWidth,
        height: sceneHeight
    });
    const newLayer = new Konva.Layer();

    // add the rectangle to the layer, and the layer to the stage
    newStage.add(newLayer);

    fitStageIntoParentContainer();
    // redraw the stage when the window is resized
    window.addEventListener('resize', fitStageIntoParentContainer);

    function fitStageIntoParentContainer() {
        // now we need to fit stage into parent container
        const containerWidth = container?.offsetWidth;

        // but we also make the full scene visible
        // so we need to scale all objects on canvas
        const scale = (containerWidth ?? 0) / sceneWidth;

        newStage.width(sceneWidth * scale);
        newStage.height(sceneHeight * scale);
        newStage.scale({ x: scale, y: scale });

    }
    return {stage: newStage, layer: newLayer, cleanUp: () => window.removeEventListener('resize', fitStageIntoParentContainer)}
};

export {createStage};

const createHeader = (color: string, title: string, stage: Konva.Stage, layer: Konva.Layer) => {
    const headerRect = new Konva.Rect({
        width: stage.width(),
        height: stage.height()/4,
        fill: color,
    });
    const headerText = new Konva.Text({
        x: stage.width()/2,
        y: headerRect.height()/2,
        text: title,
        fontSize: headerRect.height()/1.5,
        fontFamily: 'Calibri',
        fill: 'white',
    });
    headerText.offsetX(headerText.width() / 2);
    headerText.offsetY(headerText.height() / 3);
    layer.add(headerRect, headerText)
}

export {createHeader};