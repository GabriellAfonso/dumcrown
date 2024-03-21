



export function simpleTweens(scene, target, x, y,
    scale = 1, depth = 1, angle = 0, duration = 100, onCompleteCallback = null, alpha = 1,) {
    scene.tweens.add({
        targets: target,
        x: x,
        y: y,
        alpha: alpha,
        angle: angle,
        scale: scale,
        depth: depth,
        duration: duration,
        ease: 'Power2',
        onComplete: onCompleteCallback,
    });
}

export function simpleTextTweens(scene, target, x, y, depth, angle, duration, alpha = 1, onCompleteCallback = null, delay = 0) {
    scene.tweens.add({
        targets: target,
        x: x,
        y: y,
        angle: angle,
        delay: delay,
        depth: depth,
        alpha: alpha,
        duration: duration,
        ease: 'Power2',
        onComplete: onCompleteCallback,
    });
}



// // Exemplo de uso:
// simpleTweens(this, yourVerseCard, 150, 20, 0.4, 90, 200, () => {
//     // O que você quer fazer quando a animação estiver completa
//     console.log('Tween concluído!');
// });