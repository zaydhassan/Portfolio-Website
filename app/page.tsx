import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Services from "@/components/sections/Services";
import Stats from "@/components/sections/Stats";
import Assistant from "@/components/sections/Assistant";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/ui/Marquee";
import Divider from "@/components/ui/Divider";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import SocialRail from "@/components/ui/SocialRail";

const TECH = [
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "OpenAI",
  "LangChain",
  "RAG",
  "Docker",
  "AWS",
  "Three.js",
  "Framer Motion",
];

export default function Home() {
  return (
    <main id="main" className="relative flex w-full flex-col">
      <ScrollProgress />
      <SocialRail />
      <BackToTop />
      <Hero />
      <About />
      <Marquee items={TECH} className="border-y border-hairline py-6" duration={45} />
      <Projects />
      <Divider />
      <Skills />
      <Divider />
      <Experience />
      <Divider />
      <Services />
      <Stats />
      <Assistant />
      <Footer />
    </main>
  );
}