export function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-black/20">
      <div className="container-page py-8 text-sm text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white font-medium">{new Date().getFullYear()} Lenso - AI-Powered Anonymous Moments</p>
        <p className="flex items-center gap-4">
          <span className="text-gray-400">Share moments, not profiles.</span>
        </p>
      </div>
    </footer>
  )
}

