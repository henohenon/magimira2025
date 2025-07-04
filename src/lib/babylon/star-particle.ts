
import { events } from "./events";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color4 } from "@babylonjs/core/Maths/math.color";
events.on("onSceneDefinition", async ({ scene }) => {

    // Create a particle system
    let particleSystem = new ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new Texture("/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = Vector3.Zero(); // the starting location

    // Colors of all particles
    particleSystem.addColorGradient(0.0, new Color4(1, 1, 1, 1)); // 最初は完全に見える
    particleSystem.addColorGradient(0.1, new Color4(1, 1, 1, 0.2)); // すぐに薄く
    particleSystem.addColorGradient(1.0, new Color4(1, 1, 1, 0));   // 最後は消える
 
    particleSystem.addSizeGradient(0.0, 2.0); // 出現時は2倍サイズ
    particleSystem.addSizeGradient(0.2, 1.0); // 少し経って通常サイズ
    particleSystem.addSizeGradient(1.0, 0); // 消える頃に小さく

    particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
   
    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 0.5;

    // Emission rate
    particleSystem.emitRate = 1000;


    /******* Emission Space ********/
    const emitter = particleSystem.createDirectedSphereEmitter(15);
    emitter.radiusRange = 0;
    
    // Speed
    particleSystem.minEmitPower = 0;
    particleSystem.maxEmitPower = 0;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();

    return scene;
}
);