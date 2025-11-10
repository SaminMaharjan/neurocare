import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy & HIPAA Compliance</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="bg-white border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Software as a Medical Device (SAMD)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              SAMD Care is classified as a Software as a Medical Device (SAMD) and is designed to comply with the Health
              Insurance Portability and Accountability Act (HIPAA) and other applicable healthcare data protection
              regulations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This application handles Protected Health Information (PHI) related to children with neurodevelopmental
              disorders. We take the security and privacy of this sensitive information extremely seriously.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Data Security & Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Encryption at Rest</h4>
                <p className="text-sm leading-relaxed">
                  All data stored in our database is encrypted using AES-256 encryption, the same standard used by
                  financial institutions and government agencies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Encryption in Transit</h4>
                <p className="text-sm leading-relaxed">
                  All data transmitted between your device and our servers uses TLS 1.3 encryption to prevent
                  interception.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Row-Level Security (RLS)</h4>
                <p className="text-sm leading-relaxed">
                  Database-level access controls ensure that users can only access their own data. Even our system
                  administrators cannot access your PHI without proper authorization.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                What Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  <strong>Account Information:</strong> Your name, email address, and authentication credentials
                </li>
                <li>
                  <strong>Child Profile Data:</strong> Child&apos;s first name, date of birth, diagnosis information,
                  and notes
                </li>
                <li>
                  <strong>Behavior Logs:</strong> Daily observations including mood, energy levels, sleep quality,
                  behaviors, triggers, and challenges
                </li>
                <li>
                  <strong>Activities:</strong> Therapy sessions, exercises, learning activities, and engagement metrics
                </li>
                <li>
                  <strong>AI-Generated Recommendations:</strong> Personalized suggestions based on logged data
                </li>
                <li>
                  <strong>Audit Logs:</strong> Records of data access for HIPAA compliance (timestamps, actions, IP
                  addresses)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Your Rights Under HIPAA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Right of Access</h4>
                <p className="text-sm leading-relaxed">
                  You have the right to access and receive a copy of all your PHI. Use the data export feature in your
                  account settings to download all your data in a portable JSON format.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Right to Amend</h4>
                <p className="text-sm leading-relaxed">
                  You can edit or update any information in your account at any time through the application interface.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Right to Delete</h4>
                <p className="text-sm leading-relaxed">
                  You can permanently delete your account and all associated data at any time. This action is
                  irreversible and all data will be securely erased.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Right to an Accounting of Disclosures</h4>
                <p className="text-sm leading-relaxed">
                  View your audit log in account settings to see all access to your data, including timestamps and
                  actions taken.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Data Sharing & Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p className="text-sm leading-relaxed">
                <strong>We do not sell, rent, or share your PHI with third parties.</strong> Your data is used solely
                for the purpose of providing personalized care recommendations through our AI analysis.
              </p>
              <p className="text-sm leading-relaxed">
                AI processing is conducted using secure, HIPAA-compliant infrastructure. No PHI is retained by AI model
                providers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="text-sm leading-relaxed">
                Your data is retained for as long as your account is active. Upon account deletion, all data is
                permanently removed from our systems within 30 days, in compliance with HIPAA requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="text-sm leading-relaxed">
                For questions about privacy, data security, or to exercise your HIPAA rights, please contact our Privacy
                Officer at:
              </p>
              <p className="text-sm font-medium mt-2">privacy@samdcare.example.com</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
