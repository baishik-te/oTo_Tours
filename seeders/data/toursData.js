/**
 * Seed dataset strictly derived from Figma design (frames #656:41 and #704:39)
 * Normalized to reference canonical locations through junction relationships.
 */

const locationsData = [
  {
    id: "downtown-minneapolis",
    name: "Downtown Minneapolis",
    city: "Minneapolis",
    state: "Minnesota",
    country: "USA",
    latitude: 44.9778,
    longitude: -93.2650
  },
  {
    id: "st-paul",
    name: "St. Paul, MN",
    city: "St. Paul",
    state: "Minnesota",
    country: "USA",
    latitude: 44.9537,
    longitude: -93.0900
  },
  {
    id: "minneapolis",
    name: "Minneapolis",
    city: "Minneapolis",
    state: "Minnesota",
    country: "USA",
    latitude: 44.9778,
    longitude: -93.2650
  },
  {
    id: "stillwater",
    name: "Stillwater",
    city: "Stillwater",
    state: "Minnesota",
    country: "USA",
    latitude: 45.0561,
    longitude: -92.8088
  },
  {
    id: "duluth",
    name: "Duluth",
    city: "Duluth",
    state: "Minnesota",
    country: "USA",
    latitude: 46.7867,
    longitude: -92.1005
  },
  {
    id: "boston-ma",
    name: "Boston, MA",
    city: "Boston",
    state: "MA",
    country: "USA",
    description: "Historic sites, iconic landmarks, and waterfront views.",
    imageUrl: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200",
    latitude: 42.3601,
    longitude: -71.0589,
    isFeatured: true,
    displayOrder: 1
  },
  {
    id: "providence-ri",
    name: "Providence, RI",
    city: "Providence",
    state: "RI",
    country: "USA",
    description: "Explore the capital city's rich history and vibrant culture.",
    imageUrl: "https://images.unsplash.com/photo-1572953109213-3be62398eb95?q=80&w=1200",
    latitude: 41.8240,
    longitude: -71.4128,
    isFeatured: true,
    displayOrder: 2
  },
  {
    id: "newport-ri",
    name: "Newport, RI",
    city: "Newport",
    state: "RI",
    country: "USA",
    description: "Coastal beauty, Gilded Age mansions, and scenic ocean views.",
    imageUrl: "https://images.unsplash.com/photo-1569428034239-f9565e32e224?q=80&w=1200",
    latitude: 41.4901,
    longitude: -71.3128,
    isFeatured: true,
    displayOrder: 3
  },
  {
    id: "salem-ma",
    name: "Salem, MA",
    city: "Salem",
    state: "MA",
    country: "USA",
    description: "Witch history, haunted tales, and charming New England streets.",
    imageUrl: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?q=80&w=1200",
    latitude: 42.5195,
    longitude: -70.8967,
    isFeatured: true,
    displayOrder: 4
  }
];

const categoriesData = [
  { id: "segway", name: "Segway tours", badge: "Segway", description: "Guided Segway personal transporter tours" },
  { id: "ebike", name: "e-Bike tours", badge: "E-Bike", description: "Electric bicycle tours through scenic routes" },
  { id: "walking", name: "Walking tours", badge: "Walking Tour", description: "Guided on-foot walking tours" },
  { id: "ghost", name: "Real ghost tours", badge: "Walking Tour", description: "Paranormal and historic ghost walking tours" },
  { id: "hop-on", name: "Hop-on / hop-off bus tours", badge: "Bus Tour", description: "Flexible sightseeing bus routes" },
  { id: "sightseeing", name: "Local attraction and sightseeing tours", badge: "Sightseeing", description: "Landmark and scenic sightseeing excursions" }
];

