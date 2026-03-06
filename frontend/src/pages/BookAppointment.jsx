import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices, getAvailableTimeSlots, bookAppointment } from '../utils/api';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    service: '',
    branch: 'Main Branch',
    appointmentDate: '',
    startTime: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  // Load available slots when date changes
  useEffect(() => {
    if (formData.appointmentDate) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [formData.appointmentDate, formData.branch]);

  const loadServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await getAvailableTimeSlots(formData.appointmentDate, formData.branch);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error loading time slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    
    // Reset time when date changes
    if (e.target.name === 'appointmentDate') {
      setFormData(prev => ({ ...prev, startTime: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await bookAppointment(formData);
      navigate('/success');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  
  // Calculate max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 text-center">Book Your Appointment</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Service *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} - ₹{service.price} ({service.duration} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Appointment Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={minDate}
                max={maxDateStr}
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You can book up to 3 months in advance
                {formData.appointmentDate === minDate && (
                  <span className="text-blue-600"> • Today: Only future time slots available</span>
                )}
              </p>
            </div>

            {formData.appointmentDate && (
              <div>
                <label className="block text-sm font-medium mb-1">Select Time *</label>
                {loadingSlots ? (
                  <div className="text-center py-4 text-gray-600">Loading available slots...</div>
                ) : availableSlots.length > 0 ? (
                  <>
                    <select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Choose a time</option>
                      {availableSlots.map((slot) => {
                        // Calculate end time based on selected service duration
                        const selectedService = services.find(s => s._id === formData.service);
                        let displayEndTime = slot.endTime;
                        
                        if (selectedService) {
                          const [hours, minutes] = slot.startTime.split(':').map(Number);
                          const endMinutes = hours * 60 + minutes + selectedService.duration;
                          const endHours = Math.floor(endMinutes / 60);
                          const endMins = endMinutes % 60;
                          displayEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
                        }
                        
                        return (
                          <option key={slot._id} value={slot.startTime}>
                            {slot.startTime} - {displayEndTime}
                            {selectedService && ` (${selectedService.duration} min)`}
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''} available
                    </p>
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-yellow-800 font-medium">No available slots for this date</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please try another date or contact us directly.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || availableSlots.length === 0 || !formData.startTime}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
