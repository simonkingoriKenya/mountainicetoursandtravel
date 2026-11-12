export const mountainMenu = [
  { slug: "private-treks", title: "Mount Kenya Private Treks" },
  { slug: "group-treks", title: "Mount Kenya Group Departures" },
  { slug: "batian-nelion", title: "Technical Climbing — Batian & Nelion" },
  { slug: "kilimanjaro", title: "Climb Kilimanjaro" },
  { slug: "mount-elgon", title: "Mount Elgon Trek" },
  { slug: "kenya-day-trip", title: "Mount Kenya Day Hike" },
] as const;

export const safariMenu = [
  { slug: "kenya-wildlife", title: "Kenya Wildlife Safaris" },
  { slug: "northern-kenya", title: "Northern Kenya Safaris" },
  { slug: "tanzania-wildlife", title: "Tanzania Wildlife Safaris" },
  { slug: "kenya-day-trip", title: "Kenya Day Trip Safaris" },
] as const;

export const fieldServiceMenu = [
  { slug: "gear-rental", title: "Mountain gear rental" },
  { slug: "transport", title: "Transport & transfers" },
  { slug: "team-hikes", title: "Team hikes & conditioning" },
  { slug: "film-photography", title: "Film & photography support" },
  { slug: "vip-itineraries", title: "VIP private itineraries" },
] as const;

export type DestinationContent = {
  title: string;
  eyebrow: string;
  summary: string;
  overview: string;
  image: "mountain" | "safari" | "crew";
  highlights: readonly string[];
  tourSlugs: readonly string[];
};

export const mountainPages = {
  "private-treks": {
    title: "Mount Kenya Private Treks",
    eyebrow: "Mount Kenya · Kilimanjaro · Meru",
    summary: "A mountain journey planned around your group, dates and pace.",
    overview: "Choose from established routes on Mount Kenya, Kilimanjaro and Mount Meru. The team can shape a private plan around your experience and the conditions; final route details and park charges are confirmed before booking.",
    image: "mountain",
    highlights: ["Private planning for your party", "Mount Kenya, Kilimanjaro and Meru route options", "Safety and crew welfare considered from the start"],
    tourSlugs: ["sirimon-chogoria", "naro-moru", "machame", "lemosho", "meru"],
  },
  "group-treks": {
    title: "Mount Kenya Group Departures",
    eyebrow: "Shared trail · Local mountain crew",
    summary: "Explore mountain routes with a group and experienced local support.",
    overview: "Mount Kenya and Kilimanjaro routes can be discussed for group travel. Share your preferred dates, group size and experience so the team can confirm an appropriate option and availability.",
    image: "mountain",
    highlights: ["Group-size planning", "Route options for different trip lengths", "Availability confirmed directly with the team"],
    tourSlugs: ["sirimon-chogoria", "naro-moru", "machame", "lemosho"],
  },
  "batian-nelion": {
    title: "Technical Climbing — Batian & Nelion",
    eyebrow: "Mount Kenya · Technical objectives",
    summary: "Technical climbing logistics shaped around experience, conditions and route availability.",
    overview: "Batian and Nelion are technical climbing objectives on Mount Kenya. The team discusses experience, intended route, conditions and logistics before confirming a plan; this is not a standard trekking itinerary.",
    image: "mountain",
    highlights: ["Technical objective review", "Experience and conditions discussed before planning", "Itinerary and quote tailored to the climb"],
    tourSlugs: ["batian-nelion"],
  },
  kilimanjaro: {
    title: "Climb Kilimanjaro",
    eyebrow: "Tanzania · 5,895 m ASL",
    summary: "Compare the Machame, Lemosho and Marangu routes before choosing your climb.",
    overview: "Choose among the listed Machame, Lemosho and Marangu climbs. Confirmed starting prices are shown for Machame and Lemosho; Marangu and any final inclusions are quoted by the team.",
    image: "mountain",
    highlights: ["Machame · 7 days · from $2,250", "Lemosho · 8 days · from $2,520", "Marangu · 6 days · tailored quote"],
    tourSlugs: ["machame", "lemosho", "marangu"],
  },
  "kenya-day-trip": {
    title: "Mount Kenya Day Hike",
    eyebrow: "Day walks · Kenya",
    summary: "A guided day outdoors, from a conditioning hike to a tailored local outing.",
    overview: "Ask about day outings such as Elephant Hill and Mount Longonot, or share your preferred area and pace. The team will confirm the route, dates, access and quote for your group.",
    image: "crew",
    highlights: ["Elephant Hill and Mount Longonot options", "Corporate and private groups", "Route and access details confirmed before booking"],
    tourSlugs: ["corporate-hike"],
  },
  "mount-elgon": {
    title: "Mount Elgon Trek",
    eyebrow: "East Africa · Mountain trek",
    summary: "Discuss a Mount Elgon trek with the team before settling the route and dates.",
    overview: "Tell us your preferred dates, group size and experience. Route details, access, permits and availability are confirmed with the team before a Mount Elgon plan is quoted.",
    image: "mountain",
    highlights: ["Route plan confirmed for your dates", "Access and permits discussed before booking", "No unconfirmed prices or itinerary details"],
    tourSlugs: [],
  },
  "mount-kenya-flight": {
    title: "Mount Kenya flight tour",
    eyebrow: "Mount Kenya · Scenic perspective",
    summary: "Ask about scenic-flight arrangements and current availability around Mount Kenya.",
    overview: "Share your preferred dates and group size to discuss a Mount Kenya flight experience. The operator, flight route, weather conditions, availability and price must be confirmed before any booking.",
    image: "mountain",
    highlights: ["Flight availability confirmed for your dates", "Operator and route details confirmed before booking", "Weather-dependent planning"],
    tourSlugs: [],
  },
} satisfies Record<(typeof mountainMenu)[number]["slug"], DestinationContent> & {
  "mount-kenya-flight": DestinationContent;
};

