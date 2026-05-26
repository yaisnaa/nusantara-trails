/**
 * Component components/StoryCard.js
 * Card untuk menampilkan ringkasan cerita budaya.
 */

import Link from 'next/link';

export default function StoryCard({ story }) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-deep-green/10 pb-12 last:border-0">
      <div className="md:col-span-5 aspect-video overflow-hidden bg-gray-200">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="md:col-span-7">
        <span className="text-[10px] uppercase tracking-widest font-bold text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
          {story.category}
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-deep-green mt-4 leading-tight">
          {story.title}
        </h2>
        <p className="mt-4 text-dark-text/70">
          {story.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Link href={`/stories`} className="text-sm font-bold border-b-2 border-terracotta pb-1 hover:text-terracotta transition-colors">
            Baca Selengkapnya
          </Link>
        </div>
      </div>
    </article>
  );
}
