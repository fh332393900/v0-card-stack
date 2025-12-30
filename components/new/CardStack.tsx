"use client"

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, type CardData } from "./Card";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import dog2 from "@/assets/dog2.gif";

interface CardStackProps {
  cards: CardData[];
  onFinish: () => void;
}

export function CardStack({ cards, onFinish }: CardStackProps) {
  const [activeCards, setActiveCards] = useState(cards);
  const [removedCards, setRemovedCards] = useState<number[]>([]);

  const handleSwipe = (id: number) => {
    setRemovedCards((prev) => [...prev, id]);
    setTimeout(() => {
      setActiveCards((prev) => prev.filter((card) => card.id !== id));
      if (activeCards.length <= 1) {
        // Only one left (the one just swiped), so now it's empty
        // Wait a bit for animation to finish then trigger onFinish?
        // Actually, if we just swiped the last card, activeCards will become empty.
        // But we usually want a final "End" card or button.
        // Let's Handle that in the parent or render a special "End" state here.
      }
    }, 400);
  };

  const isFinished = activeCards.length === 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[600px]">
      <AnimatePresence>
        {!isFinished ? (
          activeCards.map((card, index) => (
            <Card
              key={card.id}
              data={card}
              index={index}
              total={activeCards.length}
              onSwipe={() => handleSwipe(card.id)}
              isFront={index === 0}
            />
          ))
        ) : (
           // Placeholder for empty state, though parent handles transition usually.
           // We can show a button here if needed, but per requirements:
           // "When sliding to the last card, show a button to start new year"
           // This means the last card IS the button or the button appears AFTER the last card?
           // Requirement: "When sliding to the last card, display a 'Start New Year' button".
           // This implies the last card content might BE the button or reveals it.
           // Let's assume after the last regular card is swiped, we show the Button Card.
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="z-10 flex flex-col items-center justify-center"
           >
             <div className="relative group text-center">
                {/* <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div> */}
                <div className="mb-3">
                  <img src={dog2.src} alt="线条小狗冲浪动图" className="rounded-md" />
                </div>
                <Button 
                  size="lg" 
                  className="relative h-16 px-8 text-xl rounded-full bg-background text-foreground border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-2xl"
                  onClick={onFinish}
                >
                  <Sparkles className="mr-2 h-6 w-6 text-secondary animate-pulse" />
                  开启 2026 新年
                </Button>
             </div>
             <p className="mt-4 text-muted-foreground text-sm">
               准备好了吗？
             </p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
