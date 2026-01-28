'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { adminApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, Clock, User, Mail, Phone, Building, Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"

interface PendingUser {
  id: string
  email: string
  full_name: string
  role: 'student' | 'caretaker'
  student_id?: string
  caretaker_id?: string
  hostel_name?: string
  room_number?: string
  phone_number?: string
  department?: string
  created_at: string
}

export default function UserApprovalsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  // Fetch pending users
  const fetchPendingUsers = async () => {
    setIsLoading(true)
    try {
      const response = await adminApi.getPendingUsers()
      setPendingUsers((response.data as PendingUser[]) || [])
    } catch (error) {
      console.error('Error fetching pending users:', error)
      toast({
        title: "Error",
        description: "Failed to load pending registrations.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingUsers()
    }
  }, [user])

  const handleApprove = async (userId: string, userName: string) => {
    setActionLoading(userId)
    
    toast({
      title: "Processing...",
      description: "Approving user account...",
    })

    try {
      await adminApi.approveUser(userId)

      toast({
        title: "User Approved! ✅",
        description: `${userName} can now log in and access the system.`,
      })

      // Refresh the list
      await fetchPendingUsers()
    } catch (error) {
      console.error('Error approving user:', error)
      toast({
        title: "Approval Failed",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectClick = (user: PendingUser) => {
    setSelectedUser(user)
    setShowRejectDialog(true)
    setRejectionReason('')
  }

  const handleRejectConfirm = async () => {
    if (!selectedUser) return
    
    setActionLoading(selectedUser.id)
    
    toast({
      title: "Processing...",
      description: "Rejecting user registration...",
    })

    try {
      await adminApi.rejectUser(selectedUser.id, rejectionReason || 'Registration declined by administrator')

      toast({
        title: "Registration Rejected",
        description: `${selectedUser.full_name}'s registration has been declined.`,
      })

      // Refresh the list
      await fetchPendingUsers()
      setShowRejectDialog(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error rejecting user:', error)
      toast({
        title: "Rejection Failed",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm sm:text-base text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">User Approvals</h1>
          <p className="text-sm sm:text-base text-gray-600">Review and approve pending registrations</p>
        </div>

        {/* Stats - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending Approvals</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{pendingUsers.length}</p>
                </div>
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Students</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {pendingUsers.filter(u => u.role === 'student').length}
                  </p>
                </div>
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Caretakers</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {pendingUsers.filter(u => u.role === 'caretaker').length}
                  </p>
                </div>
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Users List - Mobile Optimized */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-sm sm:text-base text-gray-600">Loading pending registrations...</span>
          </div>
        ) : pendingUsers.length === 0 ? (
          <Card>
            <CardContent className="py-8 sm:py-12 p-4 sm:p-6">
              <div className="text-center">
                <Check className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-sm sm:text-base text-gray-600">No pending registrations at the moment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {pendingUsers.map((pendingUser) => (
              <Card key={pendingUser.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-base sm:text-lg">
                        <span className="break-words">{pendingUser.full_name}</span>
                        <Badge 
                          variant={pendingUser.role === 'student' ? 'default' : 'secondary'}
                          className="w-fit text-xs"
                        >
                          {pendingUser.role}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2 text-xs sm:text-sm">
                        Registered {new Date(pendingUser.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })} at{' '}
                        {new Date(pendingUser.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(pendingUser.id, pendingUser.full_name)}
                        disabled={actionLoading === pendingUser.id}
                        className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none text-xs sm:text-sm h-9"
                      >
                        {actionLoading === pendingUser.id ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectClick(pendingUser)}
                        disabled={actionLoading === pendingUser.id}
                        className="flex-1 sm:flex-none text-xs sm:text-sm h-9"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{pendingUser.email}</span>
                    </div>
                    {pendingUser.phone_number && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{pendingUser.phone_number}</span>
                      </div>
                    )}
                    {pendingUser.hostel_name && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                        <span className="break-words">
                          {pendingUser.hostel_name}
                          {pendingUser.room_number && ` - Room ${pendingUser.room_number}`}
                        </span>
                      </div>
                    )}
                    {pendingUser.student_id && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Student ID: {pendingUser.student_id}</span>
                      </div>
                    )}
                    {pendingUser.caretaker_id && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Caretaker ID: {pendingUser.caretaker_id}</span>
                      </div>
                    )}
                    {pendingUser.department && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                        <span className="break-words">Department: {pendingUser.department}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Dialog - Mobile Optimized */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Reject Registration</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to reject {selectedUser?.full_name}'s registration?
              Please provide a reason (optional):
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="my-4 text-sm sm:text-base"
            rows={3}
          />
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel 
              onClick={() => setSelectedUser(null)}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm sm:text-base"
            >
              Reject Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
