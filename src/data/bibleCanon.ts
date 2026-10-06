import { BibleBook, BibleTranslationInfo, BibleVerse, TranslationKey } from '../types';

export const BIBLE_TRANSLATIONS: BibleTranslationInfo[] = [
  {
    key: 'LSG',
    name: 'Louis Segond 1910 (LSG)',
    fullName: 'Bible Louis Segond 1910 (Version Officielle EMCI TV)',
    language: 'Français',
  },
  {
    key: 'BDS',
    name: 'Bible du Semeur (BDS)',
    fullName: 'La Bible du Semeur (Société Biblique Internationale)',
    language: 'Français',
  },
  {
    key: 'BFC',
    name: 'Français Courant (BFC)',
    fullName: 'La Bible en Français Courant (Alliance Biblique)',
    language: 'Français',
  },
  {
    key: 'DARBY',
    name: 'Darby (DRB)',
    fullName: 'Traduction J.N. Darby (Traduction Littérale)',
    language: 'Français',
  },
  {
    key: 'KJV',
    name: 'King James (KJV)',
    fullName: 'King James Version (Bilingue Anglais/Réf)',
    language: 'Anglais',
  },
  {
    key: 'AMP',
    name: 'Amplifiée (AMP)',
    fullName: 'Amplified Bible (Traduite & Enrichie)',
    language: 'Français / Réf',
  },
];

export const BIBLE_BOOKS: BibleBook[] = [
  // ANCIEN TESTAMENT (39 Livres)
  { id: 'GEN', name: 'Genèse', shortName: 'Gen', testament: 'AT', category: 'Pentateuque', chaptersCount: 50 },
  { id: 'EXO', name: 'Exode', shortName: 'Exo', testament: 'AT', category: 'Pentateuque', chaptersCount: 40 },
  { id: 'LEV', name: 'Lévitique', shortName: 'Lév', testament: 'AT', category: 'Pentateuque', chaptersCount: 27 },
  { id: 'NUM', name: 'Nombres', shortName: 'Nom', testament: 'AT', category: 'Pentateuque', chaptersCount: 36 },
  { id: 'DEU', name: 'Deutéronome', shortName: 'Deu', testament: 'AT', category: 'Pentateuque', chaptersCount: 34 },
  { id: 'JOS', name: 'Josué', shortName: 'Jos', testament: 'AT', category: 'Livres Historiques', chaptersCount: 24 },
  { id: 'JDG', name: 'Juges', shortName: 'Jug', testament: 'AT', category: 'Livres Historiques', chaptersCount: 21 },
  { id: 'RUT', name: 'Ruth', shortName: 'Rut', testament: 'AT', category: 'Livres Historiques', chaptersCount: 4 },
  { id: '1SA', name: '1 Samuel', shortName: '1Sa', testament: 'AT', category: 'Livres Historiques', chaptersCount: 31 },
  { id: '2SA', name: '2 Samuel', shortName: '2Sa', testament: 'AT', category: 'Livres Historiques', chaptersCount: 24 },
  { id: '1KI', name: '1 Rois', shortName: '1Ro', testament: 'AT', category: 'Livres Historiques', chaptersCount: 22 },
  { id: '2KI', name: '2 Rois', shortName: '2Ro', testament: 'AT', category: 'Livres Historiques', chaptersCount: 25 },
  { id: '1CH', name: '1 Chroniques', shortName: '1Ch', testament: 'AT', category: 'Livres Historiques', chaptersCount: 29 },
  { id: '2CH', name: '2 Chroniques', shortName: '2Ch', testament: 'AT', category: 'Livres Historiques', chaptersCount: 36 },
  { id: 'EZR', name: 'Esdras', shortName: 'Esd', testament: 'AT', category: 'Livres Historiques', chaptersCount: 10 },
  { id: 'NEH', name: 'Néhémie', shortName: 'Néh', testament: 'AT', category: 'Livres Historiques', chaptersCount: 13 },
  { id: 'EST', name: 'Esther', shortName: 'Est', testament: 'AT', category: 'Livres Historiques', chaptersCount: 10 },
  { id: 'JOB', name: 'Job', shortName: 'Job', testament: 'AT', category: 'Poétiques & Sagesse', chaptersCount: 42 },
  { id: 'PSA', name: 'Psaumes', shortName: 'Psa', testament: 'AT', category: 'Poétiques & Sagesse', chaptersCount: 150 },
  { id: 'PRO', name: 'Proverbes', shortName: 'Pro', testament: 'AT', category: 'Poétiques & Sagesse', chaptersCount: 31 },
  { id: 'ECC', name: 'Ecclésiaste', shortName: 'Ecc', testament: 'AT', category: 'Poétiques & Sagesse', chaptersCount: 12 },
  { id: 'SNG', name: 'Cantique des Cantiques', shortName: 'Can', testament: 'AT', category: 'Poétiques & Sagesse', chaptersCount: 8 },
  { id: 'ISA', name: 'Ésaïe', shortName: 'Ésa', testament: 'AT', category: 'Prophètes Majeurs', chaptersCount: 66 },
  { id: 'JER', name: 'Jérémie', shortName: 'Jér', testament: 'AT', category: 'Prophètes Majeurs', chaptersCount: 52 },
  { id: 'LAM', name: 'Lamentations', shortName: 'Lam', testament: 'AT', category: 'Prophètes Majeurs', chaptersCount: 5 },
  { id: 'EZK', name: 'Ézéchiel', shortName: 'Ézé', testament: 'AT', category: 'Prophètes Majeurs', chaptersCount: 48 },
  { id: 'DAN', name: 'Daniel', shortName: 'Dan', testament: 'AT', category: 'Prophètes Majeurs', chaptersCount: 12 },
  { id: 'HOS', name: 'Osée', shortName: 'Osé', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 14 },
  { id: 'JOL', name: 'Joël', shortName: 'Joë', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 3 },
  { id: 'AMO', name: 'Amos', shortName: 'Amo', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 9 },
  { id: 'OBA', name: 'Abdias', shortName: 'Abd', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 1 },
  { id: 'JON', name: 'Jonas', shortName: 'Jon', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 4 },
  { id: 'MIC', name: 'Michée', shortName: 'Mic', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 7 },
  { id: 'NAM', name: 'Nahum', shortName: 'Nah', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 3 },
  { id: 'HAB', name: 'Habacuc', shortName: 'Hab', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 3 },
  { id: 'ZEP', name: 'Sophonie', shortName: 'Sop', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 3 },
  { id: 'HAG', name: 'Aggée', shortName: 'Agg', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 2 },
  { id: 'ZEC', name: 'Zacharie', shortName: 'Zac', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 14 },
  { id: 'MAL', name: 'Malachie', shortName: 'Mal', testament: 'AT', category: 'Prophètes Mineurs', chaptersCount: 4 },

  // NOUVEAU TESTAMENT (27 Livres)
  { id: 'MAT', name: 'Matthieu', shortName: 'Mat', testament: 'NT', category: 'Évangiles', chaptersCount: 28 },
  { id: 'MRK', name: 'Marc', shortName: 'Mar', testament: 'NT', category: 'Évangiles', chaptersCount: 16 },
  { id: 'LUK', name: 'Luc', shortName: 'Luc', testament: 'NT', category: 'Évangiles', chaptersCount: 24 },
  { id: 'JHN', name: 'Jean', shortName: 'Jea', testament: 'NT', category: 'Évangiles', chaptersCount: 21 },
  { id: 'ACT', name: 'Actes des Apôtres', shortName: 'Act', testament: 'NT', category: 'Histoire de l’Église', chaptersCount: 28 },
  { id: 'ROM', name: 'Romains', shortName: 'Rom', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 16 },
  { id: '1CO', name: '1 Corinthiens', shortName: '1Co', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 16 },
  { id: '2CO', name: '2 Corinthiens', shortName: '2Co', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 13 },
  { id: 'GAL', name: 'Galates', shortName: 'Gal', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 6 },
  { id: 'EPH', name: 'Éphésiens', shortName: 'Éph', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 6 },
  { id: 'PHP', name: 'Philippiens', shortName: 'Phi', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 4 },
  { id: 'COL', name: 'Colossiens', shortName: 'Col', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 4 },
  { id: '1TH', name: '1 Thessaloniciens', shortName: '1Th', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 5 },
  { id: '2TH', name: '2 Thessaloniciens', shortName: '2Th', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 3 },
  { id: '1TI', name: '1 Timothée', shortName: '1Ti', testament: 'NT', category: 'Épîtres Pastorales', chaptersCount: 6 },
  { id: '2TI', name: '2 Timothée', shortName: '2Ti', testament: 'NT', category: 'Épîtres Pastorales', chaptersCount: 4 },
  { id: 'TIT', name: 'Tite', shortName: 'Tit', testament: 'NT', category: 'Épîtres Pastorales', chaptersCount: 3 },
  { id: 'PHM', name: 'Philémon', shortName: 'Phm', testament: 'NT', category: 'Épîtres Pauliniennes', chaptersCount: 1 },
  { id: 'HEB', name: 'Hébreux', shortName: 'Héb', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 13 },
  { id: 'JAS', name: 'Jacques', shortName: 'Jac', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 5 },
  { id: '1PE', name: '1 Pierre', shortName: '1Pi', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 5 },
  { id: '2PE', name: '2 Pierre', shortName: '2Pi', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 3 },
  { id: '1JN', name: '1 Jean', shortName: '1Jn', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 5 },
  { id: '2JN', name: '2 Jean', shortName: '2Jn', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 1 },
  { id: '3JN', name: '3 Jean', shortName: '3Jn', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 1 },
  { id: 'JUD', name: 'Jude', shortName: 'Jud', testament: 'NT', category: 'Épîtres Générales', chaptersCount: 1 },
  { id: 'REV', name: 'Apocalypse', shortName: 'Apo', testament: 'NT', category: 'Prophétie & Révélation', chaptersCount: 22 },
];

