import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useSceneColors() {
  const [colors, setColors] = useState({ pink: "", violet: "", ink: "", white: "" });
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    setColors({
      pink: css.getPropertyValue("--scene-pink").trim(),
      violet: css.getPropertyValue("--scene-violet").trim(),
      ink: css.getPropertyValue("--scene-ink").trim(),
      white: css.getPropertyValue("--scene-white").trim(),
    });
  }, []);
  return colors;
}
function Starfield({ color, reduced }: { color: string; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(1350 * 3);
    for (let i = 0; i < 1350; i++) {
      const r = (n: number) => {
        const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
        return v - Math.floor(v);
      };
      array[i * 3] = (r(i + 1) - 0.5) * 48;
      array[i * 3 + 1] = (r(i + 1400) - 0.5) * 35;
      array[i * 3 + 2] = -r(i + 2800) * 30;
    }
    return array;
  }, []);
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.z += Math.min(delta, 0.05) * 0.004;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.032}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
function Nebula({ pink, violet, reduced }: { pink: string; violet: string; reduced: boolean }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPink: { value: new THREE.Color(pink) },
      uViolet: { value: new THREE.Color(violet) },
    }),
    [pink, violet],
  );
  useFrame((_, delta) => {
    if (!reduced) uniforms.uTime.value += Math.min(delta, 0.05) * 0.09;
    uniforms.uScroll.value =
      window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  });
  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[65, 50]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`varying vec2 vUv; uniform float uTime; uniform float uScroll; uniform vec3 uPink; uniform vec3 uViolet;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);} float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.1+1.;a*=.5;}return v;}
void main(){vec2 p=vUv*5.;float n=fbm(p+vec2(uTime,-uTime*.3)+fbm(p*1.3));float clouds=smoothstep(.3,.8,n);float band=exp(-pow((vUv.y-.38+sin(vUv.x*5.+uTime)*.09)*3.,2.));float intensity=(.24+sin(uScroll*3.14159)*.25);vec3 c=mix(uViolet,uPink,clamp(n*.65,0.,1.));gl_FragColor=vec4(c,clouds*band*intensity);}`}
      />
    </mesh>
  );
}
export default function Universe({ reduced = false }: { reduced?: boolean }) {
  const colors = useSceneColors();
  if (!colors.pink) return null;
  return (
    <div className="universe" aria-hidden="true">
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Starfield color={colors.white} reduced={reduced} />
        <Nebula pink={colors.pink} violet={colors.violet} reduced={reduced} />
      </Canvas>
    </div>
  );
}

// A lemniscate of Bernoulli lifted into 3D: the ribbon weaves over and under
// itself at the crossing instead of intersecting, so it reads as a true ∞.
class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  a: number;
  lift: number;
  weave: number;
  zOffset: number;
  constructor(a: number, lift: number, weave: number, zOffset: number) {
    super();
    this.a = a;
    this.lift = lift;
    this.weave = weave;
    this.zOffset = zOffset;
  }
  override getPoint(t: number, target = new THREE.Vector3()) {
    const s = t * Math.PI * 2;
    const sin = Math.sin(s);
    const cos = Math.cos(s);
    const d = 1 + sin * sin;
    return target.set(
      (this.a * cos) / d,
      ((this.a * sin * cos) / d) * this.lift,
      this.weave * sin + this.zOffset,
    );
  }
}

// Motion travels through tube UVs, not by turning the infinity edge-on.
const INFINITY_FEEL = { flowSpeed: 0.11, bodyRadius: 0.23, hazeRadius: 0.52, sway: 0.08 };

// Hologram surface: rotating helical light + seamless circulating highlights.
function HologramSkin({
  pink,
  violet,
  intensity,
  reduced,
}: {
  pink: string;
  violet: string;
  intensity: number;
  reduced: boolean;
}) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uPink: { value: new THREE.Color(pink) },
      uViolet: { value: new THREE.Color(violet) },
    }),
    [pink, violet, intensity],
  );
  useFrame((_, delta) => {
    if (!reduced) uniforms.uTime.value += Math.min(delta, 0.05) * INFINITY_FEEL.flowSpeed;
  });
  return (
    <shaderMaterial
      uniforms={uniforms}
      transparent
      depthWrite={false}
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
      toneMapped={false}
      vertexShader={`varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vUv;
void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`}
      fragmentShader={`uniform float uTime; uniform float uIntensity; uniform vec3 uPink; uniform vec3 uViolet;
varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vUv;
void main(){float fres=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.8);
float scan=.5+.5*sin(vW.y*140.-uTime*29.);
float phase=6.2831853*(vUv.x-uTime);
float flow=pow(.5+.5*cos(phase*3.),10.);
float helix=pow(.5+.5*cos(6.2831853*(vUv.y+vUv.x*8.-uTime*4.)),12.);
float band=.5+.5*sin(phase*2.);
vec3 col=mix(uViolet,uPink,clamp(band*.55+fres*.45+flow*.35,0.,1.));
float a=(.3+fres*.55+scan*.07+flow*.3+helix*.2)*uIntensity;
gl_FragColor=vec4(col*(.85+fres*.7+flow*.8+helix*.45)*uIntensity,a);}`}
    />
  );
}

