import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";

// 🔥 Définition du Shader Material
const CustomShaderMaterial = shaderMaterial(
  {
    u_time: 0,
    u_resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    u_color: new THREE.Color(0.3137, 0, 1),
    u_background: new THREE.Vector4(0, 0, 0, 1),
    u_speed: 0.1,
    u_detail: 0.4,
  },
  `void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  `uniform vec2 u_resolution;
   uniform float u_time;
   uniform vec3 u_color;
   uniform vec4 u_background;
   uniform float u_speed;
   uniform float u_detail;

   mat2 m(float a) {
       float c = cos(a), s = sin(a);
       return mat2(c,-s,s,c);
   }

   float map(vec3 p) {
       float t = u_time * u_speed;
       p.xz *= m(t * 0.4);
       p.xy *= m(t * 0.1);
       vec3 q = p * 2.0 + t;
       return length(p + vec3(sin((t * u_speed) * 0.1))) * log(length(p) + 0.9)
              + cos(q.x + sin(q.z + cos(q.y))) * 0.5 - 1.0;
   }

   void main() {
       vec2 a = gl_FragCoord.xy / u_resolution - vec2(0.5, 0.5);
       vec3 cl = vec3(0.0);
       float d = 2.5;

       for (float i = 0.; i <= (1. + 20. * u_detail); i++) {
           vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -1.0)) * d;
           float rz = map(p);
           float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);
           vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
           cl = cl * l + smoothstep(2.5, 0.0, rz) * 0.6 * l;
           d += min(rz, 1.0);
       }

       vec4 color = vec4(min(u_color, cl), 1.0);
       color.r = max(u_background.r, color.r);
       color.g = max(u_background.g, color.g);
       color.b = max(u_background.b, color.b);
       gl_FragColor = color;
   }`
);

// 🔥 Enregistrer le shader pour qu'il soit utilisable en JSX
extend({ CustomShaderMaterial });

// 🔥 TypeScript : Déclaration pour `@react-three/fiber`
declare module "@react-three/fiber" {
  interface ThreeElements {
    customShaderMaterial: ThreeElements["meshStandardMaterial"];
  }
}

function ShaderScene() {
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const { size, viewport } = useThree();

  // ⚡ Mettre à jour la résolution quand la fenêtre change
  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_resolution.value.set(size.width, size.height);
    }
  }, [size]);

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <customShaderMaterial ref={shaderRef} attach="material" />
    </mesh>
  );
}

// ⚡ Composant principal
export default function ShaderCanvas() {
  return (
    <Canvas className="fixed top-0 left-0 w-full h-full object-cover">
      <ShaderScene />
    </Canvas>
  );
}
