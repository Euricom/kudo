import Konva from 'konva';

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