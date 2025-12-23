import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export default function AppShell() {
    return (
        <div className="h-screen flex">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Topbar />

                <main className="flex-1 overflow-auto p-6 bg-muted/30">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
