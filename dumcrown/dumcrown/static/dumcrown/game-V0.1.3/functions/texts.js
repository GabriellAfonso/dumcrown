export function add_text(scene, x, y, text, fontSize, origin = 0) {
    var new_text = scene.add.text(x, y, text, {
        fontSize: fontSize,
        fontFamily: 'sans-serif',
        color: 'white',
    });
    new_text.setOrigin(origin);
    return new_text
}