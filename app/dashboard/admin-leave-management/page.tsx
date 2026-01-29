'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, CheckCircle2, AlertCircle, XCircle, FileText, Shield, ChevronLeft, ChevronRight, Users, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, differenceInDays } from 'date-fns';

interface CaretakerLeave {
  id: string;
  caretakerName: string;
  caretakerBlock: string;
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

interface CalendarDay {
  date: Date;
  leaves: CaretakerLeave[];
  available: number;
  total: number;
}

// Dummy Caretaker Leave Requests
const dummyCaretakerLeaves: CaretakerLeave[] = [
  {
    id: '1',
    caretakerName: 'Kumar Singh',
    caretakerBlock: 'Block A',
    leaveType: 'Casual',
    startDate: new Date('2026-02-10'),
    endDate: new Date('2026-02-12'),
    numberOfDays: 3,
    reason: 'Personal family function - daughter\'s engagement ceremony',
    documentUrl: null,
    replacementSuggestion: 'Sharma - Block B',
    status: 'Pending',
    submittedAt: new Date('2026-01-29T10:30:00')
  },
  {
    id: '2',
    caretakerName: 'Patel Ji',
    caretakerBlock: 'Block C',
    leaveType: 'Sick',
    startDate: new Date('2026-02-05'),
    endDate: new Date('2026-02-07'),
    numberOfDays: 3,
    reason: 'Severe fever and need rest as per doctor\'s advice',
    documentUrl: 'medical-certificate.pdf',
    replacementSuggestion: 'Reddy - Block D',
    status: 'Approved',
    submittedAt: new Date('2026-01-28T09:15:00'),
    reviewedAt: new Date('2026-01-28T15:30:00'),
    reviewedBy: 'Admin Verma',
    assignedReplacement: 'Reddy - Block D'
  },
  {
    id: '3',
    caretakerName: 'Sharma',
    caretakerBlock: 'Block B',
    leaveType: 'Emergency',
    startDate: new Date('2026-02-15'),
    endDate: new Date('2026-02-17'),
    numberOfDays: 3,
    reason: 'Family emergency - need to attend to urgent family matter',
    documentUrl: null,
    replacementSuggestion: 'Kumar - Block A',
    status: 'Approved',
    submittedAt: new Date('2026-01-27T14:20:00'),
    reviewedAt: new Date('2026-01-27T16:45:00'),
    reviewedBy: 'Admin Verma',
    assignedReplacement: 'Kumar - Block A'
  },
  {
    id: '4',
    caretakerName: 'Reddy',
    caretakerBlock: 'Block D',
    leaveType: 'Casual',
    startDate: new Date('2026-02-20'),
    endDate: new Date('2026-02-22'),
    numberOfDays: 3,
    reason: 'Personal work - need to handle property documentation',
    documentUrl: null,
    replacementSuggestion: 'Patel - Block C',
    status: 'Pending',
    submittedAt: new Date('2026-01-29T16:00:00')
  }
];

export default function AdminLeaveManagementPage() {
  const [activeTab, setActiveTab] = useState('review-caretakers');
  
  // Caretaker Leave Review State
  const [caretakerLeaves, setCaretakerLeaves] = useState<CaretakerLeave[]>(dummyCaretakerLeaves);
  const [selectedCaretakerLeave, setSelectedCaretakerLeave] = useState<CaretakerLeave | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'conditional' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [assignedReplacement, setAssignedReplacement] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterCaretaker, setFilterCaretaker] = useState<string>('all');

  // Review Caretaker Leaves Functions
  const openReviewDialog = (leave: CaretakerLeave, type: 'approve' | 'reject' | 'conditional') => {
    setSelectedCaretakerLeave(leave);
    setReviewAction(type);
    setReviewNotes('');
    setAssignedReplacement(leave.replacementSuggestion);
    setIsReviewDialogOpen(true);
  };

  const handleReview = () => {
    if (!selectedCaretakerLeave || !reviewAction) return;

    const updatedLeaves = caretakerLeaves.map(leave => {
      if (leave.id === selectedCaretakerLeave.id) {
        const updated = {
          ...leave,
          status: reviewAction === 'approve' ? 'Approved' : reviewAction === 'reject' ? 'Rejected' : 'Conditionally Approved',
          reviewedAt: new Date(),
          reviewedBy: 'Admin Verma',
          adminNotes: reviewNotes
        };
        
        if (reviewAction === 'approve' || reviewAction === 'conditional') {
          updated.assignedReplacement = assignedReplacement;
        }
        
        if (reviewAction === 'reject') {
          updated.rejectionReason = reviewNotes;
        }
        
        return updated;
      }
      return leave;
    });

    setCaretakerLeaves(updatedLeaves);
    setIsReviewDialogOpen(false);
    setSelectedCaretakerLeave(null);
    setReviewAction(null);
    setReviewNotes('');
    setAssignedReplacement('');
  };

