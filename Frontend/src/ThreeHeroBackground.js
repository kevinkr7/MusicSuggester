import { useEffect, useRef } from "react";

const THREE_CDN = "https://unpkg.com/three@0.160.0/build/three.min.js";

function loadThree() {
  return new Promise((resolve, reject) => {
    if (window.THREE) {
      resolve(window.THREE);
      return;
    }

    const existing = document.querySelector(`script[src="${THREE_CDN}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.THREE));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = THREE_CDN;
    script.async = true;
    script.onload = () => resolve(window.THREE);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function ThreeHeroBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    let cleanup = () => {};

    loadThree()
      .then((THREE) => {
        if (!mountRef.current) return;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.z = 40;

        const mount = mountRef.current;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const geometry = new THREE.IcosahedronGeometry(11, 2);
        const material = new THREE.MeshStandardMaterial({
          color: "#8b5cf6",
          wireframe: true,
          emissive: "#2563eb",
          emissiveIntensity: 0.35,
          metalness: 0.2,
          roughness: 0.35,
          transparent: true,
          opacity: 0.85,
        });

        const orb = new THREE.Mesh(geometry, material);
        group.add(orb);

        const starGeometry = new THREE.BufferGeometry();
        const starCount = 900;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 180;
          positions[i + 1] = (Math.random() - 0.5) * 180;
          positions[i + 2] = (Math.random() - 0.5) * 180;
        }

        starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const starMaterial = new THREE.PointsMaterial({
          color: "#22d3ee",
          size: 0.18,
          transparent: true,
          opacity: 0.8,
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        const light = new THREE.DirectionalLight("#ffffff", 1.2);
        light.position.set(20, 20, 25);
        scene.add(light);

        const accentLight = new THREE.PointLight("#14b8a6", 2, 160);
        accentLight.position.set(-18, 10, 15);
        scene.add(accentLight);

        const resize = () => {
          const { width, height } = mount.getBoundingClientRect();
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };

        resize();
        window.addEventListener("resize", resize);

        let frame;
        const animate = () => {
          frame = requestAnimationFrame(animate);
          orb.rotation.x += 0.003;
          orb.rotation.y += 0.006;
          group.rotation.z += 0.001;
          stars.rotation.y += 0.0009;
          renderer.render(scene, camera);
        };

        animate();

        cleanup = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          mount.removeChild(renderer.domElement);
          geometry.dispose();
          material.dispose();
          starGeometry.dispose();
          starMaterial.dispose();
          renderer.dispose();
        };
      })
      .catch((error) => {
        console.error("Three.js failed to load", error);
      });

    return () => cleanup();
  }, []);

  return <div className="three-hero" ref={mountRef} aria-hidden="true" />;
}
