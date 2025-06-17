"use client"
import type React from "react"
import { motion, AnimatePresence } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { cn, getGreetingMessage } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"

interface FormStep {
    id: string
    question: string
    placeholder: string
    type: string
    value: string
    editable: boolean,
}

const initialSteps: FormStep[] = [
    {
        id: "email",
        question: "Confirm your email",
        placeholder: "",
        type: "email",
        value: "Rokat.dev@gmail.com",
        editable: false,
    },
    {
        id: "name",
        question: "What's your name?",
        placeholder: "Your full name",
        type: "text",
        value: "",
        editable: true,
    },
    {
        id: "username",
        question: "Pick a username",
        placeholder: "e.g. rokat.dev",
        type: "text",
        value: "",
        editable: true,
    },
    {
        id: "birthDate",
        question: "When were you born?",
        placeholder: "YYYY-MM-DD",
        type: "date",
        value: "",
        editable: true,
    },
    {
        id: "bio",
        question: "Tell us something about you",
        placeholder: "Just a short bio",
        type: "text",
        value: "",
        editable: true,
    },
]

export default function FormOnboardingPage({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [hasStarted, setHasStarted] = useState(false)
    const [showTransition, setShowTransition] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [steps, setSteps] = useState<FormStep[]>(initialSteps)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<FormStep[]>([])
    const [currentValue, setCurrentValue] = useState("")

    const currentStep = steps[currentStepIndex]
    const isLastStep = currentStepIndex === steps.length - 1

    const handleStart = () => {
        setHasStarted(true)
        setShowTransition(true)

        setTimeout(() => {
            setShowTransition(false)
            setShowForm(true)
        }, 2000)
    }

    useEffect(() => {
        setCurrentValue(currentStep.value || "")
    }, [currentStep])

    const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault()
        if (!currentValue.trim()) return

        const updatedStep = { ...currentStep, value: currentValue }
        const updatedSteps = [...steps]
        updatedSteps[currentStepIndex] = updatedStep

        setSteps(updatedSteps)

        const updatedCompletedSteps = updatedSteps.slice(0, currentStepIndex + 1)
        setCompletedSteps(updatedCompletedSteps)

        if (isLastStep) {
            console.log("Form completed:", updatedCompletedSteps)
            return
        }

        setCurrentStepIndex((prev) => prev + 1)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e)
        }
    }

    // Transition Screen
    if (hasStarted && showTransition) {
        return (
            <div
                className={cn("bg-[var(--bgLevel2)] min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8", className)}
                {...props}
            >
                <div className="flex justify-center gap-2 md:justify-start">
                    <div className="flex items-center space-x-3 fixed top-5 left-5">
                        <img
                            src={"/konekt-logo-full.png"}
                            className="w-32 h-auto block"
                        />
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-lg sm:max-w-xl md:max-w-2xl w-full"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-blue-500 to-fuchsia-500 leading-tight"
                    >
                        Let's get to know you
                    </motion.p>
                </motion.div>
            </div>
        )
    }

    // Welcome Screen
    if (!hasStarted) {
        return (
            <div
                className={cn("bg-[var(--bgLevel2)] min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8", className)}
                {...props}
            >
                <div className="flex justify-center gap-2 md:justify-start">
                    <div className="flex items-center space-x-3 fixed top-5 left-5">
                        <img
                            src={"/konekt-logo-full.png"}
                            className="w-32 h-auto block"
                        />
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-center max-w-lg sm:max-w-xl md:max-w-2xl w-full"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--textNeutral)] mb-4 sm:mb-6"
                    >
                        Welcome!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg sm:text-xl md:text-2xl text-[var(--textNeutralAlt)] mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2"
                    >
                        Before we continue, we'd love to know you better.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Button
                            onClick={handleStart}
                            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-full px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg font-medium tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs sm:w-auto"
                        >
                            CONTINUE
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    // Form Steps
    if (showForm) {
        return (
            <div className={cn("bg-[var(--bgLevel2)] min-h-screen flex flex-col px-4 py-6 sm:px-6 sm:py-8 md:px-8", className)} {...props}>
                {/* Header */}
                <div className="flex justify-center gap-2 md:justify-start">
                    <div className="flex items-center space-x-3 fixed top-5 left-5">
                        <img
                            src={"/konekt-logo-full.png"}
                            className="w-32 h-auto block"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col flex-1 justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {completedSteps.length > 0 &&
                            (() => {
                                const lastStep = completedSteps[completedSteps.length - 1]
                                const message = getGreetingMessage(lastStep)
                                return message ? (
                                    <motion.div
                                        key={lastStep.id}
                                        className="text-[var(--textNeutral)] font-semibold text-lg sm:text-xl md:text-2xl text-center px-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                                            {message}
                                        </ReactMarkdown>
                                    </motion.div>
                                ) : null
                            })()}
                    </AnimatePresence>

                    {/* Current Step */}
                    <AnimatePresence mode="wait">
                        {currentStep && (
                            <motion.div
                                key={currentStep.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-4 sm:space-y-6 max-w-lg sm:max-w-xl w-full mx-auto"
                            >
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--textNeutral)] text-center px-2 leading-tight">
                                    {currentStep.question}
                                </h1>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="px-2 sm:px-4 md:px-6 lg:px8">
                                        {!currentStep.editable ? (
                                            <div className="w-full text-base sm:text-lg md:text-xl font-medium tracking-tight py-3 sm:py-4 px-2 text-[var(--neutralFillAlt)] border-b border-gray-300 min-h-[3rem] sm:min-h-[3.5rem] flex items-center">
                                                {currentStep.value}
                                            </div>
                                        ) : (
                                            <Input
                                                type={currentStep.type}
                                                value={currentValue}
                                                onChange={(e) => setCurrentValue(e.target.value)}
                                                onKeyDown={handleKeyPress}
                                                placeholder={currentStep.placeholder}
                                                autoFocus
                                                className={cn(
                                                    "w-full text-base sm:text-lg md:text-xl font-medium tracking-tight",
                                                    "border-0 focus:outline-none bg-transparent",
                                                    "placeholder:text-[var(--greyFill)] py-3 sm:py-4 md:py-6 px-2 rounded-2xl",
                                                    "min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem]"
                                                )}
                                            />
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <footer className="mt-8 sm:mt-10 w-full">
                    {/* Mobile Footer (visible on mobile and tablet) */}
                    <div className="flex flex-col items-center gap-3 sm:gap-4 xl:hidden">
                        <Button
                            onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                            variant="ghost"
                            disabled={currentStepIndex < 1}
                            className="bg-[var(--white)] hover:bg-[var(--white)]/80 text-gray-900 border border-gray-200 rounded-full px-8 py-4 text-sm font-medium disabled:opacity-50 transition-all duration-200"
                        >
                            ← Previous Step
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            variant="ghost"
                            disabled={!currentValue.trim()}
                            className="bg-[var(--white)] hover:bg-[var(--white)]/80 text-gray-900 border border-gray-200 rounded-full px-8 py-4 text-sm font-medium disabled:opacity-50 transition-all duration-200"
                        >
                            {isLastStep ? "FINISH" : "Next Step →"}
                        </Button>

                        {/* Progress indicator for mobile/tablet */}
                        <p className="text-xs sm:text-sm text-gray-600 tracking-wider mt-2">
                            {String(currentStepIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                        </p>
                    </div>

                    {/* Desktop Footer (visible on large screens only) */}
                    <div className="hidden xl:flex justify-between items-center w-full">
                        <Button
                            onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                            variant="ghost"
                            disabled={currentStepIndex < 1}
                            className="cursor-pointer bg-[var(--white)] hover:bg-[var(--white)]/80 text-gray-900 border border-gray-200 rounded-full px-8 py-4 text-sm font-medium disabled:opacity-50 transition-all duration-200"
                        >
                            ← Previous Step
                        </Button>

                        <p className="text-sm text-[var(--textNeutral)] tracking-wider">
                            {String(currentStepIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                        </p>

                        <Button
                            onClick={handleSubmit}
                            variant="ghost"
                            disabled={!currentValue.trim()}
                            className="cursor-pointer bg-[var(--white)] hover:bg-[var(--white)]/80 text-gray-900 border border-gray-200 rounded-full px-8 py-4 text-sm font-medium disabled:opacity-50 transition-all duration-200"
                        >
                            {isLastStep ? "FINISH" : "Next Step →"}
                        </Button>
                    </div>
                </footer>
            </div>
        )
    }

    // Fallback (should not happen)
    return null
}