

"use client"

import { useState } from "react";
import { CardStack } from "@/components/new/CardStack";
// import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation"
import dog1 from "@/assets/img/dog1.gif";

import img1 from "@/assets/img/img1.jpg";
import img21 from "@/assets/img/img2-1.jpg";
import img2 from "@/assets/img/img2.jpg";
import img3 from "@/assets/img/img3.jpg";
import img4 from "@/assets/img/img4.jpg";
import img5 from "@/assets/img/img5.jpg";
import img6 from "@/assets/img/img6.jpg";
import img7 from "@/assets/img/img7.jpg";
import img8 from "@/assets/img/img8.jpg";
import img9 from "@/assets/img/img9.jpg";
import img10 from "@/assets/img/img10.jpg";
import img11 from "@/assets/img/img11.jpg";
import img12 from "@/assets/img/img12.jpg";
import img13 from "@/assets/img/img13.jpg";
import img14 from "@/assets/img/img14.jpg";
import img15 from "@/assets/img/img15.jpg";
import img16 from "@/assets/img/img16.jpg";
import img17 from "@/assets/img/img17.jpg";

// Mock Data
const CARDS_DATA = [
  {
    id: 1,
    date: "2025.01.19",
    location: "臭猪的家里",
    image: img1.src,
    description: "小晶宝宝给我在拼乐高的车车，乖乖的",
    color: "oklch(0.65 0.2 30)", // Coral
  },
  {
    id: 2,
    date: "2025.02.21",
    location: "臭猪的家里",
    image: img21.src,
    description: "开始学习！要努力成为中级宝宝",
    color: "oklch(0.6 0.15 250)", // Teal
  },
  {
    id: 3,
    date: "2025.02.27",
    location: "建设路的烤匠",
    image: img2.src,
    description: "宝宝的生日，正在许愿！",
    color: "oklch(0.6 0.15 250)", // Teal
  },
  {
    id: 4,
    date: "2025.03.22",
    location: "铁像寺水街",
    image: img3.src,
    description: "我们的一周年，我们一起吃了西餐，臭猪把这个塑料的猪猪吃了一口发现袄不动！憨猪样",
    color: "oklch(0.6 0.118 184)", // Greenish
  },
  {
    id: 5,
    date: "2025.03.21",
    location: "臭猪的家里",
    image: img4.src,
    description: "送给你一个大大的粉色颜色花",
    color: "oklch(0.85 0.18 85)", // Gold
  },
  {
    id: 6,
    date: "2025.05.03",
    location: "臭猪的家里",
    image: img5.src,
    description: "夏天的第一顿小龙虾，小晶宝宝最爱吃啦",
    color: "oklch(0.65 0.2 30)", // Coral
  },
  {
    id: 7,
    date: "2025.05.01",
    location: "臭猪的家里",
    image: img6.src,
    description: "臭冯航把灶台都煮炸了，以后可得小心！！！",
    color: "oklch(0.85 0.18 85)", // Gold
  },
  {
    id: 8,
    date: "2025.05.09",
    location: "臭猪的家里",
    image: img7.src,
    description: "小晶宝宝在拯救小熊猫的眉毛",
    color: "oklch(0.6 0.118 184)", // Greenish
  },
  {
    id: 9,
    date: "2025.07.11",
    location: "西安奥体中心",
    image: img8.src,
    description: "陪宝宝看了她心心念念鹿哥的演唱会，我是鹿角猪啦！",
    color: "oklch(0.6 0.15 250)", // Teal
  },
  {
    id: 10,
    date: "2025.07.11",
    location: "西安某个酒店",
    image: img9.src,
    description: "一秒800个动作，乖乖晶",
    color: "oklch(0.6 0.15 250)", // Teal
  },
  {
    id: 11,
    date: "2025.07.12",
    location: "西安某个按摩的地方",
    image: img10.src,
    description: "搞笑揪带我去按摩了，哈哈哈，小揪的样子又搞笑，又乖乖的",
    color: "oklch(0.6 0.118 184)", // Greenish
  },
  {
    id: 12,
    date: "2025.10.04",
    location: "青岛第二海水浴场",
    image: img11.src,
    description: "我们去了青岛，差点没赶上飞机，🏃‍♂️🏃‍♀️狂奔ing！",
    color: "oklch(0.85 0.18 85)", // Gold
  },
  {
    id: 13,
    date: "2025.10.04",
    location: "青岛五四广场前海沿",
    image: img12.src,
    description: "我们吃了第一顿海鲜大餐，好好吃！",
    color: "oklch(0.65 0.2 30)", // Coral
  },
  {
    id: 14,
    date: "2025.10.07",
    location: "石老人海水浴场",
    image: img13.src,
    description: "和宝宝一起看了日出",
    color: "oklch(0.6 0.15 250)", // Teal
  },
  {
    id: 15,
    date: "2025.10.25",
    location: "广汉三星堆",
    image: img14.src,
    description: "去了三星堆，看到了一只猪，哈哈哈哈！",
    color: "oklch(0.85 0.18 85)", // Gold
  },
  {
    id: 16,
    date: "2025.11.14",
    location: "臭猪的家里",
    image: img15.src,
    description: "臭冯航求婚啦！宝宝我爱你，我要和你结纷！",
    color: "oklch(0.6 0.118 184)", // Greenish
  },
  {
    id: 17,
    date: "2025.11.15",
    location: "臭猪的家里",
    image: img16.src,
    description: "宝宝穿乖睡衣的样子，乖乖哒",
    color: "oklch(0.65 0.2 30)", // Coral
  },
  {
    id: 18,
    date: "2025.12.24",
    location: "建设路的烤匠",
    image: img17.src,
    description: "和宝宝在一起过了平安夜，我们又吃了烤匠，哼臭冯航把宝宝惹生气了，小晶气呼呼的在拆蛋糕哈哈",
    color: "oklch(0.6 0.15 250)", // Teal
  },
];

export default function Home() {
  // const [_, setLocation] = useLocation();
  const [started, setStarted] = useState(false);
  const router = useRouter();

  const handleFinish = () => {
    // setLocation("/new-year");
    router.push("/new-year");
  };

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center pt-0 font-cartoon">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="z-20 flex flex-col items-center text-center space-y-8 p-8"
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={dog1.src} className="w-36 h-36" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-6xl mb-4"
              >
                🕰️
              </motion.div>
              <h1 className="text-5xl font-cartoon text-primary drop-shadow-sm">
                跨年时光机
              </h1>
              <p className="text-xl text-muted-foreground font-cartoon">
                回顾 2025 · 启程 2026
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="rounded-full px-12 py-8 text-2xl font-cartoon bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              onClick={() => setStarted(true)}
            >
              <Sparkles className="mr-2 h-6 w-6 animate-pulse" />
              开启回忆
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="stack"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center h-full"
          >
            {/* Header / Logo - Compact spacing */}
            <header className="relative mt-4 mb-2 z-10">
              <h1 className="text-lg font-cartoon text-foreground/60 tracking-widest uppercase">
                时间胶囊 2025
              </h1>
            </header>

            {/* Main Card Stack Area */}
            <main className="w-full flex-1 flex items-center justify-center p-4 min-h-[600px]">
              <CardStack cards={CARDS_DATA} onFinish={handleFinish} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
