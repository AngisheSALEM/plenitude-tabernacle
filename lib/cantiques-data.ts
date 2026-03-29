export interface Cantique {
  id: number
  title: string
  reference: string
  lyrics: string[]
  chorus?: string[]
  category: string
}

export const cantiques: Cantique[] = [
  {
    id: 1,
    title: "CROIS SEULEMENT",
    reference: "Crois seulement 1",
    category: "Foi",
    lyrics: [
      "Crains point, petit troupeau, de la croix au trone,\nDe la mort a la vie, Il cherchait les Siens;\nTout pouvoir sur terre, tout pouvoir au Ciel,\nLui est donne pour Son troupeau bien-aime.",
      "Crains point, petit troupeau, Il t'a precede,\nTon Berger a choisi le sentier a suivre;\nPour toi, Il rendra pure l'eau de Mara,\nIl but toute l'amertume a Gethsemane.",
      "Crains point, petit troupeau, peu importe ton sort,\nIl entre dans les chambres aux «portes fermees»;\nIl n'abandonne point, Il n'est point absent,\nAinsi, compte sur Sa presence le jour, la nuit."
    ],
    chorus: [
      "Crois seulement, crois seulement,\nTout est possible, crois seulement;\nCrois seulement, crois seulement,\nTout est possible, crois seulement."
    ]
  },
  {
    id: 2,
    title: "GRACE ETONNANTE",
    reference: "Crois seulement 2",
    category: "Grace",
    lyrics: [
      "Grace etonnante! quel doux son,\nMe sauva malheureux\nJ'etais perdu, je suis retrouve,\nAveugle, maintenant je vois.",
      "Cette grace m'a enseigne la crainte,\nEt elle ota mes frayeurs;\nCombien precieuse parut cette grace\nAu moment ou j'ai cru !",
      "A travers les dangers et pieges,\nPar ou je suis passe;\nCette grace qui m'a garde aussi loin\nElle m'a conduit au ciel.",
      "Le Seigneur m'a promis du bien,\nSa Parole me soutient,\nIl sera mon Abri, ma Part\nTant que j'aurai la vie.",
      "Apres dix mille ans passes la,\nBrillants comme le soleil,\nNous aurons plus de temps qu'avant\nPour louer notre Dieu.",
      "Quand tombera cette robe de chair,\nMa vie mortelle cessera;\nJe possederai dans l'au-dela\nUne vie de joie et paix."
    ]
  },
  {
    id: 3,
    title: "MOMENT DE PRIERE",
    reference: "Crois seulement 5",
    category: "Priere",
    lyrics: [
      "Moment de priere, moment de priere\nQui m'appelle d'un monde de soucis\nEt m'invite au trone de mon Pere\nPour faire connaitre mes desirs;\nEn temps de peines et de chagrins,\nMon ame est souvent consolee,\nEchappe aux pieges du tentateur,\nPar ton retour, moment de priere.",
      "Moment de priere, moment de priere\nQuelle joie! quel bonheur je partage\nAvec ceux-la dont les coeurs brulent\nD'ardents desirs pour ton retour!\nAvec eux je m'empresse la\nOu mon Sauveur revele Sa face,\nEt joyeusement je me tiens la\nEt je t'attends, moment de priere.",
      "Moment de priere, moment de priere\nTes ailes porteront ma requete\nVers Celui dont la fidelite\nTient a benir l'ame qui attend;\nIl m'invite a chercher Sa face,\nCroire Sa Parole, croire en Sa grace;\nSur Lui je mets tous mes soucis,\nEt je t'attends, moment de priere."
    ]
  },
  {
    id: 4,
    title: "OH! JE DESIRE LE VOIR!",
    reference: "Crois seulement 8",
    category: "Adoration",
    lyrics: [
      "Voyageant dans le pays, je chante en marchant,\nGuidant les ames au Calvaire, au flot cramoisi;\nMon ame percee par les fleches, dedans et dehors,\nMon Seigneur me conduit, par Lui je vaincrai.",
      "Au service de mon Seigneur, meme dans la nuit sombre,\nJe m'accrocherai a Lui, Il va m'eclairer;\nEt les pieges de Satan peuvent troubler mon ame\nMon Seigneur est devant, dirigeant le tout.",
      "Quand du fond de la vallee, Je vois mon Sauveur\nDebout sur la haute montagne, dirigeant la guerre,\nPar Sa tendre main tendue vers la basse vallee,\nIl me guide, je peux voir, marchant en avant.",
      "Quand devant moi les flots montent du fond de l'abime,\nMon Seigneur dirige ma barque, Il prend soin de moi,\nIl me conduit tendrement a travers ce monde,\nIl est mon vrai Ami, oh! je L'aime tant."
    ],
    chorus: [
      "Je desire Le voir, contempler Sa face!\nEt chanter pour toujours Sa grace qui sauve;\nDans les rues de gloire, elever ma voix;\nLes soucis sont passes, joie sans fin au Ciel!"
    ]
  },
  {
    id: 5,
    title: "NOUS NOUS SENTONS SI BIEN",
    reference: "Crois seulement 9",
    category: "Louange",
    lyrics: [
      "Nous nous sentons si bien en parlant du bon vieux Chemin,\nNous nous sentons si bien en parlant du Seigneur;\nContinuons, continuons a parler du bon vieux Chemin.\nContinuons, continuons a parler du Seigneur.",
      "Le diable n'aime pas cela : parler de ce bon vieux Chemin,\nLe diable n'aime pas cela : parler du Seigneur;\n(Ainsi) continuons, continuons a parler du bon vieux Chemin,\nContinuons, continuons a parler du Seigneur"
    ]
  },
  {
    id: 6,
    title: "NOUS MARCHONS VERS SION",
    reference: "Crois seulement 15",
    category: "Marche",
    lyrics: [
      "Laissons voir notre joie,\nNous qui aimons le Seigneur,\nJoignons au chant un doux accord,\nJoignons au chant un doux accord,\nEt environnons le trone,\nEt environnons le trone.",
      "Qu'ils refusent de chanter\nCeux qui ne connaissent pas Dieu\nMais tous les enfants du Roi celeste,\nMais tous les enfants du Roi celeste,\nProclameront leur joie,\nProclameront leur joie.",
      "La colline de Sion\nProduit des delices sacrees\nAvant que nous atteignions le Ciel,\nAvant que nous atteignions le Ciel,\nOu marchions sur les rues d'or,\nOu marchions sur les rues d'or.",
      "Puissent nos chants abonder,\nEt chaque larme etre sechee;\nNous marchons sur le sol d'Emmanuel,\nNous marchons sur le sol d'Emmanuel,\nVers les beaux pays d'En-haut,\nVers les beaux pays d'En-haut"
    ],
    chorus: [
      "Nous marchons vers Sion,\nMerveilleuse, merveilleuse Sion;\nNous montons tout droit vers Sion,\nLa merveilleuse Cite de Dieu."
    ]
  },
  {
    id: 7,
    title: "EN AVANT SOLDATS CHRETIENS !",
    reference: "Crois seulement 18",
    category: "Combat spirituel",
    lyrics: [
      "En avant soldats chretiens!\nMarchant au combat,\nAvec la croix de Jesus,\nAllant de l'avant;\nChrist, le Royal Maitre,\nMene contre l'ennemi;\nTout droit dans la bataille,\nRegardez Ses bannieres.",
      "Comme une puissante armee\nS'avance l'Eglise,\nFreres, nous sommes en marche\nSur les traces des Saints;\nNous ne sommes pas divises,\nNous sommes un seul corps,\nUn dans l'esperance, la doctrine\nEt la charite.",
      "Couronnes et trones peuvent perir\nEt royaumes tomber;\nMais l'Eglise de Jesus\nRestera constante\nLes portes de l'enfer ne peuvent\nPrevaloir contre Elle;\nNous avons la promesse\nInfaillible de Christ.",
      "Au signal de triomphe,\nSatan s'enfuira;\nAlors soldats chretiens,\nA nous la victoire!\nLes fondements de l'enfer\nS'ebranlent aux louanges;\nFreres, elevez vos voix et\nQue vos hymnes montent!",
      "En avant, vous les peuples,\nJoignez l'heureuse foule;\nMelez vos voix aux notres,\nEn chants de victoire;\n« Gloire, honneur et louange\nSoient a Christ le Roi, »\nChantent les hommes et les anges\nDans les ages eternels."
    ],
    chorus: [
      "En avant, soldats chretiens!\nMarchant au combat\nAvec la croix de Jesus,\nAllant de l'avant."
    ]
  },
  {
    id: 8,
    title: "PARLONS DE JESUS",
    reference: "Crois seulement 19",
    category: "Louange",
    lyrics: [
      "Parlons de Jesus,\nIl est le Roi des rois,\nLe Seigneur des seigneurs,\nDurant l'eternite;\nLe Grand JE SUIS, la Voie,\nLa Vie, la Verite,\nParlons de Jesus de plus en plus.",
      "Parlons de Jesus,\nQue tout le monde proclame\nPuissance et majeste\nD'un tel merveilleux Nom.\nBebe de Bethlehem,\nL'Etoile du matin,\nChantons donc Ses louanges partout.",
      "Parlons de Jesus,\nIl est le Pain de Vie,\nC'est le Sauveur du monde,\nL'Homme de Galilee.\nProphete, Pretre, Roi,\nIl est le Dieu-Puissant,\nLa Source de l'Eau de Vie gratuite.",
      "Parlons de Jesus,\nC'est le Prince de la Paix,\nIl est le Grand Medecin,\nA travers toute l'histoire.\nIl est le Lys pur, blanc,\n« La belle Rose de Sharon,\nIl est le Berger aux soins tendres.",
      "Parlons de Jesus,\nC'est le Rocher des Ages,\nAgneau, Homme du Calvaire,\nMort pour tous les pecheurs,\nLe Grand Emmanuel,\nParole de Dieu sublime,\nEt Il est notre Epoux si divin."
    ]
  },
  {
    id: 9,
    title: "J'ABANDONNE",
    reference: "Crois seulement 25",
    category: "Consecration",
    lyrics: [
      "Tout a Jesus j'abandonne,\nFais-moi, Sauveur, tout a Toi;\nLaisse-moi sentir le Saint-Esprit,\nSavoir que Tu es a moi.",
      "Tout a Jesus j'abandonne\nJe me prosterne a Ses pieds\nLes plaisirs du monde oublies,\nJesus prends-moi, maintenant",
      "Tout a Jesus j'abandonne\nFais-moi Sauveur tout a Toi\nLaisse-moi sentir le Saint-Esprit\nSavoir que Tu es a moi",
      "Tout a Jesus j'abandonne,\nSeigneur, je me donne a Toi;\nEnvoie-moi Ta benediction.\nRemplis-moi de Ta puissance,",
      "Tout a Jesus j'abandonne,\nEt je sens le feu sacre;\nOh! la joie du salut parfait!\nGloire, gloire a Son Nom!"
    ],
    chorus: [
      "J'abandonne tout\nJ'abandonne\nTout a Toi, mon sauveur beni\nJ'abandonne tout"
    ]
  },
  {
    id: 10,
    title: "PLUS TARD",
    reference: "Crois seulement 27",
    category: "Esperance",
    lyrics: [
      "Tentes, eprouves, nous nous demandons\nPourquoi c'est ainsi le long du jour,\nPendant qu'il y en a d'autres autour de nous,\nQuoique dans le mal, sont impunis.",
      "Quand la mort vient et prend nos bien-aimes,\nLaissant notre maison solitaire;\nAlors nous nous demandons bien pourquoi\nLes mechants prosperent jour apres jour.",
      "Fideles jusqu'a la mort, dit le Maitre,\nNotre labeur est bientot finie;\nLes peines du chemin seront oubliees\nQuand nous franchirons la belle porte.",
      "Nous voyons Jesus venir dans la gloire,\nComme Il vient de Sa maison celeste,\nEt nous le rencontrons dans ce palais,\nNous comprendrons ca dans peu de temps."
    ],
    chorus: [
      "Plus tard nous saurons ce qu'il en est,\nPlus tard nous comprendrons le pourquoi,\nCourage, mon frere, vis dans la lumiere,\nNous comprendrons tout dans peu de temps"
    ]
  },
  {
    id: 11,
    title: "REMPLIS-MOI D'AMOUR",
    reference: "Crois seulement 28",
    category: "Priere",
    lyrics: [
      "Laisse-moi marcher, Seigneur, par ou Tu es passe,\nChemin conduisant vers le ciel,\nPartout donnant la joie, aux gens abandonnes,\nRemplis-moi chaque jour d'Amour.",
      "Garde-moi a cote de mon Sauveur et Guide,\nNe me laisse pas dans les tenebres,\nGarde-moi du courroux et satisfais mon ame,\nRemplis-moi chaque jour d'Amour.",
      "Bientot finie la course, la fin de mon voyage,\nJ'habiterai au Ciel chez moi;\nQue je chante, Roi beni, sur la route vers la rive\nVers la rive, Remplis-moi chaque Jour d'Amour."
    ],
    chorus: [
      "Remplis-moi chaque jour d'Amour,\nComme je marche avec la colombe;\nLaisse-moi marcher toujours, avec chant et sourire,\nRemplis-moi chaque jour d'Amour."
    ]
  },
  {
    id: 12,
    title: "LIEUX PLUS HAUTS",
    reference: "Crois seulement 30",
    category: "Aspiration",
    lyrics: [
      "Je me presse sur la route du Ciel,\nNouvelles hauteurs, chaque jour je gagne;\nSur mon chemin, je prie toujours:\n«Place-moi, Seigneur, aux lieux plus hauts».",
      "Mon coeur ne desire point rester\nOu doutes s'elevent et peurs abattent;\nQue certains restent ou ils abondent,\nJe prie, visant les lieux plus hauts.",
      "Je veux atteindre le sommet,\nEt voir luire la gloire eclatante;\nAvant de voir le Ciel je prie :\n«Seigneur, mene-moi aux lieux plus hauts»."
    ],
    chorus: [
      "Leve-moi, Seigneur, que je me tienne,\nPar la foi, sur le plateau du Ciel,\nLa plus haute plaine jamais trouvee;\nPlace-moi, Seigneur, aux lieux plus Hauts"
    ]
  },
  {
    id: 13,
    title: "DEBOUT SUR LES PROMESSES",
    reference: "Crois seulement 31",
    category: "Foi",
    lyrics: [
      "Debout sur les promesses de Christ, mon Roi,\nQue Ses louanges resonnent dans l'eternite;\nGloire dans les Lieux tres-hauts je chanterai,\nDebout sur les promesses de Dieu.",
      "Debout sur les promesses infaillibles,\nQuand les tempetes de doutes et de peurs assaillent,\nPar la Parole vivante de Dieu je vaincrai.\nDebout sur les promesses de Dieu.",
      "Debout sur les promesses, maintenant je vois,\nDans le sang, la purification pour moi;\nDebout dans la liberte qui vient de Christ,\nDebout sur les promesses de Dieu.",
      "Debout sur les promesses de Christ,\nSeigneur, Attache a Lui par la corde d'amour,\nToujours victorieux par l'epee de l'Esprit,\nDebout sur les promesses de Dieu",
      "Debout sur les promesses, je ne peux tomber,\nToujours ecoutant la voix du Saint-Esprit;\nReposant en mon Sauveur, mon Tout en tout,\nDebout sur les promesses de Dieu."
    ],
    chorus: [
      "Debout, debout,\nDebout sur les promesses de Dieu,\nmon Sauveur; Debout, debout,\nJe me tiens sur les promesses de Dieu."
    ]
  },
  {
    id: 14,
    title: "ROCHER D'AGES",
    reference: "Crois seulement 33",
    category: "Refuge",
    lyrics: [
      "Rocher d'ages, fendu pour moi,\nLaisse-moi me cacher en Toi;\nLaisse l'eau avec le sang,\nSortis de Ton flanc perce,\nEtre un double remede,\nMe sauver me rendre pur.",
      "Que mes larmes coulent a jamais,\nQue mon zele ne s'eteigne point,\nCela n'ote pas mon peche;\nC'est Toi seul qui dois sauver;\nEt ma main ne t'offre rien,\nJe ne m'attache qu'a Ta croix.",
      "Alors que j'aspire ce souffle,\nQuand mes yeux se fermeront,\nEt quand je me leverai,\nJe Te verrai sur Ton trone,\nRocher d'ages, fendu pour moi.\nLaisse-moi me cacher en Toi."
    ]
  },
  {
    id: 15,
    title: "QUAND JE VERRAI LE SANG",
    reference: "Crois seulement 34",
    category: "Redemption",
    lyrics: [
      "Christ, Redempteur, est mort sur la croix,\nPour le pecheur, paya toute sa dette;\nAspergez l'ame du sang de l'Agneau,\nEt je passerai par dessus vous.",
      "Pire des pecheurs Jesus sauvera,\nIl fera tout ce qu'il a promis;\nLavez-vous dans la fontaine ouverte,\nEt je passerai par-dessus vous.",
      "Le jugement vient et tous seront la,\nChacun recevra juste son du;\nCachez-vous dans le sang qui rend pur,\nEt je passerai par dessus vous.",
      "Grande compassion! Amour sans mesure!\nAmour bienveillant, fidele, sincere!\nTrouvez paix et abri sous le sang,\nEt je passerai par dessus vous."
    ],
    chorus: [
      "Quand je verrai le sang,\nQuand je verrai le sang,\nQuand je verrai le sang,\nEt je passerai par dessus vous."
    ]
  },
  {
    id: 16,
    title: "PLUIES DE BENEDICTION",
    reference: "Crois seulement 36",
    category: "Benediction",
    lyrics: [
      "'Y aura pluies de benediction,\nC'est la promesse d'amour;\nLe Sauveur nous enverra du Ciel\nLe temps de rafraichissement.",
      "'Y aura pluies de benediction\nPrecieuses et vivifiantes;\nSur les collines, dans les vallees,\nLe bruit d'une pluie abondante.",
      "'Y aura pluies de benediction,\nSeigneur, envoie-nous ces pluies,\nAccorde-nous un rafraichissement,\nViens honorer Ta Parole.",
      "'Y aura pluies de benediction,\nPuissent-elles tomber aujourd'hui,\nComme a Dieu nous nous confessons,\nEt nous invoquons Jesus !"
    ],
    chorus: [
      "Pluies de benediction,\nOui, nous desirons ces pluies;\nLes gouttes de grace tombent autour de nous,\nMais nous reclamons les pluies."
    ]
  },
  {
    id: 17,
    title: "COMME TU VEUX",
    reference: "Crois seulement 37",
    category: "Soumission",
    lyrics: [
      "Comme Tu veux, Seigneur!\nComme Tu le veux!\nTu es le Potier,\nJe suis l'argile.\nTaille-moi, faconne-moi,\nSelon Ton gre,\nPendant que j'attends,\nCalme et soumis.",
      "Comme Tu veux, Seigneur!\nComme Tu le veux!\nEprouve-moi, sonde-moi,\nMaitre, aujourd'hui!\nRends-moi maintenant\nPlus blanc que neige,\nComme je me prosterne\nDans Ta presence.",
      "Comme Tu veux, Seigneur!\nComme Tu le veux!\nBlesse, fatigue, Aide-moi, je prie!\nPuissance, toute puissance,\nSurement est Tienne!\nTouche et gueris-moi,\nSauveur divin!",
      "Comme Tu veux, Seigneur!\nComme Tu le veux!\nTiens tout mon etre\nSous Ta puissance.\nRemplis-moi d'Esprit\nAu point qu'on ne voie\nQue Christ seul,\nvivant toujours en moi."
    ]
  },
  {
    id: 18,
    title: "JE SUIS MARQUE",
    reference: "Crois seulement 39",
    category: "Temoignage",
    lyrics: [
      "J'ai perdu mon renom depuis que j'ai cesse de pecher,\nTant d'amis m'ont quitte depuis que j'ai recu mon Sauveur;\nJadis souriants, maintenant ils me passent comme un inconnu;\nDisant que je suis vraiment un insense, un demode.",
      "Ils disent que ma vie est ruinee, que mon talent est gache,\nIls ne comprennent pas cela, car j'avais des plans la-dessus;\nJe sais ce que j'ai laisse quand j'ai promis d'aller jusqu'au bout;\nEt j'ai eu beaucoup plus de gloire depuis que Dieu m'a change."
    ],
    chorus: [
      "Je suis marque, marque, marque;\nJe suis marque, maintenant ou que j'aille;\nJe suis marque, marque, marque\nEt ce que je suis, tous semblent savoir.\nJe suis scelle, scelle, scelle,\nJe suis scelle par l'Esprit Divin;\nOh! Gloire a Dieu! Alleluia! Amen!\nJe suis Sien et je sais qu'il est mien."
    ]
  },
  {
    id: 19,
    title: "SUR LES AILES D'UNE COLOMBE",
    reference: "Crois seulement 41",
    category: "Saint-Esprit",
    lyrics: [
      "Noe avait navigue,\nSur les eaux plusieurs jours,\nIl chercha la terre ferme,\nDe plusieurs manieres;\nDes ennuis, il en a eu\nMais non pas du Ciel,\nDieu lui donna Son signe\nSur les ailes d'une colombe.",
      "Jesus-Christ, notre Sauveur\nVint un jour sur la terre;\nNe dans une etable,\nDans une creche de paille;\nIci-bas rejete, Mais non pas du Ciel,\nDieu nous donna Son signe\nSur les ailes d'une colombe.",
      "Bien qu'ayant beaucoup souffert\nDe bien des manieres,\nJ'ai crie pour la guerison\nLa nuit comme le jour;\nLa foi ne fut pas oubliee\nPar le Pere du Ciel,\nIl me donna Son Signe\nSur les ailes d'une colombe."
    ],
    chorus: [
      "Sur les ailes d'une colombe\nblanche comme neige,\nDieu envoya Son amour doux, pur,\nUn signe du Ciel,\nSur les ailes d'une colombe."
    ]
  },
  {
    id: 20,
    title: "J'AI ENVIE D'Y ALLER",
    reference: "Crois seulement 42",
    category: "Ciel",
    lyrics: [
      "Ma demeure celeste est splendide,\nJ'ai envie d'y aller;\nNi mort, ni peines n'y entreront,\nJ'ai envie d'y aller.",
      "Et ses tours brillent plus que le soleil,\nJ'ai envie d'y aller;\nCe palais celeste sera mien,\nJ'ai envie d'y aller.",
      "D'autres cherchent une maison ici-bas,\nJ'ai envie d'y aller;\nQue des flammes devorent,\nles vagues inondent,\nJ'ai envie d'y aller.",
      "Le Seigneur a ete bon pour moi,\nJ'ai envie d'y aller;\nAvant de voir cette maison benie,\nJ'ai envie d'y aller."
    ],
    chorus: [
      "Oui, j'ai envie d'y aller,\nJ'ai envie d'y aller;\nMa demeure celeste est splendide,\nJ'ai envie d'y aller."
    ]
  },
  {
    id: 21,
    title: "VIENS SOUPER",
    reference: "Crois seulement 43",
    category: "Communion",
    lyrics: [
      "Jesus a une table ou les saints de Dieu sont nourris,\nIl invite Son peuple elu; «Viens souper»;\nIl nourrit avec Sa manne, pourvoit a tous nos besoins;\nC'est bon de souper avec Lui tout le temps!",
      "Les disciples etaient venus, en obeissant ainsi a Christ,\nCar le Maitre les appela : «Viens souper»;\nLa, ils trouverent leur desir : pain et poisson sur le feu;\nIl satisfait les affames tout le temps.",
      "Et l'Agneau prend son Epouse pour toujours a Ses cotes,\nEt tous les hotes du Ciel sont assembles;\nOh quelle glorieuse belle vue, tous les saints vetus de blanc;\nAvec Jesus ils sont en fete tout le temps."
    ],
    chorus: [
      "«Viens souper», le Maitre appelle: «Viens souper»\nTu peux feter a Sa table tout le temps;\nLui qui a nourri la foule et change de l'eau en vin,\nUn appel a l'affame: «Viens souper»."
    ]
  },
  {
    id: 22,
    title: "POURRONS-NOUS A LA RIVIERE",
    reference: "Crois seulement 50",
    category: "Ciel",
    lyrics: [
      "Pourrons-nous a la riviere\nSortant du trone de Dieu\nNous nous rassemblons sur la rive\nOu les anges ont marche.",
      "Au sein de cette riviere\nLe Roi Sauveur est a nous\nNous serons la plus de peines\nSous la gloire du trone.",
      "Aux bords de cette riviere\nNous nous baignons de son eau\nNous marcherons en adorant\nCe sera un jour dore.",
      "Arrives a la riviere\nDeposons tous nos fardeaux\nLa grace nous delivrera\nNous donnera une couronne",
      "Tout pres de cette riviere\nRefletant la face de Dieu\nLes Saints qui sont immortels\nChanterons leurs chants de grace",
      "Bientot a cette riviere\nLe voyage est fini\nEt tous nos coeurs se rejouiront.\nDe la melodie de Paix."
    ],
    chorus: [
      "Oui nous allons nous rassembler\nA la merveilleuse riviere\nAvec tous les saints a la riviere\nQui coule du trone de Dieu."
    ]
  },
  {
    id: 23,
    title: "GLOIRE A SON NOM !",
    reference: "Crois seulement 51",
    category: "Louange",
    lyrics: [
      "A la croix ou mourut mon Sauveur,\nJe criais pour etre purifie;\nLa, le sang fut applique a mon coeur;\nGloire a Son Nom!",
      "Je suis si merveilleusement sauve,\nAvec douceur Jesus est en moi,\nLa, a la croix, ou Il m'a recu;\nGloire a Son Nom!",
      "Fontaine qui sauve du peche!\nJe suis heureux de m'y etre plonge;\nLa, Jesus me sauve, me rend pur;\nGloire a Son Nom!",
      "Viens a la Fontaine si riche et douce;\nJette ton ame aux pieds du Sauveur;\nPlonge-t'y aujourd'hui et sois pur;\nGloire a Son Nom!"
    ],
    chorus: [
      "Gloire a Son Nom!\nGloire a Son Nom!\nLa, le sang fut applique a mon coeur;\nGloire a Son Nom!"
    ]
  },
  {
    id: 24,
    title: "IL M'A SORTI",
    reference: "Crois seulement 52",
    category: "Delivrance",
    lyrics: [
      "Mon coeur angoisse sous l'oeil severe de Dieu\nDans la fosse ou mes peches m'avaient plonge;\nDe la boue profonde j'ai crie au seigneur\nQui tendrement m'emmena au jour dore.",
      "Il m'a place pres de Lui sur le Rocher,\nMes pas sont affermis, j'y demeurerai,\nAucun risque de tomber tant que j'y reste,\nJusqu'au couronnement, Je tiendrai par Sa Grace",
      "Il m'a donne un nouveau chant de louange\nDont je chanterai les douces notes nuit et jour;\nMon coeur debordant, je suis libre, heureux,\nJe loue mon Redempteur qui m'a secouru.",
      "Je chanterai Sa merveilleuse grace pour moi,\nLe louerai jusqu'a faire voir Sa bonte;\nJe chanterai le salut chez moi, partout,\nJusqu'a ce que tous entendent la Parole, croient Dieu."
    ],
    chorus: [
      "Il m'a sorti de la boue d'argile,\nIl a place mes pieds sur le Roc;\nIl met un chant dans mon ame ce jour,\nUn chant de louange, alleluia!"
    ]
  },
  {
    id: 25,
    title: "BIENTOT DANS LA DOUCEUR",
    reference: "Crois seulement 53",
    category: "Esperance",
    lyrics: [
      "'Y a un Pays plus beau que le jour,\nEt par la foi nous pouvons le voir;\nLe Pere attend de l'autre cote\nPour nous preparer la un palais.",
      "Nous chanterons sur ce beau rivage,\nLes chants melodieux du bienheureux;\nNos esprits ne s'affligeront plus\nEt plus de soupirs pour le repos.",
      "A notre genereux Pere celeste,\nNous offrirons hommages et louanges,\nPour le glorieux don de Son Amour,\nEt les bienfaits consacrant nos jours."
    ],
    chorus: [
      "Bientot dans la douceur,\nNous nous rencontrerons sur cette rive,\nBientot dans la douceur,\nNous nous rencontrerons sur cette rive."
    ]
  },
  {
    id: 26,
    title: "'Y A UNE FONTAINE",
    reference: "Crois seulement 54",
    category: "Redemption",
    lyrics: [
      "Y a une fontaine remplie de sang\nTire des veines d'Emmanuel,\nLes pecheurs plonges dans ce flot\nPerdent toutes leurs souillures.\nPerdent toutes leurs souillures,\nPerdent toutes leurs souillures;\nLes pecheurs plonges dans ce flot\nPerdent toutes leurs souillures.",
      "Le voleur mourant s'est rejoui\nDe voir cette fontaine;\nEt la, vil comme lui, puisse-je etre,\nLave de tout peche.\nLave de tout peche,\nLave de tout peche;\nEt la, vil comme lui, puisse-je etre,\nLave de tout peche.",
      "Agneau mourant, Ton sang precieux\nNe perd point sa puissance\nJusqu'a ce que l'Eglise de Dieu,\nSauvee, ne peche plus.\nSauvee, ne peche plus,\nSauvee, ne peche plus;\nJusqu'a ce que l'Eglise de Dieu,\nSauvee, ne peche plus.",
      "Depuis que ma foi vit ce flot,\nCoulant de Tes blessures,\nL'amour redempteur est mon theme\nJusqu'au jour de ma mort.\nJusqu'au jour de ma mort,\nJusqu'au jour de ma mort;\nL'amour redempteur est mon theme\nJusqu'au jour de ma mort.",
      "Puis dans un chant noble et doux\nJe chanterai Ta puissance,\nLorsque mes levres tremblantes\nDescendront au tombeau.\nDescendront au tombeau,\nDescendront au tombeau;\nLorsque mes levres tremblantes\nDescendront au tombeau."
    ]
  },
  {
    id: 27,
    title: "HYMNE DE BATAILLE DE LA REPUBLIQUE",
    reference: "Crois seulement 57",
    category: "Combat spirituel",
    lyrics: [
      "Mes yeux ont vu la gloire de la venue du Seigneur;\nIl est en train de fouler la vendange de la colere;\nIl a lache le fatal eclair de Sa terrible epee;\nSa Verite est en marche.",
      "Je L'ai vu entoure d'une centaine de feux de bivouac;\nIls ont bati pour Lui un autel dans la fraicheur du soir;\nJe peux lire Sa juste sentence par le scintillement des lampes;\nSon jour est vraiment en marche.",
      "Il sonna la trompette qui jamais n'annonce la retraite;\nEt Il sonde les coeurs des hommes devant Son trone de jugement;\nO mon ame, hate-toi de Lui repondre! mes pieds, jubilez!\nNotre Dieu est bien en marche.",
      "Dans la beaute de lys, Christ naquit par dela la mer,\nAvec dans Son sein une gloire qui nous transfigure, vous et moi;\nComme Sa mort sanctifia les hommes, mourons pour les liberer\nPendant que Dieu est en marche."
    ],
    chorus: [
      "Gloire! gloire, alleluia!\nGloire! gloire, alleluia!\nGloire! gloire, alleluia!\nSa Verite est en marche"
    ]
  },
  {
    id: 28,
    title: "AMEN !",
    reference: "Crois seulement 58",
    category: "Louange",
    lyrics: [
      "Amen! Amen! Amen! Amen, Amen!",
      "Allez-vous L'aimer? Amen!\nAllez-vous Le louer? Amen!\nAllez-vous L'adorer? Amen!\nAmen, Amen!",
      "Allez-vous L'aimer? Amen!\nLe servirez-vous? Amen!\nCroyez-vous en Lui? Amen!\nAmen! Amen!\nLa Bible est vraie. Amen!\nJ'ai la foi en Elle. Amen!\nC'est la Parole de Dieu. Amen!\nAmen! Amen!",
      "Jesus est venu. Amen!\nIl nous a enleves. Amen!\nDans la nuee de Gloire. Amen!\nAmen! Amen!"
    ]
  },
  {
    id: 29,
    title: "JE NE CHANCELLE PAS",
    reference: "Crois seulement 61",
    category: "Foi",
    lyrics: [
      "Jesus est mon sauveur, je ne chancelle pas\nSon amour est faveur, je ne chancelle pas\nJuste comme un arbre plante pres des eaux, Je ne chancelle pas.",
      "Cache dans le Christ, je ne chancelle pas\nCache dans son amour, je ne chancelle pas\nJuste comme un arbre plante pres des eaux, Je ne chancelle pas.",
      "Si je le crois toujours, je ne chancelle pas\nIl ne peut me lacher, je ne chancelle pas\njuste comme un arbre plante pres des eaux, je ne chancelle pas.",
      "Gloire, Alleluia, je ne chancelle pas\nancre dans Jehovah, je ne chancelle pas\njuste comme un arbre plante pres des eaux, je ne chancelle pas.",
      "Que l'Enfer m'assaille, je ne chancelle pas\nJesus ne me lache pas, je ne chancelle pas\njuste comme un arbre plante pres des eaux, je ne chancelle pas.",
      "Que les tempetes sevissent, je ne chancelle pas\nSur le rocher des ages, je ne chancelle pas\njuste comme un arbre plante pres des eaux, je ne chancelle pas.",
      "Je suis dans son amour, je ne chancelle pas\nJe me confie en lui, je ne chancelle pas\njuste comme un arbre plante pres des eaux, je ne chancelle pas.",
      "Je mange ta parole, je ne chancelle pas\nIl est bien le guide, je ne chancelle pas\njuste comme un arbre plante pres des eaux, je ne chancelle pas."
    ],
    chorus: [
      "Je ne chancelle, je ne chancelle pas\nJe ne chancelle, je ne chancelle pas\nJuste comme un arbre plante pres des eaux, Je ne chancelle pas."
    ]
  },
  {
    id: 30,
    title: "L'ANCIEN EVANGILE",
    reference: "Crois seulement 63",
    category: "Evangile",
    lyrics: [
      "C'est toujours l'ancien Saint-Esprit,\nEt Satan ne peut L'approcher,\nC'est pourquoi les peuples Le craignent;\nMais Il est si bon pour moi.",
      "Il mettra fin a tes mensonges;\nIl te sauvera de la mort;\nIl fera s'enfuir les demons;\nEt Il est si bon pour moi.",
      "Il est bon je n'en veux d'autres,\nCar Il me fait aimer mon frere;\nIl met toutes choses a decouvert,\nEt Il est si bon pour moi.",
      "Il etait si bon pour nos peres;\nIl fut bon pour Paul et Silas;\nIl etait bon pour frere Branham,\nEt Il est si bon pour moi.",
      "Il etait bon dans la fournaise;\nIl me fait aimer mon prochain;\nIl agira quand je mourrai,\nM'amenera au Ciel."
    ],
    chorus: [
      "Donne-moi l'ancien Evangile,\nDonne-moi l'ancien Evangile,\nDonne-moi l'ancien Evangile,\nIl est si bon pour moi."
    ]
  },
  {
    id: 31,
    title: "EMBARQUEZ",
    reference: "Crois seulement 64",
    category: "Salut",
    lyrics: [
      "C'est le vieux bateau de Sion,\nC'est le vieux bateau de Sion,\nC'est le vieux bateau de Sion,\nEmbarquez, embarquez.",
      "Il fit arriver mon vieux pere,\nIl fit arriver mon vieux pere,\nIl fit arriver mon vieux pere,\nEmbarquez, embarquez.",
      "Le Message du temps de la fin (3x)\nEst merveilleux pour moi",
      "Il est merveilleux pour Branham\nIl est merveilleux pour Neville\nIl est merveilleux pour Meda\nIl est merveilleux pour moi",
      "Il est merveilleux pour mon frere\nIl est merveilleux pour ma soeur\nIl est merveilleux pour l'eglise\nIl est merveilleux pour moi"
    ]
  },
  {
    id: 32,
    title: "IL EST TOUTE CHOSE POUR MOI",
    reference: "Crois seulement 70",
    category: "Louange",
    lyrics: [
      "Il est toute chose, Il est toute chose pour moi;\nIl est toute chose, Il est toute chose pour moi;\nCar Il est mon pere, ma mere, ma soeur et mon frere,\nIl est toute chose pour moi."
    ]
  },
  {
    id: 33,
    title: "JE SAIS C'ETAIT LE SANG",
    reference: "Crois seulement 71",
    category: "Redemption",
    lyrics: [
      "Je sais c'etait le Sang, je sais c'etait le Sang,\nJe sais c'etait le Sang pour moi;\nLorsque j'etais perdu, a la croix Il mourut,\nJe sais c'etait le Sang pour moi."
    ]
  },
  {
    id: 34,
    title: "LE SANG DE JESUS",
    reference: "Crois seulement 72",
    category: "Redemption",
    lyrics: [
      "Le Sang de Jesus,\nOh mon ami, le Sang de Jesus",
      "Il efface le peche,\nOh mon ami, le Sang de Jesus",
      "Il nous donne la victoire\nOh mon ami, le Sang de Jesus",
      "C'est mon assurance\nOh mon ami, le Sang de Jesus"
    ]
  },
  {
    id: 35,
    title: "AMI DE JESUS",
    reference: "Crois seulement 80",
    category: "Amitie",
    lyrics: [
      "Ami de Jesus, o quelle joie,\nPour un ignoble comme moi,\nD'avoir toujours un tel ami\nPour me conduire au Ciel.",
      "Ami quand d'autres amities\nCessent ou me decoivent,\nAmi qui me donne joie et paix,\nAmi quand vient l'ennemi.",
      "Un Ami dans la maladie\nEt quand approche la mort,\nAmi quand je passe la vallee,\nIl m'aide et m'encourage.",
      "Ami quand ma courte vie s'arrete,\nAmi quand passe la terre,\nAmi a voir au seuil du Ciel,\nAmi, enfin, chez moi."
    ],
    chorus: [
      "Ami de Jesus,\nCommunion divine,\nO quelle benie, douce communion,\nJesus est bien mon ami."
    ]
  },
  {
    id: 36,
    title: "LE LYS DE LA VALLEE",
    reference: "Crois seulement 83",
    category: "Adoration",
    lyrics: [
      "J'ai trouve en Jesus, l'ami qui est toute chose pour moi.\nC'est le plus beau d'entre dix mille pour mon ame;\nIl est le Lys de la Vallee et en Lui seul je trouve\nMa purification et ma guerison.\nMon reconfort dans les peines, appui dans les tourments,\nIl m'invite a Lui confier chaque souci. Alleluia !\nLa Brillante Etoile du Matin, le Lys de la Vallee,\nC'est le plus beau d'entre dix mille pour mon ame.",
      "Il a pris et porte sur Lui tous mes soucis et peines;\nMa tour forte et puissante dans les tentations;\nPour Lui, j'ai tout abandonne et ote de mon coeur\nMes idoles; et par Sa puissance Il me garde.\nMeme si le monde m'abandonne ou que Satan me tente,\nPar Jesus j'atteindrai surement le but Alleluia !\nLa Brillante Etoile du Matin, le Lys de la Vallee,\nC'est le plus beau d'entre dix mille pour mon ame.",
      "Il ne me quittera jamais, ne me laissera ici,\nTant que j'ai la foi et fais Sa volonte;\nUn mur de feu autour de moi, maintenant je ne crains rien;\nMon ame affamee se nourrit de Sa manne.\nEt nous, ravis dans la gloire, verrons Sa face benie,\nLa, a jamais coulent les fleuves des delices. Alleluia!\nLa Brillante Etoile du Matin, le Lys de la Vallee,\nC'est le plus beau d'entre dix mille pour mon ame."
    ]
  },
  {
    id: 37,
    title: "IL PREND SOIN DE TOI",
    reference: "Crois seulement 84",
    category: "Confiance",
    lyrics: [
      "Il prend soin de toi,\nIl prend soin de toi;\nTant le jour que la nuit,\nIl prend soin de toi."
    ]
  },
  {
    id: 38,
    title: "PARLE, MON SEIGNEUR",
    reference: "Crois seulement 92",
    category: "Mission",
    lyrics: [
      "Ecoutez le Maitre de la moisson:\n«Qui va travailler pour Moi ce jour,\nMe ramener les perdus, les mourants,\nLeur indiquer le chemin etroit ?»",
      "Quand la braise ardente toucha le prophete,\nLe rendant aussi pur que possible,\nQuand la Voix de Dieu dit : «Qui ira pour nous ?»\nIl repondit : «Maitre, envoie-moi.»",
      "Des milliers meurent sans grace, dans le peche;\nEntends leurs amers et tristes cris;\nHate-toi mon frere de les secourir,\nReponds vite : «O Maitre, me voici.»",
      "Bientot le temps de la moisson prend fin;\nA la fete de la moisson bientot,\nPuisse le Maitre de la moisson nous dire:\n«Enfant, tu as tres bien travaille !»"
    ],
    chorus: [
      "Parle! mon Seigneur parle! mon Seigneur,\nParle! je Te repondrai si vite;\nParle! mon Seigneur parle! mon Seigneur,\nJe repondrai : «Seigneur, envoie-moi»."
    ]
  },
  {
    id: 39,
    title: "L'AMOUR DE DIEU",
    reference: "Crois seulement 93",
    category: "Amour",
    lyrics: [
      "L'amour de Dieu est de loin si grand\nQue langue ou plume ne peuvent le dire;\nIl va plus loin que la plus haute etoile,\nIl atteint le plus bas enfer.\nAux coupables, sous les fardeaux,\nDieu donna Son Fils pour vaincre;\nIl reconcilia Son fils errant,\nLui pardonna son peche.",
      "Quand le temporel va disparaitre,\nTrones et royaumes terrestres tombent,\nEt quand les hommes qui refusent de prier\nInvoqueront sur rocs et montagnes;\nL'Amour de Dieu demeurera toujours;\nIl est sans mesure et fort,\nGrace redemptrice pour la race d'Adam;\nLe chant des saints et des anges",
      "Si nous remplissions l'ocean d'encre,\nSi les cieux etaient parchemins;\nSi chaque tige etait une plume,\nEt tout homme etait ecrivain;\nDecrire l'Amour de Dieu Celeste\nDessecherait l'ocean,\nLe rouleau ne contiendrait le tout,\nQuoique couvrant tout le ciel."
    ],
    chorus: [
      "Oh! l'amour de Dieu combien riche et pur!\nIl est sans mesure et fort.\nIl demeurera eternellement\nLe chant des saints et des anges."
    ]
  },
  {
    id: 40,
    title: "N'OUBLIEZ PAS LA PRIERE EN FAMILLE",
    reference: "Crois seulement 103",
    category: "Priere",
    lyrics: [
      "N'oubliez pas la priere en famille,\nJesus veut vous trouver la;\nIl va s'occuper de vous,\nOh! n'oubliez pas la priere en famille!"
    ]
  },
  {
    id: 41,
    title: "L'HOMME DE GALILEE",
    reference: "Crois seulement 105",
    category: "Jesus",
    lyrics: [
      "Dans une creche il ya longtemps\nPour moi c'est evident,\nUn bebe naquit Sauveur du pecheur\nJean Le vit sur le rivage,\nl'Agneau plus que jamais\nOh ! Christ Le crucifie du calvaire.",
      "Le publicain vint prier\nAu temple ce jour-la,\nIl cria : « Seigneur, aie pitie de moi »\nSes peches furent pardonnes,\nUne douce paix le remplit,\nIl dit : « Venez voir l'Homme de Galilee ».",
      "Le boiteux pouvait marcher\nEt le muet parler\nCela fut proclamer avec amour\nEt l'aveugle pouvait voir,\nJe sais cet evident\nC'est la Puissance de l'Homme de Galilee.",
      "Nicodeme vint de nuit,\nDecouvrir le chemin\nIl demanda au Fils de l'homme que faire\nCelui-ci lui dit ces mots :\n« Tu dois naitre de nouveau »,\nPar l'Esprit de cet Homme de Galilee.",
      "Il avait dit les peches\nDe la femme au puits\nComment les cinq maris elle avait eu,\nSes peches furent pardonnes,\nUne douce paix la remplit,\nElle dit : « Venez voir l'Homme de Galilee »."
    ],
    chorus: [
      "Oh ! que j'aime cet Homme de Galilee,\nParce qu'Il a fait beaucoup pour moi.\nIl pardonna mes peches,\nMe remplit du Saint Esprit.\nOh ! que j'aime cet Homme de Galilee."
    ]
  },
  {
    id: 42,
    title: "DANS CETTE CITE",
    reference: "Crois seulement 107",
    category: "Ciel",
    lyrics: [
      "Il y a un pays au dela des etoiles,\nIl y a une cite ou il n'y a point de nuit;\nSi nous sommes fideles, nous irons la bientot,\nC'est la cite ou l'Agneau est la Lumiere.",
      "Ici nous sommes eclaires, mais nous savons\nQue ce soleil qui luit sur nous maintenant,\nSe changera en nuages quand nous irons\nA la cite ou l'Agneau est la Lumiere.",
      "La, les fleurs s'epanouissent toujours et le jour\nSera un jour eternel, et point de nuit!\nNos larmes seront essuyees a jamais,\nDans cette cite ou l'Agneau est la Lumiere.",
      "Ici nous avons toujours des deceptions,\nEt nos espoirs rencontrent l'opposition;\nIci nous pleurons, la-bas sera la joie,\nDans cette cite ou l'Agneau est la Lumiere."
    ],
    chorus: [
      "Dans cette cite ou l'Agneau est la Lumiere,\nCette cite ou il n'y a point de nuit;\nJ'ai un beau palais la-haut, et libere des soucis,\nJe m'en irai ou l'Agneau est la Lumiere."
    ]
  },
  {
    id: 43,
    title: "AU NOM DE JESUS",
    reference: "Crois seulement 65",
    category: "Jesus",
    lyrics: [
      "Au nom de Jesus, tout genou flechira,\nAu Ciel, sur terre, aux enfers;\nToute langue confessera Jesus-Christ,\nEst le Seigneur de tout.",
      "Au nom de Jesus, les demons s'enfuiront,\nLes malades seront gueris;\nLa puissance du sang de Jesus-Christ,\nNous donne la victoire.",
      "Au nom de Jesus, nous sommes plus que vainqueurs,\nPar Celui qui nous a aimes;\nRien ne pourra nous separer de Christ,\nNi la mort, ni la vie."
    ],
    chorus: [
      "Jesus! Jesus! Nom glorieux!\nJesus! Jesus! Nom precieux!\nQuel beau nom que le nom de Jesus!"
    ]
  },
  {
    id: 44,
    title: "ESPRIT DE DIEU, DESCENDS",
    reference: "Crois seulement 70",
    category: "Saint-Esprit",
    lyrics: [
      "Esprit de Dieu, descends sur moi,\nViens me remplir de Toi;\nQue ma vie soit un sacrifice,\nAgreable a mon Roi.",
      "Esprit de verite, eclaire-moi,\nGuide mes pas chaque jour;\nQue je marche dans Tes voies,\nDans la lumiere de l'amour.",
      "Esprit de puissance, fortifie-moi,\nDans les temps difficiles;\nQue je sois un temoin fidele,\nDe Ta grace infinie."
    ],
    chorus: [
      "Viens, Saint-Esprit, viens!\nRemplis-moi maintenant;\nQue Ta presence divine,\nM'envahisse pleinement."
    ]
  },
  {
    id: 45,
    title: "QUEL AMI FIDELE ET TENDRE",
    reference: "Crois seulement 75",
    category: "Amour",
    lyrics: [
      "Quel ami fidele et tendre,\nNous avons en Jesus-Christ!\nToujours pret a nous entendre,\nA repondre a notre cri.",
      "Il connait nos defaillances,\nNos chutes de chaque jour;\nSevere en Ses exigences,\nIl est riche en Son amour.",
      "Disons-Lui toutes nos craintes,\nOuvrons-Lui tout notre coeur;\nBientot Ses divines etreintes,\nNous rendront plus que vainqueurs."
    ],
    chorus: [
      "Quel ami fidele et tendre,\nNous avons en Jesus-Christ!\nToujours pret a nous defendre,\nQuand l'ennemi nous poursuit."
    ]
  },
  {
    id: 46,
    title: "J'IRAI OU TU VOUDRAS",
    reference: "Crois seulement 80",
    category: "Mission",
    lyrics: [
      "J'irai ou Tu voudras que j'aille,\nCher Maitre, je suivrai Tes pas;\nSur les monts ou dans les vallees,\nPartout Tu me guideras.",
      "Je dirai ce que Tu voudras,\nTa Parole sera ma vie;\nJe parlerai de Ton amour,\nDans les tenebres ou la lumiere luit.",
      "Je serai ce que Tu voudras,\nFaconne-moi a Ton image;\nQue ma vie soit un temoignage,\nDe Ta gloire ici-bas."
    ],
    chorus: [
      "Me voici, Seigneur, envoie-moi!\nJe suis pret a obeir;\nLa ou Tu m'enverras j'irai,\nPour Ton nom glorifier."
    ]
  },
  {
    id: 47,
    title: "MA FOI REGARDE A TOI",
    reference: "Crois seulement 85",
    category: "Confiance",
    lyrics: [
      "Ma foi regarde a Toi,\nAgneau de Dieu, Sauveur;\nExauce-moi, je viens a Toi,\nOte mon peche, Seigneur.",
      "Que Ton amour vainqueur,\nRemplisse tout mon coeur;\nQue pour Toi seul, mon Redempteur,\nJe vive a chaque heure.",
      "Quand viendra le moment,\nDu dernier grand combat;\nSois mon Rocher, Dieu tout-puissant,\nGuide mes pas la-bas."
    ],
    chorus: [
      "Ma foi regarde a Toi,\nJesus, divin Sauveur;\nJe mets ma confiance en Toi,\nTu es mon Redempteur."
    ]
  },
  {
    id: 48,
    title: "DEVANT LE TRONE CELESTE",
    reference: "Crois seulement 90",
    category: "Adoration",
    lyrics: [
      "Devant le trone celeste,\nJe m'incline avec respect;\nDevant la majeste divine,\nJe chante: Saint, Saint, Saint!",
      "Les anges voilent leur face,\nDevant l'eclat de Ta gloire;\nEt moi, pecheur par Ta grace,\nJ'ose entrer dans Ton histoire.",
      "Digne es-Tu, Seigneur,\nDe recevoir tout honneur;\nLa puissance et la richesse,\nAppartiennent au Createur."
    ],
    chorus: [
      "Saint, Saint, Saint est le Seigneur!\nLe Ciel et la terre sont remplis,\nDe Sa gloire et de Sa splendeur;\nGloire a Dieu aux lieux tres hauts!"
    ]
  },
  {
    id: 49,
    title: "IL ME DELIVRE",
    reference: "Crois seulement 95",
    category: "Delivrance",
    lyrics: [
      "Il me delivre, Il me delivre,\nMon Sauveur me delivre;\nDe tout peche, de toute crainte,\nMon Sauveur me delivre.",
      "Des chaines du peche qui m'enchainait,\nJesus m'a delivre;\nDu pouvoir de Satan, mon ennemi,\nJesus m'a libere.",
      "Je suis libre maintenant,\nLibre par le sang de Christ;\nPlus de condamnation,\nJesus m'a affranchi."
    ],
    chorus: [
      "Delivre, delivre,\nJesus m'a delivre!\nMon ame chante alleluia,\nJesus m'a delivre!"
    ]
  },
  {
    id: 50,
    title: "QUAND JE CONTEMPLE LA CROIX",
    reference: "Crois seulement 100",
    category: "Redemption",
    lyrics: [
      "Quand je contemple la croix,\nOu le Prince de gloire est mort,\nJe considere comme une perte,\nTout ce qui me semblait un tresor.",
      "Interdit-moi, Seigneur, de me vanter,\nSi ce n'est dans la mort de Christ;\nTout charme et tout attrait du monde,\nJe les sacrifie a Son nom.",
      "Voyez sur Sa tete, Ses mains et pieds,\nLa douleur et l'amour s'entremelent;\nJamais l'amour et la douleur,\nN'ont forme couronne si belle."
    ]
  },
  {
    id: 51,
    title: "MARCHONS ENSEMBLE",
    reference: "Crois seulement 105",
    category: "Communion",
    lyrics: [
      "Marchons ensemble dans l'unite,\nDans l'amour et la verite;\nFreres et soeurs en Jesus-Christ,\nUnis par Son Saint-Esprit.",
      "Portons les fardeaux les uns des autres,\nComme Christ nous l'a commande;\nDans la joie comme dans la peine,\nRestons toujours lies.",
      "Le monde saura que nous sommes Ses disciples,\nPar l'amour que nous aurons;\nEnsemble nous vaincrons,\nCar Dieu est avec nous."
    ],
    chorus: [
      "Unis, unis dans l'amour,\nUnis dans la foi;\nMarchons ensemble chaque jour,\nSur les traces de notre Roi."
    ]
  }
]

export const categories = [
  "Tous",
  "Adoration",
  "Amour",
  "Aspiration",
  "Benediction",
  "Ciel",
  "Combat spirituel",
  "Communion",
  "Confiance",
  "Consecration",
  "Delivrance",
  "Esperance",
  "Foi",
  "Grace",
  "Jesus",
  "Louange",
  "Marche",
  "Mission",
  "Priere",
  "Redemption",
  "Refuge",
  "Saint-Esprit",
  "Soumission",
  "Temoignage"
]
