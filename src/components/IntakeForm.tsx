import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitBookingAsync, resetBookingState } from '../store/bookingSlice';
import type { RootState, AppDispatch } from '../store';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function IntakeForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.booking);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleInfo: '',
    serviceRequired: '',
    locationPreference: 'in-shop',
    specificRequests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitBookingAsync(formData));
  };

  const handleReset = () => {
    dispatch(resetBookingState());
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicleInfo: '',
      serviceRequired: '',
      locationPreference: 'in-shop',
      specificRequests: '',
    });
  };

  return (
    <section id="contact" className="py-24 bg-brand-darker relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
          
          {/* Left Side: Contact Info */}
          <div className="bg-brand-gray p-10 md:p-16 border-l-4 border-brand-orange">
            <span className="text-brand-orange font-bold uppercase tracking-widest text-sm block mb-4">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase mb-8">
              Contact <span className="text-brand-orange">The Lab</span>
            </h2>
            
            <p className="text-gray-400 mb-12 leading-relaxed">
              Ready to upgrade your ride? Fill out the intake form to schedule a consultation. We specialize in custom builds and require appointments for all major retrofits.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-darker border border-gray-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-white font-display uppercase tracking-wider text-xl mb-2">Location</h4>
                  <p className="text-gray-400">NKKS Arcade, Krystal Homes, Brgy. Alasas<br />Pampanga, San Fernando, Philippines, 2000</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-darker border border-gray-700 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-white font-display uppercase tracking-wider text-xl mb-2">Phone</h4>
                  <p className="text-gray-400">0939 330 8263</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-darker border border-gray-700 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-white font-display uppercase tracking-wider text-xl mb-2">Email</h4>
                  <p className="text-gray-400">1625autolab@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-darker border border-gray-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-white font-display uppercase tracking-wider text-xl mb-2">Hours</h4>
                  <p className="text-gray-400">Mon-Fri: 9:00 AM - 6:00 PM<br />Sat: By Appointment Only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="bg-brand-dark p-10 md:p-16 border border-gray-800 relative">
            {status === 'success' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark/95 backdrop-blur-sm p-8 text-center z-10">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h3 className="text-3xl font-display font-bold text-white uppercase mb-4">Request Received</h3>
                <p className="text-gray-400 mb-8 max-w-md">
                  We've received your build request. A technician will contact you within 24 hours to discuss details and scheduling.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-brand-orange text-white font-display uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-orange-600 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-display font-bold text-white uppercase mb-8 border-b border-gray-800 pb-4">
                  Intake Form
                </h3>
                
                {status === 'error' && (
                  <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle Info (Year/Make/Model) *</label>
                    <input
                      type="text"
                      name="vehicleInfo"
                      required
                      value={formData.vehicleInfo}
                      onChange={handleChange}
                      className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                      placeholder="e.g. 2018 Subaru WRX"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Service Required *</label>
                      <select
                        name="serviceRequired"
                        required
                        value={formData.serviceRequired}
                        onChange={handleChange}
                        className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
                      >
                        <option value="" disabled>Select a service</option>
                        <option value="headlights">Headlight Retrofit</option>
                        <option value="headunit">Android Headunit</option>
                        <option value="tuning">Performance Tuning</option>
                        <option value="fabrication">Custom Fabrication</option>
                        <option value="other">Other / Multiple</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Location Preference</label>
                      <select
                        name="locationPreference"
                        value={formData.locationPreference}
                        onChange={handleChange}
                        className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
                      >
                        <option value="in-shop">In-Shop (Los Angeles)</option>
                        <option value="mail-in">Mail-In Service</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Specific Requests / Details</label>
                    <textarea
                      name="specificRequests"
                      rows={4}
                      value={formData.specificRequests}
                      onChange={handleChange}
                      className="w-full bg-brand-gray/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors resize-none"
                      placeholder="Describe your vision or specific parts you want used..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-brand-orange text-white font-display uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
