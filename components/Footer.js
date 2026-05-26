/**
 * Component components/Footer.js
 * Bagian bawah website berisi hak cipta dan info tugas.
 */

export default function Footer() {
  return (
    <footer className="w-full bg-deep-green text-cream mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-cream/10 pb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 italic">Nusantara Trails</h3>
            <p className="max-w-md text-cream/70">
              Menemukan kembali akar budaya Indonesia melalui perjalanan ke tempat-tempat yang jarang terjamah.
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-sm font-medium uppercase tracking-widest text-terracotta mb-2">Tugas Kuliah</p>
            <p className="text-cream/70">Mata Kuliah: Pemrograman Web</p>
            <p className="text-cream/70">Tema: Tourism & Culture Exchange Indonesia</p>
          </div>
        </div>
        
        <div className="pt-8 flex justify-between items-center text-sm text-cream/50 uppercase tracking-tighter">
          <p>© 2024 Nusantara Trails. Dibuat dengan cinta untuk Indonesia.</p>
          <p>Powered by Next.js 14</p>
        </div>
      </div>
    </footer>
  );
}
