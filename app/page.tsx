import CardStack from "@/components/card-stack"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-pink-100 p-4">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">我们的 2025</h1>
      <p className="mb-8 text-rose-600">记录与你的每一个美好瞬间</p>
      <div className="w-full max-w-md">
        <CardStack />
      </div>
    </main>
  )
}
