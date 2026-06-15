import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Agent standard" },
      { name: "description", content: "" },
    ],
  }),
  component: Index,
});

function Index() {
  return <div />;
}
