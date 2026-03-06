import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getServices } from '../utils/api';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent to-secondary py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Journey to Radiant Skin Starts Here
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Professional skincare treatments tailored to your unique needs
          </p>
          <Link to="/book" className="btn-primary inline-block text-lg">
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          {loading ? (
            <div className="text-center">Loading services...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service._id} className="card hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-semibold">₹{service.price}</span>
                    <span className="text-sm text-gray-500">{service.duration} min</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Glow Clinic</h2>
          <p className="text-lg text-gray-700 mb-4">
            At Glow Clinic, we believe that healthy skin is beautiful skin. Our team of experienced
            dermatologists and skincare specialists are dedicated to helping you achieve your skin goals.
          </p>
          <p className="text-lg text-gray-700">
            With state-of-the-art technology and personalized treatment plans, we provide the highest
            quality care in a comfortable and welcoming environment.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold">Phone:</span> +91 98765 43210
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email:</span> info@glowclinic.com
            </p>
            <p className="text-lg">
              <span className="font-semibold">Address:</span> 123 Beauty Street, Mumbai, India
            </p>
            <p className="text-lg">
              <span className="font-semibold">Hours:</span> Mon-Sat, 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2026 Glow Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
