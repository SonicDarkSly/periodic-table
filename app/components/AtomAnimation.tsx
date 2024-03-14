import React, { useRef, useLayoutEffect, FC } from "react";
import * as THREE from "three";

interface AtomAnimationProps {
  protonCount: number;
  neutronCount: number;
  electronCount: number;
  elementData: {
    electronLayers: number[];
  };
}

const Colors = {
  red: "#ff5252",
  white: "#ffffff",
  brown: "#59332e",
  pink: "#f5986e",
  brownDark: "#23190f",
  blue: "#00e5ff",
  green: "#39e639",
  valences: "#00fbff",
};

const createSphere = (params: {
  r: number;
  color?: string;
  opacity?: number;
  x?: number;
  y?: number;
}): THREE.Mesh => {
  const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(
    params.r,
    14,
    14,
  );
  const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
    color: params.color || Colors.blue,
    transparent: true,
    opacity: params.opacity || 0.8,
    emissive: params.color
  });
  const sphere: THREE.Mesh = new THREE.Mesh(geometry, material);

  sphere.position.x = params.x || 0;
  sphere.position.y = params.y || 0;

  return sphere;
};

const createValence = (
  ringNumber: number,
  electronCount: number,
): THREE.Group => {
  const baseRadius: number =
    window.innerWidth > window.innerHeight
      ? window.innerHeight - 40 / 2
      : window.innerWidth - 40 / 2;
  const radius: number = 40 + (baseRadius / 20) * ringNumber * 1.3;
  const ring: THREE.Mesh = createTorus(
    radius,
    baseRadius / 2400,
    20,
    100,
    Math.PI * 2,
    Colors.valences, //ligne verte, options utilisateur ?
    0,
  );

  const electrons: THREE.Mesh[] = [];
  let currentLayer: number = 0;

  while (electronCount > 0) {
    const electronPerLayer: number[] = [2, 8, 18, 32, 32, 18, 8];
    const electronsInLayer: number = Math.min(
      electronPerLayer[currentLayer],
      electronCount,
    );
    const angleIncrement: number = (Math.PI * 2) / electronsInLayer;
    let angle: number = Math.random() * angleIncrement;

    for (let i = 0; i < electronsInLayer; i++) {
      const posX: number = radius * Math.cos(angle);
      const posY: number = radius * Math.sin(angle);

      angle += angleIncrement;

      const electron: THREE.Mesh = createSphere({
        r: 10,
        x: posX,
        y: posY,
        color: Colors.green,
        opacity: 0.8,
      });
      electrons.push(electron);
    }

    electronCount -= electronsInLayer;
    currentLayer++;
  }

  const group: THREE.Group = new THREE.Group();
  group.add(ring);

  electrons.forEach((electron: THREE.Mesh) => {
    group.add(electron);
  });

  return group;
};

const createValenceLayers = (electronCount: number, elementData: any) => {
  const electronPerLayer = elementData.electronLayers || [];
  const valences = [];

  for (let i = 0; i < electronPerLayer.length; i++) {
    const electronsInLayer = Math.min(electronPerLayer[i], electronCount);
    if (electronsInLayer <= 0) {
      break;
    }

    const valence = createValence(i + 1, electronsInLayer);
    valences.push(valence);

    electronCount -= electronsInLayer;
  }

  return valences;
};

const createTorus = (
  r: number,
  tubeD: number,
  radialSegs: number,
  tubularSegs: number,
  arc: number,
  color: string,
  rotationX: number,
): THREE.Mesh => {
  const geometry: THREE.TorusGeometry = new THREE.TorusGeometry(
    r,
    tubeD,
    radialSegs,
    tubularSegs,
    arc,
  );
  const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    color: color || "#cdcdcd",
    emissive: Colors.valences, // Ajouter une composante émissive pour la couleur
    transparent: true,
    opacity: 0.7,
  });
  const torus: THREE.Mesh = new THREE.Mesh(geometry, material);
  torus.rotation.x = rotationX;

  return torus;
};

