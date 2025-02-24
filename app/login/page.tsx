"use client"
import dynamic from "next/dynamic";
import Content from "./Components/Content";

// ⚡ Import dynamique pour éviter les erreurs SSR
const ShaderCanvas = dynamic(() => import("../Components/backgrond"), { ssr: false });

export default function Home() {
  return (
    <>
      <main className="relative h-screen w-screen">
        <ShaderCanvas />
        <Content className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </main>
    </>
  );
}
