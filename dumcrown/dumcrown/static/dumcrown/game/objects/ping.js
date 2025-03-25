import { latency_ms } from "../client/client.js";
import { add_text } from "../functions/texts.js";

export class Ping {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initialize(scene, x, y)
    }

    initialize(scene, x, y) {
        this.ping = scene.add.image(x, y, 'signal01');
        // this.ping.setScale(0.06)
        this.ms = add_text(scene, x + 35, y, latency_ms, '16px', 0.5)
        this.update()
    }

    latencyCheck() {
        if (latency_ms <= 100) {
            return 'signal01'
        }

        if (latency_ms <= 250) {
            return 'signal02'
        }

        if (latency_ms <= 400) {
            return 'signal03'
        }

        return 'signal04'
    }

    update() {
        this.pingUpdate = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.ping) {
                    this.ping.setTexture(this.latencyCheck());
                    this.ms.setText(latency_ms);
                }
            }
        });
    }
}