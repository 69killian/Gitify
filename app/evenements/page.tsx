"use client"
import dynamic from "next/dynamic";
import Evenements from "./Components/evenements";

// ⚡ Import dynamique pour éviter les erreurs SSR
const ShaderCanvas = dynamic(() => import("../Components/backgrond"), { ssr: false });

export default function Home() {
  return (
    <>
      <main className="relative h-screen w-screen">
        <ShaderCanvas />
        <Evenements />
      </main>
    </>
  );
}
