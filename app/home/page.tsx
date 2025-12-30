

"use client"

import { useState } from "react";
import { CardStack } from "@/components/new/CardStack";
// import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation"
// import card1 from "../../assets/card-1.jpg";
// import card2 from "../../assets/card-1.jpg";
// import card3 from "../../assets/card-1.jpg";
// import card4 from "../../assets/card-1.jpg";

// Mock Data
const CARDS_DATA = [
  {
    id: 1,
    date: "2025.03.15",
    location: "Spring Garden",
    image: '/card-1.jpg',
    description: "万物复苏，在这个春天埋下了希望的种子。",
    color: "oklch(0.65 0.2 30)", // Coral
  },
  {
    id: 2,
    date: "2025.07.20",
    location: "Sunny Beach",
    image: '/card-1.jpg',
    description: "热烈的夏日，海风与冰淇淋不仅是味觉的享受，更是自由的味道。",
    color: "oklch(0.6 0.15 250)", // Teal
  },
  {
    id: 3,
    date: "2025.10.05",
    location: "Cozy Nook",
    image: '/card-1.jpg',
    description: "秋日的午后，一杯热可可，一本好书，享受内心的宁静。",
    color: "oklch(0.6 0.118 184)", // Greenish
  },
  {
    id: 4,
    date: "2025.12.31",
    location: "Starry Night",
    image: '/card-1.jpg',
    description: "在烟花绽放的瞬间，许下对未来的期许。",
    color: "oklch(0.85 0.18 85)", // Gold
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
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center font-cartoon">
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
                Time Capsule 2025
              </h1>
            </header>

            {/* Main Card Stack Area */}
            <main className="w-full flex-1 flex items-center justify-center p-4 min-h-[600px]">
              <CardStack cards={CARDS_DATA} onFinish={handleFinish} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Hint (only show when started) */}
      {started && (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 text-center"
        >
          <p className="text-sm text-muted-foreground font-cartoon opacity-60">
            上滑翻阅回忆
          </p>
        </motion.footer>
      )}
    </div>
  );
}
