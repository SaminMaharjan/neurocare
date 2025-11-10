import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SAMD Care</h1>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Check your email</CardTitle>
              <CardDescription className="text-center">We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-sm text-gray-700">
                  Please check your email inbox and click the confirmation link to activate your account. You&apos;ll be
                  able to sign in once your email is verified.
                </AlertDescription>
              </Alert>
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Didn&apos;t receive an email? Check your spam folder.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
