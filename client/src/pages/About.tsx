import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Music, Heart, Users, TrendingUp, Mail, Phone, Globe } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <div className="container py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Ateker Music
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your premier destination for discovering and downloading the best music from Eastern Uganda
          </p>
        </div>

        {/* Mission */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ateker Music is dedicated to promoting and preserving the rich musical heritage of Eastern Uganda, 
            particularly from the Teso, Bukedi, Busoga, Bugisu, Sebei, and Karamoja regions. We provide a 
            platform where artists can share their music with the world and where music lovers can discover 
            and enjoy authentic Ugandan sounds.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our platform supports traditional genres like Akogo, Ajosi, Ekiriakiria, and Kadodi, alongside 
            modern styles including Afrobeat, Gospel, Reggae, and more. We believe in making music accessible 
            to everyone, which is why all downloads are completely free.
          </p>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Music className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Free Music</h3>
            <p className="text-sm text-muted-foreground">
              Download high-quality MP3s at no cost
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Support Artists</h3>
            <p className="text-sm text-muted-foreground">
              Help local talent reach wider audiences
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Discover Trends</h3>
            <p className="text-sm text-muted-foreground">
              Stay updated with trending music
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Community Driven</h3>
            <p className="text-sm text-muted-foreground">
              Built for and by music lovers
            </p>
          </Card>
        </div>

        {/* Developer Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Built By</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Developer Photo */}
            <div className="flex-shrink-0">
              <img
                src="/developer.jpg"
                alt="Enocha Engulu - Lead Developer"
                className="w-48 h-48 md:w-56 md:h-56 rounded-lg object-cover shadow-lg"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                YOGASWAM I.T SOLUTIONS
              </h3>
              <p className="text-muted-foreground mb-4">
                Professional IT solutions provider specializing in web development, mobile app development, 
                and custom software engineering. Based in Soroti, Eastern Uganda, we create innovative 
                digital solutions that serve local communities and beyond.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-1">Lead Developer</h4>
                  <p className="text-muted-foreground">
                    <strong>Enocha Engulu</strong> - I.T Specialist, Web Developer, App Developer & Software Engineer
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based in Soroti, Eastern Uganda
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <a
                    href="mailto:enochaengulu@gmail.com"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    enochaengulu@gmail.com
                  </a>
                  <a
                    href="mailto:info@atekermusic.com"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    info@atekermusic.com
                  </a>
                  <a
                    href="tel:+256787168666"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    +256 787 168666
                  </a>
                  <a
                    href="tel:+256757566144"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    +256 757 566144
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Join Our Community
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you're an artist looking to share your music or a music lover seeking new sounds, 
            Ateker Music is here for you. Together, let's celebrate the vibrant musical culture of Eastern Uganda.
          </p>
        </div>
      </div>
    </Layout>
  );
}
