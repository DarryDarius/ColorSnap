import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type Expert = {
  id: string; // ex1..ex11
  name: string;
  title: string;
  bio: string;
  icon: string;
};

export function ConsultationPage() {
  const navigate = useNavigate();

  const experts = useMemo<Expert[]>(
    () => [
      {
        id: "ex1",
        name: "Yuna Lee",
        icon: "🌿",
        title: "Personal Color Consultant – Busan, South Korea",
        bio: "With 5 years of experience in personal color analysis, Yuna has helped over 200 clients discover their best tones. She specializes in soft summer and light spring palettes and is known for her calm, intuitive approach to everyday styling.",
      },
      {
        id: "ex2",
        name: "Jisoo Park",
        icon: "💼",
        title: "Senior Color Consultant – Seoul, South Korea",
        bio: "Jisoo has worked with ColorSnap for over 6 years, specializing in deep winter and cool summer tones. Her clients appreciate her structured yet friendly approach, helping them translate analysis into confident everyday outfits.",
      },
      {
        id: "ex3",
        name: "Soojin Kwon",
        icon: "🌸",
        title: "Color & Style Coach – Incheon, South Korea",
        bio: "Soojin has been part of the ColorSnap team for 4 years, blending personal color theory with real-life styling. She is especially skilled in light summer and soft autumn tones, making color feel both calming and empowering.",
      },
      {
        id: "ex4",
        name: "Ha-eun Lim",
        icon: "🌷",
        title: "Junior Color Consultant – Daejeon, South Korea",
        bio: "Ha-eun joined ColorSnap after studying fashion color psychology and focuses on fresh, youthful palettes like light spring and clear winter. Her bright energy and easy-to-follow tips delight her clients.",
      },
      {
        id: "ex5",
        name: "Nia Brooks",
        icon: "☀️",
        title: "Color Coach – Seoul, South Korea",
        bio: "Nia brings a global perspective with her background in beauty marketing and skin tone inclusivity. She specializes in deep autumn and true winter palettes, celebrating bold, rich color stories.",
      },
      {
        id: "ex6",
        name: "Elizabeth Lee",
        icon: "💎",
        title: "Certified Color Analyst – Seoul, South Korea",
        bio: "With 7 years of experience, Elizabeth works with neutral and cool undertones. Clients trust her for timeless advice and thoughtful guidance on balancing personality with palette.",
      },
      {
        id: "ex7",
        name: "Eunji Han",
        icon: "🌸",
        title: "Lead Color Consultant – Seoul, South Korea",
        bio: "Eunji has over 6 years at ColorSnap and is renowned for her precise cool/warm contrast assessments. Her sessions are both insightful and uplifting.",
      },
      {
        id: "ex8",
        name: "Ara Jeong",
        icon: "🍃",
        title: "Color Specialist – Gwangju, South Korea",
        bio: "With a background in fashion retail and color consulting, Ara has spent 5 years simplifying wardrobes using muted seasonal palettes and tone-on-tone styling.",
      },
      {
        id: "ex9",
        name: "Audrey Chen",
        icon: "🎀",
        title: "Color Consultant – Shenzhen, China",
        bio: "Audrey is known for her energetic, modern take on clear spring and bright summer palettes. She helps young professionals build fresh, color-smart wardrobes.",
      },
      {
        id: "ex10",
        name: "Talia Kim",
        icon: "🌟",
        title: "Color Strategy Consultant – Seoul, South Korea",
        bio: "Talia combines consulting experience with digital media expertise to help clients understand color’s role in style, branding, and identity. She specializes in bright spring and clear winter palettes.",
      },
      {
        id: "ex11",
        name: "Olivia Bennett",
        icon: "🌼",
        title: "Color Consultant – San Francisco, USA",
        bio: "Olivia focuses on soft summer and cool neutral palettes with 4 years of experience. With expertise in wardrobe styling and personal branding, she creates looks that are fresh and polished.",
      },
    ],
    [],
  );

  return (
    <section className="consultation-section">
      <h2>Expert Consultation</h2>
      <p>
        Our professional color consultants provide one-on-one consultation via
        video call, offering personalized advice based on your color palette
        results. Choose an expert below to learn more about their approach and
        schedule your consultation.
      </p>

      <div className="experts-grid">
        {experts.map((expert) => (
          <div key={expert.id} className="expert-card">
            <img
              className="photo"
              src={`images/${expert.id}.jpg`}
              alt={expert.name}
            />
            <h3>
              <span className="icon">{expert.icon}</span> {expert.name}
            </h3>
            <h4>{expert.title}</h4>
            <p>{expert.bio}</p>
            <button
              type="button"
              onClick={() => navigate(`/booking?expert=${expert.id}`)}
            >
              Book Consultation
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}


