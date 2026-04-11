const Footer = () => {
  return (
    <footer className="border-t border-[var(--app-border)] bg-[var(--app-bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-[var(--app-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>EventGo</p>
        <p>Plan smarter. Execute calmer.</p>
      </div>
    </footer>
  );
};

export default Footer;
