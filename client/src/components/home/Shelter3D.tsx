export default function Shelter3D() {
  return (
    <div className="w-full h-[600px] bg-stone-100 relative rounded-xl overflow-hidden border border-stone-400/20 shadow-inner">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg max-w-xs pointer-events-none">
         <h3 className="font-bold text-[#3E2723]">Interactive 3D Model</h3>
         <p className="text-sm text-muted-foreground">Click and drag to rotate. Scroll to zoom.</p>
      </div>
      
      <div className="sketchfab-embed-wrapper w-full h-full">
        <iframe 
          title="underground storm shelter" 
          frameBorder="0" 
          allowFullScreen 
          mozallowfullscreen="true" 
          webkitallowfullscreen="true" 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          xr-spatial-tracking 
          execution-while-out-of-viewport 
          execution-while-not-rendered 
          web-share 
          src="https://sketchfab.com/models/c4e63133cb56419a93afa2b5d3fd2b01/embed?ui_theme=dark"
          className="w-full h-full"
        >
        </iframe>
      </div>
    </div>
  );
}