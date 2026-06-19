// Extended mock events generator to yield exactly 200 events with specified counts per category
const CATEGORY_COUNTS = {
  "Concert": 41,
  "Festivals": 43,
  "Competitions": 41,
  "Workshops": 14,
  "Conferences": 13,
  "Sports": 11,
  "Movie / Drama": 10,
  "Exhibitions": 7,
  "Party": 7,
  "Seminars": 5,
  "Stand-up": 3,
  "Fashion Shows": 2,
  "Pop Culture": 2,
  "Fundraisers": 1,
  "Reunions": 0,
  "Launching": 0
};

const CATEGORY_DETAILS = {
  "Concert": {
    titles: ["Live Symphony Orchestra Spectacular", "Rock Arena Global Tour", "Jazz Under the Stars", "Electronic Music Carnival", "Acoustic Sunset Session", "Hip Hop Summit", "Indie Rock Night Out", "Pop Anthem Festival", "Classical Piano Recital", "Metal Mania Concert"],
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["music", "live", "concert", "performance", "rock", "jazz", "dance"],
    venues: ["Royal Concert Hall", "Metropolis Arena", "The Backyard Amphitheater", "Central Park Main Stage"]
  },
  "Sports": {
    titles: ["Championship League Match", "City Marathon 2026", "Beach Volleyball Open", "Charity Football Cup", "Ultimate Frisbee Tournament", "Basketball Invitational", "Powerlifting Championship", "Cycling Grand Prix"],
    images: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["sports", "fitness", "athletics", "game", "match", "championship", "running"],
    venues: ["City Sports Stadium", "Olympic Athletics Track", "Sunset Beach Sand Courts", "Downtown Recreation Center"]
  },
  "Workshops": {
    titles: ["Creative Design Masterclass", "AI & Machine Learning Workshop", "Digital Photography Basics", "Figma Advanced Prototyping", "Full-Stack Web Boot Camp", "Content Writing Seminar", "Video Editing Bootcamp"],
    images: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["learning", "workshop", "design", "coding", "masterclass", "tech", "figma"],
    venues: ["Creative Space Labs", "Tech Hub Innovation Room", "Silicon Center Room 404", "Designers Collective Studio"]
  },
  "Fundraisers": {
    titles: ["Annual Charity Gala & Dinner", "Hope for Everyone Fundraiser", "Green Planet Charity Drive"],
    images: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["charity", "fundraiser", "hope", "gala", "dinner", "donations", "community"],
    venues: ["Grand Ballroom, Plaza Hotel", "Skyline Events Center", "Community Trust Hall"]
  },
  "Festivals": {
    titles: ["Spring Lantern Festival", "Summer Food & Drinks Expo", "International Film & Art Fest", "Winter Wonderland Festival", "Autumn Folk Harvest", "Heritage & Craft Fair", "Jazz & Blues Outdoor Fest"],
    images: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["festival", "food", "music", "culture", "expo", "art", "outdoors", "fun"],
    venues: ["Riverfront Promenade", "Expo Trade Fairgrounds", "City Gardens Park", "Central Plaza"]
  },
  "Competitions": {
    titles: ["Hackathon 2026 Code Challenge", "Robotics Arena Fight", "Startup Pitch Cup", "Photography Shootout", "Gaming Arena Tournament", "Debate Championship League", "Culinary Masterchef Battle"],
    images: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["competition", "hackathon", "gaming", "robotics", "pitch", "championship", "awards"],
    venues: ["Arena Hall Z", "Science Expo Center Auditorium", "Innovation Incubator Hall", "Vegas Gaming Center"]
  },
  "Fashion Shows": {
    titles: ["Autumn Couture Runway", "Eco-Friendly Sustainable Fashion Show", "Vanguard Streetwear Exhibition"],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["fashion", "runway", "couture", "model", "style", "design", "clothing"],
    venues: ["The Grand Runway Deck", "Industrial Loft Gallery", "Metropolitan Fashion Hub"]
  },
  "Conferences": {
    titles: ["Global Tech Summit", "Healthcare Innovation Conference", "Web3 Future Tech Forum", "Educators Leadership Summit", "Business Strategy Colloquium"],
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["conference", "summit", "keynote", "networking", "industry", "panel", "business"],
    venues: ["Convention Center Hall A", "InterContinental Summit Suite", "Grand Civic Hall"]
  },
  "Seminars": {
    titles: ["Personal Finance & Wealth Seminar", "Mental Health Awareness & Mindfulness", "Public Speaking Secrets", "Product Management Trends", "SEO and Growth Hacking Tips"],
    images: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["seminar", "education", "finance", "mindfulness", "growth", "career", "keynote"],
    venues: ["Academic Lecture Hall B", "Downtown Library Auditorium", "Corporate Training Center"]
  },
  "Exhibitions": {
    titles: ["Modern Art Gallery Exhibition", "Vintage Automobile Expo", "Science & Discovery Fair", "Space Travel Tech Expo", "History & Culture Museum Tour"],
    images: [
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["exhibition", "art", "museum", "gallery", "history", "expo", "showcase"],
    venues: ["Fine Arts Museum Wing C", "Metropolitan Exhibition Hall", "City Science Pavilion"]
  },
  "Stand-up": {
    titles: ["Comedy Club Stand-up Special", "Late Night Laughs Showcase", "Improv Comedy Night"],
    images: [
      "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["comedy", "stand-up", "jokes", "laughs", "performance", "nightlife"],
    venues: ["The Laugh Lounge", "Giggles Comedy Club", "Underground Stage"]
  },
  "Party": {
    titles: ["Neon Dance Party Night", "Retro 80s Social Mixer", "Rooftop Networking Social", "Summer Splash Pool Party", "Masquerade Club Night"],
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["party", "dance", "dj", "social", "drinks", "nightlife", "mixer"],
    venues: ["Penthouse Rooftop Club", "Sky Bar & Lounge", "Aquarius Water Resort"]
  },
  "Pop Culture": {
    titles: ["Cosplay & Comic Convention", "Gaming and Anime Expo"],
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["pop-culture", "comics", "anime", "gaming", "cosplay", "convention"],
    venues: ["Convention Hall C", "Nippon Cultural Center"]
  },
  "Movie / Drama": {
    titles: ["Outdoor Cinema Night", "Shakespeare Drama Festival", "Indie Film Screening", "Classic Movie Marathon", "Broadway Musical Showcase"],
    images: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["movie", "cinema", "drama", "theatre", "screening", "broadway", "film"],
    venues: ["Central Park Open Cinema", "Globe Theatre Replica", "Criterion Art House Screen 2"]
  }
};

const ORGANIZERS = [
  { name: "Eventra Team", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" },
  { name: "Green Future Org", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" },
  { name: "Tech Frontiers", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" },
  { name: "Global Rhythms", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" }
];

const SPEAKERS = [
  { name: "Dr. Sarah Jenkins", role: "AI Research Lead at Google", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" },
  { name: "Marcus Vance", role: "CTO, FutureTech Solutions", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" },
  { name: "Elena Rostova", role: "Principal Product Designer at Airbnb", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" },
  { name: "David Chen", role: "Managing Partner at Sequoia Lite", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" }
];

const GALLERY_POOL = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80"
];

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Anchor target date: Tuesday, June 16, 2026
const NOW_DATE = new Date("2026-06-16T20:31:57+06:00");

function generateEvents() {
  const events = [];
  let currentId = 1;

  // We want to generate exactly the category counts
  // To distribute them across Past (40), Live (9), and Upcoming (151)
  // Let's explicitly define a category structure mapping how many of each status we want:
  const distribution = {
    "Concert": { past: 2, live: 1, upcoming: 38 },
    "Festivals": { past: 10, live: 1, upcoming: 32 },
    "Competitions": { past: 10, live: 2, upcoming: 29 },
    "Workshops": { past: 3, live: 1, upcoming: 10 },
    "Conferences": { past: 3, live: 1, upcoming: 9 },
    "Sports": { past: 2, live: 1, upcoming: 8 },
    "Movie / Drama": { past: 2, live: 0, upcoming: 8 },
    "Exhibitions": { past: 2, live: 0, upcoming: 5 },
    "Party": { past: 2, live: 1, upcoming: 4 },
    "Seminars": { past: 1, live: 0, upcoming: 4 },
    "Stand-up": { past: 1, live: 0, upcoming: 2 },
    "Fashion Shows": { past: 1, live: 0, upcoming: 1 },
    "Pop Culture": { past: 1, live: 0, upcoming: 1 },
    "Fundraisers": { past: 0, live: 0, upcoming: 1 },
    "Reunions": { past: 0, live: 0, upcoming: 0 },
    "Launching": { past: 0, live: 0, upcoming: 0 }
  };

  // Keep separate index offsets to spread dates nicely
  let pastOffset = 0;
  let liveOffset = 0;
  let upcomingOffset = 0;

  for (const [category, counts] of Object.entries(distribution)) {
    const details = CATEGORY_DETAILS[category];
    if (!details) continue;

    // Generate Past Events
    for (let i = 0; i < counts.past; i++) {
      const date = new Date(NOW_DATE);
      // past events go backward in time from June 15, 2026
      date.setDate(date.getDate() - (pastOffset * 3) - 1);
      pastOffset++;

      events.push(createEventObject(currentId++, category, details, date, "Past"));
    }

    // Generate Live Events
    for (let i = 0; i < counts.live; i++) {
      const date = new Date(NOW_DATE);
      // live events occur on June 16, 2026 but at different times
      date.setHours(9 + (liveOffset % 8), 0, 0, 0);
      liveOffset++;

      events.push(createEventObject(currentId++, category, details, date, "Live"));
    }

    // Generate Upcoming Events
    for (let i = 0; i < counts.upcoming; i++) {
      const date = new Date(NOW_DATE);
      // upcoming events go forward in time from June 17, 2026
      date.setDate(date.getDate() + (upcomingOffset * 2) + 1);
      upcomingOffset++;

      events.push(createEventObject(currentId++, category, details, date, "Upcoming"));
    }
  }

  return events;
}

function createEventObject(id, category, details, dateObj, rawStatus) {
  const titleIndex = id % details.titles.length;
  const imageIndex = id % details.images.length;
  const venueIndex = id % details.venues.length;
  const organizerIndex = id % ORGANIZERS.length;

  const title = `${details.titles[titleIndex]} #${id}`;
  const image = details.images[imageIndex];
  const venue = details.venues[venueIndex];
  const organizer = ORGANIZERS[organizerIndex];

  // format dateBadge: { day: "28", month: "JUN" }
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = MONTHS[dateObj.getMonth()];
  const dateBadge = { day, month };

  // format dateText: "Sunday, June 28, 2026"
  const weekday = WEEKDAYS[dateObj.getDay()];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateText = `${weekday}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, 2026`;

  // status text in badge
  let status = "Upcoming";
  if (rawStatus === "Live") {
    status = "Live Event";
  } else if (rawStatus === "Past") {
    status = "Closed";
  } else {
    status = id % 3 === 0 ? "Registration Open" : "Upcoming";
  }

  // seat count
  const seatsLeft = rawStatus === "Past" ? 0 : (id % 45) + 1;

  // speakers
  const speakers = [];
  const speakerCount = (id % 2) + 1; // 1 or 2 speakers
  for (let s = 0; s < speakerCount; s++) {
    speakers.push(SPEAKERS[(id + s) % SPEAKERS.length]);
  }

  // gallery
  const gallery = [];
  const galleryCount = (id % 3) + 2; // 2 to 4 images
  for (let g = 0; g < galleryCount; g++) {
    gallery.push(GALLERY_POOL[(id + g) % GALLERY_POOL.length]);
  }

  // tags
  const tags = [...details.tags];
  // add category as lowercase tag and status as tag
  tags.push(category.toLowerCase().replace(" / ", "-"));
  tags.push(rawStatus.toLowerCase());

  // times
  const timeOpts = [
    "09:00 AM - 05:00 PM",
    "10:00 AM - 02:00 PM",
    "04:00 PM - 08:00 PM",
    "11:00 AM - 04:30 PM",
    "06:00 PM - 09:30 PM",
    "08:00 AM - 11:30 AM"
  ];
  const time = timeOpts[id % timeOpts.length];

  return {
    id,
    title,
    category,
    dateBadge,
    dateText,
    date: dateObj, // Keep date object for sorting
    time,
    venue,
    image,
    organizer,
    seatsLeft,
    status,
    rawStatus, // 'Past' | 'Live' | 'Upcoming'
    description: `Join us for this premier ${category} event: "${title}". Expand your knowledge, connect with active field professionals, and experience the premium services offered by our organizers. This program features direct networking sessions, dedicated keynote speakers, and curated visual gallery showcases.`,
    speakers,
    gallery,
    tags
  };
}

export const mockEvents = generateEvents();
export default mockEvents;
