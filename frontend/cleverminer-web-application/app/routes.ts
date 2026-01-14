import { type RouteConfig, layout, index, route } from '@react-router/dev/routes';

export default [
  layout('shared/components/layout/platformLayout/PlatformLayout.tsx', [
    route('projects', 'modules/projects/pages/ProjectsMainPage.tsx'),
    route('new-task', 'modules/tasks/pages/NewTask.page.tsx'),
    route('tasks', 'modules/tasks/pages/Tasks.page.tsx'),
    route('datasets', 'modules/datasets/pages/DatasetUpload.page.tsx'),
    route('datasets/:id', 'modules/datasets/pages/DatasetDetail.page.tsx'),
  ]),
  layout('shared/components/layout/baseLayout/BaseLayout.tsx', [
    index('modules/homePage/pages/HomePage.tsx'),
  ]),
] satisfies RouteConfig;
