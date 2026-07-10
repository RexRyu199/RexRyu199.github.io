import { createHashRouter, Navigate } from "react-router";
import { GameLayout } from "./layouts/GameLayout";
import { LoadingScreen } from "./screens/LoadingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ProjectsScreen } from "./screens/ProjectsScreen";
import { TechnologiesScreen } from "./screens/TechnologiesScreen";
import { ExperienceScreen } from "./screens/ExperienceScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

export const router = createHashRouter([
  {
    path: "/",
    Component: GameLayout,
    children: [
      { index: true, element: <Navigate to="/loading" replace /> },
      { path: "loading", Component: LoadingScreen },
      { path: "home", Component: HomeScreen },
      { path: "projects", Component: ProjectsScreen },
      { path: "technologies", Component: TechnologiesScreen },
      { path: "experience", Component: ExperienceScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);