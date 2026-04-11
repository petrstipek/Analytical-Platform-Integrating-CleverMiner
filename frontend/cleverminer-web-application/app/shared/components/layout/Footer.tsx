import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CleverMiner Analytical Platform
          </div>
          <div className="flex gap-4 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" to="/login">
              Log in
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" to="/register">
              Register
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              to="https://github.com/petrstipek/Analytical-Platform-Integrating-CleverMiner"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
