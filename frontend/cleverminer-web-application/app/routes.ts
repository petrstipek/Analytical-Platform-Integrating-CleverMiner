import { type RouteConfig, layout, index, route } from '@react-router/dev/routes';

export default [
  layout('shared/components/layout/platformLayout/PlatformLayout.tsx', [
    route('tasks', 'modules/tasks/pages/Tasks.layout.tsx', [
      index('modules/tasks/pages/Tasks.page.tsx'),
      route('new-task', 'modules/tasks/pages/NewTask.page.tsx'),
      route(':taskId', 'modules/tasks/pages/TaskDetail.page.tsx'),
      route('edit-task/:taskId', 'modules/tasks/pages/EditTask.page.tsx'),
    ]),

    route('projects', 'modules/projects/pages/Projects.layout.tsx', [
      index('modules/projects/pages/Projects.page.tsx'),
      route('new-project', 'modules/projects/pages/NewProject.page.tsx'),
      route(':projectId', 'modules/projects/pages/ProjectDetails.page.tsx'),
    ]),

    route('datasets', 'modules/datasets/pages/Datasets.layout.tsx', [
      index('modules/datasets/pages/Datasets.page.tsx'),
      route('upload', 'modules/datasets/pages/DatasetUpload.page.tsx'),
      route(':datasetId', 'modules/datasets/pages/DatasetDetail.page.tsx'),
    ]),

    route('run/:runId', 'modules/runs/pages/RunDetail.page.tsx'),
    route('runs', 'modules/runs/pages/Runs.page.tsx'),
    layout('modules/dashboard/pages/Dashboard.layout.tsx', [
      route('home', 'modules/dashboard/pages/Dashboard.page.tsx'),
    ]),
  ]),
  layout('shared/components/layout/baseLayout/BaseLayout.tsx', [
    index('modules/homePage/pages/HomePage.tsx'),
    route('login', 'modules/auth/pages/Login.page.tsx'),
    route('register', 'modules/auth/pages/Register.page.tsx'),
  ]),
] satisfies RouteConfig;
