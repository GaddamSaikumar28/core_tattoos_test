"use client";
import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { pageAtom, pages } from "./UI";

// Synchronous 1x1 base64 texture to eliminate cover loading layout flashes
const DUMMY_ROUGHNESS =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=";

const easingFactor         = 0.5;
const easingFactorFold     = 0.3;
const insideCurveStrength  = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

export const PAGE_WIDTH  = 1.28;
export const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH         = 0.003;

const PAGE_SEGMENTS  = 20; // Reduced from 30 -> 20 to cut skinning cost by ~33%
const SEGMENT_WIDTH  = PAGE_WIDTH / PAGE_SEGMENTS;

// Reusable static geometry instance across all pages
const pageGeometry = new THREE.BoxGeometry(
  PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH,
  PAGE_SEGMENTS, 2,
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const _pos         = pageGeometry.attributes.position;
const _vertex      = new THREE.Vector3();
const skinIndexes: number[] = [];
const skinWeights: number[] = [];

for (let i = 0; i < _pos.count; i++) {
  _vertex.fromBufferAttribute(_pos, i);
  const x          = _vertex.x;
  const skinIndex  = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}
pageGeometry.setAttribute("skinIndex",  new THREE.Uint16BufferAttribute(skinIndexes, 4));
pageGeometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));

const whiteColor    = new THREE.Color("#b3b3b3");
const emissiveColor = new THREE.Color("#FF7A00");
const pageMaterials = [
  new THREE.MeshStandardMaterial({ color: whiteColor }),
  new THREE.MeshStandardMaterial({ color: "#111" }),
  new THREE.MeshStandardMaterial({ color: whiteColor }),
  new THREE.MeshStandardMaterial({ color: whiteColor }),
];

interface PageProps {
  number:      number;
  front:       string;
  back:        string;
  page:        number;
  opened:      boolean;
  bookClosed:  boolean;
  totalPages:  number;
}

const Page = ({
  number, front, back, page, opened, bookClosed, totalPages, ...props
}: PageProps) => {
  const isFirstPage = number === 0;
  const isLastPage  = number === totalPages - 1;

  const textureData = useTexture([
    front,
    back,
    ...(isFirstPage || isLastPage ? [DUMMY_ROUGHNESS] : []),
  ]);

  const picture          = textureData[0];
  const picture2         = textureData[1];
  const pictureRoughness = textureData.length > 2 ? textureData[2] : null;

  picture.colorSpace = picture2.colorSpace = THREE.SRGBColorSpace;

  const group          = useRef<THREE.Group>(null);
  const turnedAt       = useRef<number>(0);
  const lastOpened     = useRef<boolean>(opened);
  const skinnedMeshRef = useRef<THREE.SkinnedMesh>(null);

  const manualSkinnedMesh = useMemo(() => {
    const bones: THREE.Bone[] = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new THREE.Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new THREE.Skeleton(bones);

    const pageTint = new THREE.Color("#999999");
    const materials = [
      ...pageMaterials,
      new THREE.MeshStandardMaterial({
        color: pageTint,
        map:   picture,
        ...(isFirstPage && pictureRoughness
          ? { roughnessMap: pictureRoughness }
          : { roughness: 0.8 }),
        emissive:          emissiveColor,
        emissiveIntensity: 0,
      }),
      new THREE.MeshStandardMaterial({
        color: pageTint,
        map:   picture2,
        ...(isLastPage && pictureRoughness
          ? { roughnessMap: pictureRoughness }
          : { roughness: 0.8 }),
        emissive:          emissiveColor,
        emissiveIntensity: 0,
      }),
    ];

    const mesh = new THREE.SkinnedMesh(pageGeometry, materials);
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [picture, picture2, pictureRoughness, isFirstPage, isLastPage]);

  const [_, setPage]              = useAtom(pageAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current || !group.current) return;

    const mats           = skinnedMeshRef.current.material as THREE.MeshStandardMaterial[];
    const targetEmissive = highlighted ? 0.28 : 0;
    mats[4].emissiveIntensity = mats[5].emissiveIntensity = THREE.MathUtils.lerp(
      mats[4].emissiveIntensity, targetEmissive, 0.1,
    );

    if (lastOpened.current !== opened) {
      turnedAt.current   = +new Date();
      lastOpened.current = opened;
    }

    let turningTime = Math.min(400, +new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) targetRotation += THREE.MathUtils.degToRad(number * 0.8);

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity  = i < 8  ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity      = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        insideCurveStrength  * insideCurveIntensity  * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity      * targetRotation;

      let foldRotationAngle = THREE.MathUtils.degToRad(Math.sign(targetRotation) * 2);

      if (bookClosed) {
        if (i === 0) { rotationAngle = targetRotation; foldRotationAngle = 0; }
        else         { rotationAngle = 0;              foldRotationAngle = 0; }
      }

      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);

      const foldIntensity = i > 8
        ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
        : 0;
      easing.dampAngle(target.rotation, "x", foldRotationAngle * foldIntensity, easingFactorFold, delta);
    }
  });

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => { e.stopPropagation(); setHighlighted(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); setHighlighted(false); }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

interface BookProps extends React.ComponentProps<"group"> {
  customPages?: { front: string; back: string }[];
}

export const Book = ({ customPages, ...props }: BookProps) => {
  const [page]                    = useAtom(pageAtom);
  const [delayedPage, setDelayed] = useState<number>(page);

  const bookPages  = customPages ?? pages;
  const totalPages = bookPages.length;

  // Swapped useMemo out for useEffect to execute texture pre-cache clear safely
  useEffect(() => {
    if (!customPages) return;

    if (customPages[0]) {
      useTexture.preload(customPages[0].front);
      useTexture.preload(customPages[0].back);
    }

    const timer = setTimeout(() => {
      customPages.slice(1).forEach((p) => {
        useTexture.preload(p.front);
        useTexture.preload(p.back);
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [customPages]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const goToPage = () => {
      setDelayed((cur) => {
        if (page === cur) return cur;
        timeout = setTimeout(goToPage, Math.abs(page - cur) > 2 ? 50 : 150);
        return page > cur ? cur + 1 : cur - 1;
      });
    };
    goToPage();
    return () => clearTimeout(timeout);
  }, [page]);

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {bookPages.map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === totalPages}
          front={pageData.front}
          back={pageData.back}
          totalPages={totalPages}
        />
      ))}
    </group>
  );
};