  // Calendar Functions
  const getCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(date => {
      const leavesOnDay = caretakerLeaves.filter(leave => 
        (filterCaretaker === 'all' || leave.caretakerBlock?.includes(filterCaretaker)) &&
        leave.status === 'Approved' &&
        date >= leave.startDate && date <= leave.endDate
      );

      const total = 8;
      const onLeave = leavesOnDay.length;
      const available = total - onLeave;

      return {
        date,
        leaves: leavesOnDay,
        available,
        total
      };
    });
  };

  const getStaffingColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#eab308';
    return '#ef4444';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: 'rgba(234, 179, 8, 0.3)' },
      Approved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
      Rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
      'Conditionally Approved': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' }
    };
    const style = styles[status as keyof typeof styles] || { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' };

    return (
      <Badge 
        className="gap-1 text-xs font-bold px-2 sm:px-3 py-1 border-2 whitespace-nowrap"
        style={{ background: style.bg, color: style.color, borderColor: style.border }}
      >
        {status === 'Pending' && <AlertCircle className="h-3 w-3" />}
        {status === 'Approved' && <CheckCircle2 className="h-3 w-3" />}
        {status === 'Rejected' && <XCircle className="h-3 w-3" />}
        <span className="hidden sm:inline">{status}</span>
        <span className="sm:hidden">{status === 'Conditionally Approved' ? 'Cond.' : status}</span>
      </Badge>
    );
  };

  const getLeaveTypeBadge = (type: string) => {
    const styles = {
      Emergency: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
      Sick: { bg: 'rgba(242, 105, 24, 0.1)', color: '#f26918', border: 'rgba(242, 105, 24, 0.3)' },
      Casual: { bg: 'rgba(1, 75, 137, 0.1)', color: '#014b89', border: 'rgba(1, 75, 137, 0.3)' }
    };
    const style = styles[type as keyof typeof styles] || { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' };

    return (
      <Badge 
        className="text-xs font-bold px-2 sm:px-3 py-1 border-2"
        style={{ background: style.bg, color: style.color, borderColor: style.border }}
      >
        {type}
      </Badge>
    );
  };

  const CaretakerLeaveCard = ({ leave }: { leave: CaretakerLeave }) => {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden mb-4 hover:shadow-lg transition-all">
        <div className="p-4 sm:p-5 md:p-6 border-b-2 border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(1, 75, 137, 0.1)' }}>
                  <Shield className="h-4 w-4" style={{ color: '#014b89' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: '#014b89' }}>
                    {leave.caretakerName}
                  </h3>
                  <p className="text-xs text-gray-600">{leave.caretakerBlock}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {getLeaveTypeBadge(leave.leaveType)}
              </div>
            </div>
            <div className="flex-shrink-0">
              {getStatusBadge(leave.status)}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(242, 105, 24, 0.1)' }}>
                <CalendarIcon className="h-4 w-4" style={{ color: '#f26918' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 mb-1">Leave Period</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">
                  {format(leave.startDate, 'PPP')} - {format(leave.endDate, 'PPP')}
                </p>
                <p className="text-xs font-bold mt-1" style={{ color: '#014b89' }}>
                  Duration: {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(107, 114, 128, 0.1)' }}>
                <Clock className="h-4 w-4" style={{ color: '#6b7280' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">Submitted</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {format(leave.submittedAt, 'PPP')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(1, 75, 137, 0.1)' }}>
              <FileText className="h-4 w-4" style={{ color: '#014b89' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 mb-1">Reason</p>
              <p className="text-xs sm:text-sm text-gray-600 break-words">{leave.reason}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <Users className="h-4 w-4" style={{ color: '#10b981' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 mb-1">Replacement Suggestion</p>
              <p className="text-xs sm:text-sm text-gray-600">{leave.replacementSuggestion}</p>
            </div>
          </div>

          {leave.documentUrl && (
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-2 h-9 text-xs w-full sm:w-auto"
                style={{ borderColor: '#014b89', color: '#014b89' }}
              >
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">View: {leave.documentUrl}</span>
              </Button>
            </div>
          )}

          {leave.reviewedAt && (
            <div className="border-t-2 border-gray-100 pt-4">
              <div className="p-3 sm:p-4 rounded-xl" style={{ background: 'rgba(1, 75, 137, 0.05)' }}>
                <p className="text-sm font-bold mb-2" style={{ color: '#014b89' }}>Review Details</p>
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  Reviewed by <strong>{leave.reviewedBy}</strong> on {format(leave.reviewedAt, 'PPP')}
                </p>
                
                {leave.assignedReplacement && (
                  <div className="mt-2 p-3 rounded-lg border-2" style={{ background: 'rgba(1, 75, 137, 0.05)', borderColor: 'rgba(1, 75, 137, 0.3)' }}>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#014b89' }}>
                      <strong>Assigned Replacement:</strong> {leave.assignedReplacement}
                    </p>
                  </div>
                )}

                {leave.adminNotes && leave.status === 'Conditionally Approved' && (
                  <div className="mt-2 p-3 rounded-lg border-2" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#3b82f6' }}>
                      <strong>Conditions:</strong> {leave.adminNotes}
                    </p>
                  </div>
                )}
                
                {leave.rejectionReason && (
                  <div className="mt-2 p-3 rounded-lg border-2" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#ef4444' }}>
                      <strong>Rejection Reason:</strong> {leave.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
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
                onClick={() => openReviewDialog(leave, 'conditional')}
                className="font-bold h-10 sm:h-11 text-xs sm:text-sm rounded-xl text-white"
                style={{ background: '#3b82f6' }}
              >
                Conditional
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
    );
  };

  const pendingCaretakerLeaves = caretakerLeaves.filter(l => l.status === 'Pending');
  const reviewedCaretakerLeaves = caretakerLeaves.filter(l => l.status !== 'Pending');
  const calendarDays = getCalendarDays();

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
            Admin Leave Management
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Review caretaker leave requests and manage staffing calendar
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-2 h-11 sm:h-12 bg-gray-100">
            <TabsTrigger 
              value="review-caretakers" 
              className="gap-1 sm:gap-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Review Caretakers</span>
              <span className="sm:hidden">Review</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="gap-1 sm:gap-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white"
            >
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Leave Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </TabsTrigger>
          </TabsList>

          {/* Review Caretaker Leaves Tab */}
          <TabsContent value="review-caretakers" className="space-y-4 sm:space-y-6 mt-0">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Total', value: caretakerLeaves.length, color: '#014b89' },
                { label: 'Pending', value: pendingCaretakerLeaves.length, color: '#eab308' },
                { label: 'Reviewed', value: reviewedCaretakerLeaves.length, color: '#10b981' }
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 hover:shadow-xl transition-all"
                >
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 mb-1 sm:mb-2 uppercase">{stat.label}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#014b89' }}>Pending Requests</h3>
              {pendingCaretakerLeaves.length === 0 ? (
                <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-8 sm:p-12 text-center">
                    <p className="text-sm sm:text-base text-gray-600">No pending caretaker leave requests</p>
                  </div>
                </div>
              ) : (
                pendingCaretakerLeaves.map(leave => (
                  <CaretakerLeaveCard key={leave.id} leave={leave} />
                ))
              )}
            </div>

            {reviewedCaretakerLeaves.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#014b89' }}>Reviewed Requests</h3>
                {reviewedCaretakerLeaves.map(leave => (
                  <CaretakerLeaveCard key={leave.id} leave={leave} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leave Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4 sm:space-y-6 mt-0">
            <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate" style={{ color: '#014b89' }}>
                      {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Staff leave calendar and staffing levels</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="border-2 h-9 px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                      className="border-2 h-9 px-3 text-xs sm:text-sm"
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="border-2 h-9 px-3"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-bold mb-2 block">Filter by Block</Label>
                  <Select value={filterCaretaker} onValueChange={setFilterCaretaker}>
                    <SelectTrigger className="w-full sm:w-64 border-2 h-10 sm:h-11">
                      <SelectValue placeholder="All Blocks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blocks</SelectItem>
                      <SelectItem value="A">Block A</SelectItem>
                      <SelectItem value="B">Block B</SelectItem>
                      <SelectItem value="C">Block C</SelectItem>
                      <SelectItem value="D">Block D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={idx} className="text-center text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 p-1 sm:p-2">
                      <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]}</span>
                      <span className="sm:hidden">{day}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {calendarDays.map((day, idx) => {
                    const staffingColor = getStaffingColor(day.available, day.total);
                    const isToday = isSameDay(day.date, new Date());
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(day.date)}
                        className="aspect-square p-1 sm:p-2 border-2 rounded-lg transition-all hover:shadow-md relative"
                        style={{
                          borderColor: isToday ? '#014b89' : '#e5e7eb',
                          backgroundColor: day.leaves.length > 0 ? `${staffingColor}15` : 'white'
                        }}
                      >
                        <div className="text-[10px] sm:text-xs md:text-sm font-bold" style={{ color: isToday ? '#014b89' : '#1f2937' }}>
                          {format(day.date, 'd')}
                        </div>
                        {day.leaves.length > 0 && (
                          <div className="mt-0.5 sm:mt-1">
                            <div 
                              className="w-full h-0.5 sm:h-1 rounded-full"
                              style={{ backgroundColor: staffingColor }}
                            />
                            <div className="text-[8px] sm:text-[10px] font-bold mt-0.5 sm:mt-1" style={{ color: staffingColor }}>
                              {day.available}/{day.total}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 sm:mt-6 pt-4 border-t-2">
                  <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3" style={{ color: '#014b89' }}>Staffing Level Legend</h4>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: '#10b981' }} />
                      <span>Good (75%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: '#eab308' }} />
                      <span>Adequate (50-75%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: '#ef4444' }} />
                      <span>Low (&lt;50%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedDate && (
              <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-4" style={{ color: '#014b89' }}>
                    Leaves on {format(selectedDate, 'PPP')}
                  </h3>
                  {calendarDays.find(d => isSameDay(d.date, selectedDate))?.leaves.length === 0 ? (
                    <p className="text-sm text-gray-600">No leaves on this day</p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {calendarDays.find(d => isSameDay(d.date, selectedDate))?.leaves.map(leave => (
                        <div key={leave.id} className="p-3 sm:p-4 border-2 rounded-lg">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-bold truncate" style={{ color: '#014b89' }}>{leave.caretakerName}</p>
                              <p className="text-xs text-gray-600">{leave.caretakerBlock}</p>
                            </div>
                            {getLeaveTypeBadge(leave.leaveType)}
                          </div>
                          {leave.assignedReplacement && (
                            <p className="text-xs text-gray-600 mt-2">
                              Replacement: <strong>{leave.assignedReplacement}</strong>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {reviewAction === 'approve' && 'Approve Leave Request'}
              {reviewAction === 'reject' && 'Reject Leave Request'}
              {reviewAction === 'conditional' && 'Conditionally Approve Leave'}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedCaretakerLeave && `${selectedCaretakerLeave.caretakerName} - ${selectedCaretakerLeave.caretakerBlock}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {(reviewAction === 'approve' || reviewAction === 'conditional') && (
              <div className="space-y-2">
                <Label className="text-sm font-bold">Assign Replacement Caretaker *</Label>
                <Select value={assignedReplacement} onValueChange={setAssignedReplacement}>
                  <SelectTrigger className="border-2 h-10 sm:h-11">
                    <SelectValue placeholder="Select replacement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kumar - Block A">Kumar - Block A</SelectItem>
                    <SelectItem value="Sharma - Block B">Sharma - Block B</SelectItem>
                    <SelectItem value="Patel - Block C">Patel - Block C</SelectItem>
                    <SelectItem value="Reddy - Block D">Reddy - Block D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-bold">
                {reviewAction === 'approve' && 'Admin Notes (Optional)'}
                {reviewAction === 'reject' && 'Reason for Rejection *'}
                {reviewAction === 'conditional' && 'Conditions for Approval *'}
              </Label>
              <Textarea
                placeholder={
                  reviewAction === 'approve' ? 'Add any notes for this approval...' :
                  reviewAction === 'reject' ? 'Explain why this leave request is being rejected...' :
                  'Specify conditions that must be met for final approval...'
                }
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                required={reviewAction !== 'approve'}
                className="border-2 border-gray-200 rounded-xl text-sm sm:text-base resize-none"
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
                (reviewAction !== 'approve' && !reviewNotes) ||
                ((reviewAction === 'approve' || reviewAction === 'conditional') && !assignedReplacement)
              }
              className="w-full sm:w-auto font-bold h-10 sm:h-11 text-sm sm:text-base rounded-xl text-white"
              style={{
                background: reviewAction === 'approve' ? '#10b981' : 
                           reviewAction === 'reject' ? '#ef4444' : '#3b82f6'
              }}
            >
              {reviewAction === 'approve' && 'Approve'}
              {reviewAction === 'reject' && 'Reject'}
              {reviewAction === 'conditional' && 'Conditionally Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
