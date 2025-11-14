import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";
import { useAuth } from "../../states/AuthContext";

function ProgramsPage() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar activeSection="programs" />
            <div className="flex flex-col overflow-y-auto mx-auto px-3 mt-8 w-7/8">
                <div className="flex flex-col mx-auto px-4 py-6 w-full max-w-7xl">
                    <h1 className="text-3xl font-bold text-center sm:text-left">Programs</h1>
                </div>
            </div>
        </div>
    );
}

export default ProgramsPage;