const AtomAnimation: FC<AtomAnimationProps> = React.memo(
  ({ protonCount, neutronCount, electronCount, elementData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scene = useRef<THREE.Scene>(new THREE.Scene());
    const renderer = useRef<THREE.WebGLRenderer | null>(null);
    const camera = useRef<THREE.OrthographicCamera | null>(null);
    const valences = useRef<THREE.Group[]>([]);

    let nucleusRotationSpeed = neutronCount < 70 ? 0.014 : 0.011;

    let initialProtonCount: number | null;
    let initialNeutronCount: number | null;
    let initialElectronCount: number | null;
    let initialElementData: any;

    if (
      protonCount === undefined ||
      neutronCount === undefined ||
      electronCount === undefined ||
      !elementData
    ) {
      initialProtonCount = null;
      initialNeutronCount = null;
      initialElectronCount = null;
      initialElementData = null;
    } else {
      initialProtonCount = protonCount;
      initialNeutronCount = neutronCount;
      initialElectronCount = electronCount;
      initialElementData = elementData;
    }

    const createAtom = (
      protonCount: number,
      neutronCount: number,
      electronCount: number,
      elementData: any,
    ) => {
      scene.current.remove(...scene.current.children);

      const nucleus = new THREE.Group();

      const protonGeometry = new THREE.SphereGeometry(2, 12, 12);
      const protonMaterial = new THREE.MeshPhongMaterial({
        color: Colors.red,
        emissive: Colors.red,
        specular: 0x333333, 
        shininess: 10,
        transparent: true,
        opacity: 0.7,
      });

      for (let i = 0; i < protonCount; i++) {
        let posX = 0;
        let posY = 0;
        let posZ = 0;

        if (protonCount <= 4) {
          posX = (Math.random() - 0.5) * 3;
          posY = (Math.random() - 0.5) * 3;
          posZ = (Math.random() - 0.4) * 3;
        } else {
          posX = (Math.random() - 0.5) * 6;
          posY = (Math.random() - 0.5) * 6;
          posZ = (Math.random() - 0.4) * 6;
        }

        const proton = new THREE.Mesh(protonGeometry, protonMaterial);
        proton.position.set(posX, posY, posZ);
        nucleus.add(proton);
      }

      const neutronGeometry = new THREE.SphereGeometry(2, 12, 12);
      const neutronMaterial = new THREE.MeshPhongMaterial({
        color: Colors.blue, 
        emissive: Colors.blue,
        specular: 0x333333,
        shininess: 10,
        transparent: true,
        opacity: 0.8,
      });

      for (let i = 0; i < neutronCount; i++) {
        let posX = 0;
        let posY = 0;
        let posZ = 0;

        if (neutronCount <= 4) {
          posX = (Math.random() - 0.5) * 3;
          posY = (Math.random() - 0.5) * 3;
          posZ = (Math.random() - 0.4) * 3;
        } else {
          posX = (Math.random() - 0.5) * 6;
          posY = (Math.random() - 0.5) * 6;
          posZ = (Math.random() - 0.4) * 6;
        }

        const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
        neutron.position.set(posX, posY, posZ);
        nucleus.add(neutron);
      }

      nucleus.scale.set(10, 10, 10);
      nucleus.rotation.x = Math.random() * Math.PI * 2;

      scene.current.add(nucleus);

      // Créer les couches électroniques
      valences.current = createValenceLayers(electronCount, elementData);
      valences.current.forEach((valence) => {
        scene.current.add(valence);
      });

      // Animation
      function render() {
        requestAnimationFrame(render);

        valences.current.forEach((valence, i) => {
          const rotationSpeedX = nucleusRotationSpeed + (i + 1) * (Math.random() * 0.020);
          const rotationSpeedY = nucleusRotationSpeed + (i + 1) * (Math.random() * 0.047);
          const rotationSpeedZ = nucleusRotationSpeed + (i + 2) * (Math.random() * 0.052);

          valence.rotation.y += rotationSpeedY;
          valence.rotation.x += rotationSpeedX;
          valence.rotation.z += rotationSpeedZ;
        });

        nucleus.rotation.x += nucleusRotationSpeed;
        nucleus.rotation.y += nucleusRotationSpeed;
        nucleus.rotation.z += nucleusRotationSpeed;

        if (renderer.current && camera.current)
          renderer.current.render(scene.current, camera.current);
      }

      render();
    };

    let zoom: number;
    if (electronCount > 90) {
      zoom = 2;
    } else if (electronCount > 60) {
      zoom = 2;
    } else if (electronCount > 40) {
      zoom = 2.5;
    } else if (electronCount > 17) {
      zoom = 3;
    } else {
      zoom = 4;
    }

    useLayoutEffect(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (!camera.current) {
        camera.current = new THREE.OrthographicCamera(
          width / -1,
          width / 1,
          height / 1,
          height / -1,
          -1000,
          1000,
        );
        camera.current.position.z = 10;
      }

      if (camera.current) {
        camera.current.zoom = zoom;
        camera.current.updateProjectionMatrix();
      }

      if (!renderer.current) {
        renderer.current = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.current.setClearColor(0x000000, 0);
        renderer.current.setSize(window.innerWidth, window.innerHeight);

        if (containerRef.current) {
          containerRef.current.appendChild(renderer.current.domElement);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.current.add(ambientLight);

        const lights = [
          new THREE.PointLight(0xffffff, 0.5, 0),
          new THREE.PointLight(0xffffff, 0.5, 0),
          new THREE.PointLight(0xffffff, 0.5, 0),
          new THREE.AmbientLight(0xffffff, 0.6),
        ];

        lights[0].position.set(200, 0, 0);
        lights[1].position.set(0, 200, 0);
        lights[2].position.set(0, 100, 100);

        lights.forEach((light) => {
          scene.current.add(light);
        });

        const nucleus = new THREE.Group();
        nucleus.name = "nucleus";
        scene.current.add(nucleus);
      }

      if (
        initialProtonCount !== null &&
        initialNeutronCount !== null &&
        initialElectronCount !== null &&
        initialElementData
      ) {
        createAtom(
          initialProtonCount,
          initialNeutronCount,
          initialElectronCount,
          initialElementData,
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [protonCount, neutronCount, electronCount, elementData]);

    return <div className="animation" ref={containerRef}></div>;
  },
);

AtomAnimation.displayName = "AtomAnimation";

export default AtomAnimation;
