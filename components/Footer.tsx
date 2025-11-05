export function Footer() {
  return (
    <footer className="mt-10 border-t">
      <div className="container-page py-6 text-sm text-gray-500 flex items-center justify-between">
        <p>Ac {new Date().getFullYear()} Lenso</p>
        <p className="flex items-center gap-4">
          <span>Feel like you were there.</span>
          <a href="/about-and-plans.txt" className="underline hover:text-gray-700">Vision & Plans</a>
        </p>
      </div>
    </footer>
  )
}

