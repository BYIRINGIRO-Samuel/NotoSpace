import React from 'react';
import { Search, ChevronLeft, ChevronRight, BookOpen, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    'UI/UX Design', 'Development', 'Data Science', 'Business', 'Financial'
  ];

  const courses = [
    {
      id: 1,
      title: 'Data Science and Machine Learning with Python - Hands On!',
      author: 'Jason Williams',
      category: 'Science',
      price: '$385.00',
      oldPrice: '$440.00',
      duration: '08 hr 15 mins',
      lectures: '29 Lectures',
      rating: 4.9,
      reviews: 8,
      image: '/courses.png'
    },
    {
      id: 2,
      title: 'Create Amazing Color Schemes for Your UX Design Projects',
      author: 'Pamela Rossi',
      category: 'Science',
      price: '$420.00',
      oldPrice: '',
      duration: '06 hr 30 mins',
      lectures: '25 Lectures',
      rating: 4.8,
      reviews: 12,
      image: '/courses.png'
    },
    {
      id: 3,
      title: 'Culture & Leadership: Strategies for a Successful Business',
      author: 'Rose Simmons',
      category: 'Science',
      price: '$235.00',
      oldPrice: '$340.00',
      duration: '10 hr 45 mins',
      lectures: '35 Lectures',
      rating: 4.9,
      reviews: 15,
      image: '/courses.png'
    },
    {
      id: 4,
      title: 'Finance Series: Learn to Budget and Calculate your Net Worth',
      author: 'Jason Williams',
      category: 'Finance',
      price: 'Free',
      oldPrice: '',
      duration: '04 hr 20 mins',
      lectures: '18 Lectures',
      rating: 4.9,
      reviews: 20,
      image: '/courses.png'
    },
    {
      id: 5,
      title: 'Build Brand into Marketing: Tackling the New Marketing Landscape',
      author: 'Jason Williams',
      category: 'Marketing',
      price: '$136.00',
      oldPrice: '',
      duration: '12 hr 10 mins',
      lectures: '42 Lectures',
      rating: 4.8,
      reviews: 10,
      image: '/courses.png'
    },
    {
      id: 6,
      title: 'Graphic Design: Mastering Badges and Icons with Decorative Shapes',
      author: 'Jason Williams',
      category: 'Design',
      price: '$237.00',
      oldPrice: '',
      duration: '09 hr 15 mins',
      lectures: '28 Lectures',
      rating: 4.9,
      reviews: 5,
      image: '/courses.png'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1DA1F2]/10 rounded-lg">
              <BookOpen className="w-8 h-8 text-[#1DA1F2]" />
            </div>
            <span className="text-2xl font-bold text-gray-800">EduLe</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[#1DA1F2] font-medium">Home</Link>
            <Link to="#" className="text-gray-600 hover:text-[#1DA1F2] transition">All Course</Link>
            <Link to="#" className="text-gray-600 hover:text-[#1DA1F2] transition">Pages</Link>
            <Link to="#" className="text-gray-600 hover:text-[#1DA1F2] transition">Blog</Link>
            <Link to="#" className="text-gray-600 hover:text-[#1DA1F2] transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 font-medium hover:text-[#1DA1F2]">Sign In</Link>
            <Link to="/signup" className="px-6 py-2.5 bg-[#1DA1F2] text-white rounded-full font-semibold hover:bg-[#1991DA] transition shadow-lg shadow-[#1DA1F2]/20">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#1DA1F2]/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8 z-10 animate-in fade-in slide-in-from-left duration-700">
            {/* Orange Dots/Grains Decoration */}
            <div className="absolute top-0 -left-10 opacity-60">
               <div className="grid grid-cols-4 gap-2">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className="w-2 h-1 bg-orange-400 rounded-full rotate-45" />
                 ))}
               </div>
            </div>

            <div className="space-y-4">
              <span className="text-[#1DA1F2] font-semibold tracking-wide">Start your favorite journey</span>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
                Unlock your potential <br />
                from anywhere, and build <br />
                your <span className="text-[#1DA1F2] relative">
                  bright future.
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0 7C30 7 70 2 100 2" stroke="#1DA1F2" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Connect with mentors, access premium study materials, and track your progress all in one place. NotoSpace is where excellence begins.
              </p>
            </div>

            <div className="pt-4">
              <button className="px-10 py-4 bg-[#1DA1F2] text-white rounded-xl font-bold text-lg hover:bg-[#1991DA] transition shadow-xl shadow-[#1DA1F2]/30 flex items-center gap-2 group">
                Explore Resources
              </button>
            </div>
          </div>

          {/* Right Image & Floating Elements */}
          <div className="flex-1 relative animate-in fade-in slide-in-from-right duration-700">
            {/* Main Student Image */}
            <div className="relative z-10">
              <img 
                src="/hero.png" 
                alt="Student" 
                className="w-full h-auto object-contain scale-110 drop-shadow-2xl"
              />
            </div>

            {/* Floating Circle (Courses) */}
            <div className="absolute top-1/2 -left-20 -translate-y-1/2 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-28 h-28 bg-[#1DA1F2] rounded-full flex flex-col items-center justify-center text-white border-4 border-white shadow-2xl">
                 <BookOpen className="w-6 h-6 mb-1" />
                 <span className="text-xl font-bold leading-none">1,235</span>
                 <span className="text-[10px] uppercase font-bold opacity-80">courses</span>
                 {/* Circle ripple effect */}
                 <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                    <div className="w-16 h-1 bg-[#1DA1F2]/20 rounded-full blur-sm" />
                 </div>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-10 right-0 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl z-20 flex flex-col items-center border border-gray-100">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold">4.8</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Rating (85k)</span>
            </div>

            {/* Arrows Decoration */}
            <div className="absolute top-1/4 left-0 text-[#1DA1F2] opacity-40 z-0">
               <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                 <path d="M10 50C25 45 35 25 50 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                 <path d="M45 10H50V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>
            <div className="absolute bottom-1/4 right-0 text-[#1DA1F2] opacity-40 z-0">
               <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="rotate-90">
                 <path d="M10 50C25 45 35 25 50 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                 <path d="M45 10H50V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>

            {/* Background Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/30 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
              All <span className="text-[#1DA1F2] border-b-4 border-[#1DA1F2]/20">Courses</span> of EduLe
            </h2>
          </div>
          <div className="flex-1 max-w-xl">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search your course" 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/50 pr-14"
                />
                <button className="absolute right-2 top-2 bottom-2 aspect-square bg-[#1DA1F2] text-white rounded-lg flex items-center justify-center hover:bg-[#1991DA] transition">
                  <Search className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 hide-scrollbar">
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
          {categories.map((cat, i) => (
            <button 
              key={cat} 
              className={`px-8 py-3 rounded-full whitespace-nowrap transition-all font-medium ${i === 0 ? 'bg-[#1DA1F2] text-white shadow-lg shadow-[#1DA1F2]/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#1DA1F2]">
                   {course.category}
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    <img src={`https://i.pravatar.cc/100?img=${course.id + 20}`} alt={course.author} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{course.author}</span>
                  <div className="ml-auto px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg uppercase">Science</div>
                </div>
                
                <h3 className="text-xl font-bold leading-tight group-hover:text-[#1DA1F2] transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#1DA1F2]" /> {course.duration}</div>
                  <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-[#1DA1F2]" /> {course.lectures}</div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#1DA1F2]">{course.price}</span>
                    {course.oldPrice && <span className="text-sm text-gray-400 line-through">{course.oldPrice}</span>}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm">
                    {course.rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <button className="px-10 py-4 bg-gray-100 text-gray-900 rounded-full font-bold hover:bg-[#1DA1F2] hover:text-white transition shadow-lg flex items-center gap-2 mx-auto">
                Other Course <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </section>

      {/* Footer / CTA mockup */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-[#1DA1F2]" />
                <span className="text-2xl font-bold">EduLe</span>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">
                  Join thousands of learners worldwide and transform your career with the most sought-after skills in today's market.
               </p>
            </div>
            <div>
               <h4 className="text-lg font-bold mb-6">Category</h4>
               <ul className="space-y-4 text-gray-400 text-sm">
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">Development</Link></li>
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">Business</Link></li>
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">Design</Link></li>
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">Marketing</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="text-lg font-bold mb-6">Quick Links</h4>
               <ul className="space-y-4 text-gray-400 text-sm">
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">About Us</Link></li>
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">Contact Us</Link></li>
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">FAQ</Link></li>
                  <li><Link to="#" className="hover:text-[#1DA1F2] transition">Terms</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="text-lg font-bold mb-6">Subscribe</h4>
               <p className="text-gray-400 text-sm mb-4">Connect with us and get the latest news</p>
               <div className="flex bg-white/10 rounded-lg p-1.5">
                  <input type="email" placeholder="Email.." className="bg-transparent border-none focus:outline-none px-3 text-sm flex-1" />
                  <button className="px-4 py-2 bg-[#1DA1F2] rounded-md text-sm font-bold">Join</button>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
