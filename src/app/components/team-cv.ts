/**
 * CV résumés des membres de l'organigramme.
 *
 * Source des données :
 *  - Ibrahima Turbé Gueye, Alpha Youssoupha Gueye, Mouhamadou Diouck,
 *    Babacar Sedikh Fall → document « CV Experts.docx » fourni par le cabinet.
 *  - Mouhamed El Moustapha Diop → son CV PDF.
 *  - Mouhamadou Mansour Sow → son portfolio https://mansoursow.vercel.app/
 *
 * Le contenu reste en français dans les deux langues : ce sont des intitulés
 * de diplômes, des raisons sociales et des titres officiels, qui se traduisent
 * mal. Seuls les libellés de section sont traduits (clés `team.cv.*`).
 */

export type CvExperience = {
  period: string;
  role: string;
  org: string;
};

export type CvHighlight = {
  title: string;
  desc: string;
};

export type CvSkillGroup = {
  label: string;
  items: string[];
};

export type MemberCv = {
  /** Nom complet tel qu'il figure sur le CV. */
  fullName: string;
  /** Titre professionnel affiché sous le nom dans la modale. */
  headline: string;
  /**
   * Paragraphe de positionnement, pour les profils que le format CV classique
   * dessert (double compétence, spécialisation transverse…).
   */
  profile?: string;
  education?: string[];
  experience?: CvExperience[];
  /** Liste plate de compétences. */
  skills?: string[];
  /** Compétences groupées, quand le profil couvre deux métiers distincts. */
  skillGroups?: CvSkillGroup[];
  /** Réalisations marquantes, plus parlantes qu'une liste de postes. */
  highlights?: CvHighlight[];
  languages?: string[];
  countries?: string[];
  affiliations?: string[];
  link?: { label: string; url: string };
};

