import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Music, Users, Download, CreditCard, Shield, HelpCircle, Upload, CheckCircle } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

export default function FAQ() {
  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      color: "text-blue-500",
      faqs: [
        {
          question: "What is Ateker Music?",
          answer: "Ateker Music is a free music streaming and download platform celebrating Eastern Uganda's musical heritage. We provide a space for artists from Teso, Bukedi, Busoga, and beyond to share their music with the world. Users can stream and download music for free, while artists can upload their work and optionally earn through premium downloads."
        },
        {
          question: "Do I need an account to listen to music?",
          answer: "No! You can browse, stream, and download free music without creating an account. However, if you want to like songs, follow artists, or access premium features, you'll need to create an account."
        },
        {
          question: "Is Ateker Music really free?",
          answer: "Yes! All free music on the platform can be downloaded at no cost. Some artists may choose to offer premium music for a fee, but the majority of content is completely free."
        },
        {
          question: "What regions and languages are supported?",
          answer: "We support music from all regions of Uganda (Eastern, Northern, Central, Western) with a special focus on Eastern Uganda. We support all major Ugandan languages including Ateso, Luganda, Lusoga, Lugisu, Runyankole, Acholi, Luo, and many more."
        },
        {
          question: "How do I search for music?",
          answer: "Use the search bar on the homepage or Music page to search by song title, artist name, or genre. You can also filter by region, district, language, or genre to discover music from specific areas."
        }
      ]
    },
    {
      title: "For Music Listeners",
      icon: Music,
      color: "text-primary",
      faqs: [
        {
          question: "How do I download music?",
          answer: "For free music, simply click the 'Free Download' button on any song card. The MP3 file will download to your device immediately. For premium music, you'll need to complete the payment process first."
        },
        {
          question: "What audio quality do you offer?",
          answer: "All music is available in high-quality MP3 format, optimized for both streaming and offline listening. File sizes are kept reasonable (max 10MB) to ensure fast downloads even on slower connections."
        },
        {
          question: "Can I use downloaded music commercially?",
          answer: "No. Downloaded music is for personal, non-commercial use only. If you want to use music commercially (in videos, advertisements, etc.), you must contact the artist directly for licensing."
        },
        {
          question: "How do I support my favorite artists?",
          answer: "You can support artists by: (1) Streaming and downloading their music to increase their play counts, (2) Liking and sharing their songs, (3) Following them to stay updated, (4) Purchasing their premium music, and (5) Sharing their work on social media."
        },
        {
          question: "What's the difference between free and premium music?",
          answer: "Free music can be downloaded at no cost. Premium music requires payment (set by the artist) before download. Premium purchases support artists directly, with 55% of the sale going to the artist and 45% to platform maintenance."
        }
      ]
    },
    {
      title: "For Artists",
      icon: Users,
      color: "text-purple-500",
      faqs: [
        {
          question: "How do I become an artist on Ateker Music?",
          answer: "Click 'Sign Up' and register as an artist. You'll need to provide your full name, email, phone number, National ID Number (NIN), and location details. After registration, an admin will review and approve your account within 24-48 hours."
        },
        {
          question: "What information do I need to register?",
          answer: "You'll need: (1) Your full legal name, (2) Stage/artist name, (3) Valid email address, (4) Phone number, (5) National ID Number (NIN) for verification, (6) District and location details, (7) A profile picture (optional but recommended), and (8) A brief biography."
        },
        {
          question: "How do I upload music?",
          answer: "After your artist account is approved: (1) Log in and go to your Dashboard, (2) Click 'Upload Song', (3) Fill in song details (title, genre, language, lyrics), (4) Upload your MP3 file (max 10MB), (5) Upload a square cover image (max 1MB - we provide a crop tool), (6) Choose free or premium pricing, (7) Submit for admin approval."
        },
        {
          question: "What file formats do you accept?",
          answer: "We accept MP3 files only, with a maximum size of 10MB. Cover images must be square (we provide a cropping tool) and under 1MB. Supported image formats include JPG, PNG, and WebP."
        },
        {
          question: "How long does song approval take?",
          answer: "Song approvals typically take 24-48 hours. You'll receive a notification once your song is approved or if any changes are needed. You can check the status in your Dashboard."
        },
        {
          question: "Can I edit my songs after uploading?",
          answer: "You can edit song details (title, genre, language, lyrics) at any time. However, you cannot replace the audio file or cover image after approval. If you need to change these, you'll need to upload a new version."
        },
        {
          question: "Can I delete my songs?",
          answer: "Yes, you can delete your songs from your Dashboard at any time. However, this action is permanent and cannot be undone."
        }
      ]
    },
    {
      title: "Premium Music & Payments",
      icon: CreditCard,
      color: "text-green-500",
      faqs: [
        {
          question: "How does premium music work?",
          answer: "Artists can choose to make their music premium by setting a price in Ugandan Shillings (UGX). When users purchase premium music, they get a permanent download license for personal use. Artists receive 55% of the sale price, and the platform retains 45% for hosting and operations."
        },
        {
          question: "How do I set my music as premium?",
          answer: "When uploading a song, toggle the 'Premium' option and enter your desired price in UGX. We recommend pricing between UGX 1,000 - 10,000 depending on your fanbase and music quality."
        },
        {
          question: "How do I get paid as an artist?",
          answer: "Premium earnings are paid out monthly via Mobile Money (MTN or Airtel) to artists who have earned at least UGX 50,000. You'll need to provide valid Mobile Money details in your profile. Payments are processed within the first week of each month."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept Mobile Money (MTN and Airtel), Visa/Mastercard credit/debit cards, and other local payment methods through our secure payment partners. All transactions are encrypted and PCI-compliant."
        },
        {
          question: "Can I get a refund on premium music?",
          answer: "Refunds are only provided in cases of technical errors that prevent download. Refund requests must be submitted within 7 days of purchase. Once you've successfully downloaded a premium song, the sale is final."
        },
        {
          question: "How do I track my earnings?",
          answer: "Your Dashboard shows real-time statistics including total plays, downloads, likes, and earnings. You can view detailed transaction history and request payouts when you reach the minimum threshold."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Shield,
      color: "text-red-500",
      faqs: [
        {
          question: "The website isn't loading properly. What should I do?",
          answer: "Try these steps: (1) Clear your browser cache and cookies, (2) Try a different browser (we support Chrome, Firefox, Safari, Edge), (3) Check your internet connection, (4) Disable browser extensions temporarily, (5) Try accessing from a different device. If the problem persists, contact support."
        },
        {
          question: "I can't log in to my account",
          answer: "If you're having login issues: (1) Make sure you're using the correct email and password, (2) Try the 'Forgot Password' option to reset your password, (3) Check if your account has been approved (artists only), (4) Clear your browser cache, (5) Contact support if the issue persists."
        },
        {
          question: "My song upload failed. What went wrong?",
          answer: "Common upload issues: (1) File size exceeds 10MB - compress your MP3, (2) File is not in MP3 format - convert it first, (3) Cover image exceeds 1MB - use our crop tool or compress the image, (4) Poor internet connection - try again with a stable connection, (5) Browser compatibility - try Chrome or Firefox."
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Login', then 'Forgot Password'. Enter your registered email address and we'll send you a password reset link. Follow the link to create a new password. If you don't receive the email, check your spam folder or contact support."
        },
        {
          question: "Is my data secure?",
          answer: "Yes! We use industry-standard encryption for all data transmission and storage. Your personal information, payment details, and uploaded content are protected by Supabase's enterprise-grade security. We never share your data with third parties without your consent."
        },
        {
          question: "Which browsers do you support?",
          answer: "Ateker Music works best on modern browsers: Google Chrome (recommended), Mozilla Firefox, Safari, Microsoft Edge, and Opera. We recommend keeping your browser updated to the latest version for the best experience."
        },
        {
          question: "Can I use Ateker Music on mobile?",
          answer: "Yes! Ateker Music is fully responsive and works on all mobile devices. We also support Progressive Web App (PWA) features, allowing you to install the website as an app on your phone for offline access and a native app-like experience."
        }
      ]
    },
    {
      title: "AI Features",
      icon: CheckCircle,
      color: "text-indigo-500",
      faqs: [
        {
          question: "What AI features do you offer?",
          answer: "We offer AI-powered tools to help artists: (1) Biography Generator - create professional artist bios from keywords, (2) Song Description Writer - generate engaging song descriptions, (3) Content Suggestions - get ideas for promoting your music. These features are powered by Hugging Face AI."
        },
        {
          question: "How do I use the AI Biography Generator?",
          answer: "In your Dashboard, click the 'AI Assistant' button. Enter a few keywords about yourself (genre, location, influences, achievements) and the AI will generate a professional biography. You can edit the generated text before saving."
        },
        {
          question: "Is AI used to create or modify music?",
          answer: "No! We do NOT use AI for audio manipulation or music creation. All music on Ateker Music must be original work created by the artist. AI is only used for text generation (bios, descriptions) and profile enhancement."
        },
        {
          question: "Do I have to use AI features?",
          answer: "No, AI features are completely optional. You can write your own biography, descriptions, and content manually. The AI tools are there to help if you need inspiration or assistance."
        }
      ]
    }
  ];

  return (
    <Layout>
      <SEOHead 
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about Ateker Music - from downloading music to uploading songs, premium features, payments, and technical support."
        keywords={["FAQ", "help", "support", "how to download", "how to upload", "premium music", "payments", "technical support"]}
      />

      <div className="container py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about using Ateker Music. Can't find what you're looking for? 
            <a href="/contact" className="text-primary hover:underline ml-1">Contact us</a>.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <Card key={categoryIndex} className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-lg bg-muted ${category.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-card-foreground">{category.title}</h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            );
          })}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you. Get in touch and we'll respond as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="mailto:info@atekermusic.com" 
                className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Email Us
              </a>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <p>📧 info@atekermusic.com</p>
              <p>📞 +256 787 168666 / +256 757 566144</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
