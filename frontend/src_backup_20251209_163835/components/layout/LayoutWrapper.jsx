export default function LayoutWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 w-full z-50">
        {/* Header component sera injecté ici */}
      </header>

      {/* Contenu principal avec espace pour le header */}
      <main className="flex-1 pt-20">{children}</main>

      {/* Footer */}
      <footer>{/* Footer component sera injecté ici */}</footer>
    </div>
  );
}
