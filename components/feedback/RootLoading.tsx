"use client";

import logo from "@/public/logo.webp";
import { motion } from "framer-motion";
import Image from "next/image";

const RootLoading = () => (
  <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white text-foreground backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="">
        <Image
          src={logo}
          alt="logo"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
    </motion.div>
  </div>
);

export default RootLoading;