function Core({
  colors,
  reduced,
}: {
  colors: ReturnType<typeof useSceneColors>;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const shapes = useMemo(() => {
    const ribbon = new InfinityCurve(2, 1.6, 0.34, 0);
    const strand = new InfinityCurve(2, 1.6, 0.34, 0.2);
    const tube = (curve: THREE.Curve<THREE.Vector3>, radius: number, radial: number) =>
      new THREE.TubeGeometry(curve, 420, radius, radial, true);
    return {
      haze: tube(ribbon, INFINITY_FEEL.hazeRadius, 18),
      body: tube(ribbon, INFINITY_FEEL.bodyRadius, 22),
      strand: tube(strand, 0.016, 6),
    };
  }, []);
  useEffect(
    () => () => {
      shapes.haze.dispose();
      shapes.body.dispose();
      shapes.strand.dispose();
    },
    [shapes],
  );
  useFrame(({ clock, camera, gl }, rawDelta) => {
    gl.domElement.closest(".core-canvas")?.setAttribute("data-scene-ready", "true");
    if (reduced || !ref.current || !outer.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.45) * INFINITY_FEEL.sway;
    ref.current.rotation.x = 0.1 + Math.sin(t * 0.5) * 0.04;
    ref.current.rotation.z = 0.04 + Math.sin(t * 0.33) * 0.05;
    outer.current.position.y = Math.sin(t * 0.6) * 0.06;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.022);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.current.x * 0.35, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -pointer.current.y * 0.2, 3, delta);
    camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 5]} color={colors.pink} intensity={42} />
      <pointLight position={[-3, 0, 3]} color={colors.violet} intensity={38} />
      <pointLight position={[0, -2, 2]} color={colors.pink} intensity={12} />
      <Environment resolution={128}>
        <Lightformer intensity={4} position={[0, 5, 2]} scale={[8, 3, 1]} color={colors.white} />
        <Lightformer
          intensity={3}
          position={[-4, 0, 2]}
          rotation-y={Math.PI / 2}
          scale={[6, 2, 1]}
          color={colors.pink}
        />
      </Environment>
      <group ref={outer} position={[0, 0, 0]} scale={0.92}>
        <group ref={ref} rotation={[0.1, 0, 0.04]}>
          <mesh geometry={shapes.haze}>
            <HologramSkin
              pink={colors.pink}
              violet={colors.violet}
              intensity={0.3}
              reduced={reduced}
            />
          </mesh>
          <mesh geometry={shapes.body}>
            <HologramSkin
              pink={colors.pink}
              violet={colors.violet}
              intensity={1.12}
              reduced={reduced}
            />
          </mesh>
          <mesh geometry={shapes.strand}>
            <meshBasicMaterial color={colors.pink} toneMapped={false} />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.24, 2]} />
            <meshPhysicalMaterial
              color={colors.pink}
              emissive={colors.pink}
              emissiveIntensity={3.5}
              metalness={0.5}
              roughness={0.12}
            />
          </mesh>
        </group>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0.3 + i * 0.2, 0.3 + i * 0.5, 0.12 + i * 0.24]}>
            <mesh>
              <torusGeometry args={[2.3 + i * 0.22, 0.008, 6, 150]} />
              <meshBasicMaterial
                color={i === 1 ? colors.violet : colors.pink}
                transparent
                opacity={0.85}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[2.3 + i * 0.22, 0, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={colors.pink} />
            </mesh>
          </group>
        ))}
        <CoreParticles color={colors.pink} />
      </group>
    </>
  );
}
function CoreParticles({ color }: { color: string }) {
  const positions = useMemo(() => {
    const p = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      const a = i * 2.39996;
      const y = 1 - i / 75;
      const r = Math.sqrt(1 - y * y);
      p[i * 3] = Math.cos(a) * r * 2.2;
      p[i * 3 + 1] = y * 1.2;
      p[i * 3 + 2] = Math.sin(a) * r * 2.2;
    }
    return p;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.023} transparent opacity={0.95} toneMapped={false} />
    </points>
  );
}
// Keeps the whole ∞ inside the frame: the hero canvas is a wide strip on
// desktop but nearly square on phones, so the camera pulls back as it narrows.
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = THREE.MathUtils.clamp(4.4 + (2.05 - aspect) * 1.7, 4.4, 5.9);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}
export function AICore({ reduced = false }: { reduced?: boolean }) {
  const colors = useSceneColors();
  if (!colors.pink) return null;
  return (
    <div className="core-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Core colors={colors} reduced={reduced} />
        <FitCamera />
      </Canvas>
    </div>
  );
}
