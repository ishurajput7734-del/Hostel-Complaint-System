import React from 'react';
import { LogIn, FileEdit, Wrench, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStarted }) => {
  const steps = [
    {
      num: '01',
      title: 'Secure Student Authentication',
      desc: 'Sign in effortlessly using your Google account or institutional University Seat Number (USN). Your session automatically locks to your allocated hostel room number and residential block.',
      icon: LogIn,
    },
    {
      num: '02',
      title: 'Digital Grievance Lodging',
      desc: 'Choose your maintenance category (Electrical, Plumbing, Furniture, Wi-Fi, etc.), provide a short description, and snap or upload a photo of the defect directly from your phone.',
      icon: FileEdit,
    },
    {
      num: '03',
      title: 'Authorized Supervisor Dispatch',
      desc: 'Hostel administration reviews the ticket within hours, tags the urgency level, and issues a formal work order to specialized campus maintenance crews (electricians, plumbers, carpenters).',
      icon: Wrench,
    },
    {
      num: '04',
      title: 'Resolution & Audit Verification',
      desc: 'Once repairs are finished, technicians sign off and administrators append official completion notes. You receive real-time status updates directly in your student dashboard.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8DDE1] text-[#A94F61] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Streamlined Hostel Protocol</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#202124] font-display">
          How the Complaint System Operates
        </h2>
        <p className="text-xs sm:text-sm text-[#5F6368]">
          From initial room defect reporting to signed-off maintenance completion in 4 transparent stages.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="bg-white rounded-3xl border border-[#E9D9D5] p-6 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-tabular font-extrabold text-2xl text-[#D98F9B]">
                    {st.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1EC] text-[#A94F61] flex items-center justify-center group-hover:bg-[#A94F61] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#202124] font-display mb-2">
                  {st.title}
                </h3>

                <p className="text-xs text-[#5F6368] leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E9D9D5]/60 text-[11px] font-semibold text-[#A94F61]">
                Stage {st.num} Complete
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action card */}
      <div className="bg-gradient-to-r from-[#FFF1EC] via-[#F8DDE1]/60 to-[#FFF1EC] rounded-3xl border border-[#E9D9D5] p-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#202124] font-display">
          Experiencing an issue in your hostel room?
        </h3>
        <p className="text-xs sm:text-sm text-[#5F6368] max-w-lg mx-auto">
          Report it now with your USN and a photo. Maintenance teams are on campus across all Kaveri, Godavari, Krishna, and Tungabhadra blocks.
        </p>
        <button
          onClick={onGetStarted}
          className="px-6 py-3 bg-[#A94F61] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#8C2E42] transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
