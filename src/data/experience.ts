export type ExperienceItem = {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  start: string;
  end: string;
  notes: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Webmob Technologies",
    title: "Software Engineer",
    location: "Ahmedabad",
    start: "DEC 2023",
    end: "Present",
    bullets: [
      "Built scalable fintech backend systems with Node.js, TypeScript, PostgreSQL, RabbitMQ, and Redis for real-time lending and transactional workflows.",
      "Processed 5K–20K async jobs/day, cut API latency by 30–50%, and reduced database load through caching and event-driven architecture.",
      "Integrated Stripe, Wise, and AWS services to support high-volume payments and secure handling of 10K+ financial and KYC documents.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    institution: "A.D. Patel Institute of Technology",
    degree: "B.Tech. in Computer Science",
    start: "2020",
    end: "2024",
    notes: [
      "Coursework in distributed systems, operating systems, databases, and computer networks.",
      "Capstone focused on fault-aware service coordination in unreliable environments.",
    ],
  },
];
