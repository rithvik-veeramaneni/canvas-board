import { CanvasEditor } from "@/components/canvas-editor"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Canvas Board Editor</h1>
        <CanvasEditor />
      </div>
    </main>
  )
}
