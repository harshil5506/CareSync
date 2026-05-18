import { Link } from 'react-router-dom';
import { Heart, Users, Calendar, BarChart3, Shield, Clock } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description:
        'Efficiently manage patient records, medical history, and personal information',
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description:
        'Easy scheduling system for appointments with real-time availability',
    },
    {
      icon: Heart,
      title: 'Prescription Management',
      description:
        'Digital prescriptions with PDF generation and easy sharing',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description:
        'Comprehensive insights and metrics for hospital management',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description:
        'Enterprise-grade security with JWT authentication and encryption',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description:
        'Live notifications and instant updates across the platform',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="text-primary" size={32} />
          <span className="text-2xl font-bold">CareSync</span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-foreground hover:text-primary transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Healthcare Management <br />
          <span className="text-primary">Made Simple</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          CareSync is a comprehensive patient management system that streamlines
          hospital operations, improves patient care, and enhances doctor-patient
          communication.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Start Free Trial
          </Link>
          <button className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition font-medium">
            Learn More
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-card py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-primary">50K+</h3>
            <p className="text-muted-foreground">Patients Managed</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">500+</h3>
            <p className="text-muted-foreground">Healthcare Providers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">100K+</h3>
            <p className="text-muted-foreground">Appointments Scheduled</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">99.9%</h3>
            <p className="text-muted-foreground">Uptime Guarantee</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <Icon className="text-primary mb-4" size={40} />
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/20 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Ready to Transform Your Healthcare Operations?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of healthcare providers using CareSync to improve
            patient outcomes and operational efficiency.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2026 CareSync. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Enterprise healthcare management system for the modern world.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
