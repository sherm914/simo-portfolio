export default function Services() {
  const services = [
    {
      title: 'Video Editing',
      description: 'Professional editing for commercials, documentaries, social media content, and more.',
      icon: '✂️'
    },
    {
      title: 'VFX & Motion Graphics',
      description: 'Custom visual effects and animated graphics to elevate your content.',
      icon: '✨'
    },
    {
      title: 'Color Grading',
      description: 'Professional color correction and grading for cinematic look and feel.',
      icon: '🎨'
    },
    {
      title: 'Production',
      description: 'Full production management from pre-production planning to final delivery.',
      icon: '🎬'
    },
    {
      title: 'Motion Design',
      description: 'Dynamic motion graphics and animated sequences for titles and transitions.',
      icon: '🎯'
    },
    {
      title: 'Consultation',
      description: 'Creative consultation and direction for your visual projects.',
      icon: '💡'
    }
  ];

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-white mb-12">Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-zinc-900 p-8 rounded-lg hover:bg-zinc-800 transition">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-zinc-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
