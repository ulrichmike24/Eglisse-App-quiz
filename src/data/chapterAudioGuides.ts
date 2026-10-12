export interface ChapterTheologicalGuide {
  bookId: string;
  bookName: string;
  chapter: number;
  title: string;
  theme: string;
  keyVerse: string;
  historicalContext: string;
  theologicalReflection: string;
  christologicalForeshadowing: string;
  practicalApplication: string;
  suggestedNarration: string;
}

export const CHAPTER_AUDIO_GUIDES: Record<string, ChapterTheologicalGuide> = {
  'GEN-1': {
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 1,
    title: 'La Création et l’Origine du Cosmos par la Parole',
    theme: 'Souveraineté créatrice de Dieu, ordre divin et image de Dieu',
    keyVerse: 'Genèse 1:1 — Au commencement, Dieu créa les cieux et la terre.',
    historicalContext: 'Rédigé dans le Proche-Orient Ancien, ce récit se démarque des mythes babyloniens de l’Enuma Elish par l’affirmation d’un Dieu unique, tout-puissant, créant par sa seule Parole sans conflit cosmique.',
    theologicalReflection: 'Le verbe hébreu « Bara » (בָּרָא) est réservé exclusivement à l’action divine créatrice ex nihilo. L’Esprit de Dieu (Ruach Elohim) planant sur les eaux annonce l’activité vivifiante de l’Esprit. L’humanité est créée à l’image et à la ressemblance de Dieu (Imago Dei), conférant à chaque vie humaine une dignité infinie et une intendance sacrée.',
    christologicalForeshadowing: 'Jean 1:1-3 et Colossiens 1:16 révèlent que tout a été créé par et pour le Christ, le Logos éternel qui était au commencement avec Dieu.',
    practicalApplication: 'Reconnaître Dieu comme Créateur souverain invite au repos sabbatique, à la gratitude pour chaque jour et au respect absolu de la création et du prochain.',
    suggestedNarration: 'Bienvenue dans l’audio-guide théologique de Genèse chapitre 1. En contemplant les six jours de création, nous voyons Dieu apporter l’ordre, la lumière et la vie à partir du néant par sa seule Parole créatrice : « Que la lumière soit ». L’homme et la femme, couronnement de cette création, sont investis de l’image divine. Écoutons ce chapitre avec un cœur rempli d’adoration pour la grandeur infinie de notre Créateur.',
  },
  'GEN-2': {
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 2,
    title: 'Le Jardin d’Éden, le Souffle de Vie et l’Alliance Conjugale',
    theme: 'Intimité entre Dieu et l’homme, sainteté du mariage et vocation humaine',
    keyVerse: 'Genèse 2:7 — L’Éternel Dieu forma l’homme de la poussière du sol, et souffla dans ses narines un souffle de vie.',
    historicalContext: 'Ce second récit complète le premier en zoomant sur la relation intime et d’alliance entre l’Éternel (YHWH Elohim) et Adam dans le jardin d’Éden.',
    theologicalReflection: 'Dieu façonne l’homme de la poussière (Adamah) et insuffle la Neshamah (souffle divin). L’arbre de vie et l’arbre de la connaissance du bien et du mal symbolisent le choix de faire confiance à la révélation morale de Dieu. L’institution de l’alliance du mariage préfigure l’union d’une seule chair.',
    christologicalForeshadowing: 'L’apôtre Paul dans Éphésiens 5:31-32 explique que le mystère d’Adam et de son épouse préfigure l’union éternelle et sacrificielle de Christ avec son Église.',
    practicalApplication: 'Travailler et garder notre environnement avec responsabilité spirituelle, chérir nos relations et marcher dans la sainteté et la transparence devant Dieu.',
    suggestedNarration: 'Dans Genèse chapitre 2, Dieu se révèle de manière personnelle et bienveillante. Il plante un jardin pour l’homme, lui confie une mission et déclare pour la première fois qu’il n’est pas bon que l’homme soit seul. En créant la femme de sa côte, Dieu établit la splendeur de l’amour et de l’alliance. Méditons sur cette bénédiction originelle.',
  },
  'GEN-3': {
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 3,
    title: 'La Chute, l’Origine du Péché et le Protoévangile',
    theme: 'Tentation, rébellion humaine, jugement et la promesse rédemptrice de la semence',
    keyVerse: 'Genèse 3:15 — Je mettrai inimitié entre toi et la femme, entre ta postérité et sa postérité : celle-ci t’écrasera la tête, et tu lui blesseras le talon.',
    historicalContext: 'La rupture de l’alliance par le doute semé par le serpent sur la bonté et la véracité de la parole de Dieu.',
    theologicalReflection: 'Le péché entre par la convoitise et la contestation de l’autorité divine. Dieu vient chercher l’homme avec la question poignante : « Où es-tu ? ». Genèse 3:15 constitue le Protoévangile (première proclamation de la Bonne Nouvelle), annonçant la victoire définitive du Messie sur Satan.',
    christologicalForeshadowing: 'L’habit de peaux confectionné par Dieu pour couvrir la nudité d’Adam et Ève anticipe le premier sacrifice sanglant innocent pour couvrir la faute, préfigurant l’Agneau de Dieu.',
    practicalApplication: 'Ne pas dissimuler nos fautes mais venir humblement à la lumière de la grâce divine, en sachant que Christ a brisé la puissance de la condamnation.',
    suggestedNarration: 'Genèse chapitre 3 est l’un des chapitres les plus cruciaux de toute l’Écriture. Il explique la tragédie de la condition humaine marquée par la rupture, la souffrance et la mort, mais allume simultanément le flambeau de l’espérance avec la promesse du Messie vainqueur. Écoutons ce récit avec solennité et foi.',
  },
  'GEN-12': {
    bookId: 'GEN',
    bookName: 'Genèse',
    chapter: 12,
    title: 'L’Appel d’Abram et le Début de l’Alliance de Grâce',
    theme: 'Obéissance par la foi, bénédiction de toutes les nations et promesse divine',
    keyVerse: 'Genèse 12:3 — Toutes les familles de la terre seront bénies en toi.',
    historicalContext: 'Abram quitte Our en Chaldée, métropole polythéiste mésopotamienne prospère, pour répondre à la voix du Dieu vivant.',
    theologicalReflection: 'L’élection d’Abraham n’est pas exclusive mais instrumentale : une bénédiction destinée à se répandre sur toute l’humanité. La foi biblique implique un départ, un renoncement aux idoles et une confiance totale en la providence.',
    christologicalForeshadowing: 'Galates 3:8 souligne que l’Évangile a été annoncé d’avance à Abraham : en Jésus-Christ, la promesse de bénédiction universelle est accomplie pour tous ceux qui croient.',
    practicalApplication: 'Oser obéir à la direction de Dieu même quand la route future semble invisible aux yeux humains, en fondant notre sécurité sur ses promesses infaillibles.',
    suggestedNarration: 'Avec Genèse 12 commence l’histoire du salut avec un homme ordinaire répondant à un appel extraordinaire. Dieu promet une descendance, un pays et une bénédiction pour toutes les nations. Laissez résonner cet appel à la foi authentique dans votre vie.',
  },
  'PSA-23': {
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 23,
    title: 'L’Éternel mon Berger : Confiance, Restauration et Victoire',
    theme: 'Providence bienveillante, paix au sein de l’épreuve et communion éternelle',
    keyVerse: 'Psaumes 23:1 — L’Éternel est mon berger : je ne manquerai de rien.',
    historicalContext: 'Psaume de David rédigé à partir de son expérience de jeune berger dans les collines de Judée, connaissant les besoins intimes du troupeau face aux prédateurs et aux ravins obscurs.',
    theologicalReflection: 'Dieu n’est pas un roi lointain mais un berger attentif qui nourrit, restaure l’âme (Nephesh) et conduit dans les sentiers de la justice. La vallée de l’ombre de la mort perd sa terreur grâce à la présence réconfortante de sa houlette et de son bâton.',
    christologicalForeshadowing: 'Jésus s’identifie explicitement dans Jean 10:11 comme le Bon Berger qui donne sa vie pour ses brebis, et dans Apocalypse 7:17 comme l’Agneau qui les mènera aux sources des eaux de la vie.',
    practicalApplication: 'Déposer toute anxiété au pied du Seigneur, recevoir son repos quotidien et célébrer la table qu’il dresse pour nous au milieu même de nos combats.',
    suggestedNarration: 'Le Psaume 23 est un cantique de confiance absolue. Que vous traversiez aujourd’hui de verts pâturages ou la sombre vallée de l’adversité, rappelez-vous que la grâce et le bonheur de Dieu vous accompagnent tous les jours de votre vie.',
  },
  'PSA-91': {
    bookId: 'PSA',
    bookName: 'Psaumes',
    chapter: 91,
    title: 'À l’Abri du Très-Haut : Protection Divine et Victoire Spirituelle',
    theme: 'Refuge divin sous les ailes du Tout-Puissant, autorité sur l’ennemi et salut assuré',
    keyVerse: 'Psaumes 91:1 — Celui qui demeure sous l’abri du Très-Haut repose à l’ombre du Tout-Puissant.',
    historicalContext: 'Poème de foi profonde souvent récité lors des épreuves, des pestes et des temps de guerre par le peuple de l’alliance.',
    theologicalReflection: 'L’emploi des quatre noms divins : Elyon (Très-Haut), Shaddai (Tout-Puissant), YHWH (l’Éternel) et Elohim (mon Dieu). Demeurer dans la présence secrète de Dieu octroie une immunité spirituelle et la délivrance des pièges invisibles.',
    christologicalForeshadowing: 'Ce psaume a été cité par le tentateur au désert face à Jésus (Matthieu 4), mais le Christ l’a parfaitement vécu dans une soumission parfaite à la volonté du Père, foulant aux pieds le lion et le dragon.',
    practicalApplication: 'Faire de Dieu notre demeure quotidienne par la prière secrète, chasser la peur nocturne et proclamer sa fidélité comme un bouclier impénétrable.',
    suggestedNarration: 'Le Psaume 91 est une forteresse pour l’âme. Écoutez cette puissante promesse de protection et de paix que le Père céleste réserve à ceux qui s’attachent à lui de tout leur cœur.',
  },
  'ISA-53': {
    bookId: 'ISA',
    bookName: 'Ésaïe',
    chapter: 53,
    title: 'Le Serviteur Souffrant et la Substitution Pénale Rédemptrice',
    theme: 'Expiation vicaire, sacrifice d’amour, justification par la foi et résurrection glorieuse',
    keyVerse: 'Ésaïe 53:5 — Mais il était blessé pour nos péchés, brisé pour nos iniquités ; le châtiment qui nous donne la paix est tombé sur lui, et c’est par ses meurtrissures que nous sommes guéris.',
    historicalContext: 'Quatrième chant du Serviteur dans la prophétie d’Ésaïe, écrit au 8e siècle avant Jésus-Christ, décrivant avec une précision stupéfiante la passion du Messie.',
    theologicalReflection: 'Le cœur de la théologie de la croix (Theologia Crucis) : le Serviteur innocent porte nos douleurs, nos maladies et notre condamnation. Dieu fait retomber sur lui l’iniquité de nous tous. Sa mort est un sacrifice expiatoire (Asham) suivi d’une résurrection où il prolonge ses jours.',
    christologicalForeshadowing: 'Accomplissement absolu à Golgotha, cité constamment par le Nouveau Testament (1 Pierre 2:24, Actes 8:32, Romains 4:25).',
    practicalApplication: 'Mesurer le prix inestimable de notre salut, recevoir la guérison de notre âme et vivre dans la gratitude consacrée pour l’Agneau de Dieu.',
    suggestedNarration: 'Entrez avec recueillement dans Ésaïe 53, le Saint des Saints des prophéties messianiques. Voyez comment, des siècles avant l’événement, le prophète contemple l’Agneau silencieux portant le poids de nos péchés pour nous offrir la paix.',
  },
  'MAT-5': {
    bookId: 'MAT',
    bookName: 'Matthieu',
    chapter: 5,
    title: 'Le Sermon sur la Montagne : Les Béatitudes et la Loi Révélée',
    theme: 'La constitution du Royaume des Cieux, la sainteté du cœur et l’amour parfait',
    keyVerse: 'Matthieu 5:14 — Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée.',
    historicalContext: 'Jésus gravit la montagne en Galilée, nouvel et supérieur Moïse, pour enseigner non pas des commandements extérieurs mais la réalité intérieure du cœur régénéré.',
    theologicalReflection: 'Les Béatitudes renversent les valeurs terrestres : les pauvres en esprit, les doux, ceux qui ont faim de justice sont déclarés bienheureux. Jésus accomplit la Torah en révélant sa signification profonde : la colère équivaut au meurtre, la convoitise à l’adultère.',
    christologicalForeshadowing: 'Christ se présente avec l’autorité suprême : « Vous avez appris qu’il a été dit... mais moi, je vous dis », démontrant sa divinité et son règne.',
    practicalApplication: 'Être le sel de la terre et la lumière du monde dans notre société par des œuvres d’amour désintéressées et une pureté de cœur inébranlable.',
    suggestedNarration: 'Dans Matthieu chapitre 5, le Roi des rois expose les principes éternels de son Royaume. Laissez la puissance des Béatitudes transformer vos priorités et renouveler votre désir de plaire au Père qui est dans les cieux.',
  },
  'JOH-1': {
    bookId: 'JOH',
    bookName: 'Jean',
    chapter: 1,
    title: 'Le Prologue Majestueux : L’Incarnation du Logos Éternel',
    theme: 'Divinité du Christ, incarnation, grâce, vérité et adoption des enfants de Dieu',
    keyVerse: 'Jean 1:14 — Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité.',
    historicalContext: 'L’apôtre Jean s’adresse à la fois au monde juif (le Memra divin) et au monde hellénistique (le Logos ordonnateur du cosmos) pour proclamer le mystère inouï du Dieu incarné.',
    theologicalReflection: 'Jésus n’est pas un être créé mais Dieu de toute éternité. La lumière luit dans les ténèbres et ne peut être étouffée. À tous ceux qui le reçoivent, il donne le pouvoir légal et spirituel (Exousia) de devenir enfants de Dieu régénérés d’en haut.',
    christologicalForeshadowing: 'Jean-Baptiste désigne Jésus comme l’Agneau de Dieu qui ôte le péché du monde, reliant toute l’ancienne alliance sacrificielle à sa personne.',
    practicalApplication: 'Accueillir quotidiennement la plénitude de la grâce et de la vérité en Jésus, et témoigner fidèlement comme Jean-Baptiste que Christ doit grandir et nous diminuer.',
    suggestedNarration: 'Contemplez le sommet de la révélation biblique avec Jean chapitre 1 : la Parole éternelle qui soutient les étoiles a pris un corps d’homme pour habiter parmi nous et nous révéler le cœur du Père.',
  },
  'JOH-3': {
    bookId: 'JOH',
    bookName: 'Jean',
    chapter: 3,
    title: 'La Nouvelle Naissance et la Déclaration Suprême de l’Amour de Dieu',
    theme: 'Régénération spirituelle par l’Esprit, foi au Fils et salut éternel',
    keyVerse: 'Jean 3:16 — Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.',
    historicalContext: 'Dialogue nocturne à Jérusalem entre Jésus et Nicodème, docteur respecté de la loi et membre du Sanhédrin.',
    theologicalReflection: 'Même la plus haute piété religieuse ne suffit pas : il faut « naître d’en haut » (Gennethe Anothen) par l’eau et l’Esprit. L’élévation du serpent d’airain dans le désert illustre la foi salvatrice en Christ élevé sur la croix.',
    christologicalForeshadowing: 'Le Fils unique offert par amour pour racheter le monde déchu de la perdition et communiquer la vie zoé impérissable.',
    practicalApplication: 'Ne pas se reposer sur des mérites humains ou des traditions, mais vivre chaque jour par le souffle libre et vivifiant du Saint-Esprit.',
    suggestedNarration: 'Jean chapitre 3 renferme le cœur vibrant de l’Évangile. Découvrez le secret de la nouvelle naissance et l’amour infini d’un Dieu qui donne tout pour que nous ayons la vie en abondance.',
  },
  'ROM-8': {
    bookId: 'ROM',
    bookName: 'Romains',
    chapter: 8,
    title: 'La Vie par l’Esprit, l’Adoption Filiale et l’Amour Indéfectible',
    theme: 'Aucune condamnation, témoignage intérieur de l’Esprit, glorification et victoire absolue',
    keyVerse: 'Romains 8:1 — Il n’y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ.',
    historicalContext: 'L’apôtre Paul couronne son exposé théologique sur la justification par la foi en décrivant la liberté glorieuse des enfants de Dieu affranchis de la loi du péché et de la mort.',
    theologicalReflection: 'L’Esprit de vie en Jésus-Christ nous libère. Nous recevons l’Esprit d’adoption par lequel nous crions « Abba ! Père ! ». Même la création qui soupire attend la révélation des fils de Dieu. Toutes choses concourent au bien de ceux qui aiment Dieu. Rien ne peut nous séparer de son amour.',
    christologicalForeshadowing: 'Christ intercède à la droite du Père pour nous, garantissant la sécurité éternelle de ses rachetés.',
    practicalApplication: 'Refuser les voix d’accusation de l’ennemi, marcher selon l’Esprit et affronter les épreuves présentes avec la certitude d’être plus que vainqueurs.',
    suggestedNarration: 'Romains 8 est souvent qualifié d’hymne triomphal de la foi chrétienne. Du cri « aucune condamnation » au début, jusqu’à « rien ne pourra nous séparer de l’amour de Dieu » à la fin, laissez ce fleuve de grâce inonder votre âme.',
  },
  'EPH-6': {
    bookId: 'EPH',
    bookName: 'Éphésiens',
    chapter: 6,
    title: 'L’Armure Complète de Dieu et le Combat Spirituel dans la Prière',
    theme: 'Relations sanctifiées dans la famille et au travail, fermeté spirituelle et vigilance',
    keyVerse: 'Éphésiens 6:11 — Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.',
    historicalContext: 'Paul écrit de sa captivité à Rome, sans doute en observant la discipline et l’équipement d’un soldat romain pour en tirer une analogie spirituelle saisissante.',
    theologicalReflection: 'Notre combat n’est pas contre la chair et le sang, mais contre les dominations et les esprits méchants dans les lieux célestes. Les armes divines sont défensives et offensives : vérité, cuirasse de justice, zèle de l’Évangile de paix, bouclier de la foi, casque du salut et l’épée de l’Esprit qui est la Parole de Dieu (Rhema Theou).',
    christologicalForeshadowing: 'C’est le Christ lui-même qui a dépouillé les autorités à la croix (Colossiens 2:15) et nous transmet ses propres victoires.',
    practicalApplication: 'Revêtir consciemment l’armure divine chaque matin dans la prière et persévérer dans l’intercession fraternelle pour tenir ferme contre toute épreuve.',
    suggestedNarration: 'Découvrez dans Éphésiens 6 les clés de la victoire spirituelle. Dieu ne nous envoie pas au combat sans protection : il nous donne ses propres armes pour que nous demeurions inébranlables et victorieux.',
  },
  'REV-21': {
    bookId: 'REV',
    bookName: 'Apocalypse',
    chapter: 21,
    title: 'Nouveaux Cieux, Nouvelle Terre et la Nouvelle Jérusalem',
    theme: 'Consommation finale, essuyage de toute larme, présence éternelle de Dieu parmi les hommes',
    keyVerse: 'Apocalypse 21:4 — Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n’y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.',
    historicalContext: 'Vision prophétique reçue par l’apôtre Jean exilé sur l’île de Patmos sous la persécution impériale de Domitien.',
    theologicalReflection: 'L’aboutissement glorieux du plan rédempteur inauguré en Genèse. L’ancienne création marquée par la corruption cède la place à une création renouvelée. La cité céleste descend d’auprès de Dieu : il n’y a plus de temple car le Seigneur Dieu Tout-Puissant et l’Agneau en sont le temple.',
    christologicalForeshadowing: 'L’Agneau est la lampe de la ville sainte, et son épouse glorifiée participe à son règne éternel.',
    practicalApplication: 'Garder les yeux fixés sur notre espérance céleste inébranlable, persévérer dans la sainteté et annoncer l’Évangile avec urgence et ferveur.',
    suggestedNarration: 'Apocalypse chapitre 21 ouvre devant nous les portes de l’éternité consolée. Toutes les souffrances terrestres trouveront leur réponse dans la gloire infinie de la Nouvelle Jérusalem où Dieu habitera pour toujours avec ses enfants bien-aimés.',
  },
};

