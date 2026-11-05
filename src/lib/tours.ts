export const currencies = ["USD", "EUR", "GBP", "CAD", "KES"] as const;
export type Currency = (typeof currencies)[number];
export type VisitorClass = "non_resident" | "resident";

export interface Tour {
  slug: string;
  title: string;
  destination: string;
  service: "Mountain" | "Safari" | "Other";
  days: number;
  startingUsd: number;
  highestUsd?: number;
  peak?: string;
  route?: string;
  summary: string;
  image: string;
}

export const tours: Tour[] = [
  { slug: "sirimon-chogoria", title: "Sirimon–Chogoria Traverse", destination: "Mount Kenya", service: "Mountain", days: 5, startingUsd: 1120, highestUsd: 1350, peak: "5,199 m ASL", route: "Sirimon · Shipton’s Camp · Point Lenana · Chogoria", summary: "A measured traverse from high moorland to the mountain’s dramatic eastern valleys.", image: "mountain" },
  { slug: "naro-moru", title: "Naro Moru Fast Ascent", destination: "Mount Kenya", service: "Mountain", days: 4, startingUsd: 820, highestUsd: 990, peak: "5,199 m ASL", route: "Naro Moru · Teleki Valley · Point Lenana", summary: "A focused approach to the summit with experienced local mountain support.", image: "mountain" },
  { slug: "peak-circuit", title: "Mount Kenya Peak Circuit", destination: "Mount Kenya", service: "Mountain", days: 6, startingUsd: 1480, peak: "5,199 m ASL", route: "Chogoria · Peaks Circuit · Sirimon", summary: "A full circuit through varied alpine valleys, ridges and high camps.", image: "mountain" },
  { slug: "batian-nelion", title: "Nelion & Batian Rock Climbs", destination: "Mount Kenya", service: "Mountain", days: 6, startingUsd: 0, route: "Technical objectives · itinerary by ability", summary: "Technical climbing logistics are tailored to conditions, experience and route availability.", image: "mountain" },
  { slug: "machame", title: "Machame Route", destination: "Mount Kilimanjaro", service: "Mountain", days: 7, startingUsd: 2250, peak: "5,895 m ASL", route: "Machame · Barafu · Uhuru Peak", summary: "A classic western approach with time for progressive acclimatization.", image: "mountain" },
  { slug: "lemosho", title: "Lemosho Route", destination: "Mount Kilimanjaro", service: "Mountain", days: 8, startingUsd: 2520, peak: "5,895 m ASL", route: "Lemosho · Shira · Barafu · Uhuru Peak", summary: "A long, scenic approach across the mountain’s quieter western slopes.", image: "mountain" },
  { slug: "marangu", title: "Marangu Route", destination: "Mount Kilimanjaro", service: "Mountain", days: 6, startingUsd: 0, peak: "5,895 m ASL", summary: "A hut-based ascent planned around route conditions and group readiness.", image: "mountain" },
  { slug: "meru", title: "Mount Meru Summit Trek", destination: "Mount Meru", service: "Mountain", days: 4, startingUsd: 920, peak: "4,566 m ASL", summary: "A wildlife-rich acclimatization climb in Arusha National Park.", image: "mountain" },
  { slug: "mara-3", title: "Maasai Mara — 3 Days", destination: "Maasai Mara", service: "Safari", days: 3, startingUsd: 950, summary: "Three days of guided drives in one of Kenya’s iconic wildlife landscapes.", image: "safari" },
  { slug: "mara-5", title: "Great Migration — 5 Days", destination: "Maasai Mara", service: "Safari", days: 5, startingUsd: 1740, summary: "An extended Mara journey timed for the wider seasonal migration window.", image: "safari" },
  { slug: "amboseli", title: "Elephants & Kilimanjaro", destination: "Amboseli", service: "Safari", days: 3, startingUsd: 880, summary: "Open plains, elephant herds and far-reaching views toward Kilimanjaro.", image: "safari" },
  { slug: "northern-circuit", title: "Ol Pejeta & Samburu", destination: "Northern Kenya", service: "Safari", days: 5, startingUsd: 1750, summary: "Two distinct landscapes across Kenya’s highlands and northern frontier.", image: "safari" },
  { slug: "rift-valley", title: "Lakes of the Rift Valley", destination: "Rift Valley", service: "Safari", days: 3, startingUsd: 720, summary: "Lake Nakuru and Naivasha wildlife, landscapes and lakeshore escapes.", image: "safari" },
  { slug: "corporate-hike", title: "Team Building & Conditioning", destination: "Elephant Hill · Longonot", service: "Other", days: 2, startingUsd: 0, summary: "Guided day outings tailored to company groups, pace and fitness levels.", image: "crew" },
];

const rates: Record<Currency, number> = { USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.36, KES: 129 };
const localeByCurrency: Record<Currency, string> = { USD: "en-US", EUR: "de-DE", GBP: "en-GB", CAD: "en-CA", KES: "en-KE" };
export function convertUsd(amount: number, currency: Currency): number {
  return Math.round(amount * rates[currency]);
}
export function formatPrice(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(localeByCurrency[currency], { style: "currency", currency, maximumFractionDigits: currency === "KES" ? 0 : 0 }).format(convertUsd(amount, currency));
}
export function tourEstimate(tour: Tour, groupSize: number, currency: Currency, visitorClass: VisitorClass) {
  const baseUsd = tour.highestUsd === undefined ? tour.startingUsd : (tour.startingUsd + tour.highestUsd) / 2;
  const perPerson = baseUsd * (groupSize >= 4 ? 0.9 : groupSize === 3 ? 0.95 : 1);
  return { amount: formatPrice(perPerson, currency), label: visitorClass === "resident" ? "Resident / citizen · park fees checked separately" : "Non-resident · park fees checked separately" };
}

export const dayRates = [
  { name: "4-season 2-person tent", rateUsd: 15, stock: 8 },
  { name: "4-season 4-person tent", rateUsd: 25, stock: 4 },
  { name: "Sub-zero down sleeping bag", rateUsd: 8, stock: 16 },
  { name: "Trekking poles · pair", rateUsd: 3, stock: 18 },
  { name: "Crampons · technical", rateUsd: 7, stock: 6 },
  { name: "Camp stove & mess kit", rateUsd: 5, stock: 10 },
];
export function rentalTotal(rateUsd: number, days: number, quantity: number, currency: Currency) {
  return formatPrice(rateUsd * days * quantity, currency);
}
