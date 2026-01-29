'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, FileText, CheckCircle2 } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(1, 75, 137, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(1, 75, 137, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo/logo.png" 
              alt="HostelVoice Logo" 
              width={2000} 
              height={70} 
              className="h-12 sm:h-14 w-auto"
              priority
            />
          </Link>
          <Link href="/register">
            <Button className="text-white border-0 shadow-lg hover:shadow-xl transition-all font-semibold text-sm sm:text-base" style={{ background: '#014b89' }}>
              Register
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: '#014b89' }}>
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: '#014b89' }}>Terms of Service</h1>
              <p className="text-gray-600 mt-1">Last updated: January 29, 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 p-6 sm:p-8 md:p-10 space-y-8" style={{ borderColor: 'rgba(1, 75, 137, 0.1)' }}>
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Welcome to HostelVoice, the official hostel management system for our college. By accessing or using this platform, you agree to comply with and be bound by these Terms of Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This system is designed to streamline hostel operations, facilitate communication between students, caretakers, and administrators, and enhance the overall hostel living experience.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-3">To use HostelVoice, you must:</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Be a registered student or staff member of the college</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Have a valid college email address</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Obtain admin approval for account activation (students and caretakers)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Be at least 18 years of age or have parental consent</span>
              </li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>3. User Responsibilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">3.1 Account Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify the administration immediately of any unauthorized access.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">3.2 Accurate Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must provide accurate, current, and complete information during registration and keep your profile information updated.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">3.3 Appropriate Use</h3>
                <p className="text-gray-700 leading-relaxed mb-2">Users must not:</p>
                <ul className="space-y-1 ml-6 text-gray-700">
                  <li>• Post false, misleading, or malicious content</li>
                  <li>• Harass, abuse, or threaten other users</li>
                  <li>• Submit spam or duplicate issues/complaints</li>
                  <li>• Attempt to gain unauthorized access to the system</li>
                  <li>• Use the platform for any illegal activities</li>
                  <li>• Share your account with others</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Services Provided */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>4. Services Provided</h2>
            <p className="text-gray-700 leading-relaxed mb-3">HostelVoice provides the following services:</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Issue and complaint management system</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Announcements and notifications</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Leave application and approval system</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Mess menu and feedback management</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Lost and found item tracking</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Resident directory and communication tools</span>
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>5. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content, features, and functionality of HostelVoice, including but not limited to text, graphics, logos, and software, are the property of the college and are protected by copyright and other intellectual property laws.
            </p>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>6. Data Usage and Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              By using HostelVoice, you consent to the collection, use, and storage of your personal information as outlined in our <Link href="/privacy" className="font-semibold hover:underline" style={{ color: '#014b89' }}>Privacy Policy</Link>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your data will be used solely for hostel management purposes and will not be shared with third parties without your consent, except as required by law or college regulations.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>7. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              HostelVoice is provided "as is" without warranties of any kind. The college does not guarantee:
            </p>
            <ul className="space-y-1 ml-6 text-gray-700">
              <li>• Uninterrupted or error-free service</li>
              <li>• Immediate resolution of reported issues</li>
              <li>• Availability of the system at all times</li>
              <li>• Accuracy of all information posted by users</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              The college shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of HostelVoice, including but not limited to loss of data, service interruptions, or delays in issue resolution.
            </p>
          </section>

          {/* Account Termination */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>9. Account Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The college reserves the right to suspend or terminate your account at any time for:
            </p>
            <ul className="space-y-1 ml-6 text-gray-700">
              <li>• Violation of these Terms of Service</li>
              <li>• Inappropriate or abusive behavior</li>
              <li>• Providing false information</li>
              <li>• Graduation, transfer, or termination from the college</li>
              <li>• Extended periods of inactivity</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              The college reserves the right to modify these Terms of Service at any time. Users will be notified of significant changes through the platform. Continued use of HostelVoice after changes are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of India and are subject to the jurisdiction of Bengaluru, Karnataka courts.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For questions or concerns about these Terms of Service, please contact:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-gray-700">
              <p><strong>Hostel Administration Office</strong></p>
              <p>Email: hostel.admin@college.edu</p>
              <p>Phone: +91 80 1234 5678</p>
              <p>Address: College Campus, Bengaluru, Karnataka 560073</p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="border-t-2 pt-6" style={{ borderColor: 'rgba(1, 75, 137, 0.1)' }}>
            <p className="text-gray-700 leading-relaxed">
              By registering for and using HostelVoice, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        {/* Back to Registration */}
        <div className="mt-8 text-center">
          <Link href="/register">
            <Button className="text-white border-0 shadow-lg hover:shadow-xl transition-all font-semibold" style={{ background: '#014b89' }}>
              Back to Registration
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-2 z-0" style={{ background: 'linear-gradient(to right, #014b89, #f26918)' }}></div>
    </div>
  )
}