export const TEAM_CV: Record<string, MemberCv> = {
  // ─────────────────────────────────────────── Associés
  'Ibrahima Gueye': {
    fullName: 'Ibrahima Turbé Gueye',
    headline:
      "Expert-comptable diplômé de l'État français · Commissaire aux comptes auprès des tribunaux du Sénégal · Directeur général d'ADOC",
    education: [
      "1998 — Diplôme d'Expertise Comptable (DEC), France",
      "1994 — Diplôme d'Études Supérieures Comptables et Financières (DESCF), INTEC Paris",
      "1991 — Diplôme d'Études Comptables et Financières (DECF), Châlons-sur-Marne",
      '1989 — Brevet de Technicien Supérieur Comptabilité, Reims',
    ],
    experience: [
      {
        period: "Depuis août 2009",
        role: 'Expert-comptable diplômé — Directeur général',
        org: 'ADOC Audit & Conseil, Dakar',
      },
      {
        period: '2001 — 2009',
        role: 'Directeur financier',
        org: 'Société Africaine de Raffinage (SAR), Dakar',
      },
      {
        period: '2000 — 2001',
        role: 'Expert-comptable — Directeur associé',
        org: "CMG & Associés, cabinet d'audit et d'expertise comptable, Dakar",
      },
      {
        period: '1998 — 2000',
        role: 'Directeur comptable et fiscal',
        org: 'Groupe Larsy Vitrage, Bayonne (France)',
      },
      {
        period: '1993 — 1998',
        role: 'Auditeur senior',
        org: 'Fiduciaire Comptable du Nord (France)',
      },
      {
        period: '1992 — 1993',
        role: 'Responsable administratif et comptable',
        org: 'Croix-Rouge française',
      },
    ],
    skills: [
      'Commissariat aux comptes',
      'Direction de mission',
      'Planification stratégique des organisations',
      'Audit de la gestion financière des subventions du Fonds Mondial',
      "Restructuration de dette et redressement d'entreprise",
      "Conseil en organisation et manuels de procédures",
      "Évaluation d'entreprise et business plan",
    ],
    languages: ['Français : excellent', 'Anglais : excellent'],
    countries: [
      'Sénégal',
      "Côte d'Ivoire",
      'Mauritanie',
      'Guinée Conakry',
      'Togo',
      'Mali',
      'Niger',
      'Tchad',
      'Cameroun',
      'Gabon',
    ],
    affiliations: ['ONECCA Sénégal'],
  },

  'Alpha Gueye': {
    fullName: 'Alpha Youssoupha Gueye',
    headline: "Expert-comptable diplômé · Chef de mission audit et conseil",
    education: [
      '2023 — 2024 : Doctorat en sciences de gestion (DBA), ACLAS Atlanta (USA)',
      "Depuis 2020 : thèse de doctorat sur les déterminants de l'innovation dans les entreprises sénégalaises (UCAD)",
      "2016 — Diplôme d'Expertise Comptable et Financière (DECOFI)",
      "2011 — Diplôme d'Études Supérieures de Comptabilité et Gestion Financière de l'UEMOA (DESCOGEF), CESAG Dakar",
      '2008 — Diplôme Supérieur Comptable (DSC), École Supérieure Polytechnique de Dakar',
      "2005 — Diplôme d'Études Approfondies (DEA) en sciences de gestion, UCAD",
      '2003 — Maîtrise en sciences économiques, option gestion des entreprises, UCAD',
    ],
    experience: [
      {
        period: 'Depuis août 2009',
        role: 'Chef de mission audit et conseil',
        org: 'ADOC Audit & Conseil, Dakar',
      },
      {
        period: '2004 — 2009',
        role: 'Chargé de la comptabilité-finance / Responsable qualité',
        org: 'SCP Maîtres Papa Ismaël Ka et Alioune Ka, notaires associés, Dakar',
      },
      {
        period: '2002',
        role: 'Consultant',
        org: 'Centre de Guidance Infantile de Dakar — enquête BIT',
      },
    ],
    skills: [
      'Commissariat aux comptes',
      'Expertise comptable : révision, présentation et tenue (PME)',
      "Organisation d'entreprise et rédaction de manuels de procédures",
      "Conception d'outils d'aide à la révision",
      'Lead Auditor management des risques ISO 31000 (2024)',
      'Fiscalité et arrêté des comptes',
      'SAGE, WINDEV, SPSS, STATA, EVIEWS, SPAD',
    ],
    languages: ['Français : excellent', 'Anglais : excellent'],
    countries: [
      'Sénégal',
      "Côte d'Ivoire",
      'Mauritanie',
      'Guinée Conakry',
      'Togo',
      'Mali',
      'Niger',
      'Tchad',
      'Cameroun',
      'Gabon',
    ],
    affiliations: [
      'ONECCA Sénégal',
      'Association Francophone de Comptabilité (AFC)',
      'Laboratoire de recherche en Entreprise et Développement (LAED)',
    ],
  },

  // ─────────────────────────────────── Experts-comptables stagiaires
  Mansour: {
    fullName: 'Mouhamadou Mansour Sow',
    headline:
      'Expert-comptable stagiaire & développeur fullstack IA · Digitalisation des cabinets',
    profile:
      "Dix ans d'expérience en audit et en finance, doublés d'une pratique de développeur. " +
      "Mansour conduit des missions d'audit et conçoit les outils qui les industrialisent : " +
      "il automatise les processus financiers que la plupart des développeurs ne comprennent pas, " +
      "et lit les systèmes que la plupart des comptables ne savent pas auditer. " +
      "Titulaire du DESCOGEF, il est en stage d'expertise comptable chez ADOC.",
    skillGroups: [
      {
        label: 'Expertise comptable & audit',
        items: [
          'Audit financier et commissariat aux comptes',
          'SYSCOHADA révisé',
          "Audit des systèmes d'information",
          'Cartographie des risques',
          'Fiscalité : ETAX, liasse fiscale',
          'Sage Comptabilité et Sage Paie',
        ],
      },
      {
        label: 'Technologie & intelligence artificielle',
        items: [
          'React, Next.js, TypeScript',
          'Python, FastAPI, PostgreSQL',
          'OCR et vision par ordinateur',
          'Deep learning et agents IA',
          'Excel avancé, VBA, Power Query',
        ],
      },
    ],
    highlights: [
      {
        title: 'AccounTech AI — ERP comptable augmenté par IA',
        desc: "De la pièce justificative au grand livre sans saisie manuelle : extraction OCR, classification par deep learning et génération d'écritures conformes au SYSCOHADA révisé.",
      },
      {
        title: "Matrice d'audit ADOC",
        desc: "Outil de conduite de mission interne au cabinet : matrices de risques, feuilles de travail structurées et génération automatique des rapports d'audit.",
      },
      {
        title: 'Site et simulateurs ADOC',
        desc: 'Refonte du site du cabinet et intégration de simulateurs financiers en libre accès : paie, impôts, TEG/TAEG et ratios de rentabilité.',
      },
      {
        title: 'Contrôle ADS — contrôle des recettes automatisé',
        desc: "Plateforme de contrôle des recettes d'infrastructure : ingestion des relevés, rapprochement ligne à ligne et mise en évidence des écarts non justifiés.",
      },
      {
        title: 'Suite Pointage — gestion des présences',
        desc: 'Application RH déployée pour trois organisations : authentification, suivi en temps réel et pilotage de la masse salariale.',
      },
    ],
    link: { label: 'mansoursow.vercel.app', url: 'https://mansoursow.vercel.app/' },
  },

  Moustapha: {
    fullName: 'Mouhamed El Moustapha Diop',
    headline: 'Expert-comptable stagiaire · Auditeur comptable et financier',
    education: [
      "Décembre 2024 — septembre 2025 : Diplôme d'Étude Supérieur de Comptabilité et Gestion Financière, Centre Africain d'Étude Supérieur en Gestion, Dakar",
      "2021 — 2023 : Master en Audit et Contrôle de Gestion, Centre Africain d'Études Supérieures en Gestion, Dakar",
      "2019 — 2021 : Diplôme Supérieur d'Études Comptables et de Gestion, École Supérieure Polytechnique, Dakar",
      '2018 — 2019 : Diplôme Élémentaire Comptable, École Supérieure Polytechnique, Dakar',
      '2017 — 2018 : Baccalauréat série G, Complexe Saint-Michel, Dakar',
    ],
    experience: [
      {
        period: 'Depuis septembre 2023',
        role: 'Auditeur comptable et financier',
        org: 'ADOC Audit & Conseil, Dakar — audits financiers d’entreprises de différentes tailles, missions sur le terrain, collecte et analyse des documents comptables',
      },
      {
        period: 'Octobre 2022 — janvier 2023',
        role: 'Assistant comptable',
        org: 'AUDACE Audit et Conseil SUARL, Dakar — comptes fournisseurs et clients, déclarations fiscales',
      },
      {
        period: 'Août — octobre 2021',
        role: 'Assistant comptable',
        org: 'Option Conseils SAS, Dakar — vérification des factures, réconciliation des comptes tiers',
      },
      {
        period: 'Août — octobre 2020',
        role: 'Assistant comptable',
        org: 'Face Africa SA, Dakar — saisie et contrôle des écritures comptables',
      },
      {
        period: 'Juillet — septembre 2019',
        role: 'Assistant comptable',
        org: 'Option Conseils SAS, Dakar — gestion des factures et paiements fournisseurs',
      },
    ],
    skills: [
      'Audit financier et missions sur le terrain',
      'Collecte et analyse des documents comptables',
      'Comptabilité et gestion financière',
      'SAGE Comptabilité, SAGE Paie',
      'AUDITSOFT',
      'Word, Excel, PowerPoint',
    ],
    languages: ['Français', 'Anglais'],
  },

  Diouck: {
    fullName: 'Mouhamadou Diouck',
    headline: 'Expert-comptable stagiaire · Superviseur du département expertise comptable',
    education: [
      "2014 — 2015 : Diplôme d'Études Supérieures de Comptabilité et de Gestion Financière (DESCOGEF), CESAG Dakar",
      '2007 — 2008 : Master II Informatique appliquée à la gestion, Université Marne-la-Vallée, Paris',
      '2004 — 2005 : MBA en Audit et Contrôle de Gestion, École Supérieure de Gestion de Paris',
      '2001 — 2003 : Master II en Économie et Finance, FASEG',
      '1998 — 1999 : Maîtrise en sciences économiques, option gestion des entreprises, FASEG',
    ],
    experience: [
      {
        period: 'Depuis janvier 2022',
        role: 'Expert-comptable stagiaire — Superviseur du département expertise comptable',
        org: 'ADOC Audit & Conseil, Dakar',
      },
      {
        period: 'Août — décembre 2021',
        role: 'Directeur administratif et financier',
        org: 'OBH SASU — comptabilité, trésorerie, fiscalité, contrôle interne et pilotage budgétaire',
      },
      {
        period: 'Septembre 2020 — juillet 2021',
        role: 'Responsable du département expertise comptable',
        org: 'Moha Conseils — révision, états financiers SYSCOHADA révisé, missions de conseil PME/PMI',
      },
      {
        period: 'Février — septembre 2019',
        role: 'Consultant — responsable du département assistance comptable',
        org: 'Cabinet CMBAC — clôture des comptes, états financiers, déclarations fiscales',
      },
    ],
    skills: [
      'Expertise comptable : révision, présentation et tenue',
      'États financiers de synthèse SYSCOHADA révisé',
      'Manuels de procédures comptables et financières',
      'Contrôle de gestion et tableaux de bord',
      'Fiscalité et déclarations sociales',
      'Évaluation, transformation et recapitalisation de sociétés',
      'SAGE (Comptabilité, Paie, Commerciale)',
    ],
  },

  // ─────────────────────────────────────────── Chef de mission
  'Massamba Fall': {
    fullName: 'Babacar Sedikh Fall',
    headline: 'Auditeur comptable et financier confirmé · Auditeur senior',
    education: [
      '2013 — Master II en sciences de gestion, option finance-comptabilité, Université Cheikh Anta Diop de Dakar',
      '2012 — Maîtrise complète en gestion informatisée (mention assez bien), Université Gaston Berger de Saint-Louis',
      '2011 — Licence en gestion informatisée, Université Gaston Berger de Saint-Louis',
    ],
    experience: [
      {
        period: 'Depuis novembre 2012',
        role: 'Auditeur — Auditeur senior sur les missions de commissariat aux comptes',
        org: 'ADOC Audit & Conseil, Dakar',
      },
      {
        period: 'Février — juillet 2012',
        role: 'Chargé de la comptabilité et des tâches administratives',
        org: 'Royal Print',
      },
    ],
    skills: [
      'Commissariat aux comptes',
      'Audit de projets financés par les bailleurs de fonds internationaux',
      'Audit des établissements publics',
      'Revue du contrôle interne',
      'Contrôle des comptes et circularisation des tiers',
      'Présentation des états financiers',
      'Bases de données, MySQL, PHP, Access',
    ],
    languages: ['Français : excellent', 'Anglais : excellent'],
    countries: ['Sénégal', 'Guinée Conakry', 'Tchad'],
  },
};
