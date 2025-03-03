
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
// Content from the component file "guide"
import Content from "./Components/Content";

export default async function Home() {

  return (
    <>
    <Header/>
    <Sidebar/>
    {/* ATTENTION a pb-[1500px] qui est à titre statique */}
    <div className="lg:pl-[270px] pt-[105px] pr-[20px]  pb-[1500px] bg-gradient-to-br from-black via-purple-900/30 to-black">
    <Content/>
    </div>
    </>
  );
}
