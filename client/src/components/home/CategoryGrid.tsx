
import { categories } from '@/lib/mockData';
import { Link } from 'wouter';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/shop/${cat.id}`}>
          <div className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer">
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-serif font-bold text-white border-b-2 border-transparent group-hover:border-white transition-all pb-1">
                {cat.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
