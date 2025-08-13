import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth", "/app/routes/auth.tsx"),
  route("/Upload", "/app/routes/upload.tsx"),
  route("/resume/:id", "/app/routes/resume.tsx"),
  route("/wipe", "/app/routes/wipe.tsx"),
  route("*", "/app/routes/notFound.tsx"),
] satisfies RouteConfig;
