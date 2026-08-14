import { useState } from "react";
import { Approach } from "./components/Approach";
import { Contact } from "./components/Contact";
import { Frictions } from "./components/Frictions";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Ledger } from "./components/Ledger";
import { Practices } from "./components/Practices";
import { Story } from "./components/Story";
import { System } from "./components/System";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <Ledger />
      <System />
      <Frictions />
      <Approach />
      <Practices />
      <Story />
      <Contact />
    </main>
  );
}
