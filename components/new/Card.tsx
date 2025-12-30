"use client"

import { motion, type PanInfo, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useState } from "react";
import { MoveUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CardData {
  id: number;
  date: string;
  location: string;
  image: string;
  description: string;
  color: string; // Background accent color for the card
}

interface CardProps {
  data: CardData;
  index: number;
  total: number;
  onSwipe: () => void;
  isFront: boolean;
}

export function Card({ data, index, total, onSwipe, isFront }: CardProps) {
  const controls = useAnimation();
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-200, 200], [-5, 5]);
  const opacity = useTransform(y, [-200, -100, 0], [0, 0.5, 1]);
  const scale = useTransform(y, [-200, 0], [0.9, 1]);

  // Dynamic stacking effect
  const offset = index * 10; // Vertical offset for stacked cards
  const scaleBack = 1 - index * 0.05; // Scale down for cards behind
  const zIndex = total - index;

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const threshold = -100; // Swipe up threshold
    if (info.offset.y < threshold && isFront) {
      // Swiped up
      await controls.start({ y: -1000, transition: { duration: 0.4, ease: "backIn" } });
      onSwipe();
    } else {
      // Snap back
      controls.start({ y: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      style={{
        y: isFront ? y : 0,
        rotate: isFront ? rotate : 0,
        zIndex,
        scale: isFront ? scale : scaleBack,
        top: offset,
        borderColor: data.color,
      }}
      drag={isFront ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ y: 0, scale: scaleBack }}
      className={cn(
        "absolute w-full max-w-sm aspect-[3/5] rounded-[2rem] bg-card p-4 flex flex-col items-center shadow-xl border-4 select-none touch-none",
        "origin-bottom transition-shadow duration-300",
        isFront ? "cursor-grab active:cursor-grabbing card-shadow ring-4 ring-primary/10" : "pointer-events-none opacity-90"
      )}

    >
      {/* Date & Location Pill */}
      <div className="flex items-center space-x-2 mb-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm">
        <span className="text-xs font-bold text-primary">{data.date}</span>
        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{data.location}</span>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-muted shadow-inner group">
        <img 
          src={data.image} 
          alt={data.description} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          draggable={false}
        />
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Description */}
      <div className="flex-1 w-full flex flex-col items-center justify-center text-center px-2">
        <p className="font-cartoon text-2xl text-foreground mb-2 leading-tight">
          {data.description}
        </p>
        <div className="h-1 w-12 rounded-full bg-accent/30 mt-2" />
      </div>

      {/* Interaction Hint (Only for front card) */}
      {isFront && (
        <motion.div 
          className="absolute bottom-4 flex flex-col items-center text-muted-foreground/50 gap-1"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <MoveUp size={24} color="#61728f" />
          {/* <span className="text-xs font-bold tracking-widest uppercase">Swipe Up</span> */}
          <p className="text-sm text-muted-foreground font-cartoon opacity-60">
            上滑翻阅回忆
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
