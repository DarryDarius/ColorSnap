import { useMemo, useState } from "react";

type FaqCategory = "Getting started" | "Accuracy" | "Privacy" | "Sharing" | "Pricing";

type Faq = { q: string; a: string; category: FaqCategory };

export function FaqPage() {
  const faqs = useMemo<Faq[]>(
    () => [
      {
        category: "Getting started",
        q: "1. How does AI color analysis work?",
        a: "Our AI analyzes your uploaded photo by detecting your undertone, contrast level, and facial features, then matches you to a seasonal color palette (like “Warm Autumn” or “Cool Summer”) based on real color theory.",
      },
      {
        category: "Getting started",
        q: "2. Do I need to wear makeup in my photo?",
        a: "Actually, no! For best results, we recommend a bare-faced photo in natural lighting, with your hair pulled away from your face.",
      },
      {
        category: "Getting started",
        q: "3. Can I use a photo I already have?",
        a: "Yes—just make sure it’s clear, taken in soft daylight, and not heavily filtered or edited.",
      },
      {
        category: "Getting started",
        q: "4. What happens after I get my result?",
        a: "You’ll receive your color season, a custom palette, helpful styling tips, and curated product suggestions tailored to your tones.",
      },
      {
        category: "Accuracy",
        q: "5. How accurate is the AI?",
        a: "Our AI gives a strong, research-based result, but since color is personal, we also offer expert consultations if you'd like deeper guidance.",
      },
      {
        category: "Getting started",
        q: "6. Can I talk to a real color consultant?",
        a: "Yes! You can book a virtual consultation with a certified expert who can walk you through your result and give personalized advice.",
      },
      {
        category: "Getting started",
        q: "7. Will I get makeup and clothing recommendations?",
        a: "Definitely—we suggest beauty and fashion items that match your palette, and we’re working on partnerships with real brands too.",
      },
      {
        category: "Getting started",
        q: "8. Will this tell me what colors to avoid?",
        a: "Yes, along with your best shades, we’ll highlight tones that might not complement your coloring, so you can shop smarter.",
      },
      {
        category: "Getting started",
        q: "9. Is this only for women?",
        a: "Not at all! Color analysis works for all genders, styles, and anyone curious about looking and feeling better.",
      },
      {
        category: "Privacy",
        q: "10. Is my photo safe?",
        a: "Absolutely. We don’t store or share your image—it's used only once for analysis.",
      },
      {
        category: "Getting started",
        q: "11. Can I retake the test later?",
        a: "Of course! You can try again any time—especially if your look changes, like new hair color or a tan.",
      },
      {
        category: "Getting started",
        q: "12. What if I don’t like my result?",
        a: "That’s okay! Think of this as a tool, not a rule—trust your own instincts, and reach out to an expert if you’d like support.",
      },
      {
        category: "Getting started",
        q: "13. Can I use this on my phone?",
        a: "Yes—our platform is mobile-friendly, so you can upload and explore your results on any device.",
      },
      {
        category: "Sharing",
        q: "14. Can I share my results on social media?",
        a: "Absolutely! You’ll have the option to share your palette or product recommendations directly with friends.",
      },
      {
        category: "Accuracy",
        q: "15. What makes ColorSnap different from quizzes or filters?",
        a: "We combine real AI tech with certified color consultant insight—not just a trend-based quiz, but something you can actually apply in daily life.",
      },
      {
        category: "Pricing",
        q: "16. Do I need to pay to use it?",
        a: "The basic analysis is free. If you want to go deeper with expert support or premium features, we offer optional upgrades.",
      },
      {
        category: "Accuracy",
        q: "17. Can my color season change over time?",
        a: "Yes—factors like aging, tanning, or hair color changes can shift your palette slightly, so it's worth checking in again once in a while.",
      },
      {
        category: "Getting started",
        q: "18. Will you offer more features in the future?",
        a: "Yes! We’re working on smarter shopping tools, more expert content, and language options to serve a global community.",
      },
      {
        category: "Privacy",
        q: "19. Do you keep or store my photos?",
        a: "No, we don’t store any uploaded images. Your photo is used one time for the AI to generate your result and is not shared.",
      },
      {
        category: "Privacy",
        q: "20. Will my personal data be shared with anyone?",
        a: "Never. We don’t sell, share, or give your personal data to third parties. Your privacy matters to us as much as your perfect color palette does.",
      },
      {
        category: "Privacy",
        q: "21. Is the platform secure to use?",
        a: "Yes. All photo uploads and user data are processed through encrypted, secure channels to ensure your information stays private.",
      },
      {
        category: "Privacy",
        q: "22. Do I need to make an account to use ColorSnap?",
        a: "Nope! You can try the basic analysis without signing up. If you choose to save your results or book a consultation, we may ask for minimal info to make the experience smoother—but never more than necessary.",
      },
    ],
    [],
  );

  const categories = useMemo<FaqCategory[]>(
    () => ["Getting started", "Accuracy", "Privacy", "Sharing", "Pricing"],
    [],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | "All">("All");
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  function toggle(idx: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs
      .map((faq, idx) => ({ faq, idx }))
      .filter(({ faq }) => (category === "All" ? true : faq.category === category))
      .filter(({ faq }) => {
        if (!q) return true;
        return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
      });
  }, [category, faqs, query]);

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-controls">
        <input
          className="faq-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          aria-label="Search FAQ"
        />
        <div className="chips" aria-label="FAQ category filter">
          <button
            type="button"
            className={`chip ${category === "All" ? "active" : ""}`}
            onClick={() => setCategory("All")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="faq-empty">
          No results. Try a different keyword (e.g. “privacy”, “share”, “accurate”).
        </div>
      ) : (
        filtered.map(({ faq, idx }) => (
          <div
            key={faq.q}
            className={`faq-item ${open.has(idx) ? "active" : ""}`}
          >
            <div className="faq-question" onClick={() => toggle(idx)}>
              <span className="faq-qtext">{faq.q}</span>
              <span className="faq-tag">{faq.category}</span>
            </div>
            <div className="faq-answer">{faq.a}</div>
          </div>
        ))
      )}
    </section>
  );
}


