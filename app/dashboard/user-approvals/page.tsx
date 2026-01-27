'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
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
  const supabase = createClient()
  
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingUsers(data || [])
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
      const { error } = await supabase
        .from('users')
        .update({
          approval_status: 'approved',
          approved_by: user?.id,
          approval_date: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error

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
      const { error } = await supabase
        .from('users')
        .update({
          approval_status: 'rejected',
          approved_by: user?.id,
          approval_date: new Date().toISOString(),
          rejection_reason: rejectionReason || 'Registration declined by administrator',
        })
        .eq('id', selectedUser.id)

      if (error) throw error

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Approvals</h1>
          <p className="text-gray-600">Review and approve pending registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                  <p className="text-3xl font-bold text-blue-600">{pendingUsers.length}</p>
                </div>
                <Clock className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Students</p>
                  <p className="text-3xl font-bold text-green-600">
                    {pendingUsers.filter(u => u.role === 'student').length}
                  </p>
                </div>
                <User className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Caretakers</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {pendingUsers.filter(u => u.role === 'caretaker').length}
                  </p>
                </div>
                <User className="w-10 h-10 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Users List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading pending registrations...</span>
          </div>
        ) : pendingUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending registrations at the moment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((pendingUser) => (
              <Card key={pendingUser.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3">
                        <span>{pendingUser.full_name}</span>
                        <Badge variant={pendingUser.role === 'student' ? 'default' : 'secondary'}>
                          {pendingUser.role}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Registered {new Date(pendingUser.created_at).toLocaleDateString()} at{' '}
                        {new Date(pendingUser.created_at).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(pendingUser.id, pendingUser.full_name)}
                        disabled={actionLoading === pendingUser.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading === pendingUser.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectClick(pendingUser)}
                        disabled={actionLoading === pendingUser.id}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{pendingUser.email}</span>
                    </div>
                    {pendingUser.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{pendingUser.phone_number}</span>
                      </div>
                    )}
                    {pendingUser.hostel_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{pendingUser.hostel_name}</span>
                        {pendingUser.room_number && ` - Room ${pendingUser.room_number}`}
                      </div>
                    )}
                    {pendingUser.student_id && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Student ID: {pendingUser.student_id}</span>
                      </div>
                    )}
                    {pendingUser.caretaker_id && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Caretaker ID: {pendingUser.caretaker_id}</span>
                      </div>
                    )}
                    {pendingUser.department && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>Department: {pendingUser.department}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {selectedUser?.full_name}'s registration?
              Please provide a reason (optional):
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="my-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