const toursData = [
  {
    id: "st-paul-legacy-tour",
    slug: "st-paul-legacy-tour",
    title: "St. Paul Legacy Tour",
    categoryId: "ebike",
    badge: "E-Bike",
    duration: "2.5 Hours",
    durationMinutes: 150,
    isSignature: true,
    locations: [
      { locationCode: "st-paul", sequence: 1, isPrimary: true }
    ],
    shortDescription: "Journey through historic streets, grand architecture, and fascinating stories as you discover the charm and heritage of Minnesota’s capital city.",
    pricing: {
      startingFrom: 89.00,
      currency: "USD",
      currencySymbol: "$",
      unit: "per person",
      displayLabel: "From, $89 / person"
    },
    heroSection: {
      tag: "Historical Tour",
      title: "St. Paul Legacy Tour",
      duration: "2.5 Hours",
      location: "St. Paul, MN",
      heroBackgroundUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18f13f7?auto=format&fit=crop&w=1920&q=80"
    },
    overview: {
      heading: "Travel Through St. Paul's Rich History",
      description: "Let a Segway be your time machine as you travel back to the days of railroads, flappers, and Prohibition-era gangsters.\n\nOur St. Paul Segway Tour explores the amazing homes of Summit Avenue and the birthplace of F. Scott Fitzgerald. Catch up on the history of the Minnesota State Capitol from its founding through its many iterations and renovations to the building we know today.\n\nOur expert guides know all the stories of historic St. Paul, including a few you won't find in the history books. It's almost more than we can pack into a three-hour tour. Ride with us through time and see:"
    },
    keyFeatures: [
      {
        id: "feat-small-group",
        title: "Small Group Experience",
        icon: "user-group"
      },
      {
        id: "feat-expert-guide",
        title: "Expert Local Guide",
        icon: "tour-guide"
      },
      {
        id: "feat-safety-training",
        title: "Safety Training Included",
        icon: "presentation-training"
      }
    ],
    highlights: [
      {
        id: "hl-1",
        title: "Summit Avenue Mansion",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "hl-2",
        title: "Veterans memorial",
        imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "hl-3",
        title: "Cathedral of St. Paul",
        imageUrl: "https://images.unsplash.com/photo-1548625361-195b05a415b3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "hl-4",
        title: "F. Scott Fitzgerald House",
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "hl-5",
        title: "Minnesota State Capitol",
        imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "hl-6",
        title: "Selby Avenue gangster hangout",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80"
      }
    ],
    included: [
      {
        id: "inc-parking",
        title: "Free Parking",
        description: "at St. Paul Curling Club"
      },
      {
        id: "inc-helmet",
        title: "Helmet",
        description: "Helmet to use during the tour."
      },
      {
        id: "inc-guide",
        title: "Expert Guide",
        description: "Narrative delivered by your experienced tour guide."
      },
      {
        id: "inc-coupon",
        title: "Happy Gnome Coupon",
        description: "25% off coupon for Happy Gnome restaurant next door."
      },
      {
        id: "inc-safety",
        title: "Segway Certified Safety Training",
        description: "Learn to ride with confidence."
      },
      {
        id: "inc-ticket",
        title: "Mill City Museum Entrance Ticket",
        description: "Included with your tour experience."
      },
      {
        id: "inc-refreshment",
        title: "Snack & Beverage",
        description: "Enjoy a snack and beverage at the midpoint of the tour."
      }
    ],
    sidebarImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "minneapolis-legacy-tour",
    slug: "minneapolis-legacy-tour",
    title: "Minneapolis Legacy Tour",
    categoryId: "segway",
    badge: "Segway",
    duration: "2.5 Hours",
    durationMinutes: 150,
    isSignature: true,
    locations: [
      { locationCode: "downtown-minneapolis", sequence: 1, isPrimary: true },
      { locationCode: "minneapolis", sequence: 2, isPrimary: false }
    ],
    shortDescription: "Explore the landmarks, riverfront views, and hidden stories that shaped Minneapolis. From iconic architecture to local legends, experience the city in a fun and unforgettable way.",
    pricing: {
      startingFrom: 89.00,
      currency: "USD",
      currencySymbol: "$",
      unit: "per person",
      displayLabel: "From, $89 / person"
    },
    heroSection: {
      tag: "Signature Tour",
      title: "Minneapolis Legacy Tour",
      duration: "2.5 Hours",
      location: "Downtown Minneapolis",
      heroBackgroundUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
    },
    overview: {
      heading: "Discover Minneapolis From Riverfront to Skyline",
      description: "Glide effortlessly along the Mississippi Riverfront, Stone Arch Bridge, and historic St. Anthony Falls. Experience Minneapolis's transition from the flour milling capital of the world into a modern cultural powerhouse."
    },
    keyFeatures: [
      {
        id: "feat-small-group",
        title: "Small Group Experience",
        icon: "user-group"
      },
      {
        id: "feat-expert-guide",
        title: "Expert Local Guide",
        icon: "tour-guide"
      },
      {
        id: "feat-safety-training",
        title: "Safety Training Included",
        icon: "presentation-training"
      }
    ],
    highlights: [
      { id: "hl-m1", title: "Stone Arch Bridge", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-m2", title: "St. Anthony Falls", imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18f13f7?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-m3", title: "Mill Ruins Park", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-m4", title: "Guthrie Theater Riverfront", imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80" }
    ],
    included: [
      { id: "inc-m1", title: "Segway Equipment & Helmet", description: "State-of-the-art self-balancing personal transporter." },
      { id: "inc-m2", title: "Comprehensive Training", description: "30-minute hands-on rider instruction." },
      { id: "inc-m3", title: "Wireless Audio Headset", description: "Hear your guide clearly while riding." }
    ],
    sidebarImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prince-tour",
    slug: "prince-tour",
    title: "Prince Tour 🎧",
    categoryId: "walking",
    badge: "Walking Tour",
    duration: "2 Hours",
    durationMinutes: 120,
    isSignature: true,
    locations: [
      { locationCode: "minneapolis", sequence: 1, isPrimary: true },
      { locationCode: "downtown-minneapolis", sequence: 2, isPrimary: false }
    ],
    shortDescription: "Experience Minneapolis through the music and legacy of Prince with an immersive audio-guided tour featuring iconic locations and unforgettable stories.",
    pricing: {
      startingFrom: 65.00,
      currency: "USD",
      currencySymbol: "$",
      unit: "per person",
      displayLabel: "From, $65 / person"
    },
    heroSection: {
      tag: "Music & Cultural Tour",
      title: "Prince Tour 🎧",
      duration: "2 Hours",
      location: "Minneapolis",
      heroBackgroundUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80"
    },
    overview: {
      heading: "Celebrate The Purple One in His Hometown",
      description: "Walk the purple carpet through Prince's formative Minneapolis haunts, from First Avenue & 7th St Entry to the murals, clubs, and studios that inspired Purple Rain and changed world music history forever."
    },
    keyFeatures: [
      { id: "feat-audio", title: "Immersive Hi-Fi Audio", icon: "headphones" },
      { id: "feat-guide", title: "Music Historian Guide", icon: "tour-guide" },
      { id: "feat-stops", title: "Exclusive Access Stops", icon: "star" }
    ],
    highlights: [
      { id: "hl-p1", title: "First Avenue & 7th St Entry", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-p2", title: "Prince Commemorative Mural", imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-p3", title: "Orpheum & State Theatres", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80" }
    ],
    included: [
      { id: "inc-p1", title: "Wireless Audio Receiver", description: "Studio-mastered Prince audio track sync during the walk." },
      { id: "inc-p2", title: "Collectible Tour Badge", description: "Exclusive commemorative souvenir laminate." }
    ],
    sidebarImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "garden-insider-tour",
    slug: "garden-insider-tour",
    title: "Garden Insider Tour",
    categoryId: "segway",
    badge: "Segway",
    duration: "2.5 Hours",
    durationMinutes: 150,
    isSignature: true,
    locations: [
      { locationCode: "downtown-minneapolis", sequence: 1, isPrimary: true },
      { locationCode: "minneapolis", sequence: 2, isPrimary: false }
    ],
    shortDescription: "Discover Minneapolis on an exciting 8-mile Segway tour featuring iconic landmarks, local stories, stunning architecture, and the famous Walker Sculpture Garden.",
    pricing: {
      startingFrom: 89.00,
      currency: "USD",
      currencySymbol: "$",
      unit: "per person",
      displayLabel: "From, $89 / person"
    },
    heroSection: {
      tag: "Sculpture & Scenic Tour",
      title: "Garden Insider Tour",
      duration: "2.5 Hours",
      location: "Downtown Minneapolis",
      heroBackgroundUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1920&q=80"
    },
    overview: {
      heading: "Art Meets Nature in an 8-Mile Segway Journey",
      description: "Glide through the Walker Sculpture Garden, Kenwood neighborhoods, and scenic city lakes. Marvel at the iconic Spoonbridge and Cherry while soaking in lush urban parks and world-renowned public sculptures."
    },
    keyFeatures: [
      { id: "feat-small-group", title: "Small Group Experience", icon: "user-group" },
      { id: "feat-expert-guide", title: "Expert Local Guide", icon: "tour-guide" },
      { id: "feat-safety-training", title: "Safety Training Included", icon: "presentation-training" }
    ],
    highlights: [
      { id: "hl-g1", title: "Walker Sculpture Garden", imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-g2", title: "Spoonbridge and Cherry", imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-g3", title: "Kenwood Parkway Estates", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" }
    ],
    included: [
      { id: "inc-g1", title: "Segway Equipment & Helmet", description: "Full self-balancing gear provided." },
      { id: "inc-g2", title: "Sculpture Garden Photo Stops", description: "Dedicated time for photos at world-famous art pieces." }
    ],
    sidebarImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "real-ghost-tours",
    slug: "real-ghost-tours",
    title: "Real Ghost Tours",
    categoryId: "ghost",
    badge: "Walking Tour",
    duration: "2.5 Hours",
    durationMinutes: 150,
    isSignature: true,
    locations: [
      { locationCode: "st-paul", sequence: 1, isPrimary: true }
    ],
    shortDescription: "Join a guided 90-minute ghost tour through one of Minneapolis' oldest buildings. Explore its haunted history, encounter reported spirits, and use EMF readers as you uncover the paranormal side.",
    pricing: {
      startingFrom: 75.00,
      currency: "USD",
      currencySymbol: "$",
      unit: "per person",
      displayLabel: "From, $75 / person"
    },
    heroSection: {
      tag: "Paranormal Tour",
      title: "Real Ghost Tours",
      duration: "2.5 Hours",
      location: "St. Paul, MN",
      heroBackgroundUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80"
    },
    overview: {
      heading: "Uncover Haunting Secrets & Paranormal Echoes",
      description: "Delve into subterranean passages, historic prohibition speakeasies, and legendary haunted corridors. Equipped with ghost-hunting gear, investigate true documented events from Minnesota's shadowy past."
    },
    keyFeatures: [
      { id: "feat-emf", title: "EMF Ghost Detectors Provided", icon: "activity" },
      { id: "feat-guide", title: "Paranormal Investigator Host", icon: "tour-guide" },
      { id: "feat-night", title: "Atmospheric Evening Experience", icon: "moon" }
    ],
    highlights: [
      { id: "hl-gh1", title: "Forepaugh's Historic Mansion", imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-gh2", title: "Wabasha Street Caves", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" }
    ],
    included: [
      { id: "inc-gh1", title: "EMF Meter Loaner", description: "Use professional electromagnetic field detectors throughout the tour." },
      { id: "inc-gh2", title: "Underground Access", description: "Exclusive after-hours access to historical spaces." }
    ],
    sidebarImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "private-tours",
    slug: "private-tours",
    title: "Private Tours",
    categoryId: "segway",
    badge: "Segway",
    duration: "2 Hours",
    durationMinutes: 120,
    isSignature: true,
    locations: [
      { locationCode: "minneapolis", sequence: 1, isPrimary: true },
      { locationCode: "st-paul", sequence: 2, isPrimary: false }
    ],
    shortDescription: "Enjoy a customizable Segway tour for corporate events, school trips, celebrations, and team-building activities. Designed for groups of all sizes, it's a fun and unique way to explore the city together.",
    pricing: {
      startingFrom: 120.00,
      currency: "USD",
      currencySymbol: "$",
      unit: "per person",
      displayLabel: "From, $120 / person"
    },
    heroSection: {
      tag: "Custom Group Experience",
      title: "Private Tours",
      duration: "2 Hours",
      location: "Minneapolis",
      heroBackgroundUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
    },
    overview: {
      heading: "Custom Tailored Adventures For Your Team or Celebration",
      description: "From corporate retreats to family reunions and milestone celebrations, craft your own custom Segway or e-bike itinerary with dedicated private guides, customized start times, and catered options."
    },
    keyFeatures: [
      { id: "feat-custom", title: "Customizable Itineraries", icon: "sliders" },
      { id: "feat-fleet", title: "Accommodates 80+ Riders", icon: "users" },
      { id: "feat-coordinator", title: "Dedicated Event Coordinator", icon: "user-check" }
    ],
    highlights: [
      { id: "hl-pr1", title: "Custom City Route", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" },
      { id: "hl-pr2", title: "Private Waterfront Reception Stop", imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80" }
    ],
    included: [
      { id: "inc-pr1", title: "Private Fleet Reservation", description: "Dedicated Segway machines for your entire party." },
      { id: "inc-pr2", title: "VIP Guide Ratio", description: "1 certified guide for every 8 riders for personalized service." },
      { id: "inc-pr3", title: "Flexible Schedule", description: "Depart on your timetable." }
    ],
    sidebarImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  }
];

module.exports = {
  toursData,
  categoriesData,
  locationsData
};
