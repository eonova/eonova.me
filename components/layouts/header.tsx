'use client'

import { useEffect, useState } from "react";
import Logo from "../logo";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./theme-toggle";
import { cn } from "~/lib/utils";
import Navbar from "./navbar";
import { Separator } from "../base/separator";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    document.addEventListener('scroll', changeBackground)

    return () => {
      document.removeEventListener('scroll', changeBackground)
    }
  }, [])
  return (
    <motion.header
      className={cn(
        'bg-background/30 fixed inset-x-0 top-4 z-40 mx-auto flex h-[50px] max-w-5xl items-center justify-between rounded-full px-8 shadow-sm saturate-100 backdrop-blur-[10px] transition-colors',
        isScrolled && 'bg-background/80', className
      )}
      initial={{
        y: -100
      }}
      animate={{
        y: 0
      }}
      transition={{
        duration: 0.3
      }}
    >
      <Link className="h-full" href="/" passHref>
        <Logo />
      </Link>

      <div className='flex items-center gap-2'>
        <Navbar />
        <Separator orientation='vertical' className='h-6' />
        <ThemeToggle />
        {/* <MobileNav /> */}
      </div>
    </motion.header>
  );
}

export default Header;
