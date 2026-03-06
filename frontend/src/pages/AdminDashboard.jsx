import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAppointments,
  updateAppointment,
  getAllServices,
  addService,
  updateService,
  deleteService,
  getAllTimeSlots,
  addTimeSlot,
  deleteTimeSlot,
  getMonthlyAnalytics
} from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({ date: '', branch: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (activeTab === 'appointments') loadAppointments();
    if (activeTab === 'services') loadServices();
    if (activeTab === 'timeslots') loadTimeSlots();
    if (activeTab === 'analytics') loadAnalytics();
  }, [activeTab, filters, selectedMonth, selectedYear]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAppointments(filters);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await getAllServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    setLoading(true);
    try {
      const response = await getAllTimeSlots();
      setTimeSlots(response.data);
    } catch (error) {
      console.error('Error loading time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await getMonthlyAnalytics(selectedYear, selectedMonth);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'appointments'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'services'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('timeslots')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'timeslots'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600'
            }`}
          >
            Time Slots
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'analytics'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            {/* Filters */}
            <div className="card mb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ date: '', branch: '', status: '' })}
                    className="btn-secondary w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="card text-center py-8 text-gray-600">
                No appointments found
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt._id} className="card">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{apt.clientName}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📧 {apt.clientEmail} | 📱 {apt.clientPhone}</p>
                          <p>💆 {apt.service?.name}</p>
                          <p>📅 {formatDate(apt.appointmentDate)} at {apt.startTime}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(apt._id, 'completed')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <ServiceManager services={services} onUpdate={loadServices} />
          </div>
        )}

        {/* Time Slots Tab */}
        {activeTab === 'timeslots' && (
          <div>
            <TimeSlotManager timeSlots={timeSlots} onUpdate={loadTimeSlots} dayNames={dayNames} />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <AnalyticsView 
              analytics={analytics} 
              loading={loading}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Service Manager Component
const ServiceManager = ({ services, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addService(formData);
      setFormData({ name: '', description: '', duration: '', price: '' });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-4">
        {showForm ? 'Cancel' : 'Add Service'}
      </button>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Service</button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service._id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <div className="mt-2 text-sm">
                  <span className="text-primary font-semibold">₹{service.price}</span>
                  <span className="text-gray-500 ml-2">{service.duration} min</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(service._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Time Slot Manager Component
const TimeSlotManager = ({ timeSlots, onUpdate, dayNames }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    branch: 'Main Branch'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTimeSlot(formData);
      setFormData({ dayOfWeek: '', startTime: '', endTime: '', branch: 'Main Branch' });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this time slot?')) {
      try {
        await deleteTimeSlot(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting time slot:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-4">
        {showForm ? 'Cancel' : 'Add Time Slot'}
      </button>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select Day</option>
              {dayNames.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Time Slot</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {dayNames.map((day, dayIndex) => {
          const daySlots = timeSlots.filter(slot => slot.dayOfWeek === dayIndex);
          if (daySlots.length === 0) return null;
          
          return (
            <div key={dayIndex} className="card">
              <h3 className="font-semibold text-lg mb-3">{day}</h3>
              <div className="grid md:grid-cols-3 gap-2">
                {daySlots.map((slot) => (
                  <div key={slot._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{slot.startTime} - {slot.endTime}</span>
                    <button
                      onClick={() => handleDelete(slot._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Analytics View Component
const AnalyticsView = ({ analytics, loading, selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">No data available</div>;
  }

  return (
    <div>
      {/* Month/Year Selector */}
      <div className="card mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(parseInt(e.target.value))}
              className="input-field"
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="input-field"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50">
          <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
          <div className="text-3xl font-bold text-blue-600">{analytics.summary.totalBookings}</div>
        </div>
        <div className="card bg-green-50">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-600">{analytics.summary.completedBookings}</div>
          <div className="text-xs text-gray-500">{analytics.summary.completionRate}% completion rate</div>
        </div>
        <div className="card bg-yellow-50">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">
            {analytics.summary.pendingBookings + analytics.summary.confirmedBookings}
          </div>
        </div>
        <div className="card bg-purple-50">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-purple-600">₹{analytics.summary.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Avg: ₹{analytics.summary.averageRevenuePerBooking}</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Status Breakdown</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{analytics.statusBreakdown.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{analytics.statusBreakdown.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{analytics.statusBreakdown.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{analytics.statusBreakdown.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled ({analytics.summary.cancellationRate}%)</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Popular Services</h3>
          {analytics.popularServices.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.count} bookings</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">₹{service.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No bookings this month</div>
          )}
        </div>

        {/* Peak Hours */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Peak Booking Hours</h3>
          {analytics.peakHours.length > 0 ? (
            <div className="space-y-3">
              {analytics.peakHours.map((peak, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="font-medium">{peak.hour}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">{peak.count} bookings</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(peak.count / analytics.peakHours[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No bookings this month</div>
          )}
        </div>
      </div>

      {/* Daily Bookings Chart */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold mb-4">Daily Bookings - {analytics.period.monthName} {analytics.period.year}</h3>
        <div className="mb-4 text-sm text-gray-600">
          Total: {analytics.summary.totalBookings} bookings this month
        </div>
        
        {Object.entries(analytics.dailyBookings).length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex items-end gap-2 h-48 min-w-full" style={{ minWidth: '600px' }}>
              {(() => {
                // Create array for all days of the month
                const daysInMonth = new Date(analytics.period.year, analytics.period.month, 0).getDate();
                const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                const maxCount = Math.max(...Object.values(analytics.dailyBookings), 1);
                
                return allDays.map(day => {
                  const count = analytics.dailyBookings[day] || 0;
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  const isToday = new Date().getDate() === day && 
                                 new Date().getMonth() + 1 === analytics.period.month &&
                                 new Date().getFullYear() === analytics.period.year;
                  
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center min-w-0">
                      {count > 0 && (
                        <div className="text-xs text-gray-600 mb-1 font-medium">{count}</div>
                      )}
                      <div 
                        className={`w-full rounded-t transition-all duration-200 hover:opacity-80 ${
                          count > 0 
                            ? isToday 
                              ? 'bg-blue-500' 
                              : 'bg-primary'
                            : 'bg-gray-100'
                        }`}
                        style={{ 
                          height: count > 0 ? `${Math.max(height, 8)}%` : '4px',
                          minHeight: count > 0 ? '8px' : '2px'
                        }}
                        title={`${day} ${analytics.period.monthName}: ${count} booking${count !== 1 ? 's' : ''}${isToday ? ' (Today)' : ''}`}
                      ></div>
                      <div className={`text-xs mt-1 ${isToday ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                        {day}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Bookings</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>No bookings</span>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {Math.max(...Object.values(analytics.dailyBookings), 0)}
                </div>
                <div className="text-xs text-gray-600">Busiest Day</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {Object.keys(analytics.dailyBookings).length}
                </div>
                <div className="text-xs text-gray-600">Active Days</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {Object.keys(analytics.dailyBookings).length > 0 
                    ? Math.round(analytics.summary.totalBookings / Object.keys(analytics.dailyBookings).length * 10) / 10
                    : 0}
                </div>
                <div className="text-xs text-gray-600">Avg/Active Day</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-lg font-medium mb-1">No bookings this month</div>
            <div className="text-sm">Start promoting your services to get bookings!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
