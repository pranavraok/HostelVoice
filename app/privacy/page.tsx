'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, CheckCircle2 } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: '#014b89' }}>Privacy Policy</h1>
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
              At HostelVoice, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our hostel management system.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy applies to all students, caretakers, and administrators who use the HostelVoice platform at our college.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">2.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-2">When you register for HostelVoice, we collect:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                    <span>Full name</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                    <span>College email address</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                    <span>Student/Employee ID number</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                    <span>Phone number</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                    <span>Hostel and room assignment</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                    <span>Course/Department information</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">2.2 Usage Information</h3>
                <p className="text-gray-700 leading-relaxed mb-2">We automatically collect information about your interactions with the platform:</p>
                <ul className="space-y-1 ml-6 text-gray-700">
                  <li>• Issues and complaints submitted</li>
                  <li>• Leave applications and approvals</li>
                  <li>• Announcements viewed</li>
                  <li>• Mess feedback provided</li>
                  <li>• Lost and found items reported</li>
                  <li>• Login timestamps and device information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">2.3 Communication Data</h3>
                <p className="text-gray-700 leading-relaxed">
                  Messages, comments, and feedback you share through the platform are stored and may be reviewed by administrators and relevant staff members.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">We use your information for the following purposes:</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To provide and maintain hostel management services</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To process and track issue resolution</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To manage leave applications and approvals</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To send important announcements and notifications</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To improve hostel operations and services</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To generate analytics and reports for administrators</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To verify user identity and prevent unauthorized access</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>To comply with college regulations and legal requirements</span>
              </li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>4. Data Sharing and Disclosure</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">4.1 Within the College</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your information is shared with authorized college personnel including hostel administrators, caretakers, wardens, and relevant staff members for the purpose of hostel management and student welfare.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">4.2 External Disclosure</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We do not sell or share your personal information with external third parties, except:
                </p>
                <ul className="space-y-1 ml-6 text-gray-700">
                  <li>• When required by law or legal process</li>
                  <li>• In case of emergencies affecting student safety</li>
                  <li>• With your explicit consent</li>
                  <li>• To parents/guardians as per college policy</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">4.3 Public Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  General announcements and non-sensitive hostel information may be visible to all registered users of the platform.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-3 text-gray-700">
                <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Encrypted data transmission using SSL/TLS protocols</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Secure password storage with hashing and salting</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Role-based access control to limit data exposure</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Regular security audits and updates</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Secure database storage with backup systems</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We retain your personal information for the duration of your association with the college and for a reasonable period thereafter as required by:
            </p>
            <ul className="space-y-1 ml-6 text-gray-700">
              <li>• College record-keeping policies</li>
              <li>• Legal and regulatory requirements</li>
              <li>• Dispute resolution purposes</li>
              <li>• Historical reference and archival needs</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              After this period, your data will be securely deleted or anonymized.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Access your personal information stored in the system</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Update or correct inaccurate information</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Request deletion of your account (subject to policy)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Opt-out of non-essential communications</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#f26918' }} />
                <span>Lodge complaints about data privacy concerns</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise these rights, please contact the hostel administration office.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              HostelVoice uses cookies and similar technologies to:
            </p>
            <ul className="space-y-1 ml-6 text-gray-700">
              <li>• Maintain your login session</li>
              <li>• Remember your preferences</li>
              <li>• Analyze platform usage and performance</li>
              <li>• Improve user experience</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can control cookie settings through your browser, but disabling cookies may affect platform functionality.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              HostelVoice is intended for use by individuals 18 years and older. If a user is under 18, parental or guardian consent is required. We do not knowingly collect information from minors without proper consent.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>10. Changes to Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Users will be notified of significant changes through the platform. Your continued use of HostelVoice after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>11. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              HostelVoice may integrate with third-party services for enhanced functionality (e.g., email notifications, cloud storage). These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of third-party services.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#014b89' }}>12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-gray-700">
              <p><strong>Data Protection Officer</strong></p>
              <p>Hostel Administration Office</p>
              <p>Email: privacy@college.edu</p>
              <p>Phone: +91 80 1234 5678</p>
              <p>Address: College Campus, Bengaluru, Karnataka 560073</p>
            </div>
          </section>

          {/* Consent */}
          <section className="border-t-2 pt-6" style={{ borderColor: 'rgba(1, 75, 137, 0.1)' }}>
            <p className="text-gray-700 leading-relaxed">
              By using HostelVoice, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and processing of your personal information as described herein.
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
