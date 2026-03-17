import React, { useState } from 'react';
import { Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const services = [
  { id: 's1', name: 'Headlight Retrofit', duration: '4-6 Hours', price: 'From $250' },
  { id: 's2', name: 'Android Headunit Installation', duration: '2-3 Hours', price: 'From $150' },
  { id: 's3', name: 'Performance Tuning', duration: '1-2 Hours', price: 'From $300' },
  { id: 's4', name: 'Custom Fabrication', duration: 'Varies', price: 'Consultation' },
];

// Generate next 7 days for mock availability
const generateNextDays = () => {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const availableDates = generateNextDays();
const availableTimes = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleInfo: '',
    notes: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call
    setTimeout(() => {
      setStep(4);
    }, 1000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter mb-4">
            Book <span className="text-brand-orange">Appointment</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Schedule your service at The Lab. Select a service, date, and time below.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-orange z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {s === 4 && step === 4 ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        <div className="bg-brand-dark border border-gray-800 p-6 md:p-10 rounded-sm">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-display font-bold text-white uppercase mb-6">1. Select Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 border text-left transition-all ${
                      selectedService === service.id 
                        ? 'border-brand-orange bg-brand-orange/10' 
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.duration}</span>
                      <span>{service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!selectedService}
                  className="w-full sm:w-auto bg-brand-orange text-white px-8 py-3 font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-display font-bold text-white uppercase mb-6">2. Select Date & Time</h2>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Available Dates</h3>
                <div className="flex overflow-x-auto pb-4 gap-3 snap-x">
                  {availableDates.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`snap-start shrink-0 w-24 p-4 border text-center transition-all ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'border-brand-orange bg-brand-orange/10'
                          : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-xs text-gray-400 uppercase mb-1">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-2xl font-display font-bold text-white">
                        {date.getDate()}
                      </div>
                      <div className="text-xs text-gray-500 uppercase mt-1">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="mb-8 animate-in fade-in duration-300">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Available Times</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableTimes.map((time, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border text-center transition-all font-bold ${
                          selectedTime === time
                            ? 'border-brand-orange bg-brand-orange text-white'
                            : 'border-gray-800 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto text-gray-400 hover:text-white px-6 py-3 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-gray-800 sm:border-transparent rounded-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full sm:w-auto bg-brand-orange text-white px-8 py-3 font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Your Details */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-display font-bold text-white uppercase mb-6">3. Your Details</h2>
              
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle (Year/Make/Model) *</label>
                    <input
                      type="text"
                      required
                      value={formData.vehicleInfo}
                      onChange={e => setFormData({...formData, vehicleInfo: e.target.value})}
                      className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Additional Notes</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors resize-none"
                  ></textarea>
                </div>
              </form>

              <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-gray-800">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto text-gray-400 hover:text-white px-6 py-3 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-gray-800 sm:border-transparent rounded-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  form="booking-form"
                  className="w-full sm:w-auto bg-brand-orange text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  Confirm Booking <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <CheckCircle className="w-24 h-24 text-brand-orange mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase mb-4">
                Booking Confirmed!
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Thank you, {formData.name}. Your appointment for {services.find(s => s.id === selectedService)?.name} is confirmed for {selectedDate?.toLocaleDateString()} at {selectedTime}. We've sent a confirmation email with details.
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedService('');
                  setSelectedDate(null);
                  setSelectedTime('');
                  setFormData({ name: '', email: '', phone: '', vehicleInfo: '', notes: '' });
                }}
                className="bg-transparent border border-gray-600 text-white px-8 py-3 font-bold uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors"
              >
                Book Another Service
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
