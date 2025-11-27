"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Heart, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import ColorThief from "colorthief"

interface CardData {
  id: number
  date: string
  location: string
  description: string
  imageUrl: string
  tags: string[]
  isLastCard?: boolean
  colors: {
    primary: string
    secondary: string
    text: string
    shadow: string
  }
}

const initialCards: CardData[] = [
  {
    id: 1,
    date: "2025.01.01",
    location: "上海 · 外滩",
    description: "新年第一天，我们一起看了外滩的烟花，许下了2025年的愿望。",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    tags: ["新年", "烟花", "浪漫"],
    colors: {
      primary: "#1a1a1a",
      secondary: "#333333",
      text: "#ffffff",
      shadow: "rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: 2,
    date: "2025.02.14",
    location: "杭州 · 西湖",
    description: "情人节的西湖，湖面上飘着细雨，我们撑着伞漫步在断桥上。",
    imageUrl: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80",
    tags: ["情人节", "西湖", "雨天"],
    colors: {
      primary: "#0f2b46",
      secondary: "#1e4976",
      text: "#ffffff",
      shadow: "rgba(15, 43, 70, 0.6)",
    },
  },
  {
    id: 3,
    date: "2025.05.20",
    location: "三亚 · 亚龙湾",
    description: "520纪念日，海边的日落美得让人窒息，你说这是最美的一天。",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    tags: ["520", "海边", "日落"],
    colors: {
      primary: "#2d4a22",
      secondary: "#4a7a38",
      text: "#ffffff",
      shadow: "rgba(45, 74, 34, 0.6)",
    },
  },
  {
    id: 4,
    date: "2025.08.15",
    location: "成都 · 宽窄巷子",
    description: "夏日成都之旅，一起吃火锅、喝盖碗茶，体验慢生活。",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    tags: ["旅行", "美食", "夏天"],
    colors: {
      primary: "#5a3a31",
      secondary: "#8c5b4a",
      text: "#ffffff",
      shadow: "rgba(90, 58, 49, 0.6)",
    },
  },
  {
    id: 5,
    date: "2025.12.31",
    location: "北京 · 家中",
    description: "2025年的最后一天，我们依偎在沙发上，回顾这一年的点点滴滴。",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    tags: ["跨年", "温馨", "感恩"],
    isLastCard: true,
    colors: {
      primary: "#1a3a5f",
      secondary: "#2d5f8a",
      text: "#ffffff",
      shadow: "rgba(26, 58, 95, 0.6)",
    },
  },
]

export default function CardStack() {
  const [cards, setCards] = useState<CardData[]>(initialCards)
  const [loading, setLoading] = useState(true)
  const [extractedColors, setExtractedColors] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const extractColors = async () => {
      if (extractedColors) return

      const updatedCards = [...cards]
      const colorThief = new ColorThief()

      for (let i = 0; i < updatedCards.length; i++) {
        const card = updatedCards[i]
        try {
          const img = new Image()
          img.crossOrigin = "Anonymous"
          img.src = card.imageUrl

          await new Promise((resolve) => {
            img.onload = () => {
              try {
                const palette = colorThief.getPalette(img, 3)
                const primaryColor = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`
                const secondaryColor = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
                const shadowColor = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.6)`
                const brightness = (palette[0][0] * 299 + palette[0][1] * 587 + palette[0][2] * 114) / 1000
                const textColor = brightness < 128 ? "#ffffff" : "#000000"

                updatedCards[i].colors = {
                  primary: primaryColor,
                  secondary: secondaryColor,
                  text: textColor,
                  shadow: shadowColor,
                }
              } catch (error) {
                console.error("Error extracting colors:", error)
              }
              resolve(null)
            }
          })
        } catch (error) {
          console.error("Error loading image:", error)
        }
      }

      setCards(updatedCards)
      setExtractedColors(true)
      setLoading(false)
    }

    extractColors()
  }, [cards, extractedColors])

  const removeCard = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id))
  }

  const handleNewYear = () => {
    router.push("/new-year")
  }

  if (loading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-2">
        <Heart className="h-8 w-8 animate-pulse text-rose-500" />
        <span className="text-rose-600">加载回忆中...</span>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] w-full">
      <AnimatePresence mode="popLayout">
        {cards.slice(0, 3).map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            removeCard={removeCard}
            totalCards={Math.min(cards.length, 3)}
            onNewYear={handleNewYear}
            isOnlyCard={cards.length === 1}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface CardProps {
  card: CardData
  index: number
  removeCard: (id: number) => void
  totalCards: number
  onNewYear: () => void
  isOnlyCard: boolean
}

function Card({ card, index, removeCard, totalCards, onNewYear, isOnlyCard }: CardProps) {
  const zIndex = totalCards - index
  const yOffset = index * 30
  const xOffset = index * 5

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100, x: xOffset }}
      animate={{
        opacity: 1,
        y: yOffset,
        x: xOffset,
        scale: 1 - index * 0.04,
        rotateZ: index * -3,
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 50,
        mass: 1,
      }}
      style={{
        zIndex,
        boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px ${card.colors.shadow}`,
        backgroundColor: card.colors.primary,
      }}
      className="absolute left-0 top-0 h-full w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
      drag={index === 0 && !card.isLastCard}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (index === 0 && !card.isLastCard) {
          const distance = Math.sqrt(Math.pow(info.offset.x, 2) + Math.pow(info.offset.y, 2))
          if (distance > 150) {
            removeCard(card.id)
          }
        }
      }}
      whileDrag={{
        scale: 1.05,
        boxShadow: `0 ${15 + index * 5}px ${40 + index * 10}px ${card.colors.shadow}`,
      }}
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{ color: card.colors.text }}
      >
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div
            className="flex items-center gap-1.5 rounded-full bg-opacity-20 px-2.5 py-1 sm:gap-2 sm:px-3"
            style={{ backgroundColor: `${card.colors.text}20` }}
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs font-medium sm:text-sm">{card.date}</span>
          </div>
          <div className="rounded-full bg-opacity-20 p-1.5 sm:p-2" style={{ backgroundColor: `${card.colors.text}20` }}>
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        <div className="px-3 py-1 sm:px-4 sm:py-2">
          <h2 className="text-2xl font-bold sm:text-3xl">{card.date}</h2>
          <div className="mt-0.5 flex items-center gap-1 sm:mt-1" style={{ color: `${card.colors.text}99` }}>
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <h3 className="text-base font-medium sm:text-lg">{card.location}</h3>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-3 py-2 sm:px-4">
          <div
            className="h-full w-full overflow-hidden rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.imageUrl})`,
              boxShadow: `0 10px 30px ${card.colors.shadow}`,
            }}
          />
        </div>

        <div className="p-3 pt-2 sm:p-4 sm:pt-3">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {card.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full px-2 py-0.5 text-xs font-medium sm:px-3 sm:py-1"
                style={{ backgroundColor: `${card.colors.text}20` }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed opacity-80 sm:mt-3 sm:text-sm">{card.description}</p>

          {card.isLastCard && isOnlyCard && (
            <motion.button
              onClick={onNewYear}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg sm:mt-4 sm:px-6 sm:py-3 sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              开启新的一年
            </motion.button>
          )}
        </div>

        {index === 0 && !card.isLastCard && (
          <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 flex-col items-center sm:bottom-2">
            <motion.div
              className="h-1 w-8 rounded-full sm:w-10"
              style={{ backgroundColor: `${card.colors.text}40` }}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
