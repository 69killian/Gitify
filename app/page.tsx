import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Content from "./Components/Content";

export default async function Home() {

  return (
    <>
    
    <Header/>
    <Sidebar/>
    <div className="lg:pl-[270px] pt-[105px] pr-[20px]">
    <Content/>
    </div>
    </>
  );
}
