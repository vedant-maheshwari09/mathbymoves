export default function GallerySection() {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Chess tournament scene with multiple players competing"
    },
    {
      src: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Professional chess tournament atmosphere"
    },
    {
      src: "https://images.unsplash.com/photo-1568871619588-88d806b1e044?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Chess pieces on wooden board during gameplay"
    },
    {
      src: "https://images.unsplash.com/photo-1550684376-efcbd6d8ed7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Close-up of chess board with strategic positioning"
    },
    {
      src: "https://images.unsplash.com/photo-1529699211952-734e80c2f6b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Tournament hall with concentrated players"
    },
    {
      src: "https://images.unsplash.com/photo-1606092195999-7b0d5d7e5b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Chess pieces with dramatic lighting"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Chess match in progress with players' hands visible"
    },
    {
      src: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Elegant chess set with traditional pieces"
    },
    {
      src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      alt: "Modern tournament setting with digital boards"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-chess-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-chess-black mb-4">Gallery</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto mb-6"></div>
          <p className="text-chess-gray text-lg max-w-2xl mx-auto">
            Tournament moments, competitive scenes, and chess journey highlights
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="gallery-item overflow-hidden rounded-xl shadow-lg">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
