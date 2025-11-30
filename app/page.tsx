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

// Premium animation variants with refined timing
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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
  const [excitedFeature, setExcitedFeature] = useState("");
  const [otherFeatureText, setOtherFeatureText] = useState("");

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

    // Validate that if "other" is selected, the text field is filled
    if (excitedFeature === "other" && !otherFeatureText.trim()) {
      setErrorMessage("Please specify your feature or feature request.");
      setState("error");
      return;
    }

    setErrorMessage("");
    setState("loading");

    try {
      const response = await fetch("/api/joinWaitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          excitedFeature: excitedFeature === "other" ? otherFeatureText : excitedFeature,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setState("success");
        trackWaitlistSignup(email, true);
        setEmail("");
        setExcitedFeature("");
        setOtherFeatureText("");
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
        className="w-full h-[70px] sm:h-[80px] bg-white relative z-50"
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
            whileHover={{
              y: 2,
              boxShadow: "0px 4px 0px 0px #c48600",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98, y: 4 }}
            whileFocus={{
              outline: "2px solid #1ba8ff",
              outlineOffset: "2px",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 bg-[#ffae00] text-white rounded-xl shadow-[0px_6px_0px_0px_#c48600] transition-all duration-200 ease-out font-semibold leading-6 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#1ba8ff] focus:ring-offset-2"
            aria-label="Join waitlist"
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
                whileHover={{
                  y: 2,
                  boxShadow: "0px 4px 0px 0px #c48600",
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98, y: 4 }}
                whileFocus={{
                  outline: "2px solid #1ba8ff",
                  outlineOffset: "2px",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 bg-[#ffae00] text-white rounded-xl shadow-[0px_6px_0px_0px_#c48600] transition-all duration-200 ease-out font-semibold leading-6 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#1ba8ff] focus:ring-offset-2"
                aria-label="Join waitlist"
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
      <section className="w-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-80px)] py-8 sm:py-0 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="space-y-6 sm:space-y-8"
          >
            <h1
              className="font-bold text-[#003658] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight"
              style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
            >
              Learn powerful vocabulary in just{" "}
              <motion.span
                className="text-[#1ba8ff]  relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
              className="space-y-4 sm:space-y-5"
            >
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 sm:gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                    <path
                      d="M6 10L9 13L14 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <p
                  className="font-medium text-[#003658] text-sm sm:text-base md:text-lg lg:text-xl"
                  style={{ lineHeight: "1.5" }}
                >
                  Set your personalized vocab level
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 sm:gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                    <path
                      d="M6 10L9 13L14 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <p
                  className="font-medium text-[#003658] text-sm sm:text-base md:text-lg lg:text-xl"
                  style={{ lineHeight: "1.5" }}
                >
                  Learn words in context with interest-based stories
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 sm:gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                    <path
                      d="M6 10L9 13L14 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <p
                  className="font-medium text-[#003658] text-sm sm:text-base md:text-lg lg:text-xl"
                  style={{ lineHeight: "1.5" }}
                >
                  Retain with adaptive spaced repetition
                </p>
              </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-2">
              <motion.a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("features");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="font-semibold text-center text-base sm:text-lg text-[#003658]/70 hover:text-[#003658] transition-colors duration-200 flex items-center gap-2"
                style={{ lineHeight: "1.5" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See how it works
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block"
                >
                  <path
                    d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z"
                    fill="currentColor"
                  />
                </svg>
              </motion.a>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{
                  y: 2,
                  boxShadow: "0px 4px 0px 0px #c48600",
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98, y: 4 }}
                whileFocus={{
                  outline: "2px solid #1ba8ff",
                  outlineOffset: "2px",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#ffae00] text-white rounded-xl shadow-[0px_6px_0px_0px_#c48600] transition-all duration-200 ease-out font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#1ba8ff] focus:ring-offset-2"
                style={{ lineHeight: "1.5" }}
                aria-label="Join waitlist"
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
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-[320px] sm:max-w-[360px]"
            >
              <Image
                src={mobileMockup}
                alt="Grocab mobile app mockup showing dictionary interface"
                width={360}
                className="w-full h-auto rounded-[2.5rem] shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 1: Save words from web */}
      <section
        id="features"
        className="w-full bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-4">
                <span
                  className="inline-block text-[#1BA8FF] font-bold uppercase tracking-wider text-xs sm:text-sm"
                  style={{
                    lineHeight: "1.4",
                    letterSpacing: "1.5px",
                  }}
                >
                  <span className="text-gray-500 opacity-60 font-semibold">
                    01/
                  </span>
                  <span className="text-[#1BA8FF]"> SAVE</span>
                </span>
                <h2
                  className="font-bold text-[#003658] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight"
                  style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
                >
                  Save words from anywhere or generate new ones instantly
                </h2>
              </div>
              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700"
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
                className="space-y-4 sm:space-y-5"
              >
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
                    style={{ lineHeight: "1.5" }}
                  >
                    Free chrome extension
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
                    style={{ lineHeight: "1.5" }}
                  >
                    Generate words from your custom topics
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
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
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full overflow-hidden"
            >
              <Image
                src={thirdSectionImage}
                alt="Grocab save words from web interface"
                className="w-full h-auto"
                priority
              />
            </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Daily Personalized Read */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-4">
                <span
                  className="inline-block text-[#1BA8FF] font-bold uppercase tracking-wider text-xs sm:text-sm"
                  style={{
                    lineHeight: "1.4",
                    letterSpacing: "1.5px",
                  }}
                >
                  <span className="text-gray-500 opacity-60 font-semibold">
                    02/
                  </span>
                  <span className="text-[#1BA8FF]"> LEARN</span>
                </span>
                <h2
                  className="font-bold text-[#003658] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight"
                  style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
                >
                  Learn your words with tailored daily reads
                </h2>
              </div>
              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700"
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
                className="space-y-4 sm:space-y-5"
              >
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
                    style={{ lineHeight: "1.5" }}
                  >
                    Set your story time (2min, 5min, 10min)
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
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
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full overflow-hidden"
              >
                <Image
                  src={storyFrame1}
                  alt="Grocab story frame showing personalized reading interface"
                  className="w-full h-auto"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 3: Byte-sized exercises */}
      <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-4">
                <span
                  className="inline-block text-[#1BA8FF] font-bold uppercase tracking-wider text-xs sm:text-sm"
                  style={{
                    lineHeight: "1.4",
                    letterSpacing: "1.5px",
                  }}
                >
                  <span className="text-gray-500 opacity-60 font-semibold">
                    03/
                  </span>
                  <span className="text-[#1BA8FF]"> REMEMBER</span>
                </span>
                <h2
                  className="font-bold text-[#003658] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight"
                  style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
                >
                  Remember forever with byte sized exercises
                </h2>
              </div>
              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700"
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
                className="space-y-4 sm:space-y-5"
              >
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
                    style={{ lineHeight: "1.5" }}
                  >
                    Smart anki style spaced repetition
                  </p>
                </motion.div>
                
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
                    style={{ lineHeight: "1.5" }}
                  >
                    Simple recall and usage checks
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInLeft}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1BA8FF" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg lg:text-xl"
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
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full overflow-hidden"
            >
              <Image
                src={secondSectionImage}
                alt="Grocab byte-sized exercises interface"
                className="w-full h-auto"
                priority
              />
            </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32 bg-[#EEF2F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
          >
            {/* Card 1: Set topics */}
            <motion.div
              variants={fadeInUp}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative w-full overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "425/275" }}
                >
                  <Image
                    src={featureCard1}
                    alt="Set topics you're interested in"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-8 md:pb-10">
                <h3
                  className="font-bold text-[#003658] mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight"
                  style={{ lineHeight: "1.2", letterSpacing: "-0.02em" }}
                >
                  Learn on your own terms
                </h3>
                <p
                  className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl font-medium"
                  style={{ lineHeight: "1.6" }}
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
                y: -8,
                scale: 1.02,
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative w-full overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "425/275" }}
                >
                  <Image
                    src={featureCard2}
                    alt="Set custom difficulty levels"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-8 md:pb-10">
                <h3
                  className="font-bold text-[#003658] mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight"
                  style={{ lineHeight: "1.2", letterSpacing: "-0.02em" }}
                >
                  Set custom difficulty levels
                </h3>
                <p
                  className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl font-medium"
                  style={{ lineHeight: "1.6" }}
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
                y: -8,
                scale: 1.02,
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative w-full overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "425/275" }}
                >
                  <Image
                    src={featureCard3}
                    alt="Watch your garden grow"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-8 md:pb-10">
                <h3
                  className="font-bold text-[#003658] mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight"
                  style={{ lineHeight: "1.2", letterSpacing: "-0.02em" }}
                >
                  Watch your garden grow
                </h3>
                <p
                  className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl font-medium"
                  style={{ lineHeight: "1.6" }}
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
        className="w-full py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32"
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
            className="font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight"
            style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
          >
            Join the waitlist
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-medium"
            style={{ lineHeight: "1.5" }}
          >
            Join over 500 early adopters and get exclusive access when we launch.
          </motion.p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 max-w-2xl mx-auto"
          >
            <motion.input
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
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm sm:text-base md:text-lg font-medium shadow-lg placeholder:text-gray-400"
              required
              aria-label="Email address"
            />

            <div className="space-y-4">
              <label className="block text-sm sm:text-base font-semibold text-white/95 mb-3">
                P.S. Which feature are you most excited for?
              </label>
              <div className="space-y-3">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    excitedFeature === "saving-words"
                      ? "border-white bg-white/20 shadow-lg backdrop-blur-sm"
                      : "border-white/20 hover:border-white/40 bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="excitedFeature-cta"
                      value="saving-words"
                      checked={excitedFeature === "saving-words"}
                      onChange={(e) => {
                        setExcitedFeature(e.target.value);
                        setOtherFeatureText("");
                        if (state === "success" || state === "error") {
                          setState("idle");
                          setErrorMessage("");
                        }
                      }}
                      disabled={state === "loading"}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        excitedFeature === "saving-words"
                          ? "border-white bg-white"
                          : "border-white/60 bg-white/20"
                      }`}
                    >
                      {excitedFeature === "saving-words" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2.5 h-2.5 rounded-full bg-[#1ba8ff]"
                        />
                      )}
                    </div>
                  </div>
                  <span className={`font-medium text-sm sm:text-base flex-1 ${
                    excitedFeature === "saving-words" ? "text-white" : "text-white/90"
                  }`}>
                    Saving words from around the web
                  </span>
                </motion.label>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    excitedFeature === "daily-reads"
                      ? "border-white bg-white/20 shadow-lg backdrop-blur-sm"
                      : "border-white/20 hover:border-white/40 bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="excitedFeature-cta"
                      value="daily-reads"
                      checked={excitedFeature === "daily-reads"}
                      onChange={(e) => {
                        setExcitedFeature(e.target.value);
                        setOtherFeatureText("");
                        if (state === "success" || state === "error") {
                          setState("idle");
                          setErrorMessage("");
                        }
                      }}
                      disabled={state === "loading"}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        excitedFeature === "daily-reads"
                          ? "border-white bg-white"
                          : "border-white/60 bg-white/20"
                      }`}
                    >
                      {excitedFeature === "daily-reads" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2.5 h-2.5 rounded-full bg-[#1ba8ff]"
                        />
                      )}
                    </div>
                  </div>
                  <span className={`font-medium text-sm sm:text-base flex-1 ${
                    excitedFeature === "daily-reads" ? "text-white" : "text-white/90"
                  }`}>
                    Daily personalized reads on topics I like
                  </span>
                </motion.label>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    excitedFeature === "spaced-repetition"
                      ? "border-white bg-white/20 shadow-lg backdrop-blur-sm"
                      : "border-white/20 hover:border-white/40 bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="excitedFeature-cta"
                      value="spaced-repetition"
                      checked={excitedFeature === "spaced-repetition"}
                      onChange={(e) => {
                        setExcitedFeature(e.target.value);
                        setOtherFeatureText("");
                        if (state === "success" || state === "error") {
                          setState("idle");
                          setErrorMessage("");
                        }
                      }}
                      disabled={state === "loading"}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        excitedFeature === "spaced-repetition"
                          ? "border-white bg-white"
                          : "border-white/60 bg-white/20"
                      }`}
                    >
                      {excitedFeature === "spaced-repetition" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2.5 h-2.5 rounded-full bg-[#1ba8ff]"
                        />
                      )}
                    </div>
                  </div>
                  <span className={`font-medium text-sm sm:text-base flex-1 ${
                    excitedFeature === "spaced-repetition" ? "text-white" : "text-white/90"
                  }`}>
                    Spaced repetition for remembering words I learned
                  </span>
                </motion.label>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    excitedFeature === "other"
                      ? "border-white bg-white/20 shadow-lg backdrop-blur-sm"
                      : "border-white/20 hover:border-white/40 bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="excitedFeature-cta"
                      value="other"
                      checked={excitedFeature === "other"}
                      onChange={(e) => {
                        setExcitedFeature(e.target.value);
                        if (state === "success" || state === "error") {
                          setState("idle");
                          setErrorMessage("");
                        }
                      }}
                      disabled={state === "loading"}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        excitedFeature === "other"
                          ? "border-white bg-white"
                          : "border-white/60 bg-white/20"
                      }`}
                    >
                      {excitedFeature === "other" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2.5 h-2.5 rounded-full bg-[#1ba8ff]"
                        />
                      )}
                    </div>
                  </div>
                  <span className={`font-medium text-sm sm:text-base flex-1 ${
                    excitedFeature === "other" ? "text-white" : "text-white/90"
                  }`}>
                    Other
                  </span>
                </motion.label>
              </div>
              {excitedFeature === "other" && (
                <motion.input
                  type="text"
                  value={otherFeatureText}
                  onChange={(e) => {
                    setOtherFeatureText(e.target.value);
                    if (state === "success" || state === "error") {
                      setState("idle");
                      setErrorMessage("");
                    }
                  }}
                  placeholder="Specify feature or feature request"
                  disabled={state === "loading"}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm sm:text-base font-medium shadow-lg placeholder:text-gray-400 bg-white"
                  required={excitedFeature === "other"}
                  aria-label="Other feature specification"
                />
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{
                y: 2,
                boxShadow: "0px 4px 0px 0px #c48600",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98, y: 4 }}
              whileFocus={{
                outline: "2px solid white",
                outlineOffset: "2px",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-[#ffae00] text-white rounded-xl shadow-[0px_6px_0px_0px_#c48600] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out font-semibold leading-6 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              aria-label="Join waitlist"
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/95 backdrop-blur-sm border-2 border-red-300 rounded-xl text-red-700 text-base sm:text-lg font-medium max-w-2xl mx-auto shadow-lg"
            >
              {errorMessage}
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/95 backdrop-blur-sm border-2 border-green-300 rounded-xl text-green-700 text-base sm:text-lg font-medium max-w-2xl mx-auto shadow-lg"
            >
              You&apos;re on the list! We&apos;ll be in touch soon.
            </motion.div>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 sm:p-10"
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
                className="font-bold text-[#003658] mb-4 text-3xl sm:text-4xl tracking-tight"
                style={{ lineHeight: "1.2", letterSpacing: "-0.02em" }}
              >
                Join the waitlist
              </h2>
              <p
                className="text-gray-600 mb-8 text-lg"
                style={{ lineHeight: "1.5" }}
              >
                Get exclusive access when we launch.
              </p>

              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
                className="flex flex-col gap-10"
              >
                <motion.input
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
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#1ba8ff]/20 focus:border-[#1ba8ff] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-base font-medium shadow-sm placeholder:text-gray-400"
                  required
                  autoFocus
                  aria-label="Email address"
                />

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-[#003658] mb-3">
                   P.S. Which feature are you most excited for?
                  </label>
                  <div className="space-y-3">
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        excitedFeature === "saving-words"
                          ? "border-[#1ba8ff] bg-[#1ba8ff]/5 shadow-md"
                          : "border-gray-200 hover:border-[#1ba8ff]/50 bg-gray-50/50"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="excitedFeature"
                          value="saving-words"
                          checked={excitedFeature === "saving-words"}
                          onChange={(e) => {
                            setExcitedFeature(e.target.value);
                            setOtherFeatureText("");
                            if (state === "success" || state === "error") {
                              setState("idle");
                              setErrorMessage("");
                            }
                          }}
                          disabled={state === "loading"}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            excitedFeature === "saving-words"
                              ? "border-[#1ba8ff] bg-[#1ba8ff]"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {excitedFeature === "saving-words" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 rounded-full bg-white"
                            />
                          )}
                        </div>
                      </div>
                      <span className={`font-medium text-sm sm:text-base flex-1 ${
                        excitedFeature === "saving-words" ? "text-[#003658]" : "text-gray-700"
                      }`}>
                        Saving words from around the web
                      </span>
                    </motion.label>
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        excitedFeature === "daily-reads"
                          ? "border-[#1ba8ff] bg-[#1ba8ff]/5 shadow-md"
                          : "border-gray-200 hover:border-[#1ba8ff]/50 bg-gray-50/50"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="excitedFeature"
                          value="daily-reads"
                          checked={excitedFeature === "daily-reads"}
                          onChange={(e) => {
                            setExcitedFeature(e.target.value);
                            setOtherFeatureText("");
                            if (state === "success" || state === "error") {
                              setState("idle");
                              setErrorMessage("");
                            }
                          }}
                          disabled={state === "loading"}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            excitedFeature === "daily-reads"
                              ? "border-[#1ba8ff] bg-[#1ba8ff]"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {excitedFeature === "daily-reads" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 rounded-full bg-white"
                            />
                          )}
                        </div>
                      </div>
                      <span className={`font-medium text-sm sm:text-base flex-1 ${
                        excitedFeature === "daily-reads" ? "text-[#003658]" : "text-gray-700"
                      }`}>
                        Daily personalized reads on topics I enjoy
                      </span>
                    </motion.label>
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        excitedFeature === "spaced-repetition"
                          ? "border-[#1ba8ff] bg-[#1ba8ff]/5 shadow-md"
                          : "border-gray-200 hover:border-[#1ba8ff]/50 bg-gray-50/50"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="excitedFeature"
                          value="spaced-repetition"
                          checked={excitedFeature === "spaced-repetition"}
                          onChange={(e) => {
                            setExcitedFeature(e.target.value);
                            setOtherFeatureText("");
                            if (state === "success" || state === "error") {
                              setState("idle");
                              setErrorMessage("");
                            }
                          }}
                          disabled={state === "loading"}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            excitedFeature === "spaced-repetition"
                              ? "border-[#1ba8ff] bg-[#1ba8ff]"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {excitedFeature === "spaced-repetition" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 rounded-full bg-white"
                            />
                          )}
                        </div>
                      </div>
                      <span className={`font-medium text-sm sm:text-base flex-1 ${
                        excitedFeature === "spaced-repetition" ? "text-[#003658]" : "text-gray-700"
                      }`}>
                        Spaced repetition for remembering words I learned
                      </span>
                    </motion.label>
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        excitedFeature === "other"
                          ? "border-[#1ba8ff] bg-[#1ba8ff]/5 shadow-md"
                          : "border-gray-200 hover:border-[#1ba8ff]/50 bg-gray-50/50"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="excitedFeature"
                          value="other"
                          checked={excitedFeature === "other"}
                          onChange={(e) => {
                            setExcitedFeature(e.target.value);
                            if (state === "success" || state === "error") {
                              setState("idle");
                              setErrorMessage("");
                            }
                          }}
                          disabled={state === "loading"}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            excitedFeature === "other"
                              ? "border-[#1ba8ff] bg-[#1ba8ff]"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {excitedFeature === "other" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 rounded-full bg-white"
                            />
                          )}
                        </div>
                      </div>
                      <span className={`font-medium text-sm sm:text-base flex-1 ${
                        excitedFeature === "other" ? "text-[#003658]" : "text-gray-700"
                      }`}>
                        Other
                      </span>
                    </motion.label>
                  </div>
                  {excitedFeature === "other" && (
                    <motion.input
                      type="text"
                      value={otherFeatureText}
                      onChange={(e) => {
                        setOtherFeatureText(e.target.value);
                        if (state === "success" || state === "error") {
                          setState("idle");
                          setErrorMessage("");
                        }
                      }}
                      placeholder="Specify feature or feature request"
                      disabled={state === "loading"}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#1ba8ff]/20 focus:border-[#1ba8ff] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-base font-medium shadow-sm placeholder:text-gray-400"
                      required={excitedFeature === "other"}
                      aria-label="Other feature specification"
                    />
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{
                    y: 2,
                    boxShadow: "0px 4px 0px 0px #c48600",
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98, y: 4 }}
                  whileFocus={{
                    outline: "2px solid #1ba8ff",
                    outlineOffset: "2px",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#ffae00] text-white rounded-xl shadow-[0px_6px_0px_0px_#c48600] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#1ba8ff] focus:ring-offset-2"
                  disabled={state === "loading"}
                  aria-label="Join waitlist"
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-base font-medium"
                >
                  {errorMessage}
                </motion.div>
              )}

              {state === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 text-base font-medium"
                >
                  You&apos;re on the list! We&apos;ll be in touch soon.
                </motion.div>
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
