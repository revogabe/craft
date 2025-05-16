export const CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Movies",
  "TV Shows",
  "Documentaries",
];

export type Video = {
  title: string;
  description: string;
  categorys: string[];
  views: string;
  date: string;
  thumbnail: string;
  iframeSrc: string;
  href: string;
};

export const VIDEOS: Video[] = [
  {
    title: "Maroon 5 - Priceless ft. LISA (Official Video)",
    description:
      "Maroon 5 teams up with BLACKPINK’s LISA in the official music video for their new single “Priceless.”",
    categorys: ["Music"],
    views: "16M",
    date: "13 days ago",
    thumbnail: "https://img.youtube.com/vi/vaGf8fmtBr4/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/vaGf8fmtBr4",
    href: "/demo/video-maroon-5-priceless-ft-lisa-official-video",
  },
  {
    title: "Shawn Mendes - Heart of Gold (Official Music Video)",
    description:
      "Shawn Mendes performs “Heart of Gold” in this heartfelt official music video from his latest album.",
    categorys: ["Music"],
    views: "4.8M",
    date: "6 months ago",
    thumbnail: "https://img.youtube.com/vi/r7__5jmJ-tA/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/r7__5jmJ-tA",
    href: "/demo/video-shawn-mendes-heart-of-gold-official-music-video",
  },
  {
    title: "Addison Rae - Headphones On (Official Video)",
    description:
      "Addison Rae’s dreamy music video for “Headphones On” takes us on a vibrant journey from a convenience store to Icelandic landscapes.",
    categorys: ["Music"],
    views: "2.8M",
    date: "4 weeks ago",
    thumbnail: "https://img.youtube.com/vi/XdFpzaM07i0/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/XdFpzaM07i0",
    href: "/demo/video-addison-rae-headphones-on-official-video",
  },
  {
    title: "ROSÉ - Messy (From F1® The Movie) [Official Music Video]",
    description:
      "BLACKPINK’s ROSÉ delivers “Messy,” the lead song from the F1® movie soundtrack, in a dazzling official music video.",
    categorys: ["Music", "Movies"],
    views: "16M",
    date: "1 week ago",
    thumbnail: "https://img.youtube.com/vi/ia2Ph61bYzc/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/ia2Ph61bYzc",
    href: "/demo/video-rosé-messy-from-f1®-the-movie-official-music-video",
  },
  {
    title: "Olivia Rodrigo - vampire (Official Video)",
    description:
      "Olivia Rodrigo’s haunting pop-rock ballad “vampire” comes to life in this cinematic official music video.",
    categorys: ["Music"],
    views: "95M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/RlPNh_PBZb4/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/RlPNh_PBZb4",
    href: "/demo/video-olivia-rodrigo-vampire-official-video",
  },
  {
    title: "Doja Cat - Paint The Town Red (Official Video)",
    description:
      "Doja Cat’s bold and artistic vision unfolds in the official music video for her smash hit “Paint The Town Red.”",
    categorys: ["Music"],
    views: "234M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/m4_9TFeMfJE/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/m4_9TFeMfJE",
    href: "/demo/video-doja-cat-paint-the-town-red-official-video",
  },
  {
    title: "Billie Eilish - What Was I Made For? (Official Music Video)",
    description:
      "Billie Eilish reflects on identity and purpose in “What Was I Made For?”, featured in the Barbie movie soundtrack.",
    categorys: ["Music", "Movies"],
    views: "140M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/cW8VLC9nnTo/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/cW8VLC9nnTo",
    href: "/demo/video-billie-eilish-what-was-i-made-for-official-music-video",
  },
  {
    title: "I Wasn't Expecting This…",
    description:
      "Gamer and streamer CaseOh finds an unexpected twist in this thrilling new gaming video.",
    categorys: ["Gaming"],
    views: "433K",
    date: "1 day ago",
    thumbnail: "https://img.youtube.com/vi/QOhBJF1j800/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/QOhBJF1j800",
    href: "/demo/video-i-wasn-t-expecting-this…",
  },
  {
    title: "LA Chargers Minecraft Schedule Release 2025",
    description:
      "The Los Angeles Chargers announce their 2025 NFL schedule with an elaborate Minecraft-themed video.",
    categorys: ["Gaming", "Sports"],
    views: "201K",
    date: "1 day ago",
    thumbnail: "https://img.youtube.com/vi/R6qi8BELUA0/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/R6qi8BELUA0",
    href: "/demo/video-la-chargers-minecraft-schedule-release-2025",
  },
  {
    title: "Making TRILLIONS in Roblox Climb and Jump Tower!",
    description:
      "CaylusBlox attempts an extreme Roblox challenge, climbing and jumping his way to a trillion-dollar fortune.",
    categorys: ["Gaming"],
    views: "639K",
    date: "1 day ago",
    thumbnail: "https://img.youtube.com/vi/7tCySooZe38/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/7tCySooZe38",
    href: "/demo/video-making-trillions-in-roblox-climb-and-jump-tower",
  },
  {
    title: "Clicking 7,317,123 Times to Unlock Brainrot in Roblox",
    description:
      "SSundee takes on a wild Roblox grind, clicking over 7 million times in pursuit of the elusive Brainrot upgrade.",
    categorys: ["Gaming"],
    views: "712K",
    date: "1 day ago",
    thumbnail: "https://img.youtube.com/vi/d3Oc26AFDdU/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/d3Oc26AFDdU",
    href: "/demo/video-clicking-7-317-123-times-to-unlock-brainrot-in-roblox",
  },
  {
    title: "Marvel’s Spider‑Man 2 – Launch Trailer | PS5",
    description:
      "Peter Parker and Miles Morales return in the epic launch trailer for Marvel’s Spider‑Man 2 on PlayStation 5.",
    categorys: ["Gaming"],
    views: "1.2M",
    date: "7 months ago",
    thumbnail: "https://img.youtube.com/vi/9fVYKsEmuRo/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/9fVYKsEmuRo",
    href: "/demo/video-marvel-s-spider‑man-2-–-launch-trailer-ps5",
  },
  {
    title: "Aphmau and Aaron Share ONE LIFE in Minecraft!",
    description:
      "In this cute Minecraft adventure, Aphmau and Aaron attempt to survive while literally sharing one life between them.",
    categorys: ["Gaming"],
    views: "1.1M",
    date: "1 day ago",
    thumbnail: "https://img.youtube.com/vi/FvzxWINRNp4/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/FvzxWINRNp4",
    href: "/demo/video-aphmau-and-aaron-share-one-life-in-minecraft",
  },
  {
    title: "World’s Largest Explosion!",
    description:
      "MrBeast Gaming pushes Minecraft to its limits by detonating the world’s biggest TNT explosion ever recorded.",
    categorys: ["Gaming"],
    views: "237M",
    date: "2 years ago",
    thumbnail: "https://img.youtube.com/vi/ABTdTTnnEU8/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/ABTdTTnnEU8",
    href: "/demo/video-world-s-largest-explosion",
  },
  {
    title:
      "See the moment the first results are announced in the 2024 presidential race",
    description:
      "CNN captures the tense moment when the first results of the 2024 U.S. presidential election come in on live television.",
    categorys: ["News"],
    views: "901K",
    date: "6 months ago",
    thumbnail: "https://img.youtube.com/vi/5jF_YxAqzyc/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/5jF_YxAqzyc",
    href: "/demo/video-see-the-moment-the-first-results-are-announced-in-the-2024-presidential-race",
  },
  {
    title:
      "Elon Musk’s SpaceX Starship rocket explodes after launch – BBC News",
    description:
      "BBC News footage shows SpaceX’s Starship – the most powerful rocket ever built – exploding minutes after its test launch in Texas.",
    categorys: ["News"],
    views: "2.8M",
    date: "2 years ago",
    thumbnail: "https://img.youtube.com/vi/BZ07ZV3kji4/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/BZ07ZV3kji4",
    href: "/demo/video-elon-musk’s-spacex-starship-rocket-explodes-after-launch-–-bbc-news",
  },
  {
    title:
      "Israel and Hamas agree to four-day truce in Gaza – Al Jazeera English",
    description:
      "Al Jazeera English reports on Israel and Hamas reaching a temporary four-day ceasefire agreement to pause fighting in Gaza.",
    categorys: ["News"],
    views: "800K",
    date: "6 months ago",
    thumbnail: "https://img.youtube.com/vi/u767l_0n5cU/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/u767l_0n5cU",
    href: "/demo/video-israel-and-hamas-agree-to-four-day-truce-in-gaza-–-al-jazeera-english",
  },
  {
    title: "2024 Total Solar Eclipse – NASA Highlights",
    description:
      "NASA presents highlights from the total solar eclipse of April 8, 2024, which swept across North America.",
    categorys: ["News"],
    views: "500K",
    date: "7 months ago",
    thumbnail: "https://img.youtube.com/vi/I9Xp2cYJifg/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/I9Xp2cYJifg",
    href: "/demo/video-2024-total-solar-eclipse-–-nasa-highlights",
  },
  {
    title:
      "Far-right outsider Javier Milei wins Argentina presidency – FRANCE 24 English",
    description:
      "France 24 English reports on populist outsider Javier Milei winning Argentina’s presidency in a fiercely contested election.",
    categorys: ["News"],
    views: "300K",
    date: "6 months ago",
    thumbnail: "https://img.youtube.com/vi/W5A7AW5Kihk/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/W5A7AW5Kihk",
    href: "/demo/video-far-right-outsider-javier-milei-wins-argentina-presidency-–-france-24-english",
  },
  {
    title:
      "Scientists revive 46,000-year-old worm found in permafrost – DW News",
    description:
      "DW News discusses the astonishing revival of a 46,000-year-old frozen worm by scientists and its implications for science.",
    categorys: ["News"],
    views: "1.1M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/gy3KIjckj4k/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/gy3KIjckj4k",
    href: "/demo/video-scientists-revive-46-000-year-old-worm-found-in-permafrost-–-dw-news",
  },
  {
    title:
      "Man rescues toddler from oncoming train with seconds to spare – Inside Edition",
    description:
      "Inside Edition shares dramatic footage of a heroic bystander saving a child from an approaching train in the nick of time.",
    categorys: ["News"],
    views: "4.5M",
    date: "3 months ago",
    thumbnail: "https://img.youtube.com/vi/JOKa4bqM1wc/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/JOKa4bqM1wc",
    href: "/demo/video-man-rescues-toddler-from-oncoming-train-with-seconds-to-spare-–-inside-edition",
  },
  {
    title:
      "Manchester City vs Inter – UEFA Champions League 2023 Final Highlights",
    description:
      "Highlights of the 2023 Champions League Final where Manchester City faced Inter Milan in a thrilling showdown in Istanbul.",
    categorys: ["Sports"],
    views: "9.8M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/AXEG_lagq9E/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/AXEG_lagq9E",
    href: "/demo/video-manchester-city-vs-inter-–-uefa-champions-league-2023-final-highlights",
  },
  {
    title: "Lionel Messi scores stunning free-kick on Inter Miami debut",
    description:
      "Lionel Messi announces his MLS arrival by scoring a game-winning free-kick in stoppage time during his Inter Miami debut.",
    categorys: ["Sports"],
    views: "12M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/pORjd5ZkTrs/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/pORjd5ZkTrs",
    href: "/demo/video-lionel-messi-scores-stunning-free-kick-on-inter-miami-debut",
  },
  {
    title: "India vs Australia – ICC Cricket World Cup 2023 Final Highlights",
    description:
      "Team India takes on Australia in the 2023 Cricket World Cup Final; watch the key moments as a new world champion is crowned.",
    categorys: ["Sports"],
    views: "18M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/YqKYpgZ9FWU/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/YqKYpgZ9FWU",
    href: "/demo/video-india-vs-australia-–-icc-cricket-world-cup-2023-final-highlights",
  },
  {
    title: "Miami Heat vs Denver Nuggets – 2023 NBA Finals Game 5 Highlights",
    description:
      "The Denver Nuggets clinch their first NBA Championship by defeating the Miami Heat in Game 5; relive the exciting final moments.",
    categorys: ["Sports"],
    views: "2.3M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/KoeMJuI03T4/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/KoeMJuI03T4",
    href: "/demo/video-miami-heat-vs-denver-nuggets-–-2023-nba-finals-game-5-highlights",
  },
  {
    title:
      "Kansas City Chiefs vs Philadelphia Eagles | Super Bowl LVII Highlights",
    description:
      "Relive Super Bowl LVII as Patrick Mahomes’ Kansas City Chiefs battle Jalen Hurts’ Philadelphia Eagles in an epic championship game.",
    categorys: ["Sports"],
    views: "15M",
    date: "2 years ago",
    thumbnail: "https://img.youtube.com/vi/BWkt79xkd00/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/BWkt79xkd00",
    href: "/demo/video-kansas-city-chiefs-vs-philadelphia-eagles-super-bowl-lvii-highlights",
  },
  {
    title: "Simone Biles lands historic Yurchenko double pike vault",
    description:
      "Olympic champion Simone Biles makes history by landing a Yurchenko double pike vault at the 2023 World Championships.",
    categorys: ["Sports"],
    views: "1.1M",
    date: "7 months ago",
    thumbnail: "https://img.youtube.com/vi/ai8sSTQ20n4/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/ai8sSTQ20n4",
    href: "/demo/video-simone-biles-lands-historic-yurchenko-double-pike-vault",
  },
  {
    title: "Dune: Part Two – Official Trailer",
    description:
      "The saga continues on Arrakis in the epic official trailer for Denis Villeneuve’s Dune: Part Two.",
    categorys: ["Movies"],
    views: "18M",
    date: "2 years ago",
    thumbnail: "https://img.youtube.com/vi/Way9Dexny3w/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/Way9Dexny3w",
    href: "/demo/video-dune-part-two-–-official-trailer",
  },
  {
    title: "Barbie – Official Trailer (2023)",
    description:
      "Barbie and Ken leave Barbieland and explore the real world in this fun-filled official trailer.",
    categorys: ["Movies"],
    views: "34M",
    date: "2 years ago",
    thumbnail: "https://img.youtube.com/vi/Kb7jYOYXiVc/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/Kb7jYOYXiVc",
    href: "/demo/video-barbie-–-official-trailer-2023",
  },
  {
    title: "Oppenheimer – Official Trailer",
    description:
      "The gripping official trailer for Christopher Nolan’s Oppenheimer, a film about the father of the atomic bomb.",
    categorys: ["Movies"],
    views: "26M",
    date: "2 years ago",
    thumbnail: "https://img.youtube.com/vi/qAWEb0h43lU/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/qAWEb0h43lU",
    href: "/demo/video-oppenheimer-–-official-trailer",
  },
  {
    title: "Five Nights at Freddy’s – Official Trailer (2023)",
    description:
      "The first official trailer for the horror movie Five Nights at Freddy’s, based on the hit video game franchise.",
    categorys: ["Movies"],
    views: "25M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/WgD9BgAZUkM/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/WgD9BgAZUkM",
    href: "/demo/video-five-nights-at-freddy’s-–-official-trailer-2023",
  },
  {
    title: "Godzilla x Kong: The New Empire – Official Trailer",
    description:
      "Legends collide again in the official trailer for Godzilla x Kong: The New Empire, the next chapter of the MonsterVerse.",
    categorys: ["Movies"],
    views: "10M",
    date: "5 months ago",
    thumbnail: "https://img.youtube.com/vi/9w5_HWhtJck/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/9w5_HWhtJck",
    href: "/demo/video-godzilla-x-kong-the-new-empire-–-official-trailer",
  },
  {
    title: "RRR – “Naatu Naatu” Full Video Song [4K]",
    description:
      "The energetic song “Naatu Naatu” from the hit film RRR features Ram Charan and NTR Jr. in an electrifying dance-off.",
    categorys: ["Movies"],
    views: "450M",
    date: "2 years ago",
    thumbnail: "https://img.youtube.com/vi/OsU0CGZoV8E/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/OsU0CGZoV8E",
    href: "/demo/video-rrr-–-“naatu-naatu”-full-video-song-4k",
  },
  {
    title: "Joker: Folie à Deux – Official Teaser",
    description:
      "A first look at the sequel to Joker, with Joaquin Phoenix and Lady Gaga sharing a chilling teaser of what’s to come.",
    categorys: ["Movies"],
    views: "5M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/xy8aJw1vYHo/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/xy8aJw1vYHo",
    href: "/demo/video-joker-folie-à-deux-–-official-teaser",
  },
  {
    title: "Ahsoka – Official Teaser Trailer (Disney+)",
    description:
      "The Star Wars universe expands with the first teaser trailer for Ahsoka, streaming on Disney+.",
    categorys: ["TV Shows"],
    views: "14M",
    date: "10 months ago",
    thumbnail: "https://img.youtube.com/vi/HnzNZ0Mdx4I/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/HnzNZ0Mdx4I",
    href: "/demo/video-ahsoka-–-official-teaser-trailer-disney+",
  },
  {
    title: "Marvel Studios’ Loki Season 2 – Official Trailer",
    description:
      "Loki is back and the timeline is in chaos in Marvel Studios’ official trailer for Loki Season 2 on Disney+.",
    categorys: ["TV Shows"],
    views: "8M",
    date: "11 months ago",
    thumbnail: "https://img.youtube.com/vi/dug56u8NN7g/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/dug56u8NN7g",
    href: "/demo/video-marvel-studios’-loki-season-2-–-official-trailer",
  },
  {
    title: "ONE PIECE – Official Trailer (Netflix)",
    description:
      "The beloved manga sets sail in this live-action official trailer for ONE PIECE, streaming on Netflix.",
    categorys: ["TV Shows"],
    views: "10M",
    date: "1 year ago",
    thumbnail: "https://img.youtube.com/vi/Ades3pQbeh8/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/Ades3pQbeh8",
    href: "/demo/video-one-piece-–-official-trailer-netflix",
  },
  {
    title: "Squid Game Season 2 – Official Teaser",
    description:
      "A brief announcement teaser confirms the return of the smash-hit series Squid Game for a second season.",
    categorys: ["TV Shows"],
    views: "4M",
    date: "8 months ago",
    thumbnail: "https://img.youtube.com/vi/T_uRaMaTa0A/hqdefault.jpg",
    iframeSrc: "https://www.youtube.com/embed/T_uRaMaTa0A",
    href: "/demo/video-squid-game-season 2-–-official-teaser",
  },
];
