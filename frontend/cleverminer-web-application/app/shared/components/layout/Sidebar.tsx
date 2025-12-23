import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "Datasets", to: "/datasets" },
    { label: "Tasks", to: "/tasks" },
    { label: "Runs", to: "/runs" },
];

export function Sidebar() {
    return (
        <aside className="w-64 border-r bg-background">
            <div className="p-4 font-semibold text-lg">
                CleverMiner
            </div>

            <nav className="flex flex-col gap-1 px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "rounded-md px-3 py-2 text-sm hover:bg-accent",
                                isActive && "bg-accent font-medium"
                            )
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
