"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { trackWaitlistSignup } from "@/lib/analytics";
import mobileMockup from "@/public/images/mobile-mockup.png";
import grocabLogo from "@/public/images/grocablogo.svg";
import storyFrame1 from "@/public/images/storyframe1.png";
import secondSectionImage from "@/public/images/secondsectionimage.png";
import thirdSectionImage from "@/public/images/thirdsection.png";
import featureCard1 from "@/public/images/featurecard1.png";
import featureCard2 from "@/public/images/featurecard2.png";
import featureCard3 from "@/public/images/featurecard3.png";

type WaitlistState = "idle" | "loading" | "success" | "error";

// Animation variants for scroll-based animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Default animation props for elements that should be visible immediately
const defaultAnimationProps = {
  initial: false,
  animate: { opacity: 1 },
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<WaitlistState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const threshold = viewportHeight * 0.5; // 50% of viewport height

      if (scrollPosition > threshold) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state === "loading") return;

    setErrorMessage("");
    setState("loading");

    try {
      const response = await fetch("/api/joinWaitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setState("success");
        trackWaitlistSignup(email, true);
        setEmail("");
        setTimeout(() => {
          setState("idle");
          if (isModalOpen) {
            setIsModalOpen(false);
          }
        }, 2000);
      } else {
        setState("error");
        setErrorMessage(
          data.error || "Something went wrong. Please try again."
        );
        trackWaitlistSignup(email, false);
      }
    } catch (error) {
      setState("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      trackWaitlistSignup(email, false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F5]">
      {/* Initial Header (visible at top) */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-[70px] sm:h-[80px] bg-white"
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={grocabLogo}
              alt="Grocab Logo"
              width={120}
              height={58}
              className="h-auto w-20 sm:w-24 md:w-[120px]"
              priority
            />
          </motion.div>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ y: 2, boxShadow: "0px 4px 0px 0px #c48600" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 bg-[#ffae00] text-white rounded-lg shadow-[0px_6px_0px_0px_#c48600] transition-all duration-300 ease-out font-medium leading-6 text-sm sm:text-base md:text-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Join waitlist
        </motion.button>
        </div>
      </motion.header>

      {/* Fixed Navigation Bar (appears after 50% scroll) */}
      <AnimatePresence>
        {showNavbar && (
          <motion.header
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-40 w-full h-[70px] sm:h-[80px] bg-white shadow-md"
          >
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-24">
              <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
            <Image
              src={grocabLogo}
              alt="Grocab Logo"
              width={120}
              height={58}
              className="h-auto w-20 sm:w-24 md:w-[120px]"
              priority
            />
              </motion.div>
            </div>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ y: 2, boxShadow: "0px 4px 0px 0px #c48600" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 bg-[#ffae00] text-white rounded-lg shadow-[0px_6px_0px_0px_#c48600] transition-all duration-300 ease-out font-medium leading-6 text-sm sm:text-base md:text-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Join waitlist
            </motion.button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="space-y-8"
          >
            <h1
              className="font-bold text-[#003658] text-3xl sm:text-4xl md:text-5xl"
              style={{ lineHeight: "1.2" }}
            >
              Learn high-impact vocabulary in just{" "}
              <motion.span
                className="text-[#1ba8ff] inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                5 minutes a day
              </motion.span>
              .
            </h1>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="space-y-4 sm:space-y-6"
            >
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                  <path
                    d="M5 8L7 10L11 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p
                  className="font-medium text-[#003658] text-base sm:text-lg md:text-xl"
                  style={{ lineHeight: "1.5" }}
                >
                  Set your personalized vocab level
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <motion.svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                  <path
                    d="M5 8L7 10L11 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
                <p
                  className="font-medium text-[#003658] text-base sm:text-lg md:text-xl"
                  style={{ lineHeight: "1.5" }}
                >
                  Learn words in context with interest-based stories
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                  <path
                    d="M5 8L7 10L11 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p
                  className="font-medium text-[#003658] text-base sm:text-lg md:text-xl"
                  style={{ lineHeight: "1.5" }}
                >
                  Retain with adaptive spaced repetition
                </p>
              </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <a
                href="#features"
                className="font-medium text-center text-sm sm:text-base"
                style={{
                  lineHeight: "1.5",
                  color: "rgba(0,54,88,0.6)",
                }}
              >
                See how it works
              </a>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ y: 2, boxShadow: "0px 4px 0px 0px #c48600" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-[#ffae00] text-white rounded-lg shadow-[0px_6px_0px_0px_#c48600] transition-all duration-300 ease-out font-medium text-sm sm:text-base"
                style={{ lineHeight: "1.5" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Join waitlist
              </motion.button>
            </div>
          </motion.div>

          {/* Mobile Mockup */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInRight}
            className="relative flex justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-[300px]"
            >
              <Image
                src={mobileMockup}
                alt="Grocab mobile app mockup showing dictionary interface"
                width={300}
                className="w-full h-auto rounded-[2rem] shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 1: Save words from web */}
      <section
        id="features"
        className="w-full bg-gray-50 py-12 sm:py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-3">
                <span
                  className="inline-block text-[#1BA8FF] font-bold uppercase tracking-wider text-xs sm:text-sm"
                  style={{
                    lineHeight: "1.4",
                    letterSpacing: "1.2px",
                  }}
                >
                  <span className="text-gray-500 opacity-50 font-semibold">
                    01/
                  </span>
                  <span className="text-[#1BA8FF]"> SAVE</span>
                </span>
                <h2
                  className="font-semibold text-[#003658] text-2xl sm:text-3xl md:text-4xl"
                  style={{ lineHeight: "1.2" }}
                >
                  Save words from anywhere or generate new ones instantly
                </h2>
              </div>
              <p
                className="text-xl text-gray-700"
                style={{ lineHeight: "1.6" }}
              >
                Find words to learn that are relevant to your interests and
                goals.
              </p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="space-y-3"
              >
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Free chrome extension
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Generate words from your custom topics
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Set your difficulty level
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* First Section Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
              className="relative flex justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative w-full overflow-hidden rounded-xl"
              >
                <Image
                  src={thirdSectionImage}
                  alt="Grocab save words from web interface"
                  className="w-full h-auto shadow-xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Daily Personalized Read */}
      <section className="w-full py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-3">
                <span
                  className="inline-block text-[#1BA8FF] font-bold uppercase tracking-wider text-xs sm:text-sm"
                  style={{
                    lineHeight: "1.4",
                    letterSpacing: "1.2px",
                  }}
                >
                  <span className="text-gray-500 opacity-50 font-semibold">
                    02/
                  </span>
                  <span className="text-[#1BA8FF]"> LEARN</span>
                </span>
                <h2
                  className="font-semibold text-[#003658] text-2xl sm:text-3xl md:text-4xl"
                  style={{ lineHeight: "1.2" }}
                >
                  Learn your words with daily reads on the topics you care about
                </h2>
              </div>
              <p
                className="text-xl text-gray-700"
                style={{ lineHeight: "1.6" }}
              >
                Your brain remembers best with engaging content. Reading vocab
                through meaningful context teaches usage, tone, and nuance all
                at once.
              </p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="space-y-3"
              >
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Set your story time (2min, 5min, 10min)
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Set your story topics of interest
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Story Frame Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
              className="relative flex justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative w-full overflow-hidden rounded-xl"
              >
                <Image
                  src={storyFrame1}
                  alt="Grocab story frame showing personalized reading interface"
                  className="w-full h-auto shadow-xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 3: Byte-sized exercises */}
      <section className="w-full bg-white py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-3">
                <span
                  className="inline-block text-[#1BA8FF] font-bold uppercase tracking-wider text-xs sm:text-sm"
                  style={{
                    lineHeight: "1.4",
                    letterSpacing: "1.2px",
                  }}
                >
                  <span className="text-gray-500 opacity-50 font-semibold">
                    03/
                  </span>
                  <span className="text-[#1BA8FF]"> REMEMBER</span>
                </span>
                <h2
                  className="font-semibold text-[#003658] text-2xl sm:text-3xl md:text-4xl"
                  style={{ lineHeight: "1.2" }}
                >
                  Remember forever with byte sized exercises and
                  smart spaced repetition
                </h2>
              </div>
              <p
                className="text-xl text-gray-700"
                style={{ lineHeight: "1.6" }}
              >
                Don&apos;t just learn new words, but actually retain them with
                our research-backed reinforcement system.
              </p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="space-y-3"
              >
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Smart anki style spaced repetition
                  </p>
                </motion.div>
                
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Simple recall and usage checks
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx="8" cy="8" r="8" fill="#1BA8FF" />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <p
                    className="text-gray-700 font-medium text-sm sm:text-base"
                    style={{ lineHeight: "1.5" }}
                  >
                    Spend just 2 minutes a day
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Third Section Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
              className="relative flex justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative w-full overflow-hidden rounded-xl"
              >
                <Image
                  src={secondSectionImage}
                  alt="Grocab byte-sized exercises interface"
                  className="w-full h-auto shadow-xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 bg-[#EEF2F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* Card 1: Set topics */}
            <motion.div
              variants={fadeInUp}
              whileHover={{
                y: -4,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="px-5 pt-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "425/275", borderRadius: "15px" }}
                >
                  <Image
                    src={featureCard1}
                    alt="Set topics you're interested in"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "15px" }}
                  />
                </motion.div>
              </div>
              <div className="px-6 pt-5 pb-6">
                <h3
                  className="font-semibold text-black mb-3 text-lg sm:text-xl"
                  style={{ lineHeight: "1.5" }}
                >
                  Learn on your own terms
                </h3>
                <p
                  className="text-[#003658] text-sm sm:text-base mt-2"
                  style={{ lineHeight: "1.5" }}
                >
                  Be entertained with stories, learn about current events, or
                  expand your knowledge with non-fiction.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Difficulty levels */}
            <motion.div
              variants={fadeInUp}
              whileHover={{
                y: -4,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="px-5 pt-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "425/275", borderRadius: "15px" }}
                >
                  <Image
                    src={featureCard2}
                    alt="Set custom difficulty levels"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "15px" }}
                  />
                </motion.div>
              </div>
              <div className="px-6 pt-5 pb-6">
                <h3
                  className="font-semibold text-black mb-3"
                  style={{ fontSize: "19px", lineHeight: "1.5" }}
                >
                  Set custom difficulty levels
                </h3>
                <p
                  className="text-[#003658]"
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.5",
                    marginTop: "8px",
                  }}
                >
                  Set your vocabulary difficulty level to match your learning
                  goals.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Garden grow */}
            <motion.div
              variants={fadeInUp}
              whileHover={{
                y: -4,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="px-5 pt-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "425/275", borderRadius: "15px" }}
                >
                  <Image
                    src={featureCard3}
                    alt="Watch your garden grow"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "15px" }}
                  />
                </motion.div>
              </div>
              <div className="px-6 pt-5 pb-6">
                <h3
                  className="font-semibold text-black mb-3"
                  style={{ fontSize: "19px", lineHeight: "1.5" }}
                >
                  Watch your garden grow
                </h3>
                <p
                  className="text-[#003658]"
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.5",
                    marginTop: "8px",
                  }}
                >
                  Get rewarded from your learning journey and expand your
                  garden.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta-section"
        className="w-full py-12 sm:py-16 md:py-24"
        style={{
          background:
            "linear-gradient(180deg, #8CD3FF 0%, #68C5FF 15.38%, #34B1FF 37.98%, #34B1FF 68.75%, #34B1FF 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="font-semibold text-white mb-4 sm:mb-6 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ lineHeight: "1.2" }}
          >
            Join the waitlist
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8"
            style={{ lineHeight: "1.5" }}
          >
            Join 10,000+ early adopters. Get exclusive access to the premium
            library when we launch the desktop app.
          </motion.p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "success" || state === "error") {
                  setState("idle");
                  setErrorMessage("");
                }
              }}
              placeholder="Enter your email"
              disabled={state === "loading"}
              className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm sm:text-base"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ y: 2, boxShadow: "0px 4px 0px 0px #c48600" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#ffae00] text-white rounded-lg shadow-[0px_6px_0px_0px_#c48600] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out font-medium leading-6 text-base sm:text-lg"
            >
              {state === "loading" ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Joining...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Join waitlist
                </>
              )}
            </motion.button>
          </form>

          {state === "error" && errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-base max-w-2xl mx-auto">
              {errorMessage}
            </div>
          )}

          {state === "success" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-base max-w-2xl mx-auto">
              You&apos;re on the list! We&apos;ll be in touch soon.
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 sm:p-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2
                className="font-semibold text-[#003658] mb-3 text-2xl sm:text-3xl"
                style={{ lineHeight: "1.2" }}
              >
                Join the waitlist
              </h2>
              <p
                className="text-gray-600 mb-6"
                style={{ fontSize: "16px", lineHeight: "1.5" }}
              >
                Get exclusive access when we launch.
              </p>

              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "success" || state === "error") {
                      setState("idle");
                      setErrorMessage("");
                    }
                  }}
                  placeholder="Enter your email"
                  disabled={state === "loading"}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1ba8ff] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm sm:text-base"
                  required
                  autoFocus
                />
                <motion.button
                  type="submit"
                  whileHover={{ y: 2, boxShadow: "0px 4px 0px 0px #c48600" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-[#ffae00] text-white rounded-lg shadow-[0px_6px_0px_0px_#c48600] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out font-medium text-sm sm:text-base"
                  disabled={state === "loading"}
                >
                  {state === "loading" ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      Join waitlist
                    </>
                  )}
                </motion.button>
              </form>

              {state === "error" && errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              {state === "success" && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  You&apos;re on the list! We&apos;ll be in touch soon.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={grocabLogo}
              alt="Grocab Logo"
              width={90}
              height={43}
              className="h-auto"
            />
            <div className="w-full h-px bg-gray-200"></div>
            <p className="text-gray-600 text-base">© 2025 Grocab Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
