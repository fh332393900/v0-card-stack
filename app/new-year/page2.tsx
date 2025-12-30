"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

class FireworkParticle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
  decay: number
  gravity: number
  trail: { x: number; y: number; alpha: number }[]

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 6 + 2
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.alpha = 1
    this.color = color
    this.size = Math.random() * 3 + 1
    this.decay = Math.random() * 0.015 + 0.01
    this.gravity = 0.05
    this.trail = []
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: this.alpha })
    if (this.trail.length > 5) this.trail.shift()

    this.vy += this.gravity
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.98
    this.alpha -= this.decay
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 绘制拖尾
    this.trail.forEach((point, i) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, this.size * (i / this.trail.length), 0, Math.PI * 2)
      ctx.fillStyle = this.color.replace("1)", `${point.alpha * 0.3})`)
      ctx.fill()
    })

    // 绘制粒子
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color.replace("1)", `${this.alpha})`)
    ctx.fill()

    // 发光效果
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2)
    gradient.addColorStop(0, this.color.replace("1)", `${this.alpha * 0.5})`))
    gradient.addColorStop(1, this.color.replace("1)", "0)"))
    ctx.fillStyle = gradient
    ctx.fill()
  }
}

class FireworkRocket {
  x: number
  y: number
  targetY: number
  vy: number
  color: string
  exploded: boolean
  particles: FireworkParticle[]
  trail: { x: number; y: number; alpha: number }[]

  constructor(x: number, canvasHeight: number) {
    this.x = x
    this.y = canvasHeight
    this.targetY = Math.random() * canvasHeight * 0.4 + canvasHeight * 0.1
    this.vy = -12 - Math.random() * 4
    const colors = [
      "rgba(255, 107, 107, 1)",
      "rgba(254, 202, 87, 1)",
      "rgba(72, 219, 251, 1)",
      "rgba(255, 159, 243, 1)",
      "rgba(84, 160, 255, 1)",
      "rgba(29, 209, 161, 1)",
      "rgba(255, 215, 0, 1)",
    ]
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.exploded = false
    this.particles = []
    this.trail = []
  }

  update() {
    if (!this.exploded) {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 })
      if (this.trail.length > 10) this.trail.shift()

      this.y += this.vy
      this.vy += 0.15

