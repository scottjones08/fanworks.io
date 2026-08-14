import { useState } from "react";
import { Contact } from "./components/Contact";
import { Ethos } from "./components/Ethos";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Journey } from "./components/Journey";
import { Story } from "./components/Story";
import { Work } from "./components/Work";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Journey />
      <Work />
      <Ethos />
      <Story />
      <Contact />
      <Footer />
    </main>
  );
}
