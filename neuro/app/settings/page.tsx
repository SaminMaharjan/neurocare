import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, Shield, Trash2, FileText, Lock } from "lucide-react"
import Link from "next/link"
import SignOutButton from "@/components/sign-out-button"
import DeleteAccountButton from "@/components/delete-account-button"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="link" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account, security, and data privacy</p>
        </div>

        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>HIPAA Compliance:</strong> Your data is encrypted, secure, and compliant with medical privacy
            standards. You have full control over your information.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{profile?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium text-gray-900">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Created</p>
                <p className="font-medium text-gray-900">{new Date(profile?.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                Data Portability
              </CardTitle>
              <CardDescription>Export your data in compliance with HIPAA Right of Access</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Download all your data including child profiles, behavior logs, activities, and AI recommendations in a
                secure JSON format.
              </p>
              <Link href="/api/data-export">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Audit Log
              </CardTitle>
              <CardDescription>Recent account activity (HIPAA audit trail)</CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs && auditLogs.length > 0 ? (
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 text-sm"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{log.action}</span>
                        <span className="text-gray-600"> on </span>
                        <span className="text-gray-900">{log.table_name}</span>
                      </div>
                      <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No audit logs available</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-600" />
                Privacy & Compliance
              </CardTitle>
              <CardDescription>Data protection and regulatory information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Data Encryption</h4>
                  <p className="text-sm text-gray-600">
                    All data is encrypted at rest and in transit using industry-standard protocols
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">HIPAA Compliant</h4>
                  <p className="text-sm text-gray-600">
                    Software as a Medical Device (SAMD) with full HIPAA compliance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Row-Level Security</h4>
                  <p className="text-sm text-gray-600">
                    Database-level access controls ensure you can only access your own data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Audit Trail</h4>
                  <p className="text-sm text-gray-600">
                    Complete logging of all data access for compliance and security
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Sign out of your account</CardDescription>
            </CardHeader>
            <CardContent>
              <SignOutButton />
            </CardContent>
          </Card>

          <Card className="bg-white border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription>Permanently delete your account and all associated data</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  <strong>Warning:</strong> This action cannot be undone. All child profiles, behavior logs, activities,
                  and recommendations will be permanently deleted.
                </AlertDescription>
              </Alert>
              <DeleteAccountButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
