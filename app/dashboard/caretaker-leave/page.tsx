'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Upload, CheckCircle2, AlertCircle, XCircle, Clock, MapPin, Phone, FileText, PlusCircle, List, MessageSquare, User } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

// Interfaces
interface StudentLeave {
  id: string;
  studentName: string;
  roomNumber: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  destination: string;
  contactNumber: string;
  documentUrl: string | null;
  status: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  additionalNotes?: string;
}

interface CaretakerLeave {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  documentUrl: string | null;
  replacementSuggestion: string;
  status: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  assignedReplacement?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

// Dummy data
const dummyStudentLeaves: StudentLeave[] = [
  {
    id: '1',
    studentName: 'Rahul Sharma',
    roomNumber: 'A-204',
    leaveType: 'Home Visit',
    startDate: new Date('2026-02-01T10:00:00'),
    endDate: new Date('2026-02-05T18:00:00'),
    reason: 'Going home for family function and cousin\'s wedding',
    destination: '123 MG Road, Bangalore, Karnataka - 560001',
    contactNumber: '+91 98765 43210',
    documentUrl: 'parent-letter.pdf',
    status: 'Pending',
    submittedAt: new Date('2026-01-28T14:30:00')
  }
];

const dummyMyLeaves: CaretakerLeave[] = [
  {
    id: '1',
    leaveType: 'Casual',
    startDate: new Date('2026-02-10'),
    endDate: new Date('2026-02-12'),
    numberOfDays: 3,
    reason: 'Personal family function',
    documentUrl: null,
    replacementSuggestion: 'Sharma - Block B',
    status: 'Pending',
    submittedAt: new Date('2026-01-29T10:30:00')
  },
  {
    id: '2',
    leaveType: 'Sick',
    startDate: new Date('2026-01-20'),
    endDate: new Date('2026-01-22'),
    numberOfDays: 3,
    reason: 'Medical checkup',
    documentUrl: 'medical.pdf',
    replacementSuggestion: 'Kumar - Block A',
    status: 'Approved',
    submittedAt: new Date('2026-01-18T09:15:00'),
    reviewedAt: new Date('2026-01-19T15:30:00'),
    reviewedBy: 'Admin Verma',
    assignedReplacement: 'Kumar - Block A'
  }
];

export default function CaretakerLeavePage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('review-students');
  
  // Student Leave Review State
  const [studentLeaves, setStudentLeaves] = useState<StudentLeave[]>(dummyStudentLeaves);
  const [selectedStudentLeave, setSelectedStudentLeave] = useState<StudentLeave | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'moreinfo' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Apply Leave State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [applyFormData, setApplyFormData] = useState({
    leaveType: '',
    reason: '',
    replacementCaretaker: '',
    document: null as File | null
  });

  // My Leaves State
  const [myLeaves, setMyLeaves] = useState<CaretakerLeave[]>(dummyMyLeaves);
  const [selectedMyLeave, setSelectedMyLeave] = useState<CaretakerLeave | null>(null);
  const [isMyLeaveDialogOpen, setIsMyLeaveDialogOpen] = useState(false);

  // Review Functions
  const openReviewDialog = (leave: StudentLeave, type: 'approve' | 'reject' | 'moreinfo') => {
    setSelectedStudentLeave(leave);
    setReviewAction(type);
    setReviewNotes('');
    setIsReviewDialogOpen(true);
  };

