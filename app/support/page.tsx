"use client"
import FeedbackSupport from "./Components/FeedbackSupport";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

export default function Home() {
  return (
    <>
    <Header></Header>
    <Sidebar></Sidebar>
      <main className="lg:pl-[302px] pt-[105px] pr-[20px]">
        <FeedbackSupport />
      </main>
    </>
  );
}