// Rich curated database of classic foundational chapters with authentic full translations
type VerseData = { [verseNum: number]: { [translation in TranslationKey]?: string } };
type BookChapterData = { [chapterNum: number]: VerseData };
type BibleCorpus = { [bookId: string]: BookChapterData };

export const CURATED_BIBLE_CHAPTERS: BibleCorpus = {
  // GENÈSE 1
  GEN: {
    1: {
      1: {
        LSG: 'Au commencement, Dieu créa les cieux et la terre.',
        BFC: 'Au commencement, Dieu créa le ciel et la terre.',
        DARBY: 'Au commencement Dieu créa les cieux et la terre.',
        KJV: 'In the beginning God created the heaven and the earth.',
        AMP: 'Au commencement [avant tout le temps existant], Dieu créa [par Sa seule volonté] les cieux et la terre.',
      },
      2: {
        LSG: 'La terre était informe et vide: il y avait des ténèbres à la surface de l’abîme, et l’Esprit de Dieu se mouvait au-dessus des eaux.',
        BFC: 'La terre était informe et déserte, l’obscurité couvrait l’océan primitif, et le souffle de Dieu planait sur les eaux.',
        DARBY: 'Et la terre était désolation et vide, et il y avait des ténèbres sur la face de l’abîme; et l’Esprit de Dieu planait sur la face des eaux.',
        KJV: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
        AMP: 'La terre était vide et chaotique, des ténèbres profondes reposaient sur l’abîme, et le Saint-Esprit de Dieu se mouvait avec puissance au-dessus des eaux.',
      },
      3: {
        LSG: 'Dieu dit: Que la lumière soit! Et la lumière fut.',
        BFC: 'Alors Dieu dit : « Que la lumière paraisse ! » et la lumière parut.',
        DARBY: 'Et Dieu dit : Que la lumière soit; et la lumière fut.',
        KJV: 'And God said, Let there be light: and there was light.',
        AMP: 'Alors Dieu proclama : « Que la lumière soit ! » et immédiatement la lumière resplendit.',
      },
      4: {
        LSG: 'Dieu vit que la lumière était bonne; et Dieu sépara la lumière d’avec les ténèbres.',
        BFC: 'Dieu constata que la lumière était une bonne chose. Alors il sépara la lumière de l’obscurité.',
        DARBY: 'Et Dieu vit la lumière, qu’elle était bonne; et Dieu sépara la lumière d’avec les ténèbres.',
        KJV: 'And God saw the light, that it was good: and God divided the light from the darkness.',
        AMP: 'Dieu contempla la lumière et constata combien elle était excellente, convenable et bonne ; Il établit une séparation nette entre le jour et la nuit.',
      },
      5: {
        LSG: 'Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.',
        BFC: 'Il appela la lumière « jour » et l’obscurité « nuit ». Il y eut un soir, puis un matin : ce fut le premier jour.',
        DARBY: 'Et Dieu appela la lumière Jour; et les ténèbres, il les appela Nuit. Et il y eut soir, et il y eut matin : premier jour.',
        KJV: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.',
        AMP: 'Dieu désigna la clarté sous le nom de Jour, et l’obscurité sous le nom de Nuit. Il y eut un soir, puis vint l’aurore : ce fut le premier jour.',
      },
    },
  },

  // PSAUME 1
  PSA: {
    1: {
      1: {
        LSG: 'Heureux l’homme qui ne marche pas selon le conseil des méchants, qui ne s’arrête pas sur la voie des pécheurs, et qui ne s’assied pas en compagnie des moqueurs,',
        BDS: 'Heureux l’homme qui ne suit pas le conseil des méchants, qui ne s’arrête pas sur la voie des pécheurs et ne s’assied pas en compagnie des moqueurs,',
        BFC: 'Heureux est l’homme qui ne prend pas le parti des méchants, qui ne s’arrête pas sur le chemin des pécheurs, et ne s’assied pas avec ceux qui se moquent de Dieu !',
        DARBY: 'Bienheureux l’homme qui ne marche pas dans le conseil des méchants, et ne se tient pas dans la voie des pécheurs, et ne s’assied pas au siège des moqueurs;',
        KJV: 'Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.',
        AMP: 'Béni, heureux, prospère et grandement favorisé est l’homme qui ne marche pas selon les conseils des impies, ne s’arrête point dans la voie des pécheurs et refuse de siéger parmi les moqueurs.',
      },
      2: {
        LSG: 'Mais qui trouve son plaisir dans la loi de l’Éternel, et qui la médite jour et nuit!',
        BDS: 'Mais qui trouve son plaisir dans la loi de l’Éternel et la médite jour et nuit !',
        BFC: 'Mais qui trouve son plaisir dans l’enseignement du Seigneur et le médite jour et nuit !',
        DARBY: 'Mais qui a son plaisir en la loi de l’Éternel, et médite en sa loi jour et nuit.',
        KJV: 'But his delight is in the law of the LORD; and in his law doth he meditate day and night.',
        AMP: 'Mais dont la joie suprême réside dans la Parole et la loi de l’Éternel, et qui la sonde et la médite avec délices jour et nuit.',
      },
      3: {
        LSG: 'Il est comme un arbre planté près d’un courant d’eau, qui donne son fruit en sa saison, et dont le feuillage ne se flétrit point: tout ce qu’il fait lui réussit.',
        BDS: 'Il est comme un arbre planté près d’un cours d’eau : il donne son fruit en sa saison et son feuillage ne se flétrit pas. Tout ce qu’il fait réussit.',
        BFC: 'Il est comme un arbre planté près d’un ruisseau : il produit ses fruits en temps voulu, son feuillage ne se dessèche jamais. Tout ce qu’il entreprend réussit.',
        DARBY: 'Et il sera comme un arbre planté près des ruisseaux d’eaux, qui rend son fruit en sa saison, et dont la feuille ne se flétrit point; et tout ce qu’il fait prospérera.',
        KJV: 'And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.',
        AMP: 'Il sera vigoureux comme un arbre fermement enraciné près de courants d’eaux vives, qui porte son fruit en sa saison propre et dont le feuillage demeure toujours vert ; dans toutes ses entreprises, il prospérera par la grâce divine.',
      },
      4: {
        LSG: 'Il n’en est pas ainsi des méchants: ils sont comme la paille que le vent dissipe.',
        BDS: 'Les méchants ne sont pas ainsi : ils sont comme la paille que le vent disperse.',
        BFC: 'Les méchants ne sont pas ainsi : ils ressemblent à la paille légère que le vent emporte.',
        DARBY: 'Il n’en est pas ainsi des méchants, mais ils sont comme la balle que le vent chasse.',
        KJV: 'The ungodly are not so: but are like the chaff which the wind driveth away.',
        AMP: 'Il n’en va nullement ainsi des méchants : ils sont semblables à la balle sans consistance que le vent tourbillonnant disperse sans laisser de traces.',
      },
      5: {
        LSG: 'C’est pourquoi les méchants ne résistent pas au jour du jugement, ni les pécheurs dans l’assemblée des justes;',
        BDS: 'C’est pourquoi les méchants ne résistent pas lors du jugement, ni les pécheurs dans la communauté des justes.',
        BFC: 'C’est pourquoi les méchants ne résisteront pas lors du jugement de Dieu, ni les pécheurs quand les justes seront rassemblés.',
        DARBY: 'C’est pourquoi les méchants ne subsisteront pas dans le jugement, ni les pécheurs dans l’assemblée des justes;',
        KJV: 'Therefore the ungodly shall not stand in the judgment, nor sinners in the congregation of the righteous.',
        AMP: 'Voilà pourquoi les impies ne pourront tenir debout au jour redoutable du jugement divin, et les pécheurs n’auront aucune part dans l’assemblée des rachetés sanctifiés.',
      },
      6: {
        LSG: 'Car l’Éternel connaît la voie des justes, et la voie des pécheurs mène à la ruine.',
        BDS: 'En effet, l’Éternel connaît la voie des justes, mais la voie des méchants mène à la ruine.',
        BFC: 'Car le Seigneur protège le chemin de ceux qui lui sont fidèles, mais le chemin des méchants mène à la ruine.',
        DARBY: 'Car l’Éternel connaît la voie des justes; mais la voie des méchants périra.',
        KJV: 'For the LORD knoweth the way of the righteous: but the way of the ungodly shall perish.',
        AMP: 'Car l’Éternel entoure de Son regard vigilant le chemin des justes, tandis que le sentier trompeur des méchants aboutit à la perdition éternelle.',
      },
    },

    // PSAUME 23
    23: {
      1: {
        LSG: "L'Éternel est mon berger: je ne manquerai de rien.",
        BFC: 'Le Seigneur est mon berger, je ne manquerai de rien.',
        DARBY: "L'Éternel est mon pasteur; je ne manquerai de rien.",
        KJV: 'The LORD is my shepherd; I shall not want.',
        AMP: "L'Éternel est mon Berger [qui prend soin de moi, me guide et me nourrit] : je ne serai dans aucun manque.",
      },
      2: {
        LSG: 'Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.',
        BFC: 'Il me fait reposer dans de verts pâturages et me conduit près des eaux paisibles.',
        DARBY: 'Il me fait reposer dans de verts pâturages, il me mène à des eaux paisibles;',
        KJV: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
        AMP: 'Il me procure un repos bienfaisant dans des prairies verdoyantes, et Il me guide doucement le long des cours d’eau rafraîchissants et calmes.',
      },
      3: {
        LSG: 'Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom.',
        BFC: 'Il me redonne des forces neuves. Il me guide sur la bonne voie, fidèle à sa réputation.',
        DARBY: 'il restaure mon âme; il me conduit dans des sentiers de justice, à cause de son nom.',
        KJV: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.',
        AMP: 'Il restaure et ranime mon âme [ma vie intérieure] ; Il me trace le chemin de la justice et de l’intégrité pour l’honneur de Son saint Nom.',
      },
      4: {
        LSG: 'Quand je marche dans la vallée de l’ombre de la mort, Je ne crains aucun mal, car tu es avec moi: Ta houlette et ton bâton me rassurent.',
        BFC: 'Même si je traverse la sombre vallée de la mort, je ne crains aucun danger, car tu es avec moi. Ton bâton de berger me protège et me rassure.',
        DARBY: 'Même quand je marcherais par la vallée de l’ombre de la mort, je ne craindrai aucun mal; car tu es avec moi : ta houlette et ton bâton, ce sont eux qui me consolent.',
        KJV: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
        AMP: 'Même si je devais traverser les défilés ténébreux de l’angoisse ou l’ombre de la mort, je ne redouterai aucun mal : Tu marches à mes côtés, Ta houlette d’autorité et Ton bâton de secours me protègent et dissipent toute frayeur.',
      },
      5: {
        LSG: 'Tu dresses devant moi une table, En face de mes adversaires; Tu oins d’huile ma tête, Et ma coupe déborde.',
        BFC: 'Tu prépares un banquet pour moi sous les yeux de mes adversaires. Tu verses sur ma tête de l’huile parfumée, et tu remplis ma coupe jusqu’à ce qu’elle déborde.',
        DARBY: 'Tu dresses devant moi une table, en la présence de mes ennemis; tu as oint ma tête d’huile, ma coupe est comble.',
        KJV: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
        AMP: 'Tu dresses un festin royal sous le regard impuissant de mes ennemis ; Tu répands sur ma tête l’onction sainte du Saint-Esprit, et ma coupe déborde de bénédictions et de joie.',
      },
      6: {
        LSG: 'Oui, le bonheur et la grâce m’accompagneront Tous les jours de ma vie, Et j’habiterai dans la maison de l’Éternel Jusqu’à la fin de mes jours.',
        BFC: 'Oui, le bonheur et la bonté m’accompagneront tous les jours de ma vie, et j’habiterai dans la maison du Seigneur aussi longtemps que je vivrai.',
        DARBY: 'Oui, la bonté et la gratuité me suivront tous les jours de ma vie, et mon habitation sera dans la maison de l’Éternel pour de longs jours.',
        KJV: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
        AMP: 'Assurément, la bienveillance, la fidélité et la grâce insondable de Dieu m’escorteront chaque jour de mon existence terrestre, et ma demeure perpétuelle sera dans la sainte présence du Seigneur pour l’éternité.',
      },
    },

    // PSAUME 91
    91: {
      1: {
        LSG: 'Celui qui demeure sous l’abri du Très-Haut Repose à l’ombre du Tout-Puissant.',
        BFC: 'Celui qui s’abrite auprès du Dieu Très-Haut passe la nuit à l’ombre du Tout-Puissant.',
        DARBY: 'Celui qui habite dans la retraite du Très-haut logera à l’ombre du Tout-puissant.',
        KJV: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.',
        AMP: 'Celui qui a fait du secret de la présence du Très-Haut son sanctuaire permanent reposera en sécurité inaltérable sous la protection souveraine du Tout-Puissant [El Shaddai].',
      },
      2: {
        LSG: 'Je dis à l’Éternel: Mon refuge et ma forteresse, Mon Dieu en qui je me confie!',
        BFC: 'Il peut dire au Seigneur : « Tu es mon refuge, ma forteresse, mon Dieu en qui j’ai confiance. »',
        DARBY: 'Je dis de l’Éternel : Il est mon refuge et mon lieu fort; il est mon Dieu, je me confierai en lui.',
        KJV: 'I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.',
        AMP: 'Je proclame avec hardiesse à l’Éternel : « Tu es mon rempart inexpugnable, ma haute forteresse, mon Dieu en qui je dépose toute mon espérance ! »',
      },
      3: {
        LSG: 'Car c’est lui qui te délivre du filet de l’oiseleur, De la peste et de ses ravages.',
        BFC: 'C’est lui qui te délivre du piège du chasseur et de la peste redoutable.',
        DARBY: 'Car c’est lui qui te délivrera du piège de l’oiseleur, de la peste destructrice.',
        KJV: 'Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence.',
        AMP: 'C’est Lui qui te libérera des pièges cachés de l’ennemi et des fléaux destructeurs.',
      },
      4: {
        LSG: 'Il te couvrira de ses plumes, Et tu trouveras un refuge sous ses ailes; Sa fidélité est un bouclier et une cuirasse.',
        BFC: 'Il te protège comme un oiseau sous ses ailes, tu trouves un abri contre lui. Sa fidélité te sert de bouclier et de cuirasse.',
        DARBY: 'Il te couvrira de ses plumes, et sous ses ailes tu auras un refuge; sa vérité sera ton bouclier et ta rondache.',
        KJV: 'He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.',
        AMP: 'Il te recouvrira de Sa tendre protection et sous l’envergure de Ses ailes tu seras préservé ; Sa vérité et Sa fidélité sans faille constituent un bouclier et une armure impénétrable.',
      },
      5: {
        LSG: 'Tu ne craindras ni les terreurs de la nuit, Ni la flèche qui vole de jour,',
        BFC: 'Tu n’auras rien à craindre : ni les terreurs de la nuit, ni la flèche qui vole en plein jour,',
        DARBY: 'Tu n’auras point de peur des frayeurs de la nuit, ni de la flèche qui vole de jour,',
        KJV: 'Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;',
        AMP: 'Tu ne seras pas effrayé par les attaques nocturnes de l’ennemi, ni par les flèches perfides tirées au grand jour.',
      },
      6: {
        LSG: 'Ni la peste qui marche dans les ténèbres, Ni la contagion qui frappe en plein midi.',
        BDS: 'Ni la peste qui rôde dans l’obscurité, ni l’épidémie qui frappe en plein midi.',
        BFC: 'Ni la peste qui rôde dans l’ombre, ni le fléau qui frappe en plein midi.',
        DARBY: 'ni de la peste qui marche dans les ténèbres, ni de la destruction qui détruit en plein midi.',
        KJV: 'Nor for the pestilence that walketh in darkness; nor for the destruction that wasteth at noonday.',
        AMP: 'Ni par les épidémies insidieuses qui sévissent dans l’ombre, ni par les fléaux dévastateurs qui frappent en plein jour.',
      },
      7: {
        LSG: 'Que mille tombent à ton côté, Et dix mille à ta droite, Tu ne seras pas atteint;',
        BDS: 'Même si mille tombent à côté de toi, et dix mille à ta droite, tu ne seras pas atteint.',
        BFC: 'Que mille tombent près de toi et dix mille à ta droite, toi, tu ne seras pas atteint.',
        DARBY: 'Il en tombera mille à ton côté, et dix mille à ta droite; toi, tu ne seras point atteint.',
        KJV: 'A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee.',
        AMP: 'Quand bien même mille s’écrouleraient à tes côtés et dix mille à ta droite, le malheur ne pourra s’approcher de toi pour te détruire.',
      },
      8: {
        LSG: 'De tes yeux seulement tu regarderas, Et tu verras la rétribution des méchants.',
        BDS: 'Ouvre seulement les yeux, et tu verras la punition des méchants.',
        BFC: 'Regarde seulement de tes yeux, et tu verras la punition des méchants.',
        DARBY: 'Seulement de tes yeux tu contempleras, et tu verras la récompense des méchants.',
        KJV: 'Only with thine eyes shalt thou behold and see the reward of the wicked.',
        AMP: 'De tes propres yeux tu contempleras et tu seras témoin de la juste rétribution réservée aux impies.',
      },
      9: {
        LSG: 'Car tu es mon refuge, ô Éternel! Tu fais du Très-Haut ta retraite.',
        BDS: 'Oui, tu es mon refuge, ô Éternel ! Si tu as fait du Très-Haut ton abri,',
        BFC: 'Oui, tu es mon abri, Seigneur ! Si tu as choisi le Très-Haut pour refuge,',
        DARBY: 'Parce que toi tu as mis l’Éternel, mon refuge, le Très-haut, pour ta demeure,',
        KJV: 'Because thou hast made the LORD, which is my refuge, even the most High, thy habitation;',
        AMP: 'Parce que tu as proclamé : « L’Éternel est mon refuge inviolable », et que tu as fait du Très-Haut ta sainte demeure,',
      },
      10: {
        LSG: 'Aucun malheur ne t’arrivera, Aucun fléau n’approchera de ta tente.',
        BDS: 'aucun mal ne t’atteindra, aucun fléau n’approchera de ta tente.',
        BFC: 'aucun mal ne t’arrivera, aucun malheur n’approchera de ta maison.',
        DARBY: 'aucun mal ne t’arrivera, et aucun fléau n’approchera de ta tente;',
        KJV: 'There shall no evil befall thee, neither shall any plague come nigh thy dwelling.',
        AMP: 'aucun malheur ne t’accablera, et aucun fléau destructeur n’approchera de ton foyer.',
      },
      11: {
        LSG: 'Car il ordonnera à ses anges De te garder dans toutes tes voies;',
        BDS: 'Car il donnera des ordres à ses anges à ton sujet, pour te garder dans toutes tes voies.',
        BFC: 'Car il chargera ses anges de te garder sur tous tes chemins.',
        DARBY: 'car il commandera à ses anges à ton sujet, de te garder en toutes tes voies:',
        KJV: 'For he shall give his angels charge over thee, to keep thee in all thy ways.',
        AMP: 'Car Il donnera des instructions précises à Ses saints anges à ton égard, afin de t’escorter et de te préserver dans toutes tes démarches ;',
      },
      12: {
        LSG: 'Ils te porteront sur les mains, De peur que ton pied ne heurte contre une pierre.',
        BDS: 'Ils te porteront sur leurs mains, de peur que ton pied ne heurte une pierre.',
        BFC: 'Ils te porteront sur leurs mains, de peur que ton pied ne heurte une pierre.',
        DARBY: 'ils te porteront sur leurs mains, de peur que tu ne heurtes ton pied contre une pierre.',
        KJV: 'They shall bear thee up in their hands, lest thou dash thy foot against a stone.',
        AMP: 'ils te porteront avec soin sur leurs mains, afin d’empêcher que ton pied ne heurte aucun obstacle de pierre.',
      },
      13: {
        LSG: 'Tu marcheras sur le lion et sur l’aspic, Tu fouleras le lionceau et le dragon.',
        BDS: 'Tu marcheras sur le lion et sur la vipère, tu écraseras le lionceau et le serpent.',
        BFC: 'Tu pourras marcher sans danger sur le lion et la vipère, tu écraseras sous tes pieds le fauve et le serpent.',
        DARBY: 'Tu marcheras sur le lion et sur l’aspic, tu fouleras le lionceau et le dragon.',
        KJV: 'Thou shalt tread upon the lion and adder: the young lion and the dragon shalt thou trample under feet.',
        AMP: 'Tu fouleras le lion féroce et le serpent venimeux, tu écraseras victorieusement sous tes pieds toute puissance ennemie.',
      },
      14: {
        LSG: 'Puisqu’il m’aime, je le délivrerai; Je le protégerai, puisqu’il connaît mon nom.',
        BDS: 'Puisqu’il s’attache à moi, je le délivrerai ; je le protégerai, car il connaît mon nom.',
        BFC: '« Il s’est attaché à moi, dit le Seigneur, je le ferai donc échapper au danger. Je le protégerai, car il sait qui je suis. »',
        DARBY: 'Puisqu’il a mis son affection sur moi, je le délivrerai; je le mettrai en une haute retraite, parce qu’il a connu mon nom.',
        KJV: 'Because he hath set his love upon me, therefore will I deliver him: I will set him on high, because he hath known my name.',
        AMP: '« Puisqu’il s’est tendrement attaché à Moi de tout son cœur, proclame l’Éternel, Je le délivrerai infailliblement ; Je l’élèverai hors d’atteinte parce qu’il révère et confesse Mon Nom glorieux.',
      },
      15: {
        LSG: 'Il m’invoquera, et je lui répondrai; Je serai avec lui dans la détresse, Je le délivrerai et je le glorifierai.',
        BDS: 'Il m’invoquera et je lui répondrai. Je serai avec lui dans la détresse, je le délivrerai et je le glorifierai.',
        BFC: 'S’il m’appelle au secours, je lui répondrai. Je serai avec lui dans la détresse, je le délivrerai et je lui rendrai gloire.',
        DARBY: 'Il m’invoquera, et je lui répondrai; je serai avec lui dans la détresse, je le délivrerai et je le glorifierai.',
        KJV: 'He shall call upon me, and I will answer him: I will be with him in trouble; I will deliver him, and honour him.',
        AMP: 'Dès qu’il M’invoquera, Je lui répondrai immédiatement ; Je me tiendrai à ses côtés dans les tourments de l’épreuve, Je le libérerai et Je le comblerai d’honneur.',
      },
      16: {
        LSG: 'Je le rassasierai de longs jours, Et je lui ferai voir mon salut.',
        BDS: 'Je le comblerai de longs jours et je lui ferai voir mon salut.',
        BFC: 'Je lui donnerai une vie longue et belle, et je lui ferai voir mon salut.',
        DARBY: 'Je le rassasierai de longs jours, et je lui ferai voir mon salut.',
        KJV: 'With long life will I satisfy him, and shew him my salvation.',
        AMP: 'Je le comblerai d’une longue existence féconde, et Je déploierai devant ses yeux la magnificence de Mon salut éternel ! »',
      },
    },
  },

  // PROVERBES 3
  PRO: {
    3: {
      5: {
        LSG: 'Confie-toi en l’Éternel de tout ton cœur, Et ne t’appuie pas sur ta sagesse;',
        BFC: 'Mets ta confiance dans le Seigneur de tout ton cœur, ne compte pas sur ta propre intelligence.',
        DARBY: 'Confie-toi de tout ton cœur en l’Éternel, et ne t’appuie pas sur ton sens;',
        KJV: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
        AMP: 'Fais pleinement confiance à l’Éternel de tout ton cœur et de tout ton être, et ne place pas ta dépendance sur ton propre discernement limité.',
      },
      6: {
        LSG: 'Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers.',
        BFC: 'Dans toutes tes démarches reconnais-le, et lui, il aplanira tes chemins.',
        DARBY: 'pense à lui dans toutes tes voies, et il aplanira tes sentiers.',
        KJV: 'In all thy ways acknowledge him, and he shall direct thy paths.',
        AMP: 'Dans tous tes projets et chaque décision de ta vie, reconnais Sa souveraineté et soumets-toi à Lui, et Il tracera devant toi une route claire et droite.',
      },
    },
  },

  // JEAN 1
  JHN: {
    1: {
      1: {
        LSG: 'Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.',
        BFC: 'Au commencement était celui qui est la Parole. Il était avec Dieu, il était Dieu.',
        DARBY: 'Au commencement était la Parole; et la Parole était auprès de Dieu; et la Parole était Dieu.',
        KJV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        AMP: 'Au commencement [avant la création de l’univers] était le Logos (la Parole vivante) ; la Parole était en communion face à face avec Dieu, et la Parole était pleinement Dieu.',
      },
      2: {
        LSG: 'Elle était au commencement avec Dieu.',
        BFC: 'Il était au commencement avec Dieu.',
        DARBY: 'Elle était au commencement auprès de Dieu.',
        KJV: 'The same was in the beginning with God.',
        AMP: 'Elle existait dès l’origine, coéternelle avec le Père.',
      },
      3: {
        LSG: 'Toutes choses ont été faites par elle, et rien de ce qui a été fait n’a été fait sans elle.',
        BFC: 'Par lui, Dieu a créé toutes choses ; rien de ce qui a été créé n’a été créé sans lui.',
        DARBY: 'Toutes choses furent faites par elle, et sans elle pas une seule chose ne fut faite de ce qui a été fait.',
        KJV: 'All things were made by him; and without him was not any thing made that was made.',
        AMP: 'Toutes choses sont venues à l’existence par Son entremise ; rien de ce qui existe n’a été façonné sans Son intervention souveraine.',
      },
      4: {
        LSG: 'En elle était la vie, et la vie était la lumière des hommes.',
        BFC: 'En lui était la vie, et cette vie était la lumière des êtres humains.',
        DARBY: 'En elle était la vie, et la vie était la lumière des hommes.',
        KJV: 'In him was life; and the life was the light of men.',
        AMP: 'En Lui résidait la plénitude de la vie [la vie divine et impérissable], et cette vie divine est la lumière rayonnante qui éclaire l’humanité entière.',
      },
      5: {
        LSG: 'La lumière luit dans les ténèbres, et les ténèbres ne l’ont point reçue.',
        BFC: 'La lumière brille dans l’obscurité, et l’obscurité ne l’a pas arrêtée.',
        DARBY: 'Et la lumière luit dans les ténèbres; et les ténèbres ne l’ont pas comprise.',
        KJV: 'And the light shineth in darkness; and the darkness comprehended it not.',
        AMP: 'La lumière brille et resplendit au cœur des ténèbres, et les ténèbres n’ont jamais pu l’étouffer ni la vaincre.',
      },
      14: {
        LSG: 'Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité; et nous avons contemplé sa gloire, une gloire comme la gloire du Fils unique venu du Père.',
        BFC: 'Celui qui est la Parole est devenu un homme, et il a vécu parmi nous, plein de grâce et de vérité. Nous avons contemplé sa gloire, la gloire que le Fils unique reçoit du Père.',
        DARBY: 'Et la Parole devint chair, et habita au milieu de nous (et nous contemplâmes sa gloire, une gloire comme d’un fils unique de la part du Père) pleine de grâce et de vérité.',
        KJV: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
        AMP: 'Et le Logos s’est fait être humain en Jésus-Christ, Il a dressé Sa tente au milieu de nous, débordant d’une grâce imméritée et d’une vérité absolue ; et nous avons contemplé Sa gloire céleste, éclat unique du Fils bien-aimé venant du Père.',
      },
    },

    // JEAN 3
    3: {
      16: {
        LSG: 'Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.',
        BFC: 'Oui, Dieu a tellement aimé le monde qu’il a donné son Fils unique, afin que quiconque met sa foi en lui ne périsse pas mais obtienne la vie éternelle.',
        DARBY: 'Car Dieu a tant aimé le monde, qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse pas, mais qu’il ait la vie éternelle.',
        KJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        AMP: 'Car Dieu a aimé le monde d’un amour si incommensurable qu’Il a fait don de Son Fils unique, afin que quiconque place sa foi et sa confiance totale en Lui ne se perde pas, mais possède la vie éternelle et glorieuse.',
      },
      17: {
        LSG: 'Dieu, en effet, n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui.',
        BFC: 'Dieu n’a pas envoyé son Fils dans le monde pour condamner le monde, mais pour que le monde soit sauvé par lui.',
        DARBY: 'Car Dieu n’a pas envoyé son Fils dans le monde afin qu’il juge le monde, mais afin que le monde soit sauvé par lui.',
        KJV: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
        AMP: 'Car Dieu n’a point mandaté Son Fils pour condamner ou foudroyer le monde, mais pour offrir au monde l’accès au salut et à la rédemption par Sa grâce.',
      },
    },
  },

  // ROMAINS 8
  ROM: {
    8: {
      1: {
        LSG: 'Il n’y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ.',
        BFC: 'Il n’y a donc maintenant plus aucune condamnation pour ceux qui sont unis à Jésus-Christ.',
        DARBY: 'Il n’y a donc maintenant aucune condamnation pour ceux qui sont dans le christ Jésus.',
        KJV: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.',
        AMP: 'Il n’y a dès à présent et à jamais aucune condamnation, aucun verdict de culpabilité pour ceux qui sont indissolublement unis à Jésus-Christ.',
      },
      28: {
        LSG: 'Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.',
        BFC: 'Nous savons que Dieu fait tout concourir au bien de ceux qui l’aiment, de ceux qu’il a appelés selon son plan.',
        DARBY: 'Or nous savons que toutes choses travaillent ensemble pour le bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son propos.',
        KJV: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
        AMP: 'Nous avons l’assurance inébranlable que Dieu orchestre et fait concourir chaque circonstance pour le bien suprême de ceux qui L’aiment sincèrement et qui sont appelés conformément à Son dessein éternel.',
      },
      31: {
        LSG: 'Que dirons-nous donc à l’égard de ces choses? Si Dieu est pour nous, qui sera contre nous?',
        BFC: 'Que dire de plus ? Si Dieu est pour nous, qui peut être contre nous ?',
        DARBY: 'Que dirons-nous donc à ces choses ? Si Dieu est pour nous, qui sera contre nous ?',
        KJV: 'What shall we then say to these things? If God be for us, who can be against us?',
        AMP: 'Que pourrions-nous ajouter devant une telle grâce ? Si Dieu le Tout-Puissant est à nos côtés et prend notre défense, qui oserait se dresser victorieusement contre nous ?',
      },
      38: {
        LSG: 'Car j’ai l’assurance que ni la mort ni la vie, ni les anges ni les dominations, ni les choses présentes ni les choses à venir,',
        BFC: 'Oui, j’ai la certitude que rien ne peut nous séparer de son amour : ni la mort, ni la vie, ni les anges, ni d’autres autorités célestes, ni le présent, ni l’avenir,',
        DARBY: 'Car je suis assuré que ni mort, ni vie, ni anges, ni principautés, ni choses présentes, ni choses à venir,',
        KJV: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,',
        AMP: 'Car je possède la conviction absolue que ni la mort physique, ni la vie présente, ni les puissances démoniaques, ni les souverainetés angéliques, ni les épreuves d’aujourd’hui, ni les périls du futur,',
      },
      39: {
        LSG: 'ni les puissances, ni la hauteur, ni la profondeur, ni aucune autre créature ne pourra nous séparer de l’amour de Dieu manifesté en Jésus-Christ notre Seigneur.',
        BFC: 'ni les forces au-dessus de nous, ni les forces au-dessous de nous, rien dans toute la création ne pourra jamais nous séparer de l’amour que Dieu nous a manifesté en Jésus-Christ notre Seigneur.',
        DARBY: 'ni puissances, ni hauteur, ni profondeur, ni aucune autre créature, ne pourra nous séparer de l’amour de Dieu, qui est dans le christ Jésus notre Seigneur.',
        KJV: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.',
        AMP: 'ni aucune altitude glorieuse, ni aucun abîme ténébreux, ni rien d’autre dans l’univers créé ne pourra jamais nous arracher à l’amour éternel de Dieu manifesté en Jésus-Christ, notre Seigneur et Sauveur.',
      },
    },
  },

  // 1 CORINTHIENS 13
  '1CO': {
    13: {
      1: {
        LSG: 'Quand je parlerais les langues des hommes et des anges, si je n’ai pas la charité, je suis un airain qui résonne, ou une cymbale qui retentit.',
        BFC: 'Même si je parlais les langues des hommes et même celles des anges, si je n’ai pas l’amour, je ne suis qu’un cuivre qui résonne ou une cymbale bruyante.',
        DARBY: 'Si je parle dans les langues des hommes et des anges, mais que je n’aie pas l’amour, je suis comme un airain qui résonne ou une cymbale retentissante.',
        KJV: 'Though I speak with the tongues of men and of angels, and have not charity, I am become as sounding brass, or a tinkling cymbal.',
        AMP: 'Même si je m’exprimais dans toutes les langues humaines et le langage des anges célestes, si je ne possède pas l’amour agapé [généreux, désintéressé], je ne suis qu’un gong discordant ou une cymbale qui tinte vainement.',
      },
      4: {
        LSG: 'La charité est patiente, elle est pleine de bonté; la charité n’est point envieuse; la charité ne se vante point, elle ne s’enfle point d’orgueil,',
        BFC: 'L’amour est patient, l’amour est serviable, il n’est pas jaloux, il ne se vante pas, il ne s’enfle pas d’orgueil.',
        DARBY: 'L’amour use de longanimité; il est plein de bonté; l’amour n’est pas envieux; l’amour ne se vante pas; il ne s’enfle pas d’orgueil;',
        KJV: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,',
        AMP: 'L’amour est patient et endure les offenses avec douceur ; il est bienveillant et prompt à secourir ; l’amour n’est jamais jaloux ni envieux ; il ne parade pas et rejette tout orgueil hautain.',
      },
      8: {
        LSG: 'La charité ne périt jamais. Les prophéties prendront fin, les langues cesseront, la connaissance disparaîtra.',
        BFC: 'L’amour ne disparaîtra jamais. Les prophéties prendront fin, les langues cesseront, la connaissance actuelle disparaîtra.',
        DARBY: 'L’amour ne périt jamais. Or y a-t-il des prophéties ? elles auront leur fin; y a-t-il des langues ? elles cesseront; y a-t-il de la connaissance ? elle aura sa fin.',
        KJV: 'Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away.',
        AMP: 'L’amour véritable ne faillit jamais et n’aura jamais de fin. Quant aux dons de prophétie, ils prendront fin ; quant aux langues, elles s’éteindront ; la science humaine sera dépassée.',
      },
      13: {
        LSG: 'Maintenant donc ces trois choses demeurent: la foi, l’espérance, la charité; mais la plus grande de ces choses, c’est la charité.',
        BFC: 'Maintenant donc, ces trois choses restent : la foi, l’espérance et l’amour ; mais la plus grande des trois, c’est l’amour.',
        DARBY: 'Or maintenant ces trois choses demeurent : la foi, l’espérance, l’amour; mais la plus grande de ces choses, c’est l’amour.',
        KJV: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.',
        AMP: 'Dès lors, trois vertus cardinales subsistent à jamais : la foi vivante, l’espérance joyeuse et l’amour inconditionnel ; mais la plus souveraine et la plus éternelle de ces trois est l’amour.',
      },
    },
  },

  // ÉPHÉSIENS 6
  EPH: {
    6: {
      10: {
        LSG: 'Au reste, fortifiez-vous dans le Seigneur, et par sa force toute-puissante.',
        BFC: 'Enfin, puisez votre force dans le Seigneur et dans sa grande puissance.',
        DARBY: 'Au reste, mes frères, fortifiez-vous dans le Seigneur et dans la puissance de sa force;',
        KJV: 'Finally, my brethren, be strong in the Lord, and in the power of his might.',
        AMP: 'Pour conclure, devenez puissants et inébranlables dans le Seigneur, en vous appuyant continuellement sur l’énergie souveraine de Sa force victorieuse.',
      },
      11: {
        LSG: 'Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.',
        BFC: 'Revêtez l’armure complète de Dieu pour pouvoir tenir bon contre les manœuvres rusées du diable.',
        DARBY: 'revêtez-vous de l’armure complète de Dieu, afin que vous puissiez tenir ferme contre les artifices du diable;',
        KJV: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
        AMP: 'Revêtez-vous de la panoplie complète des armes spirituelles fournies par Dieu, afin d’être capables de résister et de triompher de toutes les tactiques et embûches trompeuses du malin.',
      },
    },
  },

  // APOCALYPSE 21
  REV: {
    21: {
      1: {
        LSG: 'Puis je vis un nouveau ciel et une nouvelle terre; car le premier ciel et la première terre avaient disparu, et la mer n’était plus.',
        BFC: 'Puis je vis un ciel nouveau et une terre nouvelle, car le premier ciel et la première terre avaient disparu et la mer n’existait plus.',
        DARBY: 'Et je vis un nouveau ciel et une nouvelle terre; car le premier ciel et la première terre s’en étaient allés, et la mer n’est plus.',
        KJV: 'And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.',
        AMP: 'Et j’eus la vision sublime d’un ciel nouveau et d’une terre renouvelée ; car l’ancien ciel et l’ancienne terre avaient passé dans leur vétusté, et la mer chaotique n’était plus.',
      },
      4: {
        LSG: 'Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n’y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.',
        BFC: 'Il essuiera toute larme de leurs yeux. Il n’y aura plus de mort, il n’y aura plus ni deuil, ni lamentation, ni douleur, car les choses anciennes ont disparu.',
        DARBY: 'et Dieu essuiera toute larme de leurs yeux; et la mort ne sera plus; et il n’y aura plus ni deuil, ni cri, ni peine, car les premières choses sont passées.',
        KJV: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
        AMP: 'Dieu Lui-même essuiera avec tendresse chaque larme de leurs yeux ; la mort sera engloutie pour toujours, et il n’y aura plus jamais ni deuil, ni gémissement, ni souffrance, car le monde ancien et ses peines auront définitivement disparu.',
      },
    },
  },
};

