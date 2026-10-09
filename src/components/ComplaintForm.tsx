import React, { useState, useRef } from 'react';
import { 
  Upload, Camera, X, Check, AlertCircle, CheckCircle2, 
  FileText, Shield, Sparkles, ArrowRight, RefreshCw 
} from 'lucide-react';
import { Complaint, UserSession, ComplaintCategory, ComplaintPriority, HostelBlock } from '../types';
import { COMPLAINT_CATEGORIES, HOSTEL_BLOCKS } from '../data/mockData';
import { SAMPLE_ISSUE_PHOTOS } from '../data/sampleImages';

interface ComplaintFormProps {
  currentUser: UserSession;
  onSubmit: (newComplaint: Omit<Complaint, 'id' | 'complaintId' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>) => string;
  onTrackSubmittedComplaint: (complaintId: string) => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  currentUser,
  onSubmit,
  onTrackSubmittedComplaint,
}) => {
  // Form fields
  const [usn, setUsn] = useState(currentUser.usn);
  const [roomNumber, setRoomNumber] = useState(currentUser.roomNumber);
  const [hostelBlock, setHostelBlock] = useState<HostelBlock>(currentUser.hostelBlock);
  const [category, setCategory] = useState<ComplaintCategory>('Plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Normal');

  // Photo upload
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoName, setPhotoName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Success state
  const [successComplaintId, setSuccessComplaintId] = useState<string | null>(null);
  
  // Validation errors
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = (file: File) => {
    setFileError('');
    // Validation: Type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setFileError('Supported formats: JPG, JPEG, PNG, WebP.');
      return;
    }

    // Validation: Size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size exceeds the 5MB institutional limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoUrl(e.target?.result as string);
      setPhotoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleKey: 'plumbing' | 'electrical' | 'carpentry' | 'wifi') => {
    setPhotoUrl(SAMPLE_ISSUE_PHOTOS[sampleKey]);
    const names = {
      plumbing: 'room_washbasin_leak.svg',
      electrical: 'ceiling_fan_spark.svg',
      carpentry: 'cupboard_hinge_defect.svg',
      wifi: 'corridor_ap_signal_drop.svg'
    };
    setPhotoName(names[sampleKey]);
    setFileError('');

    if (!title) {
      if (sampleKey === 'plumbing') {
        setCategory('Plumbing');
        setTitle('Continuous washbasin faucet leakage in room');
        setDescription('The washbasin tap spindle is damaged and drips constantly.');
      } else if (sampleKey === 'electrical') {
        setCategory('Electrical');
        setTitle('Ceiling fan regulator sparking when switched');
        setDescription('Electrical sparks visible when toggling speed steps. Slight burning smell.');
        setPriority('Urgent');
      } else if (sampleKey === 'carpentry') {
        setCategory('Furniture');
        setTitle('Cupboard door hinge loose');
        setDescription('Steel wardrobe door hinge has broken screws and cannot close safely.');
      } else if (sampleKey === 'wifi') {
        setCategory('Internet');
        setTitle('Corridor Wi-Fi access point frequent disconnects');
        setDescription('Signal frequently drops during lab project submissions.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [k: string]: string } = {};

    if (!usn.trim()) newErrors.usn = 'Student USN is required.';
    if (!roomNumber.trim()) newErrors.roomNumber = 'Room number is required.';
    if (!title.trim()) newErrors.title = 'Complaint title is required.';
    if (!description.trim() || description.trim().length < 15) {
      newErrors.description = 'Please provide a detailed description (at least 15 characters).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate submission and non-sequential ID generation
    setTimeout(() => {
      const generatedId = onSubmit({
        userId: currentUser.id,
        usn: usn.toUpperCase().trim(),
        roomNumber: roomNumber.trim(),
        hostelBlock,
        category,
        title: title.trim(),
        description: description.trim(),
        priority,
        imageUrl: photoUrl,
      });

      setIsSubmitting(false);
      setSuccessComplaintId(generatedId);
    }, 400);
  };

  // Success Screen from Section 11
  if (successComplaintId) {
    return (
      <div className="py-12 max-w-2xl mx-auto px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl border border-[#E9D9D5] p-8 sm:p-10 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#2E8B68] border border-emerald-200 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-[#202124] font-display">
            Complaint Submitted Successfully
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-2">
            Your grievance has been securely logged into the BEC hostel maintenance dispatch queue.
          </p>

          {/* Details Card */}
          <div className="my-6 p-5 rounded-2xl bg-[#FFF8F5] border border-[#E9D9D5] text-left space-y-3">
            <div className="flex items-center justify-between border-b border-[#E9D9D5] pb-3">
              <span className="text-xs text-[#5F6368] font-bold uppercase tracking-wider">Complaint Reference ID</span>
              <span className="text-lg font-bold font-mono-tabular text-[#A94F61] select-all">
                {successComplaintId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#5F6368]">Date:</span>{' '}
                <strong className="text-[#202124]">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </div>
              <div>
                <span className="text-[#5F6368]">Category:</span>{' '}
                <strong className="text-[#202124]">{category}</strong>
              </div>
              <div>
                <span className="text-[#5F6368]">Room & Block:</span>{' '}
                <strong className="text-[#202124]">{roomNumber} ({hostelBlock.replace('Block ', '')})</strong>
              </div>
              <div>
                <span className="text-[#5F6368]">Initial Status:</span>{' '}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F8DDE1] text-[#A94F61]">
                  Submitted
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={() => onTrackSubmittedComplaint(successComplaintId)}
              className="w-full py-3.5 bg-[#A94F61] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#8C2E42] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <span>Track Complaint</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSuccessComplaintId(null);
                setTitle('');
                setDescription('');
                setPhotoUrl(undefined);
                setPhotoName('');
              }}
              className="w-full py-2.5 text-xs text-[#5F6368] hover:text-[#202124] font-medium cursor-pointer"
            >
              Raise Another Complaint
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#A94F61] mb-1 uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>BEC Hostel Services · Maintenance Request</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-display">
          Raise a Hostel Complaint
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
          Provide your room information, issue details, and attach a photo to ensure prompt maintenance resolution.
        </p>
      </div>

      {/* Main Complaint Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* Section 1: Student Information */}
        <div>
          <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-2 mb-4">
            1. Student & Room Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                University Seat Number (USN) *
              </label>
              <input
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
                placeholder="2BA22CS045"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FFF8F5] text-xs sm:text-sm font-mono-tabular uppercase focus:outline-none focus:ring-2 focus:ring-[#A94F61] ${
                  errors.usn ? 'border-red-400' : 'border-[#E9D9D5]'
                }`}
              />
              {errors.usn && <p className="text-[11px] text-red-500 mt-1">{errors.usn}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Room Number *
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="304"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FFF8F5] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A94F61] ${
                  errors.roomNumber ? 'border-red-400' : 'border-[#E9D9D5]'
                }`}
              />
              {errors.roomNumber && <p className="text-[11px] text-red-500 mt-1">{errors.roomNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Hostel Block *
              </label>
              <select
                value={hostelBlock}
                onChange={(e) => setHostelBlock(e.target.value as HostelBlock)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E9D9D5] bg-[#FFF8F5] text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
              >
                {HOSTEL_BLOCKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Complaint Details */}
        <div>
          <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-2 mb-4">
            2. Complaint Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Category Dropdown from Section 10 */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E9D9D5] bg-[#FFF8F5] text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
              >
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority from Section 10 */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Priority *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E9D9D5] bg-[#FFF8F5] text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
              >
                <option value="Normal">Normal (Standard inspection schedule)</option>
                <option value="Urgent">Urgent (Safety hazard, pipe burst, sparking)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#202124] mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Washbasin faucet continuous leakage, ceiling fan humming"
              maxLength={100}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FFF8F5] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A94F61] ${
                errors.title ? 'border-red-400' : 'border-[#E9D9D5]'
              }`}
            />
            {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail, its exact location in the room, and when it started..."
              maxLength={600}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FFF8F5] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A94F61] resize-none ${
                errors.description ? 'border-red-400' : 'border-[#E9D9D5]'
              }`}
            />
            <div className="flex justify-between items-center text-[11px] text-[#5F6368] mt-1">
              <span>{errors.description ? <span className="text-red-500">{errors.description}</span> : 'Provide specific details for accurate technician dispatch.'}</span>
              <span>{description.length}/600</span>
            </div>
          </div>
        </div>

        {/* Section 3: Photo Upload from Section 10 */}
        <div>
          <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-2 mb-2">
            3. Photo Upload of the Issue
          </h2>
          
          {/* Required Privacy Message from Section 10 */}
          <p className="text-xs text-[#5F6368] mb-4">
            Your uploaded photo will be securely associated with this complaint and will only be accessible to authorized users.
          </p>

          {/* Hidden inputs for regular file upload and camera capture on mobile */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleProcessFile(e.target.files[0]);
              }
            }}
          />

          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleProcessFile(e.target.files[0]);
              }
            }}
          />

          {fileError && (
            <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* If photo uploaded: show preview with remove / reselect */}
          {photoUrl ? (
            <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#E9D9D5] space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-24 h-20 rounded-xl overflow-hidden border border-[#E9D9D5] bg-white shrink-0">
                  <img
                    src={photoUrl}
                    alt="Uploaded issue preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#202124] truncate">
                    {photoName || 'Issue Photograph'}
                  </p>
                  <p className="text-[11px] text-[#2E8B68] flex items-center gap-1 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Attached and ready for submission</span>
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#A94F61] font-semibold hover:underline cursor-pointer"
                    >
                      Reselect Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl(undefined);
                        setPhotoName('');
                      }}
                      className="text-red-600 font-semibold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Action Area (No empty broken boxes) */
            <div className="border-2 border-dashed border-[#E9D9D5] rounded-2xl p-6 bg-[#FFF8F5] text-center space-y-3">
              <Upload className="w-8 h-8 text-[#A94F61] mx-auto opacity-80" />
              <div>
                <p className="text-xs font-bold text-[#202124]">
                  Upload photo of the damaged fixture or problem
                </p>
                <p className="text-[11px] text-[#5F6368] mt-0.5">
                  JPG, JPEG, PNG, or WebP up to 5MB
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-[#E9D9D5] text-[#202124] text-xs font-semibold rounded-xl hover:bg-[#FFF1EC] hover:border-[#D98F9B] transition-colors cursor-pointer shadow-xs"
                >
                  Choose from Files
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-[#E9D9D5] text-[#202124] text-xs font-semibold rounded-xl hover:bg-[#FFF1EC] hover:border-[#D98F9B] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Use Camera</span>
                </button>
              </div>

              {/* Sample Issue Presets for Testing */}
              <div className="pt-3 border-t border-[#E9D9D5]/60 text-left">
                <p className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-1.5">
                  Or load sample test issue:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectSample('plumbing')}
                    className="p-1.5 text-center rounded-lg bg-white border border-[#E9D9D5] hover:border-[#A94F61] text-[11px] font-medium text-[#A94F61] cursor-pointer"
                  >
                    Tap Leakage
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSample('electrical')}
                    className="p-1.5 text-center rounded-lg bg-white border border-[#E9D9D5] hover:border-[#A94F61] text-[11px] font-medium text-[#A94F61] cursor-pointer"
                  >
                    Fan Sparking
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSample('carpentry')}
                    className="p-1.5 text-center rounded-lg bg-white border border-[#E9D9D5] hover:border-[#A94F61] text-[11px] font-medium text-[#A94F61] cursor-pointer"
                  >
                    Cupboard Hinge
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSample('wifi')}
                    className="p-1.5 text-center rounded-lg bg-white border border-[#E9D9D5] hover:border-[#A94F61] text-[11px] font-medium text-[#A94F61] cursor-pointer"
                  >
                    Corridor Wi-Fi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Submit Footer */}
        <div className="pt-4 border-t border-[#E9D9D5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#5F6368]">
            <span>Authenticated student: </span>
            <strong className="text-[#202124]">{currentUser.usn}</strong>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#A94F61] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#8C2E42] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Encrypting & Submitting...</span>
              </>
            ) : (
              <span>Submit Complaint</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
