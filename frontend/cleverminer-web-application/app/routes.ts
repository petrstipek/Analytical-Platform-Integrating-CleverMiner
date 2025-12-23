import {type RouteConfig, index, layout, route} from "@react-router/dev/routes";

export default [index("routes/home.tsx"), layout('shared/components/layout/AppShell.tsx', [
    route('projects', 'modules/projects/pages/ProjectsMainPage.tsx')
])] satisfies RouteConfig;
