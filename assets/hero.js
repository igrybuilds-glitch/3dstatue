/* 3D Statue — cinematic Three.js hero: a golden abstract sculpture, slowly turning in gold dust.
   Loaded as an ES module; THREE comes from the importmap in <head>. */
import * as THREE from 'three';
(function(){
  "use strict";
  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
  } catch (err) { canvas.style.display = "none"; return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08080d, 0.055);
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.1, 9.5);

  /* --- the sculpture: lathe-turned abstract figure, gold metal --- */
  var pts = [];
  var profile = [
    [0.00, 0.00], [0.62, 0.02], [0.78, 0.18], [0.72, 0.42], [0.50, 0.62],
    [0.34, 0.90], [0.30, 1.30], [0.42, 1.70], [0.52, 2.05], [0.46, 2.45],
    [0.30, 2.80], [0.20, 3.10], [0.24, 3.42], [0.34, 3.66], [0.30, 3.92],
    [0.16, 4.10], [0.00, 4.16]
  ];
  profile.forEach(function(p){ pts.push(new THREE.Vector2(p[0], p[1])); });
  var geo = new THREE.LatheGeometry(pts, 96);
  var goldMat = new THREE.MeshStandardMaterial({
    color: 0xd9a441, metalness: 0.95, roughness: 0.28,
    emissive: 0x2a1c05, emissiveIntensity: 0.35
  });
  var statue = new THREE.Mesh(geo, goldMat);
  statue.position.y = -2.1;
  scene.add(statue);

  /* --- pedestal disc --- */
  var ped = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.7, 0.22, 64),
    new THREE.MeshStandardMaterial({color: 0x14141c, metalness: 0.6, roughness: 0.5})
  );
  ped.position.y = -2.12;
  scene.add(ped);
  var rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.58, 0.02, 12, 128),
    new THREE.MeshBasicMaterial({color: 0xd9a441})
  );
  rim.rotation.x = Math.PI / 2; rim.position.y = -2.0;
  scene.add(rim);

  /* --- gold dust particles --- */
  var N = 700, pos = new Float32Array(N * 3), spd = new Float32Array(N);
  for (var i = 0; i < N; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 22;
    pos[i*3+1] = (Math.random() - 0.5) * 12;
    pos[i*3+2] = (Math.random() - 0.5) * 14 - 2;
    spd[i] = 0.15 + Math.random() * 0.5;
  }
  var pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  var dust = new THREE.Points(pgeo, new THREE.PointsMaterial({
    color: 0xf0c568, size: 0.045, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  scene.add(dust);

  /* --- cinematic lighting --- */
  scene.add(new THREE.AmbientLight(0x30281a, 1.4));
  var key = new THREE.DirectionalLight(0xffe6b0, 2.4); key.position.set(5, 7, 6); scene.add(key);
  var rimL = new THREE.DirectionalLight(0xd9a441, 3.2); rimL.position.set(-6, 3, -5); scene.add(rimL);
  var under = new THREE.PointLight(0xd9a441, 12, 12); under.position.set(0, -1.4, 2.2); scene.add(under);

  /* --- interaction: mouse parallax + scroll --- */
  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", function(e){
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, {passive: true});

  function resize(){
    var w = canvas.clientWidth || window.innerWidth,
        h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.x = w < 700 ? 0 : 0;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var clock = new THREE.Clock();
  function tick(){
    requestAnimationFrame(tick);
    var t = clock.getElapsedTime();
    if (!reduce) {
      statue.rotation.y = t * 0.28;
      var p = pgeo.attributes.position.array;
      for (var i = 0; i < N; i++) {
        p[i*3+1] += spd[i] * 0.008;
        p[i*3] += Math.sin(t * 0.5 + i) * 0.0015;
        if (p[i*3+1] > 6) p[i*3+1] = -6;
      }
      pgeo.attributes.position.needsUpdate = true;
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    }
    camera.position.x = mx * 0.9;
    camera.position.y = 1.1 - my * 0.5;
    camera.lookAt(0, 0.4, 0);
    var sy = window.scrollY || 0;
    canvas.style.opacity = Math.max(0, 1 - sy / (window.innerHeight * 0.9));
    renderer.render(scene, camera);
  }
  tick();
})();
