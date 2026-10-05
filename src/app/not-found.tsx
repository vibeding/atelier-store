import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-narrow section text-center">
      <p className="text-eyebrow text-ink-muted">404</p>
      <h1 className="text-display mt-3">Page not found</h1>
      <p className="mt-4 text-ink-muted">
        The page you are looking for has moved or no longer exists.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
