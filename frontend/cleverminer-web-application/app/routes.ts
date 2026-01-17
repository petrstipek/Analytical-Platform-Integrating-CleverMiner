import { type RouteConfig, layout, index, route } from '@react-router/dev/routes';

export default [
  layout('shared/components/layout/platformLayout/PlatformLayout.tsx', [
    route('projects', 'modules/projects/pages/ProjectsMainPage.tsx'),
    route('tasks/new-task', 'modules/tasks/pages/NewTask.page.tsx'),
    route('tasks', 'modules/tasks/pages/Tasks.page.tsx'),
    route('tasks/:taskId', 'modules/tasks/pages/TaskDetail.page.tsx'),
    route('datasets', 'modules/datasets/pages/DatasetUpload.page.tsx'),
    route('datasets/:id', 'modules/datasets/pages/DatasetDetail.page.tsx'),
    route('run/:runId', 'modules/runs/pages/RunDetail.page.tsx'),
  ]),
  layout('shared/components/layout/baseLayout/BaseLayout.tsx', [
    index('modules/homePage/pages/HomePage.tsx'),
    route('login', 'modules/auth/pages/Login.page.tsx'),
    route('register', 'modules/auth/pages/Register.page.tsx'),
  ]),
] satisfies RouteConfig;