export const safariPages = {
  "kenya-wildlife": {
    title: "Kenya Wildlife Safaris",
    eyebrow: "Maasai Mara · Amboseli · Rift Valley",
    summary: "Wildlife journeys through Kenya’s varied landscapes, planned around your dates.",
    overview: "Explore the Maasai Mara, Amboseli, Lake Nakuru and Lake Naivasha. Safari duration, seasonal conditions, park access and final pricing are confirmed for your travel dates.",
    image: "safari",
    highlights: ["Maasai Mara · 3- and 5-day options", "Amboseli · elephants beneath Kilimanjaro", "Nakuru and Naivasha · Rift Valley escapes"],
    tourSlugs: ["mara-3", "mara-5", "amboseli", "rift-valley"],
  },
  "northern-kenya": {
    title: "Northern Kenya Safaris",
    eyebrow: "Ol Pejeta · Samburu",
    summary: "A northern circuit connecting two distinct Kenyan wildlife landscapes.",
    overview: "The listed Ol Pejeta and Samburu circuit combines Kenya’s highlands and northern frontier. Ask the team to confirm the route, dates, inclusions and quote for your group.",
    image: "safari",
    highlights: ["Ol Pejeta and Samburu circuit", "Listed 5-day journey", "Dates and pricing confirmed by request"],
    tourSlugs: ["northern-circuit"],
  },
  "kenya-day-trip": {
    title: "Kenya Day Trip Safaris",
    eyebrow: "Wildlife · One day at a time",
    summary: "Ask about a short wildlife outing from your starting point in Kenya.",
    overview: "Share your departure point, dates and interests to discuss a Kenya day-trip safari. Park choice, travel time, access, availability and pricing depend on the location and are confirmed by the team.",
    image: "safari",
    highlights: ["Tailored to your departure point", "Park access and timing confirmed in advance", "Request a quote for your group"],
    tourSlugs: [],
  },
  "tanzania-wildlife": {
    title: "Tanzania Wildlife Safaris",
    eyebrow: "Tanzania · Wildlife journeys",
    summary: "Plan a Tanzania safari around your travel dates and wildlife interests.",
    overview: "Tell the team which areas interest you, when you plan to travel and how long you have. Park selection, itinerary, availability and pricing are confirmed before a booking is made.",
    image: "safari",
    highlights: ["Itinerary planned to your dates and interests", "Park and route details confirmed directly", "No unconfirmed rates shown"],
    tourSlugs: [],
  },
} satisfies Record<(typeof safariMenu)[number]["slug"], DestinationContent>;

export const fieldServicePages = {
  "gear-rental": {
    title: "Mountain gear rental",
    eyebrow: "Field services · Equipment",
    summary: "Rent practical camp and mountain equipment by the day.",
    overview: "Available equipment listed on the site includes four-season tents, sub-zero sleeping bags, trekking poles, crampons, camp stoves and mess kits. Confirm fit, stock and rental dates before collection.",
    image: "crew",
    highlights: ["2-person tent · $15 per day", "4-person tent · $25 per day", "Sleeping bag · $8 per day", "Poles, crampons and camp kit · ask for current rates"],
    tourSlugs: [],
  },
  transport: {
    title: "Transport & transfers",
    eyebrow: "Field services · Ground transport",
    summary: "Arrange a safari vehicle, driver-guide or transfer with the field team.",
    overview: "The fleet offering includes 4×4 safari Land Cruisers and safari vans, plus airport and Nanyuki transfers. Confirm vehicle availability, route, driver arrangement and final price for your dates.",
    image: "safari",
    highlights: ["Safari Land Cruiser · $160–$220 per day", "Safari van · $95–$140 per day", "KATO driver-guide or self-drive by arrangement", "Airport and Nanyuki transfers"],
    tourSlugs: [],
  },
  "team-hikes": {
    title: "Team hikes & conditioning",
    eyebrow: "Field services · Groups",
    summary: "Bring a team together outdoors or build confidence before a bigger climb.",
    overview: "Corporate team days and weekend conditioning hikes can be planned around group size, fitness, location and preferred pace. Elephant Hill and Mount Longonot are among the requested outing options.",
    image: "crew",
    highlights: ["Corporate team-building days", "Elephant Hill and Mount Longonot options", "Route and pace planned for the group"],
    tourSlugs: ["corporate-hike"],
  },
  "film-photography": {
    title: "Film & photography support",
    eyebrow: "Field services · Production logistics",
    summary: "Discuss field logistics for a film or photography trip in East Africa.",
    overview: "Share your production dates, locations, crew size and field requirements. The team can discuss local logistics and a tailored plan; permits and operator availability are confirmed for each project.",
    image: "crew",
    highlights: ["Location and travel logistics by request", "Crew and equipment needs discussed in advance", "Permits and availability confirmed for each project"],
    tourSlugs: [],
  },
  "vip-itineraries": {
    title: "VIP private itineraries",
    eyebrow: "Field services · Private travel",
    summary: "Build a private East African itinerary around the way you want to travel.",
    overview: "Tell the team your dates, interests, pace and preferred level of support. Mountain journeys, wildlife travel, vehicle arrangements and practical field services can be discussed together in one tailored request.",
    image: "mountain",
    highlights: ["Private planning", "Mountain, safari and ground-transport options", "Final availability and inclusions confirmed in writing"],
    tourSlugs: [],
  },
} satisfies Record<(typeof fieldServiceMenu)[number]["slug"], DestinationContent>;