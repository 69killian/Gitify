import AdminFeedbackDashboard from './Components/AdminFeedbackDashboard';
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";

export default function AdminFeedbackPage() {
    return (
        <>
        <Header/>
        <Sidebar/>
        <div className="lg:pl-[270px] pt-[105px] pr-[20px]">
        <AdminFeedbackDashboard />
        </div>
        </>
      );
} 