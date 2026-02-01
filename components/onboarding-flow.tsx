"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Calendar, MessageSquare, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to EduFlow",
    subtitle: "Your complete school management solution",
    description:
      "A powerful platform designed to streamline education management for teachers, students, and administrators.",
    icon: GraduationCap,
    features: ["Course Management", "Student Portal", "Real-time Updates", "Easy Integration"],
  },
  {
    id: 2,
    title: "Manage Courses Effortlessly",
    subtitle: "Everything you need in one place",
    description:
      "Create, organize, and deliver engaging courses. Upload materials, set assignments, and track progress with ease.",
    icon: BookOpen,
    features: ["Course Builder", "Rich Content Support", "Assignment Tracking", "Grading System"],
  },
  {
    id: 3,
    title: "Connect with Students",
    subtitle: "Foster meaningful engagement",
    description:
      "Built-in messaging and discussion forums keep everyone connected. Share announcements and communicate in real-time.",
    icon: MessageSquare,
    features: ["Direct Messaging", "Discussion Forums", "Announcements", "Notifications"],
  },
  {
    id: 4,
    title: "Track Attendance & Performance",
    subtitle: "Data-driven insights",
    description: "Monitor attendance, grades, and student progress with comprehensive analytics and reporting tools.",
    icon: Calendar,
    features: ["Attendance Tracking", "Grade Management", "Performance Analytics", "Report Generation"],
  },
  {
    id: 5,
    title: "Ready to Get Started?",
    subtitle: "Join thousands of educators",
    description:
      "Create your account and start transforming education today. Choose your role to get personalized onboarding.",
    icon: Users,
    features: ["Teacher Dashboard", "Student Portal", "Admin Console", "Parent Access"],
  },
]

const userRoles = [
  { id: "teacher", label: "Teacher", description: "Manage courses and students" },
  { id: "student", label: "Student", description: "Access courses and materials" },
  { id: "admin", label: "Administrator", description: "Oversee school operations" },
  { id: "parent", label: "Parent", description: "Monitor student progress" },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [direction, setDirection] = useState(1)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGetStarted = () => {
    if (selectedRole) {
      // Redirect to dashboard based on role
      console.log(`Starting onboarding for: ${selectedRole}`)
      alert(`Welcome! Redirecting to your ${selectedRole} dashboard...`)
    }
  }

  const step = onboardingSteps[currentStep]
  const Icon = step.icon
  const isLastStep = currentStep === onboardingSteps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Visual */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -50 }}
                transition={{ duration: 0.3 }}
                className="bg-primary/5 rounded-3xl p-8 lg:p-12 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="bg-primary rounded-full p-8 mb-8">
                  <Icon className="w-16 h-16 text-primary-foreground" />
                </div>
                <div className="space-y-4 w-full">
                  {step.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-lg">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step indicator */}
                <div className="flex gap-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "bg-primary w-12"
                          : index < currentStep
                            ? "bg-primary/50 w-8"
                            : "bg-border w-8"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2 text-balance">{step.title}</h1>
                    <p className="text-xl text-primary font-medium">{step.subtitle}</p>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{step.description}</p>
                </div>

                {/* Role selection (last step only) */}
                {isLastStep && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-3 mt-6"
                  >
                    {userRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedRole === role.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div className="font-semibold text-foreground">{role.label}</div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex gap-4 pt-4">
                  {currentStep > 0 && (
                    <Button variant="outline" size="lg" onClick={handleBack} className="flex-1 bg-transparent">
                      Back
                    </Button>
                  )}
                  {!isLastStep ? (
                    <Button size="lg" onClick={handleNext} className="flex-1 group">
                      Next
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handleGetStarted} disabled={!selectedRole} className="flex-1 group">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>

                {/* Skip link */}
                {!isLastStep && (
                  <button
                    onClick={() => setCurrentStep(onboardingSteps.length - 1)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip onboarding
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
