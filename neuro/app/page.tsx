"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Activity, TrendingUp, Heart, CheckCircle2, Lock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">NeuroCare</h1>
          <p className="text-xl text-gray-700 mb-2">Software as a Medical Device (SAMD)</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered personalized care for children with neurodevelopmental disorders
          </p>
        </header>

        <div className="max-w-5xl mx-auto mb-16">
          <Card className="bg-white border-blue-200 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Digital Therapy at Home</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Track your child&apos;s daily behaviors, routines, and progress. Our AI analyzes the data and
                    provides personalized recommendations, exercises, and learning strategies—like having a digital
                    therapist or coach available 24/7.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/auth/sign-up">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button size="lg" variant="outline">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Track Progress</h3>
                      <p className="text-sm text-gray-600">Clear visualizations showing development over time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
                      <p className="text-sm text-gray-600">Personalized daily strategies based on your data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">HIPAA Compliant</h3>
                      <p className="text-sm text-gray-600">Medical-grade security protecting sensitive data</p>
                    </div>
                  </div>
                  {/* Added medication tracking, therapy sessions, and reminders */}
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Medication Tracking</h3>
                      <p className="text-sm text-gray-600">Keep track of all medications and dosages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Therapy Sessions</h3>
                      <p className="text-sm text-gray-600">Schedule and log therapy sessions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Reminders</h3>
                      <p className="text-sm text-gray-600">Set reminders for daily routines and appointments</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          <Card className="bg-white border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Child Profiles</h3>
              <p className="text-sm text-gray-600">Secure profiles for each child with detailed information</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Behavior Tracking</h3>
              <p className="text-sm text-gray-600">Log moods, triggers, and daily observations</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">Smart insights and personalized recommendations</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">HIPAA-compliant data protection standards</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-blue-600 border-blue-700 shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
              <p className="text-blue-100 mb-6">
                Create your secure account and begin tracking your child&apos;s development today
              </p>
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Create Free Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            <span className="font-semibold">SAMD (Software as a Medical Device)</span>
          </div>
          <p>HIPAA-compliant • Secure • Confidential</p>
          <div className="mt-2">
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy & HIPAA Compliance
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