      if (this.y <= this.targetY || this.vy >= 0) {
        this.explode()
      }
    }

    this.trail = this.trail.map((t) => ({ ...t, alpha: t.alpha - 0.1 })).filter((t) => t.alpha > 0)
    this.particles = this.particles.filter((p) => p.alpha > 0)
    this.particles.forEach((p) => p.update())
  }

  explode() {
    this.exploded = true
    const particleCount = 60 + Math.floor(Math.random() * 40)
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new FireworkParticle(this.x, this.y, this.color))
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 绘制火箭拖尾
    this.trail.forEach((point, i) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 200, 100, ${point.alpha})`
      ctx.fill()
    })

    if (!this.exploded) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 1)"
      ctx.fill()
    }

    this.particles.forEach((p) => p.draw(ctx))
  }

  isDead() {
    return this.exploded && this.particles.length === 0 && this.trail.length === 0
  }
}

class Balloon {
  x: number
  y: number
  size: number
  color: string
  highlightColor: string
  vy: number
  vx: number
  wobbleOffset: number
  wobbleSpeed: number
  stringLength: number

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth
    this.y = canvasHeight + 100
    this.size = 30 + Math.random() * 20
    const colors = [
      { main: "#ff6b6b", highlight: "#ff9999" },
      { main: "#feca57", highlight: "#ffdd88" },
      { main: "#48dbfb", highlight: "#7ae8ff" },
      { main: "#ff9ff3", highlight: "#ffccff" },
      { main: "#54a0ff", highlight: "#88c0ff" },
      { main: "#1dd1a1", highlight: "#5eebc0" },
      { main: "#ee5a24", highlight: "#ff8855" },
      { main: "#a29bfe", highlight: "#c8c4ff" },
    ]
    const colorSet = colors[Math.floor(Math.random() * colors.length)]
    this.color = colorSet.main
    this.highlightColor = colorSet.highlight
    this.vy = -1 - Math.random() * 1.5
    this.vx = 0
    this.wobbleOffset = Math.random() * Math.PI * 2
    this.wobbleSpeed = 0.02 + Math.random() * 0.02
    this.stringLength = 40 + Math.random() * 30
  }

  update(time: number) {
    this.y += this.vy
    this.vx = Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * 0.5
    this.x += this.vx
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    const wobble = Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * 3

    ctx.save()
    ctx.translate(this.x + wobble, this.y)

    // 气球主体 - 椭圆形
    ctx.beginPath()
    ctx.ellipse(0, 0, this.size * 0.8, this.size, 0, 0, Math.PI * 2)

    // 渐变填充
    const gradient = ctx.createRadialGradient(-this.size * 0.3, -this.size * 0.3, 0, 0, 0, this.size)
    gradient.addColorStop(0, this.highlightColor)
    gradient.addColorStop(0.3, this.color)
    gradient.addColorStop(1, this.darkenColor(this.color, 30))
    ctx.fillStyle = gradient
    ctx.fill()

    // 高光
    ctx.beginPath()
    ctx.ellipse(-this.size * 0.35, -this.size * 0.4, this.size * 0.2, this.size * 0.3, -0.5, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
    ctx.fill()

    // 气球底部小尖角
    ctx.beginPath()
    ctx.moveTo(-this.size * 0.15, this.size * 0.95)
    ctx.lineTo(0, this.size * 1.15)
    ctx.lineTo(this.size * 0.15, this.size * 0.95)
    ctx.fillStyle = this.darkenColor(this.color, 20)
    ctx.fill()

    // 绳子 - 弯曲的
    ctx.beginPath()
    ctx.moveTo(0, this.size * 1.15)
    const stringWobble = Math.sin(time * this.wobbleSpeed * 2 + this.wobbleOffset)
    ctx.quadraticCurveTo(
      stringWobble * 10,
      this.size * 1.15 + this.stringLength * 0.5,
      stringWobble * 5,
      this.size * 1.15 + this.stringLength,
    )
    ctx.strokeStyle = "rgba(150, 150, 150, 0.8)"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.restore()
  }

  darkenColor(color: string, amount: number): string {
    const hex = color.replace("#", "")
    const r = Math.max(0, Number.parseInt(hex.slice(0, 2), 16) - amount)
    const g = Math.max(0, Number.parseInt(hex.slice(2, 4), 16) - amount)
    const b = Math.max(0, Number.parseInt(hex.slice(4, 6), 16) - amount)
    return `rgb(${r}, ${g}, ${b})`
  }

  isOffScreen() {
    return this.y < -this.size * 2 - this.stringLength
  }
}

function CanvasEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireworksRef = useRef<FireworkRocket[]>([])
  const balloonsRef = useRef<Balloon[]>([])
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 初始化气球
    for (let i = 0; i < 12; i++) {
      const balloon = new Balloon(canvas.width, canvas.height)
      balloon.y = Math.random() * canvas.height
      balloonsRef.current.push(balloon)
    }

    const animate = () => {
      timeRef.current++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 随机发射烟花
      if (Math.random() < 0.02) {
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1
        fireworksRef.current.push(new FireworkRocket(x, canvas.height))
      }

      // 随机添加气球
      if (Math.random() < 0.008 && balloonsRef.current.length < 20) {
        balloonsRef.current.push(new Balloon(canvas.width, canvas.height))
      }

      // 更新和绘制烟花
      fireworksRef.current = fireworksRef.current.filter((f) => !f.isDead())
      fireworksRef.current.forEach((f) => {
        f.update()
        f.draw(ctx)
      })

      // 更新和绘制气球
      balloonsRef.current = balloonsRef.current.filter((b) => !b.isOffScreen())
      balloonsRef.current.forEach((b) => {
        b.update(timeRef.current)
        b.draw(ctx, timeRef.current)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />
}

// 星星组件
function Star({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute text-yellow-300"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
      transition={{
        delay,
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 3,
      }}
    >
      <Sparkles className="h-4 w-4" />
    </motion.div>
  )
}

export default function NewYearPage() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const stars = Array.from({ length: 25 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    delay: Math.random() * 2,
  }))

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <CanvasEffects />

      {/* 返回按钮 */}
      <Link href="/">
        <motion.div
          className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">返回</span>
        </motion.div>
      </Link>

      {/* 星星背景 */}
      {stars.map((star, i) => (
        <Star key={i} x={star.x} y={star.y} delay={star.delay} />
      ))}

      {/* 主要内容 */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {showContent && (
          <>
            {/* 新年快乐主标题 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="bg-gradient-to-r from-yellow-200 via-pink-300 to-yellow-200 bg-clip-text text-5xl font-bold text-transparent sm:text-7xl md:text-8xl"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: "200% 200%" }}
              >
                新年快乐
              </motion.h1>
              <motion.p
                className="mt-3 text-xl text-white/80 sm:mt-4 sm:text-2xl md:text-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Happy New Year 2026
              </motion.p>
            </motion.div>

            {/* 爱心动画 */}
            <motion.div
              className="my-6 sm:my-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="h-12 w-12 fill-rose-500 text-rose-500 sm:h-16 sm:w-16" />
              </motion.div>
            </motion.div>

            {/* 祝福文字 */}
            <motion.div
              className="max-w-lg px-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
                亲爱的，感谢你陪我度过了2025年的每一天。
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/90 sm:mt-4 sm:text-lg md:text-xl">
                那些欢笑、那些旅程、那些平凡却温暖的日常，
                <br className="hidden sm:block" />
                都是我最珍贵的回忆。
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/90 sm:mt-4 sm:text-lg md:text-xl">
                2026年，让我们继续携手前行，
                <br className="hidden sm:block" />
                创造更多美好的故事。
              </p>
            </motion.div>

            {/* 底部装饰 */}
            <motion.div
              className="mt-8 flex items-center gap-2 text-white/60 sm:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <Sparkles className="h-4 w-4" />
              <span>爱你，永远</span>
              <Sparkles className="h-4 w-4" />
            </motion.div>
          </>
        )}
      </div>

      {/* 底部光晕效果 */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-rose-500/20 to-transparent" />
    </div>
  )
}
