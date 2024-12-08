export const backstoryModel = {
  origins: [
    'Raised by a traveling circus, mastering the art of acrobatics and disguise.',
    'Fled from their homeland after a rebellion toppled the ruling monarchy.',
    'Born under an eclipse, believed to be marked by celestial powers.',
    'Trained in a secluded monastery, but exiled after breaking a sacred vow.',
    'Grew up scavenging in the ruins of a forgotten city, learning survival skills.',
    'Captured as a child and raised by a clan of orcs, eventually escaping.',
    'Found abandoned in the Feywild, adopted by mischievous pixies.',
    'Once a wealthy merchant, lost everything in a dragon attack.',
    'The lone survivor of a cursed village, haunted by the memories.',
    'Born into a noble family but disowned after refusing an arranged marriage.',
    'Spent their youth as a squire, learning the ways of knights.',
    'Discovered as an orphan by an eccentric wizard and trained in magic.',
    'Worked as a miner in the Underdark, surviving on wits and courage.',
    'Former pirate, left the crew after a falling out with the captain.',
    'Raised by druids in the forest, learning the balance of nature.',
    'Grew up in a desert caravan, trading goods and stories with travelers.',
    "Was a servant in a grand castle, secretly observing the noble's intrigues.",
    'Born into a family of monster hunters, but turned against the trade.',
    'Banished from their village after being accused of a crime they didn’t commit.',
    'A runaway from a cult seeking refuge and redemption.',
    'Born to a lineage of scholars but rejected academia for a life of adventure.',
    'Found in a drifting boat as an infant, bearing an unknown family crest.',
    'Witnessed the fall of a great hero and swore to avenge them.',
    'Born with an unusual birthmark, believed to be a prophecy by local shamans.',
    'Former soldier who abandoned their post after a traumatic battle.',
    'Lost their family to a plague, now searching for a cure to save others.',
    'Born in a city built on the ruins of an ancient empire.',
    'Became a mercenary after their village was destroyed by marauders.',
    'Was a treasure hunter who accidentally unleashed a terrible curse.',
    'Grew up on the streets, learning to survive through cunning and skill.',
  ],
  skills: [
    'Master alchemist with a knack for brewing potions that have unpredictable effects.',
    'Former smuggler who knows every secret passage and hidden cove.',
    'Skilled blacksmith who forges weapons imbued with minor magical properties.',
    'An amateur historian obsessed with uncovering ancient secrets.',
    'Animal whisperer who can tame even the wildest creatures.',
    'Talented bard who uses song to manipulate emotions and conceal truths.',
    'Adept tracker with an uncanny ability to read subtle signs in nature.',
    'Spellcaster who specializes in illusion magic to avoid direct conflict.',
    'Quick-witted rogue with a reputation for charming nobles out of their gold.',
    'Healer with a mysterious scar that they claim is a mark of divine favor.',
    'Artificer who invents unusual contraptions from salvaged materials.',
    'A sharpshooter with unmatched precision and a custom-built crossbow.',
    'A sailor with expertise in navigating treacherous waters.',
    'A martial artist who practices an exotic fighting style from a far-off land.',
    'A diviner who sees glimpses of the future through dreams.',
    'A locksmith and trapmaker who can disarm even the most complex mechanisms.',
    'A beast tamer who trains creatures for both battle and companionship.',
    'A skilled gambler who uses sleight of hand to sway the odds.',
    'A painter whose artwork seems to come to life in strange ways.',
    'An expert cartographer who creates maps of uncharted territories.',
    'A dancer who uses mesmerizing movements to distract foes.',
    'A cook whose meals can temporarily grant minor magical effects.',
    'An acrobat capable of daring feats that defy gravity.',
    'A linguist fluent in rare and ancient languages.',
    'A jewelcrafter who creates enchanted accessories.',
    'A master forger who can replicate documents and seals with precision.',
    'A falconer whose trained birds act as scouts and messengers.',
    'A herbalist who specializes in crafting curative remedies.',
    'A shadowy assassin with an extensive knowledge of poisons.',
    'A geomancer who can shape and manipulate the terrain.',
  ],
  motivations: [
    'Seeks redemption for a past betrayal that cost innocent lives.',
    'Desires revenge against the creature that destroyed their village.',
    'On a quest to find their missing sibling, rumored to be held by slavers.',
    'Searching for an artifact that can restore their family’s lost honor.',
    'Strives to master forbidden magic to protect their loved ones.',
    'Wants to unite the warring factions of their homeland under a single banner.',
    'Is driven by the need to repay a life debt to a powerful benefactor.',
    'Dreams of building a sanctuary for outcasts and misfits.',
    'Hopes to uncover the truth about their mysterious parentage.',
    'Aims to become a legend by performing a deed no one else has dared attempt.',
    'Wants to ensure their child never experiences the hardships they endured.',
    'Seeks to clear their name after being framed for a heinous crime.',
    'Hopes to amass wealth to buy back their ancestral lands.',
    'Wishes to undo the effects of a curse that plagues their bloodline.',
    'Yearns to restore a forgotten deity to prominence.',
    'Seeks to avenge a fallen comrade who sacrificed themselves.',
    'Dreams of discovering the secrets of immortality.',
    'Wants to become the ruler of a territory through strength or diplomacy.',
    'Aims to destroy an ancient evil rumored to be rising again.',
    'Desires to reconcile with an estranged family member.',
    'Yearns to prove their worth to a disapproving mentor.',
    'Hopes to recover a stolen heirloom of great sentimental value.',
    'Wishes to protect their homeland from an impending threat.',
    'Wants to overthrow a tyrant ruling with an iron fist.',
    'Dreams of opening a school to pass on their unique skills.',
    'Seeks to repay a debt to a mysterious patron.',
    'Hopes to reclaim a lost artifact from a rival adventurer.',
    'Aims to gain enough power to challenge the gods themselves.',
    'Wants to reunite the scattered fragments of an ancient prophecy.',
    'Strives to create a masterpiece that will be remembered forever.',
  ],
};

export const getRandomBackstory = () => {
  // gets random origin
  const randomOrigenIndex = Math.floor(
    Math.random() * backstoryModel.origins.length
  );
  const origin = backstoryModel.origins[randomOrigenIndex];
  // gets random skill
  const randomSkillIndex = Math.floor(
    Math.random() * backstoryModel.skills.length
  );
  const skill = backstoryModel.skills[randomSkillIndex];
  // gets random motivation
  const randomMotivationIndex = Math.floor(
    Math.random() * backstoryModel.motivations.length
  );
  const motivation = backstoryModel.motivations[randomMotivationIndex];
  return `${origin}, ${skill}, ${motivation}`;
};
