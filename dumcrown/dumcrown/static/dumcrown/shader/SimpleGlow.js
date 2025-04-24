export default class SimpleGlow extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            fragShader: `
                precision mediump float;
                varying vec2 outTexCoord;
                uniform sampler2D uMainSampler;

                void main() {
                    vec2 texcoord = outTexCoord;
                    vec4 original = texture2D(uMainSampler, texcoord);

                    if (original.a > 0.1) {
                        gl_FragColor = original;
                        return;
                    }

                    float maxGlowDistance = 6.0;
                    float spread = 0.006;
                    float glowAccum = 0.0;

                    for (int dx = -6; dx <= 6; dx++) {
                        for (int dy = -6; dy <= 6; dy++) {
                            float dist = sqrt(float(dx * dx + dy * dy));
                            if (dist == 0.0 || dist > maxGlowDistance) continue;

                            vec2 offset = texcoord + vec2(float(dx), float(dy)) * spread;
                            vec4 sample = texture2D(uMainSampler, offset);

                            if (sample.a > 0.1) {
                                float contribution = 1.0 - (dist / maxGlowDistance);
                                glowAccum += contribution;
                            }
                        }
                    }

                    // A curva aqui determina quão suave é o fade
                    float alpha = clamp(glowAccum * 0.1, 0.0, 1.0);
                    alpha = pow(alpha, 1.5); // curva ajustável

                    if (alpha > 0.01) {
                        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                    } else {
                        discard;
                    }
                }
            `,
        });
    }

    onBind() {
        const gl = this.renderer.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        super.onBind();
    }
}
