import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Content from "./Components/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    /*ne pas hésiter si jamais redirect(/login); */
    redirect('/accueil');
  }

  return (
    <>
      <Header />
      <Sidebar />
      <div className="lg:pl-[270px] pt-[105px] pr-[20px]">
        <Content />
      </div>
    </>
  );
}