  const handleReview = () => {
    if (!selectedStudentLeave || !reviewAction) return;
    const updatedLeaves = studentLeaves.map(leave => {
      if (leave.id === selectedStudentLeave.id) {
        return {
          ...leave,
          status: reviewAction === 'approve' ? 'Approved' : reviewAction === 'reject' ? 'Rejected' : 'More Info Needed',
          reviewedAt: new Date(),
          reviewedBy: user?.name || 'Caretaker',
          rejectionReason: reviewAction === 'reject' ? reviewNotes : undefined,
          additionalNotes: reviewAction === 'moreinfo' ? reviewNotes : undefined
        };
      }
      return leave;
    });
    setStudentLeaves(updatedLeaves);
    setIsReviewDialogOpen(false);
    setSelectedStudentLeave(null);
    setReviewAction(null);
    setReviewNotes('');
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      return differenceInDays(endDate, startDate) + 1;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setActiveTab('my-status');
        setApplyFormData({ leaveType: '', reason: '', replacementCaretaker: '', document: null });
        setStartDate(undefined);
        setEndDate(undefined);
      }, 2000);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      Pending: { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: 'rgba(234, 179, 8, 0.3)' },
      Approved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
      Rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
      'More Info Needed': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' }
    };
    const style = styles[status] || { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' };
    return (
      <Badge className="gap-1 text-xs font-bold px-2 sm:px-3 py-1 border-2 whitespace-nowrap" style={{ background: style.bg, color: style.color, borderColor: style.border }}>
        {status === 'Pending' && <AlertCircle className="h-3 w-3" />}
        {status === 'Approved' && <CheckCircle2 className="h-3 w-3" />}
        {status === 'Rejected' && <XCircle className="h-3 w-3" />}
        <span className="hidden sm:inline">{status}</span>
        <span className="sm:hidden">{status === 'More Info Needed' ? 'Info' : status}</span>
      </Badge>
    );
  };

  const pendingStudentLeaves = studentLeaves.filter(l => l.status === 'Pending');
  const reviewedStudentLeaves = studentLeaves.filter(l => l.status !== 'Pending');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      `}</style>

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(1, 75, 137, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(1, 75, 137, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-12 pb-12 sm:pb-16 md:pb-24 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2" style={{ color: '#014b89' }}>
            Caretaker Leave Management
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Review student leaves, apply for your leave, and track your leave status
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 h-11 sm:h-12 bg-gray-100">
            <TabsTrigger value="review-students" className="gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold data-[state=active]:bg-white px-1 sm:px-3">
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Review Students</span>
              <span className="sm:hidden">Review</span>
            </TabsTrigger>
            <TabsTrigger value="apply" className="gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold data-[state=active]:bg-white px-1 sm:px-3">
              <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Apply for Leave</span>
              <span className="sm:hidden">Apply</span>
            </TabsTrigger>
            <TabsTrigger value="my-status" className="gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold data-[state=active]:bg-white px-1 sm:px-3">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">My Status</span>
              <span className="sm:hidden">Status</span>
            </TabsTrigger>
          </TabsList>

          {/* Review Student Leaves */}
          <TabsContent value="review-students" className="space-y-4 sm:space-y-6 mt-0">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Total', value: studentLeaves.length, color: '#014b89' },
                { label: 'Pending', value: pendingStudentLeaves.length, color: '#eab308' },
                { label: 'Reviewed', value: reviewedStudentLeaves.length, color: '#10b981' }
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 hover:shadow-xl transition-all"
                >
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1 sm:mb-2 uppercase truncate">{stat.label}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#014b89' }}>Pending Leave Requests</h3>
              {pendingStudentLeaves.length === 0 ? (
                <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-8 sm:p-12 text-center">
                    <p className="text-sm sm:text-base text-gray-600">No pending leave requests</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingStudentLeaves.map((leave) => (
                    <div key={leave.id} className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="p-4 sm:p-5 md:p-6 border-b-2 border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(1, 75, 137, 0.1)' }}>
                                <User className="h-4 w-4" style={{ color: '#014b89' }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: '#014b89' }}>
                                  {leave.studentName}
                                </h3>
                                <p className="text-xs text-gray-600">Room {leave.roomNumber} • {leave.leaveType}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(leave.status)}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 md:p-6 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(242, 105, 24, 0.1)' }}>
                              <CalendarIcon className="h-4 w-4" style={{ color: '#f26918' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-600 break-words">
                                {format(leave.startDate, 'PPP')} - {format(leave.endDate, 'PPP')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                              <MapPin className="h-4 w-4" style={{ color: '#10b981' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-600 break-words">{leave.destination}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                              <Phone className="h-4 w-4" style={{ color: '#3b82f6' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-600">{leave.contactNumber}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t-2 border-gray-100">
                          <p className="text-sm font-bold text-gray-900 mb-1">Reason:</p>
                          <p className="text-xs sm:text-sm text-gray-600 break-words">{leave.reason}</p>
                        </div>

                        {leave.documentUrl && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <FileText className="h-4 w-4 flex-shrink-0" style={{ color: '#014b89' }} />
                            <a href="#" className="text-blue-600 hover:underline truncate">
                              {leave.documentUrl}
                            </a>
                          </div>
                        )}

                        {leave.status === 'Pending' && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t-2 border-gray-100">
                            <Button
                              onClick={() => openReviewDialog(leave, 'approve')}
                              className="font-bold h-10 sm:h-11 text-xs sm:text-sm rounded-xl text-white"
                              style={{ background: '#10b981' }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => openReviewDialog(leave, 'moreinfo')}
                              className="font-bold h-10 sm:h-11 text-xs sm:text-sm rounded-xl border-2"
                              variant="outline"
                              style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              More Info
                            </Button>
                            <Button
                              onClick={() => openReviewDialog(leave, 'reject')}
                              className="font-bold h-10 sm:h-11 text-xs sm:text-sm rounded-xl text-white"
                              style={{ background: '#ef4444' }}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {reviewedStudentLeaves.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#014b89' }}>Reviewed Requests</h3>
                <div className="space-y-4">
                  {reviewedStudentLeaves.map((leave) => (
                    <div key={leave.id} className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: '#014b89' }}>{leave.studentName}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Room {leave.roomNumber}</p>
                          </div>
                          {getStatusBadge(leave.status)}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {format(leave.startDate, 'PPP')} - {format(leave.endDate, 'PPP')}
                        </p>
                        {leave.reviewedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Reviewed on {format(leave.reviewedAt, 'PPP')} by {leave.reviewedBy}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Apply for Leave */}
          <TabsContent value="apply" className="mt-0">
            {isSuccess ? (
              <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                <div className="p-8 sm:p-12 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: '#10b981' }} />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#014b89' }}>Leave Request Submitted!</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Your leave request has been submitted successfully. The admin will review it shortly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#014b89' }}>Apply for Leave</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Submit your leave request for admin approval
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Leave Type *</Label>
                      <Select
                        value={applyFormData.leaveType}
                        onValueChange={(value) =>
                          setApplyFormData({ ...applyFormData, leaveType: value })
                        }
                      >
                        <SelectTrigger className="border-2 h-10 sm:h-11">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casual">Casual Leave</SelectItem>
                          <SelectItem value="Sick">Sick Leave</SelectItem>
                          <SelectItem value="Emergency">Emergency Leave</SelectItem>
                          <SelectItem value="Earned">Earned Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold">Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-2 h-10 sm:h-11"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold">End Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-2 h-10 sm:h-11"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {startDate && endDate && (
                      <div className="p-3 sm:p-4 rounded-xl border-2" style={{ background: 'rgba(1, 75, 137, 0.05)', borderColor: 'rgba(1, 75, 137, 0.3)' }}>
                        <p className="text-sm font-bold" style={{ color: '#014b89' }}>
                          Total Days: <strong>{calculateDays()}</strong>
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Reason for Leave *</Label>
                      <Textarea
                        placeholder="Provide detailed reason for your leave"
                        rows={4}
                        value={applyFormData.reason}
                        onChange={(e) =>
                          setApplyFormData({ ...applyFormData, reason: e.target.value })
                        }
                        className="border-2 rounded-xl text-sm sm:text-base resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Replacement Caretaker Suggestion *</Label>
                      <Select
                        value={applyFormData.replacementCaretaker}
                        onValueChange={(value) =>
                          setApplyFormData({ ...applyFormData, replacementCaretaker: value })
                        }
                      >
                        <SelectTrigger className="border-2 h-10 sm:h-11">
                          <SelectValue placeholder="Suggest replacement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kumar - Block A">Kumar - Block A</SelectItem>
                          <SelectItem value="Sharma - Block B">Sharma - Block B</SelectItem>
                          <SelectItem value="Patel - Block C">Patel - Block C</SelectItem>
                          <SelectItem value="Reddy - Block D">Reddy - Block D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Supporting Document (if required)</Label>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setApplyFormData({ ...applyFormData, document: file });
                        }}
                        className="border-2 h-10 sm:h-11 text-sm sm:text-base"
                      />
                      <p className="text-xs text-gray-500">
                        Upload medical certificate for sick leave
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full font-bold h-10 sm:h-11 text-sm sm:text-base rounded-xl text-white"
                      disabled={
                        isSubmitting ||
                        !applyFormData.leaveType ||
                        !startDate ||
                        !endDate ||
                        !applyFormData.reason ||
                        !applyFormData.replacementCaretaker
                      }
                      style={{ background: '#014b89' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Leave Request
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </TabsContent>

          {/* My Status */}
          <TabsContent value="my-status" className="space-y-4 sm:space-y-6 mt-0">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Total', value: myLeaves.length, color: '#014b89' },
                { label: 'Pending', value: myLeaves.filter((l) => l.status === 'Pending').length, color: '#eab308' },
                { label: 'Approved', value: myLeaves.filter((l) => l.status === 'Approved').length, color: '#10b981' }
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 hover:shadow-xl transition-all"
                >
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1 sm:mb-2 uppercase truncate">{stat.label}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#014b89' }}>My Leave Requests</h3>
              {myLeaves.length === 0 ? (
                <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-8 sm:p-12 text-center">
                    <p className="text-sm sm:text-base text-gray-600">
                      You haven't submitted any leave requests yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {myLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedMyLeave(leave);
                        setIsMyLeaveDialogOpen(true);
                      }}
                    >
                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold" style={{ color: '#014b89' }}>
                              {leave.leaveType} Leave
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                              {format(leave.startDate, 'PPP')} - {format(leave.endDate, 'PPP')}
                            </p>
                          </div>
                          {getStatusBadge(leave.status)}
                        </div>
                        <div className="text-xs sm:text-sm space-y-1">
                          <p className="text-gray-600">
                            <strong>Duration:</strong> {leave.numberOfDays} days
                          </p>
                          <p className="text-gray-600">
                            <strong>Submitted:</strong> {format(leave.submittedAt, 'PPP')}
                          </p>
                          {leave.assignedReplacement && (
                            <p className="text-gray-600">
                              <strong>Replacement:</strong> {leave.assignedReplacement}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Student Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {reviewAction === 'approve' && 'Approve Leave Request'}
              {reviewAction === 'reject' && 'Reject Leave Request'}
              {reviewAction === 'moreinfo' && 'Request More Information'}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedStudentLeave && (
                <>
                  Student: {selectedStudentLeave.studentName} (Room{' '}
                  {selectedStudentLeave.roomNumber})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold">
                {reviewAction === 'moreinfo' ? 'Message to Student' : 'Notes'}
              </Label>
              <Textarea
                placeholder={
                  reviewAction === 'reject'
                    ? 'Provide reason for rejection'
                    : reviewAction === 'moreinfo'
                    ? 'What additional information do you need?'
                    : 'Optional notes about this approval'
                }
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="border-2 rounded-xl text-sm sm:text-base resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              className="w-full sm:w-auto border-2 h-10 sm:h-11 text-sm sm:text-base rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={
                reviewAction === 'reject' && !reviewNotes.trim()
              }
              className="w-full sm:w-auto font-bold h-10 sm:h-11 text-sm sm:text-base rounded-xl text-white"
              style={{
                background: reviewAction === 'approve' ? '#10b981' : 
                           reviewAction === 'reject' ? '#ef4444' : '#3b82f6'
              }}
            >
              {reviewAction === 'approve' && 'Approve'}
              {reviewAction === 'reject' && 'Reject'}
              {reviewAction === 'moreinfo' && 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* My Leave Details Dialog */}
      <Dialog open={isMyLeaveDialogOpen} onOpenChange={setIsMyLeaveDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedMyLeave && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Status:</span>
                {getStatusBadge(selectedMyLeave.status)}
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Leave Type:</p>
                <p className="text-sm text-gray-600">{selectedMyLeave.leaveType}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Duration:</p>
                <p className="text-sm text-gray-600">
                  {format(selectedMyLeave.startDate, 'PPP')} -{' '}
                  {format(selectedMyLeave.endDate, 'PPP')} ({selectedMyLeave.numberOfDays}{' '}
                  days)
                </p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Reason:</p>
                <p className="text-sm text-gray-600 break-words">{selectedMyLeave.reason}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Suggested Replacement:</p>
                <p className="text-sm text-gray-600">
                  {selectedMyLeave.replacementSuggestion}
                </p>
              </div>
              {selectedMyLeave.assignedReplacement && (
                <div>
                  <p className="text-sm font-bold mb-1">Assigned Replacement:</p>
                  <p className="text-sm text-gray-600">
                    {selectedMyLeave.assignedReplacement}
                  </p>
                </div>
              )}
              {selectedMyLeave.adminNotes && (
                <div>
                  <p className="text-sm font-bold mb-1">Admin Notes:</p>
                  <p className="text-sm text-gray-600 break-words">{selectedMyLeave.adminNotes}</p>
                </div>
              )}
              {selectedMyLeave.reviewedAt && (
                <div>
                  <p className="text-xs text-gray-500">
                    Reviewed on {format(selectedMyLeave.reviewedAt, 'PPP')} by{' '}
                    {selectedMyLeave.reviewedBy}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => setIsMyLeaveDialogOpen(false)}
              className="w-full font-bold h-10 sm:h-11 text-sm sm:text-base rounded-xl text-white"
              style={{ background: '#014b89' }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
