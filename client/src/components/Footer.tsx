import { Link } from 'wouter';
import { Music, Heart, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="Ateker Music Logo" 
                className="w-16 h-16 object-contain"
              />
              <span className="text-xl font-bold text-card-foreground">Ateker Music</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Celebrating Eastern Uganda's Musical Heritage
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/music">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Browse Music
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/artists">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Artists
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/news">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    News & Updates
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Terms & Conditions
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dmca">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    DMCA Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/artist-agreement">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Artist Agreement
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="mailto:info@atekermusic.com" className="hover:text-primary transition-colors">
                    info@atekermusic.com
                  </a>
                  <br />
                  <a href="mailto:enochaengulu@gmail.com" className="hover:text-primary transition-colors">
                    enochaengulu@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+256787168666" className="hover:text-primary transition-colors">
                    +256 787 168666
                  </a>
                  <br />
                  <a href="tel:+256757566144" className="hover:text-primary transition-colors">
                    +256 757 566144
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} Ateker Music. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by{' '}
              <span className="font-semibold text-card-foreground">YOGASWAM I.T SOLUTIONS</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
