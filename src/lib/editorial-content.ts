export const fieldNotes = [
  {
    slug: "choosing-a-mount-kenya-route",
    title: "Choosing a route across Mount Kenya",
    category: "Mountain planning",
    summary: "Compare trip length, starting point and the kind of mountain day you want before choosing a trek.",
    image: "mountain",
    paragraphs: [
      "A useful first step is to decide how much time you have and what matters most to your group. The five-day Sirimon–Chogoria traverse and the four-day Naro Moru ascent are different starting points, not interchangeable itineraries.",
      "Think about your recent time at altitude, the pace your group prefers and whether a traverse or a more direct ascent suits you. A guide can help match those details to an appropriate route and current conditions.",
      "Park charges, route access, dates and inclusions should be checked for the actual trip before you book. Share your dates and experience with the Nanyuki team to discuss the available options.",
    ],
  },
  {
    slug: "preparing-for-a-high-altitude-trek",
    title: "Preparing for a high-altitude trek",
    category: "On the mountain",
    summary: "A practical starting checklist for conversations about fitness, kit and mountain readiness.",
    image: "crew",
    paragraphs: [
      "Preparation begins with an honest conversation about your walking experience, health, group pace and available training time. A route should fit the people taking it, not just the number of days on a calendar.",
      "Make a personal gear list with the operator before departure. Layers, footwear and sleep equipment need to suit the route and conditions; rental availability and fit should be confirmed before travel.",
      "Ask how the team handles health checks, guide communication and changes to the plan on the mountain. The details of safety support should be clear before your group sets out.",
    ],
  },
  {
    slug: "planning-a-kenya-wildlife-safari",
    title: "Planning a Kenya wildlife safari",
    category: "Safari planning",
    summary: "Start with your travel dates, interests and time on the ground to shape the right safari conversation.",
    image: "safari",
    paragraphs: [
      "Kenya offers very different wildlife landscapes. Your starting point, the length of your trip and the animals or places you hope to see all affect which itinerary is a sensible fit.",
      "Before confirming a safari, ask for a clear route, accommodation plan, vehicle arrangements, park charges and inclusions for your dates. Seasonal conditions and availability can change what is practical.",
      "A three-day Mara visit, an Amboseli trip and a northern circuit have different rhythms. Share your priorities and travel window so the team can help you compare the options.",
    ],
  },
] as const;

export type FieldNote = (typeof fieldNotes)[number];
export type FieldNoteSlug = FieldNote["slug"];
