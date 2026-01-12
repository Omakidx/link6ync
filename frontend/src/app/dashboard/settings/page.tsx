"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store";
import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Alert,
  Badge,
} from "@/components/ui";
import { setup2FA, verify2FA, disable2FA } from "@/lib/api";
import { Shield, Smartphone, Lock, Eye, EyeOff, KeyRound, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, refreshAuth } = useAuthStore();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle2FASetup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await setup2FA();
      setQrCodeUrl(response.otpauthUrl);
      setSecret(response.secret);
      setShow2FASetup(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to setup 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await verify2FA({
        twoFactorCode: verificationCode,
      });
      toast.success("Two-factor authentication enabled!");
      setShow2FASetup(false);
      setVerificationCode("");
      await refreshAuth();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (disableCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await disable2FA(disableCode);
      toast.success("Two-factor authentication disabled");
      setShowDisable2FAModal(false);
      setDisableCode("");
      await refreshAuth();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account security and preferences</p>
        </div>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </div>
              <Badge variant={user?.twoFactorEnabled ? "success" : "default"}>
                {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {!user?.twoFactorEnabled && !show2FASetup && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Protect your account</h3>
                <p className="text-gray-600 mb-6">
                  Two-factor authentication adds an extra layer of security by requiring a code from your authenticator
                  app.
                </p>
                <Button onClick={handle2FASetup} isLoading={isLoading}>
                  Enable Two-Factor Authentication
                </Button>
              </div>
            )}

            {show2FASetup && (
              <div className="space-y-6">
                <Alert variant="info">
                  Scan the QR code with your authenticator app (like Google Authenticator or Authy), then enter the
                  6-digit code.
                </Alert>

                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <QRCodeSVG value={qrCodeUrl} size={200} />
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Can&apos;t scan? Enter this code manually:</p>
                    <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm">{secret}</code>
                  </div>
                </div>

                <div className="max-w-xs mx-auto">
                  <Input
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    leftIcon={<KeyRound className="w-5 h-5" />}
                  />
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShow2FASetup(false);
                      setVerificationCode("");
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleVerify2FA} isLoading={isLoading}>
                    Verify & Enable
                  </Button>
                </div>
              </div>
            )}

            {user?.twoFactorEnabled && (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900">Two-factor authentication is enabled</h3>
                      <p className="text-sm text-green-700">
                        Your account is protected with an extra layer of security
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDisable2FAModal(true)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Disable 2FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Password
            </CardTitle>
            <CardDescription>
              {user?.isOAuthUser
                ? "You signed up with Google OAuth and don't have a password set"
                : "Update your password to keep your account secure"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user?.isOAuthUser ? (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  You signed in using Google OAuth. To set a password for your account, you can use the "Forgot
                  Password" feature from the login page.
                </p>
              </div>
            ) : !showPasswordSection ? (
              <Button variant="outline" onClick={() => setShowPasswordSection(true)}>
                Change Password
              </Button>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  leftIcon={<Lock className="w-5 h-5" />}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  leftIcon={<Lock className="w-5 h-5" />}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                  leftIcon={<Lock className="w-5 h-5" />}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => {
                      toast.success("Password updated successfully!");
                      setShowPasswordSection(false);
                    }}
                  >
                    Update Password
                  </Button>
                  <Button variant="outline" onClick={() => setShowPasswordSection(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Sessions
            </CardTitle>
            <CardDescription>Manage your active sessions and sign out from other devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-500">This device • Last active: Now</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="text-red-600 hover:bg-red-50">
                Sign out all other sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disable 2FA Modal */}
      {showDisable2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Disable Two-Factor Authentication</h3>
              <button
                onClick={() => {
                  setShowDisable2FAModal(false);
                  setDisableCode("");
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Alert variant="warning" className="mb-4">
              This will make your account less secure. Enter your current 6-digit code to confirm.
            </Alert>

            {error && (
              <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <div className="mb-6">
              <Input
                label="Verification Code"
                placeholder="Enter 6-digit code"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                leftIcon={<KeyRound className="w-5 h-5" />}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDisable2FAModal(false);
                  setDisableCode("");
                  setError(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleDisable2FA} isLoading={isLoading} className="flex-1 bg-red-600 hover:bg-red-700">
                Disable 2FA
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
