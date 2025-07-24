import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("card-canvas");

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  100
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  premultipliedAlpha: false, // ⚠️ fixes glow/outline
});
renderer.setClearColor(0x000000, 0); // fully transparent
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.autoClear = true;

// Texture loader
const loader = new THREE.TextureLoader();
Promise.all([
  loader.loadAsync("card/front.png"),
  loader.loadAsync("card/back.png"),
])
  .then(([frontTex, backTex]) => {
    frontTex.colorSpace = THREE.SRGBColorSpace;
    backTex.colorSpace = THREE.SRGBColorSpace;

    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    const geometry = new THREE.PlaneGeometry(2, 2.9);

    const frontMat = new THREE.MeshBasicMaterial({
      map: frontTex,
      side: THREE.FrontSide,
      transparent: true,
      alphaTest: 0, // 👈 fixes faint edge/halo
      depthWrite: false,
    });

    const backMat = new THREE.MeshBasicMaterial({
      map: backTex,
      side: THREE.FrontSide,
      transparent: true,
      alphaTest: 0,
      depthWrite: false,
    });

    const front = new THREE.Mesh(geometry, frontMat);
    front.position.z = 0.025;
    cardGroup.add(front);

    const back = new THREE.Mesh(geometry, backMat);
    back.rotation.y = Math.PI;
    back.position.z = -0.025;
    cardGroup.add(back);

    cardGroup.scale.set(0.75, 0.75, 0.75);

    // Animate
    function animate() {
      cardGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  })
  .catch((err) => {
    console.error("Failed to load textures:", err);
  });
