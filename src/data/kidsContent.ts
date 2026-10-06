import { KidsStory } from '../types';

export const INITIAL_KIDS_STORIES: KidsStory[] = [
  {
    id: 'arche-noe-kids',
    title: 'La Grande Aventure de l’Arche de Noé',
    passage: 'Genèse 6 à 9',
    heroName: 'Noé le Juste',
    moral: 'Faire confiance à Dieu et Lui obéir même quand les autres se moquent.',
    coverImage: '/src/assets/images/kids_noahs_ark_1791221022432.jpg',
    scenes: [
      {
        dialogue: '« Toc, toc, toc ! Coup de marteau ! Noé construit un immense bateau en bois de gopher au beau milieu de la terre ferme ! »',
        caption: 'Dieu a demandé à Noé de préparer une grande arche pour sauver sa famille et tous les animaux de la création.',
        soundEffect: 'Bruits d’oiseaux et de marteau sur le bois',
      },
      {
        dialogue: '« Deux par deux ! Deux petits lapins tout doux, deux fiers lions qui rugissent, deux grandes girafes au long cou ! »',
        caption: 'Tous les animaux entrent paisiblement dans l’arche sans se faire de mal, sous la garde bienveillante de Dieu.',
        soundEffect: 'Rugissement joyeux et barrissement d’éléphant',
      },
      {
        dialogue: '« Plouf, plouf, les gouttes tombent ! Mais dans l’arche, toute la famille est bien au chaud et en sécurité ! »',
        caption: 'L’arche flotte doucement sur les flots pendant quarante jours et quarante nuits.',
        soundEffect: 'Bruit de pluie bienfaisante et clapotis des vagues',
      },
      {
        dialogue: '« Youpi ! Regardez dans le ciel : un magnifique arc-en-ciel rouge, orange, jaune, vert, bleu et violet ! »',
        caption: 'Dieu place Son arc dans les nuages comme un signe éternel de Son amour et de Sa promesse de paix.',
        soundEffect: 'Mélodie lumineuse et carillons joyeux',
      },
    ],
    quiz: [
      {
        question: 'Comment s’appelle le grand bateau que Noé a construit pour sauver les animaux ?',
        choices: ['Un sous-marin', 'L’Arche', 'Une pirogue', 'Un château'],
        correctIndex: 1,
        funFact: 'L’arche était aussi longue qu’un terrain et demi de football !',
      },
      {
        question: 'Quel oiseau est revenu avec une feuille d’olivier dans son bec ?',
        choices: ['L’aigle', 'Le perroquet', 'La colombe', 'Le pingouin'],
        correctIndex: 2,
        funFact: 'La colombe et la feuille d’olivier sont devenues le symbole universel de la paix !',
      },
      {
        question: 'Que met Dieu dans les nuages après la pluie pour nous rappeler Sa promesse ?',
        choices: ['Un cerf-volant', 'Un arc-en-ciel brillant', 'Un feu d’artifice', 'Un ballon doré'],
        correctIndex: 1,
        funFact: 'L’arc-en-ciel nous rappelle que Dieu tient toujours Ses promesses envers nous !',
      },
    ],
  },
  {
    id: 'david-lion-kids',
    title: 'David, le Petit Berger Courageux',
    passage: '1 Samuel 16 & 17',
    heroName: 'David & sa Harpe',
    moral: 'Peu importe si tu es petit : avec Dieu dans ton cœur, tu peux accomplir de grandes choses !',
    coverImage: '/src/assets/images/story_david_goliath_1791221000257.jpg',
    scenes: [
      {
        dialogue: '« Tralala ! David joue de la harpe sous les étoiles tout en surveillant ses petits moutons blancs. »',
        caption: 'Dans les collines de Bethléem, le jeune berger David chante des louanges joyeuses à Dieu.',
        soundEffect: 'Notes douces de harpe et bêlement des moutons',
      },
      {
        dialogue: '« Grrr ! Un gros lion s’approche pour voler un agneau ! Mais David crie : "Le Seigneur me protège !" et le lion s’enfuit ! »',
        caption: 'David apprend le courage en protégeant son troupeau avec l’aide de Dieu.',
        soundEffect: 'Rugissement et cri de victoire',
      },
      {
        dialogue: '« Devant le géant Goliath, David n’a pas peur : "Tu viens avec une épée, mais moi je viens au nom de l’Éternel des armées !" »',
        caption: 'Avec une simple fronde et une petite pierre lisse, David triomphe du géant qui terrifiait tout le pays.',
        soundEffect: 'Sifflement de la fronde dans l’air et acclamations du peuple',
      },
    ],
    quiz: [
      {
        question: 'Quel instrument de musique David aimait-il jouer dans les champs ?',
        choices: ['La batterie', 'La trompette', 'La harpe', 'La guitare électrique'],
        correctIndex: 2,
        funFact: 'David a composé de nombreux Psaumes magnifiques en jouant de la harpe !',
      },
      {
        question: 'Avec quoi David a-t-il vaincu le géant Goliath ?',
        choices: ['Un canon', 'Une fronde et une pierre', 'Une flèche magique', 'Un bouclier d’or'],
        correctIndex: 1,
        funFact: 'David a choisi 5 pierres lisses dans le ruisseau avant d’affronter Goliath !',
      },
    ],
  },
  {
    id: 'daniel-lions-kids',
    title: 'Daniel et les Lions dans la Fosse',
    passage: 'Daniel 6',
    heroName: 'Daniel l’Homme de Prière',
    moral: 'Ne cesse jamais de prier Dieu, même quand c’est difficile : Il envoie Ses anges pour te garder !',
    coverImage: '/src/assets/images/hero_bible_holylight_1791220988671.jpg',
    scenes: [
      {
        dialogue: '« Trois fois par jour, Daniel ouvre sa fenêtre vers Jérusalem et s’agenouille pour remercier son Dieu avec amour. »',
        caption: 'Malgré la jalousie des conseillers du roi Darius, Daniel reste fidèle et continue de prier chaque jour.',
        soundEffect: 'Murmure de prière et chant d’oiseaux à la fenêtre',
      },
      {
        dialogue: '« Oh non ! Les gardes emmènent Daniel et le descendent au fond d’une fosse sombre pleine de gros lions affamés ! »',
        caption: 'Le roi est très triste mais la loi le force à jeter Daniel aux lions.',
        soundEffect: 'Bruit de lourde pierre qui roule et grognements dans l’obscurité',
      },
      {
        dialogue: '« Chuuut... Un ange lumineux apparaît dans la fosse et ferme doucement la gueule des lions ! Les fauves ronronnent comme des chatons ! »',
        caption: 'Dieu a envoyé Son ange protecteur. Aucun lion n’a fait le moindre mal à Daniel pendant toute la nuit.',
        soundEffect: 'Lumière céleste scintillante et ronronnement paisible',
      },
      {
        dialogue: '« "Daniel ! Ton Dieu a-t-il pu te sauver ?" crie le roi au matin. "Oui Ô roi ! Mon Dieu a envoyé Son ange !" »',
        caption: 'Le roi Darius est émerveillé et publie un décret ordonnant à tout le royaume d’honorer le Dieu vivant de Daniel !',
        soundEffect: 'Cris de joie et fanfares royales',
      },
    ],
    quiz: [
      {
        question: 'Combien de fois par jour Daniel priait-il Dieu à sa fenêtre ?',
        choices: ['Une fois par an', 'Trois fois par jour', 'Dix fois par heure', 'Seulement le dimanche'],
        correctIndex: 1,
        funFact: 'Daniel priait matin, midi et soir avec un cœur reconnaissant !',
      },
      {
        question: 'Qui est venu dans la fosse pour fermer la gueule des lions ?',
        choices: ['Un ange envoyé par Dieu', 'Un dompteur de cirque', 'Un autre lion', 'Le roi lui-même'],
        correctIndex: 0,
        funFact: 'Les lions n’ont pas fait une seule égratignure à Daniel !',
      },
    ],
  },
  {
    id: 'jonas-poisson-kids',
    title: 'Jonas et le Grand Poisson Voyageur',
    passage: 'Livre de Jonas',
    heroName: 'Jonas le Prophète',
    moral: 'On ne peut pas se cacher de Dieu : Son amour et Sa miséricorde sont partout !',
    coverImage: '/src/assets/images/story_parting_red_sea_1791221011406.jpg',
    scenes: [
      {
        dialogue: '« Oups ! Dieu a dit à Jonas d’aller à Ninive, mais Jonas prend un bateau pour s’enfuir dans la direction opposée ! »',
        caption: 'Jonas monte sur un bateau vers Tarsis en pensant pouvoir échapper à l’appel du Seigneur.',
        soundEffect: 'Vent dans les voiles et cris des marins',
      },
      {
        dialogue: '« Une grande tempête se lève ! Houuuu ! Les vagues secouent le navire ! Jonas dit : "C’est à cause de moi, jetez-moi à l’eau !" »',
        caption: 'Dès que Jonas touche l’eau, la mer redevient calme comme un miroir.',
        soundEffect: 'Tonnerre, éclairs puis silence paisible de l’océan',
      },
      {
        dialogue: '« Gloup ! Un immense poisson envoyé par Dieu avale Jonas tout rond sans le blesser ! »',
        caption: 'Dans le ventre du poisson, Jonas prie de tout son cœur pendant trois jours et demande pardon.',
        soundEffect: 'Gros clapotis d’eau sous-marin et écho bienveillant',
      },
      {
        dialogue: '« Beurk... et hop ! Le poisson crache Jonas sain et sauf sur la plage de sable doré ! »',
        caption: 'Jonas court avec joie à Ninive annoncer le message de pardon de Dieu, et toute la ville est sauvée !',
        soundEffect: 'Vagues sur le rivage et rire joyeux',
      },
    ],
    quiz: [
      {
        question: 'Combien de jours Jonas est-il resté dans le ventre du grand poisson ?',
        choices: ['1 heure', '3 jours et 3 nuits', '40 jours', '1 an'],
        correctIndex: 1,
        funFact: 'Jésus a comparé Sa résurrection au signe de Jonas resté trois jours dans le poisson !',
      },
      {
        question: 'Vers quelle ville Jonas devait-il aller pour apporter le message de Dieu ?',
        choices: ['Rome', 'Ninive', 'Paris', 'Babylone'],
        correctIndex: 1,
        funFact: 'Tous les habitants de Ninive, des plus petits aux plus grands, ont écouté et changé de vie !',
      },
    ],
  },
  {
    id: 'noel-jesus-kids',
    title: 'La Belle Nuit de Noël : Jésus est Né !',
    passage: 'Luc 2',
    heroName: 'Bébé Jésus & les Bergers',
    moral: 'Jésus est le plus beau cadeau de Dieu pour le monde entier !',
    coverImage: '/src/assets/images/hero_bible_holylight_1791220988671.jpg',
    scenes: [
      {
        dialogue: '« Marie et Joseph arrivent à Bethléem, mais il n’y a plus aucune chambre libre dans les auberges ! »',
        caption: 'Un gentil aubergiste leur offre une petite étable chaude avec du foin frais.',
        soundEffect: 'Bruit de sabots d’âne et souffle doux d’un bœuf',
      },
      {
        dialogue: '« Dans le ciel de la nuit, une armée d’anges chante : "Gloire à Dieu au plus haut des cieux et paix sur la terre !" »',
        caption: 'Les bergers gardant leurs troupeaux sont éblouis par une grande lumière céleste.',
        soundEffect: 'Chœur d’anges magnifique et carillons de fête',
      },
      {
        dialogue: '« Regardez ce tout petit bébé emmailloté dans la mangeoire : c’est le Sauveur du monde, le Prince de la Paix ! »',
        caption: 'Les bergers et les rois mages s’agenouillent avec respect et offrent de précieux trésors.',
        soundEffect: 'Berceuse douce et murmures émerveillés',
      },
    ],
    quiz: [
      {
        question: 'Dans quelle petite ville de Judée Jésus est-il né ?',
        choices: ['Nazareth', 'Bethléem', 'Jérusalem', 'Capernaüm'],
        correctIndex: 1,
        funFact: 'Bethléem signifie "Maison du Pain" en hébreu, et Jésus est le Pain de Vie !',
      },
      {
        question: 'Où le petit bébé Jésus a-t-il été couché à sa naissance ?',
        choices: ['Dans un lit en or', 'Dans une mangeoire avec du foin', 'Sur un trône royal', 'Dans un hamac'],
        correctIndex: 1,
        funFact: 'Jésus est venu dans la simplicité pour être accessible à tous les enfants !',
      },
    ],
  },
  {
    id: 'jesus-tempete-kids',
    title: 'Jésus Calme la Grande Tempête',
    passage: 'Marc 4:35-41',
    heroName: 'Jésus le Maître du Vent et de la Mer',
    moral: 'Quand Jésus est dans ta barque, tu n’as rien à craindre : Sa paix surpasse toute peur !',
    coverImage: '/src/assets/images/story_parting_red_sea_1791221011406.jpg',
    scenes: [
      {
        dialogue: '« Le soleil se couche sur le lac de Galilée. Jésus et Ses amis montent dans une barque de pêcheur. »',
        caption: 'Fatigué d’avoir enseigné toute la journée, Jésus s’endort paisiblement sur un coussin à l’arrière de la barque.',
        soundEffect: 'Clapotis de l’eau et respiration calme',
      },
      {
        dialogue: '« Soudain, un vent violent souffle ! Vroooom ! Des vagues géantes remplissent le bateau d’eau ! »',
        caption: 'Les disciples paniquent et crient : "Maître, ne t’inquiètes-tu pas que nous périssions ?"',
        soundEffect: 'Rafales de vent hurlantes et fracas des vagues',
      },
      {
        dialogue: '« Jésus se lève doucement, tend Sa main vers le ciel et dit : "Silence ! Tais-toi !" »',
        caption: 'Aussitôt, le vent s’arrête net. Le lac devient aussi lisse qu’un miroir sous les étoiles.',
        soundEffect: 'Arrêt instantané de la tempête et brise légère apaisante',
      },
      {
        dialogue: '« "Pourquoi avez-vous peur ? Où est votre foi ?" demande Jésus avec un sourire aimant. »',
        caption: 'Les disciples sont saisis d’émerveillement : "Qui est donc cet homme, à qui même le vent et la mer obéissent ?"',
        soundEffect: 'Murmure d’admiration et chant de grillons sur la rive',
      },
    ],
    quiz: [
      {
        question: 'Que faisait Jésus au fond de la barque au début de la tempête ?',
        choices: ['Il pêchait des poissons', 'Il dormait sur un coussin', 'Il ramait vite', 'Il pleurait'],
        correctIndex: 1,
        funFact: 'Jésus dormait en toute confiance parce qu’Il reposait dans la paix de Son Père céleste !',
      },
      {
        question: 'Quels mots Jésus a-t-il dits pour calmer la mer et le vent ?',
        choices: ['"Abracadabra !"', '"Silence ! Tais-toi !"', '"Volez plus haut !"', '"Attention à vous !"'],
        correctIndex: 1,
        funFact: 'La Parole de Jésus a une autorité totale sur toute la création !',
      },
    ],
  },
  {
    id: 'moise-mer-rouge-kids',
    title: 'Moïse et le Grand Miracle de la Mer Rouge',
    passage: 'Exode 14',
    heroName: 'Moïse le Libérateur',
    moral: 'Quand il semble n’y avoir aucune issue, Dieu ouvre un chemin miraculeux !',
    coverImage: '/src/assets/images/story_parting_red_sea_1791221011406.jpg',
    ageRange: '5-9 ans',
    memoryVerse: '« L’Éternel combattra pour vous; et vous, gardez le silence. » - Exode 14:14',
    prayer: 'Seigneur Dieu, quand j’ai peur, montre-moi le chemin et aide-moi à avancer avec foi. Amen.',
    scenes: [
      {
        dialogue: '« Le peuple d’Israël marche dans le désert, guidé par une colonne de nuée le jour et une colonne de feu la nuit ! »',
        caption: 'Dieu conduit Son peuple hors d’Égypte vers la terre promise où coulent le lait et le miel.',
        soundEffect: 'Bruit de milliers de pas joyeux et vent chaud du désert',
      },
      {
        dialogue: '« Devant eux, les grandes vagues bleues de la mer Rouge ! Derrière eux, les chars de Pharaon qui galopent au grand trot ! »',
        caption: 'Le peuple commence à trembler de peur, mais Moïse dit avec foi : "Ne craignez rien, regardez la délivrance de l’Éternel !"',
        soundEffect: 'Fracas des vagues et hennissement des chevaux au loin',
      },
      {
        dialogue: '« Moïse tend son bâton de berger au-dessus de l’eau... WOOOSH ! Un vent puissant d’Orient sépare la mer en deux murs liquides géants ! »',
        caption: 'Au milieu de l’eau, un sentier de terre totalement sèche s’ouvre sous leurs pieds ébahis !',
        soundEffect: 'Souffle puissant d’un vent miraculeux et clapotis des murailles d’eau',
      },
      {
        dialogue: '« Tous les enfants et les parents traversent à pied sec ! De l’autre côté, Myriam prend son tambourin et tout le monde danse pour louer Dieu ! »',
        caption: 'Dieu a sauvé Son peuple avec puissance et amour !',
        soundEffect: 'Rythme de tambourins joyeux et cris d’allégresse',
      },
    ],
    quiz: [
      {
        question: 'Qu’est-ce qui séparait la mer Rouge en deux ?',
        choices: ['Une pelleteuse géante', 'Le vent envoyé par Dieu quand Moïse a tendu son bâton', 'Un pont en bois', 'Un sous-marin'],
        correctIndex: 1,
        funFact: 'Les eaux se dressaient comme deux murailles à droite et à gauche !',
      },
      {
        question: 'Quel instrument de musique Myriam a-t-elle pris pour chanter la victoire de Dieu ?',
        choices: ['Une trompette', 'Un tambourin', 'Un piano', 'Une flûte'],
        correctIndex: 1,
        funFact: 'C’est le tout premier chant de louange festif noté dans la Bible !',
      },
    ],
  },
  {
    id: 'joseph-manteau-kids',
    title: 'Joseph et son Magnifique Manteau Multicolore',
    passage: 'Genèse 37 à 45',
    heroName: 'Joseph le Rêveur Pardonateur',
    moral: 'Le pardon guérit les cœurs et Dieu transforme le mal en un bien immense.',
    coverImage: '/src/assets/images/hero_bible_holylight_1791220988671.jpg',
    ageRange: '6-10 ans',
    memoryVerse: '« Vous aviez médité de me faire du mal : Dieu l’a changé en bien. » - Genèse 50:20',
    prayer: 'Seigneur Jésus, donne-moi un cœur capable de pardonner à ceux qui me blessent, tout comme Joseph l’a fait. Amen.',
    scenes: [
      {
        dialogue: '« Jacob offre à son fils bien-aimé Joseph une tunique de toutes les couleurs : bleu, doré, rouge vif et vert émeraude ! »',
        caption: 'Joseph a de beaux rêves où des gerbes de blé et des étoiles scintillantes s’inclinent devant lui.',
        soundEffect: 'Bruissement d’un beau tissu soyeux et rire joyeux',
      },
      {
        dialogue: '« Ses frères sont jaloux et le vendent comme esclave en Égypte... Mais même en prison, Dieu est avec Joseph et lui donne la sagesse ! »',
        caption: 'Joseph interprète le rêve de Pharaon sur les 7 vaches grasses et les 7 vaches maigres et devient le gouverneur d’Égypte.',
        soundEffect: 'Sons de cloches royales égyptiennes et vent du Nil',
      },
      {
        dialogue: '« Quand ses frères affamés viennent chercher du grain, Joseph pleure d’émotion : "C’est moi, votre frère Joseph ! Ne vous tourmentez pas, Dieu m’a envoyé pour vous sauver la vie !" »',
        caption: 'Au lieu de se venger, Joseph serre ses frères dans ses bras et les embrasse avec des larmes de joie !',
        soundEffect: 'Sanglots de joie, embrassades et musique de paix',
      },
    ],
    quiz: [
      {
        question: 'Qu’est-ce que le père de Joseph lui a offert de si spécial ?',
        choices: ['Une paire de baskets', 'Une tunique de plusieurs couleurs', 'Un cheval ailé', 'Un trésor en argent'],
        correctIndex: 1,
        funFact: 'Cette tunique montrait l’amour immense de son père pour lui !',
      },
      {
        question: 'Comment Joseph a-t-il réagi quand il a revu ses frères en Égypte ?',
        choices: ['Il s’est mis en colère', 'Il les a pardonnés et embrassés avec amour', 'Il les a chassés', 'Il a fui'],
        correctIndex: 1,
        funFact: 'Joseph a nourri toute sa famille pendant les années de famine !',
      },
    ],
  },
  {
    id: 'brebis-perdue-kids',
    title: 'La Parabole de la Petite Brebis Retrouvée',
    passage: 'Luc 15:3-7',
    heroName: 'Le Bon Berger Aimant',
    moral: 'Tu as un prix infini aux yeux de Dieu : même si tu t’égares, Il vient te chercher avec tendresse !',
    coverImage: '/src/assets/images/kids_noahs_ark_1791221022432.jpg',
    ageRange: '3-7 ans',
    memoryVerse: '« Le Fils de l’homme est venu chercher et sauver ce qui était perdu. » - Luc 19:10',
    prayer: 'Mon Bon Berger Jésus, merci de veiller sur moi chaque jour et de me porter quand je suis fatigué. Amen.',
    scenes: [
      {
        dialogue: '« 97, 98, 99... Oh non ! Où est passée la petite Frisette, la centième brebis blanche ? »',
        caption: 'Le berger compte son troupeau au crépuscule et s’aperçoit qu’une seule petite brebis s’est égarée dans les buissons.',
        soundEffect: 'Bêlements doux et tintement de clochettes',
      },
      {
        dialogue: '« Le berger laisse les 99 autres en sécurité dans l’enclos et s’enfonce dans la nuit noire en appelant : "Frisette ! Frisette !" »',
        caption: 'Il ne renonce pas, il brave les épines et les collines escarpées pour la retrouver.',
        soundEffect: 'Craquement de branches sous les pas et vent nocturne',
      },
      {
        dialogue: '« "Bêêê !" La petite brebis tremble au bord d’un fossé. Le berger la prend doucement dans ses bras et la pose sur ses épaules avec joie ! »',
        caption: 'Il invite tous ses voisins et dit : "Réjouissez-vous avec moi, car j’ai retrouvé ma brebis qui était perdue !"',
        soundEffect: 'Rires d’enfants, fête joyeuse et applaudissements',
      },
    ],
    quiz: [
      {
        question: 'Combien de brebis le berger avait-il en tout dans son troupeau ?',
        choices: ['10', '50', '100', '1 000'],
        correctIndex: 2,
        funFact: 'Chaque brebis est unique et le berger connaît chacune par son prénom !',
      },
      {
        question: 'Où le berger pose-t-il la brebis retrouvée pour la ramener à la maison ?',
        choices: ['Dans un carton', 'Sur ses épaules', 'Dans un chariot', 'Sur le toit'],
        correctIndex: 1,
        funFact: 'Poser la brebis sur ses épaules permet de la réchauffer et de la soulager de sa fatigue !',
      },
    ],
  },
  {
    id: 'multiplication-pains-kids',
    title: 'Le Pique-Nique Miraculeux : 5 Pains et 2 Poissons',
    passage: 'Jean 6:1-14',
    heroName: 'Le Petit Garçon Généreux & Jésus',
    moral: 'Donne le peu que tu as à Jésus, et Il le multipliera pour bénir une multitude !',
    coverImage: '/src/assets/images/hero_bible_holylight_1791220988671.jpg',
    ageRange: '4-8 ans',
    memoryVerse: '« Dieu aime celui qui donne avec joie. » - 2 Corinthiens 9:7',
    prayer: 'Jésus, bénis mes mains et mon cœur pour que j’apprenne à partager avec ceux qui en ont besoin. Amen.',
    scenes: [
      {
        dialogue: '« Plus de 5 000 personnes écoutent Jésus sur la colline fleurie jusqu’au soir. Leurs estomacs commencent à gargouiller : "Glllou glou !" »',
        caption: 'Les disciples s’inquiètent : où trouver assez de nourriture pour tant de monde dans cet endroit désert ?',
        soundEffect: 'Bourdonnement d’une grande foule et vent frais sur l’herbe verte',
      },
      {
        dialogue: '« André s’approche : "Il y a ici un jeune garçon qui a cinq petits pains d’orge et deux petits poissons séchés... mais qu’est-ce que cela pour tant de gens ?" »',
        caption: 'Le petit garçon offre de bon cœur tout son goûter à Jésus sans rien garder pour lui.',
        soundEffect: 'Bruissement d’un petit panier en osier et sourire complice',
      },
      {
        dialogue: '« Jésus prend les pains, lève les yeux vers le ciel, remercie Dieu et les rompt... Miracle ! Plus les disciples distribuent, plus il y en a ! »',
        caption: 'Tout le monde mange à satiété et on ramasse 12 pleins paniers de morceaux qui restent !',
        soundEffect: 'Exclamations de surprise réjouie et murmures d’étonnement',
      },
    ],
    quiz: [
      {
        question: 'Que contenait le panier du petit garçon généreux ?',
        choices: ['3 gâteaux au chocolat', '5 pains d’orge et 2 poissons', '10 pommes rouges', 'Un poulet rôti'],
        correctIndex: 1,
        funFact: 'L’orge était le pain simple des familles modestes de l’époque !',
      },
      {
        question: 'Combien de paniers pleins de restes les disciples ont-ils ramassés à la fin ?',
        choices: ['0 panier', '1 panier', '12 paniers', '100 paniers'],
        correctIndex: 2,
        funFact: 'Il y avait 12 paniers, exactement un pour chacun des douze disciples !',
      },
    ],
  },
  {
    id: 'zachee-sycomore-kids',
    title: 'Zachée, le Petit Homme Perché sur l’Arbre',
    passage: 'Luc 19:1-10',
    heroName: 'Zachée Transformé par l’Amour de Jésus',
    moral: 'Jésus te voit là où tu es et Son amour transforme toute ta vie !',
    coverImage: '/src/assets/images/story_david_goliath_1791221000257.jpg',
    ageRange: '4-9 ans',
    memoryVerse: '« Aujourd’hui le salut est entré dans cette maison. » - Luc 19:9',
    prayer: 'Seigneur Jésus, entre dans mon cœur comme Tu es entré chez Zachée, et remplis ma maison de Ta paix. Amen.',
    scenes: [
      {
        dialogue: '« Jésus traverse la ville de Jéricho ! Une foule immense se presse sur les trottoirs, mais Zachée est trop petit pour voir quoi que ce soit ! »',
        caption: 'Zachée est le chef des collecteurs d’impôts. Les gens ne l’aiment pas beaucoup car il a pris trop d’argent.',
        soundEffect: 'Brouhaha de la foule et bruits de sandales sur les pavés',
      },
      {
        dialogue: '« Hop là ! Zachée retrousse sa belle tunique et grimpe agilement sur les branches feuillues d’un grand arbre sycomore ! »',
        caption: 'De là-haut, il a une vue parfaite sur la rue. Personne ne l’a remarqué... sauf une personne !',
        soundEffect: 'Craquement des branches d’arbre et feuilles agitées',
      },
      {
        dialogue: '« Jésus s’arrête juste sous l’arbre, lève les yeux avec un sourire lumineux : "Zachée, descends vite, car il faut que je loge aujourd’hui dans ta maison !" »',
        caption: 'Zachée descend avec joie ! Touché par tant de bonté, il donne la moitié de ses biens aux pauvres et répare toutes ses erreurs.',
        soundEffect: 'Rires d’allégresse et applaudissements chaleureux',
      },
    ],
    quiz: [
      {
        question: 'Sur quel arbre Zachée est-il grimpé pour voir passer Jésus ?',
        choices: ['Un chêne', 'Un pommier', 'Un sycomore', 'Un baobab'],
        correctIndex: 2,
        funFact: 'Le sycomore a des branches basses très faciles à escalader pour un enfant ou un petit homme !',
      },
      {
        question: 'Que dit Zachée qu’il va faire après avoir reçu Jésus chez lui ?',
        choices: ['Acheter un château', 'Donner la moitié de ses biens aux pauvres', 'Quitter la ville', 'Garder tout son or'],
        correctIndex: 1,
        funFact: 'La rencontre avec Jésus a complètement changé le cœur de Zachée en un cœur généreux !',
      },
    ],
  },
];
