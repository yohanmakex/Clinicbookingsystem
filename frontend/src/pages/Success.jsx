import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booked!</h1>
          <p className="text-gray-600">
            Your appointment has been successfully scheduled. We'll send you a confirmation email shortly.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link to="/" className="btn-primary block">
            Back to Home
          </Link>
          <Link to="/book" className="btn-secondary block">
            Book Another Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