/**
 * Returns a specific guide if authored, or dynamically constructs a solid theological guide
 * for any book and chapter based on canonical books and biblical theology.
 */
export function getChapterTheologicalGuide(
  bookId: string,
  bookName: string,
  chapter: number,
  category: string,
  testament: 'AT' | 'NT'
): ChapterTheologicalGuide {
  const key = `${bookId}-${chapter}`;
  if (CHAPTER_AUDIO_GUIDES[key]) {
    return CHAPTER_AUDIO_GUIDES[key];
  }

  // Generative canonical commentary for any chapter
  const isOldTestament = testament === 'AT';
  const title = `${bookName} — Chapitre ${chapter} : Guide Théologique & Spirituel`;
  const theme = isOldTestament
    ? `Alliance divine, fidélité de l'Éternel envers son peuple et préparation du dessein rédempteur messianique.`
    : `Accomplissement en Jésus-Christ, puissance régénératrice de l'Évangile et marche selon l'Esprit Saint.`;

  const historicalContext = isOldTestament
    ? `Révélé dans le cadre de l'ancienne alliance (${category}), ce chapitre témoigne de la pédagogie de Dieu qui forme son peuple et annonce l'espérance messianique à travers l'histoire humaine.`
    : `Proclamé sous la nouvelle alliance (${category}), ce texte fondateur transmet les paroles vivantes et les ordonnances du Royaume des Cieux pour l'édification de l'Église universelle.`;

  const theologicalReflection =
    `La lecture attentive de ${bookName} ${chapter} met en lumière la sainteté, la justice et la grâce infinie du Dieu vivant. ` +
    `Chaque parole est inspirée et utile pour instruire, corriger et fortifier dans la justice (2 Timothée 3:16). ` +
    `Ce texte nous invite à sonder notre cœur à la lumière des Écritures et à nous confier pleinement dans les promesses immuables de l'Éternel.`;

  const christologicalForeshadowing = isOldTestament
    ? `Comme Jésus l'a enseigné sur le chemin d'Emmaüs (Luc 24:27), toute la loi, les prophètes et les psaumes rendent témoignage du Messie. Ce chapitre prépare le chemin de la grâce accomplie en Christ.`
    : `Jésus-Christ est le centre et le garant de cette vérité. Sa mort substitutive et sa résurrection victorieuse donnent tout son sens et sa puissance transformatrice à ce passage.`;

  const practicalApplication =
    `Prenez un moment pour méditer ce chapitre dans la prière personnelle. Demandez au Saint-Esprit d'éclairer votre compréhension, ` +
    `de renouveler votre foi et de vous donner la force d'appliquer concrètement ces enseignements dans votre vie quotidienne, votre famille et votre communauté.`;

  const suggestedNarration =
    `Bienvenue dans l'audio-guide théologique de ${bookName}, chapitre ${chapter}. ` +
    `Alors que vous suivez la lecture du texte biblique, prêtez l'oreille aux vérités éternelles de ce passage. ` +
    `Ce chapitre s'inscrit au cœur du grand dessein rédempteur de Dieu pour l'humanité. ` +
    `Recevez cette parole avec humilité et foi, et laissez le Saint-Esprit renouveler votre intelligence et votre amour pour le Seigneur.`;

  return {
    bookId,
    bookName,
    chapter,
    title,
    theme,
    keyVerse: `${bookName} ${chapter}`,
    historicalContext,
    theologicalReflection,
    christologicalForeshadowing,
    practicalApplication,
    suggestedNarration,
  };
}