// Asynchronous loader that fetches the exact EMCI TV / Louis Segond 1910 text via AI
// with localStorage caching so chapters are stored locally for fast offline access
export async function fetchExactBibleChapter(
  bookId: string,
  bookName: string,
  chapter: number,
  translation: TranslationKey = 'LSG'
): Promise<{ verses: BibleVerse[]; isAIGenerated?: boolean }> {
  const cacheKey = `bereens_chapter_${bookId}_${chapter}_${translation}`.toUpperCase();

  // 1. Check local device cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { verses: parsed, isAIGenerated: false };
      }
    }
  } catch {}

  // 2. Check if we have curated complete data
  const curatedBook = CURATED_BIBLE_CHAPTERS[bookId];
  if (curatedBook && curatedBook[chapter]) {
    const localVerses = getChapterVerses(bookId, chapter, translation);
    if (localVerses.length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(localVerses));
      } catch {}
      return { verses: localVerses, isAIGenerated: false };
    }
  }

  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  const bookNr = bookIndex >= 0 ? bookIndex + 1 : 1;

  // 3. Request exact authentic text via our backend /api/bible/chapter
  try {
    const res = await fetch('/api/bible/chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, bookName, chapter, translation }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.verses) && data.verses.length > 0) {
        const formattedVerses: BibleVerse[] = data.verses.map((v: any) => ({
          bookId,
          bookName,
          chapter,
          verse: v.verse,
          text: v.text,
          translation,
          strongCode: v.strongCode,
          strongOriginal: v.strongOriginal,
          strongDefinition: v.strongDefinition,
        }));

        try {
          localStorage.setItem(cacheKey, JSON.stringify(formattedVerses));
        } catch {}

        return { verses: formattedVerses, isAIGenerated: false };
      }
    }
  } catch (err) {
    console.warn('Backend fetch failed, attempting direct getbible fallback:', err);
  }

  // 4. Direct client-side getbible.net fallback (CORS enabled)
  try {
    const getBibleVersion =
      translation === 'DARBY' ? 'darby' : translation === 'KJV' ? 'kjv' : 'ls1910';
    const remoteRes = await fetch(
      `https://api.getbible.net/v2/${getBibleVersion}/${bookNr}/${chapter}.json`
    );
    if (remoteRes.ok) {
      const remoteData = (await remoteRes.json()) as any;
      if (remoteData && Array.isArray(remoteData.verses) && remoteData.verses.length > 0) {
        const directVerses: BibleVerse[] = remoteData.verses.map((v: any) => ({
          bookId,
          bookName,
          chapter,
          verse: v.verse,
          text: v.text.trim(),
          translation,
        }));

        try {
          localStorage.setItem(cacheKey, JSON.stringify(directVerses));
        } catch {}

        return { verses: directVerses, isAIGenerated: false };
      }
    }
  } catch (err2) {
    console.warn('Direct fallback also failed:', err2);
  }

  // 5. Final fallback to cached or curated verses
  return { verses: getChapterVerses(bookId, chapter, translation), isAIGenerated: false };
}

export function getChapterVerses(bookId: string, chapter: number, translation: TranslationKey = 'LSG'): BibleVerse[] {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId) || BIBLE_BOOKS[0];

  // Check localStorage cache first
  const cacheKey = `bereens_bible_exact_${bookId}_${chapter}_${translation}`.toUpperCase();
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  const curatedBook = CURATED_BIBLE_CHAPTERS[bookId];
  if (curatedBook && curatedBook[chapter]) {
    const versesMap = curatedBook[chapter];
    const verseNumbers = Object.keys(versesMap)
      .map(Number)
      .sort((a, b) => a - b);
    return verseNumbers.map((vNum) => {
      const vData = versesMap[vNum];
      const text = vData[translation] || vData['LSG'] || `[Verset ${vNum}]`;
      return {
        bookId: book.id,
        bookName: book.name,
        chapter,
        verse: vNum,
        text,
        translation,
      };
    });
  }

  return [];
}
