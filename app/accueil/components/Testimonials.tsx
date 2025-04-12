"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sophie Martin",
    position: "Développeuse Full Stack",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Gitify a complètement changé ma façon de contribuer au code. Mes streaks de contribution sont passés de 3 jours à 45 jours consécutifs! Les badges m'ont vraiment motivée à coder tous les jours.",
    rating: 5
  },
  {
    id: 2,
    name: "Thomas Dubois",
    position: "Lead Developer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "En tant que lead dev, j'utilise Gitify pour motiver mon équipe. Les défis hebdomadaires ont augmenté nos contributions de 40% et amélioré la qualité de notre code. Un outil essentiel!",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Bernard",
    position: "Développeuse Open Source",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "La gamification de Gitify rend les contributions open source plus engageantes. Je me surprends à chercher des projets sur lesquels contribuer juste pour débloquer de nouveaux badges!",
    rating: 4
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section id="testimonials" className="relative py-20 md:py-32 bg-gradient-to-b from-black/40 to-black/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-900/40 backdrop-blur-sm text-blue-400 text-sm mb-3">
            Témoignages
          </span>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Découvrez comment Gitify transforme l'expérience de développement de nos utilisateurs et booste leur productivité.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -left-4 md:-left-12 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              className="p-2 rounded-full bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/30 text-white hover:bg-indigo-800/60 transition-colors duration-200"
              onClick={prevTestimonial}
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="relative h-[420px] md:h-[320px] overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className="absolute inset-0 p-8 md:p-12 bg-gradient-to-b from-indigo-950/60 to-blue-950/40 backdrop-blur-sm rounded-xl border border-indigo-900/30 shadow-xl flex flex-col"
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0,
                  x: index === activeIndex ? 0 : (index < activeIndex ? -100 : 100),
                  zIndex: index === activeIndex ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute top-8 right-8 text-indigo-400 opacity-30">
                  <Quote size={48} />
                </div>
                
                <p className="text-lg text-gray-300 mb-8 relative z-10">"{testimonial.content}"</p>
                
                <div className="mt-auto flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-500"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-indigo-300">{testimonial.position}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute -right-4 md:-right-12 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              className="p-2 rounded-full bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/30 text-white hover:bg-indigo-800/60 transition-colors duration-200"
              onClick={nextTestimonial}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === activeIndex ? "bg-indigo-500" : "bg-indigo-900/40"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 