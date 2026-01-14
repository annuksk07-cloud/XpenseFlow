export type Language = 'en' | 'es' | 'hi' | 'fr';

export const translations = {
  en: {
    // Login Screen
    login: {
      title: 'XpenseFlow',
      subtitle: 'Professional Expense Management',
      emailPlaceholder: 'Email Address',
      passwordPlaceholder: 'Password',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      or: 'OR',
      signInWithGoogle: 'Sign in with Google',
      noAccount: "Don't have an account? ",
      hasAccount: 'Already have an account? ',
      signUp: 'Sign Up',
    },
    // Header
    header: {
        goPro: 'Go Pro'
    },
    // FAB
    fab: {
        addTransaction: 'Add new transaction'
    },
    // Sync Status
    sync: {
        idle: 'Idle',
        syncing: 'Syncing...',
        synced: 'Synced',
        error: 'Sync Error'
    },
    // Bottom Nav
    nav: {
        home: 'Home',
        analytics: 'Analytics',
        history: 'History',
        settings: 'Settings'
    },
    // Dashboard
    dashboard: {
        totalBalance: 'Total Balance',
        income: 'Income',
        expense: 'Expense',
        subscriptions: 'Subscriptions',
        noSubscriptions: 'No active subscriptions.'
    },
     // Financial Health
    financialHealth: {
        title: 'Financial Health',
        savingsStreak: 'Savings Streak',
        days: 'Days',
        budgetUse: 'Budget Use',
        spent: 'Spent',
        savingsGoal: 'Savings Goal',
        ofGoal: 'of goal reached'
    },
    // Analytics
    analytics: {
        spendAnalysis: 'Spend Analysis',
        categoryBreakdown: 'Category Breakdown',
        dailyExpense: 'Daily Expense',
        noExpenseData: 'No expense data for chart.'
    },
    // Transaction List
    transactions: {
        title: 'All Transactions',
        noTransactions: 'No transactions yet.'
    },
    // Modals
    modals: {
        newEntry: 'New Entry',
        newSubscription: 'New Subscription',
        settingsTitle: 'App Settings',
        expense: 'Expense',
        income: 'Income',
        titlePlaceholder: 'Title',
        amountPlaceholder: 'Amount',
        category: 'Category',
        saveTransaction: 'Save Transaction',
        subscriptionNamePlaceholder: 'Subscription Name (e.g. Netflix)',
        billingCycle: 'Billing Cycle',
        monthly: 'Monthly',
        yearly: 'Yearly',
        startDate: 'Start Date',
        saveSubscription: 'Save Subscription',
        baseCurrency: 'Base Currency',
        stealthMode: 'Stealth Mode',
        stealthModeDesc: 'Blur sensitive numbers',
        dataBackup: 'Data & Backup',
        exportCSV: 'Export to CSV',
        exportPDF: 'Export to PDF',
        signOut: 'Sign Out',
        language: 'Language',
        financialTargets: 'Financial Targets',
        budgetLimitLabel: 'Monthly Budget Limit',
        savingsGoalLabel: 'Target Savings Goal'
    },
    // Categories
    categories: {
        Food: 'Food', Transport: 'Transport', Shopping: 'Shopping', Bills: 'Bills',
        Entertainment: 'Entertainment', Health: 'Health', Salary: 'Salary',
        Investment: 'Investment', General: 'General'
    }
  },
  es: {
    login: {
      title: 'XpenseFlow',
      subtitle: 'Gestión Profesional de Gastos',
      emailPlaceholder: 'Correo Electrónico',
      passwordPlaceholder: 'Contraseña',
      signIn: 'Iniciar Sesión',
      createAccount: 'Crear Cuenta',
      or: 'O',
      signInWithGoogle: 'Iniciar sesión con Google',
      noAccount: '¿No tienes una cuenta? ',
      hasAccount: '¿Ya tienes una cuenta? ',
      signUp: 'Regístrate',
    },
    header: { goPro: 'Hazte Pro' },
    fab: { addTransaction: 'Añadir nueva transacción' },
    sync: { idle: 'Inactivo', syncing: 'Sincronizando...', synced: 'Sincronizado', error: 'Error de Sincronización' },
    nav: { home: 'Inicio', analytics: 'Análisis', history: 'Historial', settings: 'Ajustes' },
    dashboard: { totalBalance: 'Balance Total', income: 'Ingresos', expense: 'Gastos', subscriptions: 'Suscripciones', noSubscriptions: 'No hay suscripciones activas.' },
    financialHealth: { title: 'Salud Financiera', savingsStreak: 'Racha de Ahorros', days: 'Días', budgetUse: 'Uso del Presupuesto', spent: 'Gastado', savingsGoal: 'Meta de Ahorro', ofGoal: 'de la meta alcanzada' },
    analytics: { spendAnalysis: 'Análisis de Gastos', categoryBreakdown: 'Desglose por Categoría', dailyExpense: 'Gasto Diario', noExpenseData: 'Sin datos de gastos para el gráfico.' },
    transactions: { title: 'Todas las Transacciones', noTransactions: 'Aún no hay transacciones.' },
    modals: {
      newEntry: 'Nueva Entrada', newSubscription: 'Nueva Suscripción', settingsTitle: 'Ajustes de la App', expense: 'Gasto', income: 'Ingreso',
      titlePlaceholder: 'Título', amountPlaceholder: 'Monto', category: 'Categoría', saveTransaction: 'Guardar Transacción',
      subscriptionNamePlaceholder: 'Nombre de la Suscripción (ej. Netflix)', billingCycle: 'Ciclo de Facturación', monthly: 'Mensual', yearly: 'Anual',
      startDate: 'Fecha de Inicio', saveSubscription: 'Guardar Suscripción', baseCurrency: 'Moneda Base', stealthMode: 'Modo Incógnito',
      stealthModeDesc: 'Ocultar números sensibles', dataBackup: 'Datos y Copia de Seguridad', exportCSV: 'Exportar a CSV', exportPDF: 'Exportar a PDF', signOut: 'Cerrar Sesión', language: 'Idioma',
      financialTargets: 'Objetivos Financieros', budgetLimitLabel: 'Límite de Presupuesto Mensual', savingsGoalLabel: 'Meta de Ahorro'
    },
    categories: {
        Food: 'Comida', Transport: 'Transporte', Shopping: 'Compras', Bills: 'Cuentas', Entertainment: 'Entretenimiento', Health: 'Salud',
        Salary: 'Salario', Investment: 'Inversión', General: 'General'
    }
  },
  hi: {
    login: {
      title: 'XpenseFlow',
      subtitle: 'पेशेवर व्यय प्रबंधन',
      emailPlaceholder: 'ईमेल पता',
      passwordPlaceholder: 'पासवर्ड',
      signIn: 'साइन इन करें',
      createAccount: 'खाता बनाएं',
      or: 'या',
      signInWithGoogle: 'Google से साइन इन करें',
      noAccount: 'खाता नहीं है? ',
      hasAccount: 'पहले से ही खाता है? ',
      signUp: 'साइन अप करें',
    },
    header: { goPro: 'प्रो बनें' },
    fab: { addTransaction: 'नया लेनदेन जोड़ें' },
    sync: { idle: 'निष्क्रिय', syncing: 'सिंक हो रहा है...', synced: 'सिंक हो गया', error: 'सिंक त्रुटि' },
    nav: { home: 'होम', analytics: 'विश्लेषण', history: 'इतिहास', settings: 'सेटिंग्स' },
    dashboard: { totalBalance: 'कुल शेष', income: 'आय', expense: 'व्यय', subscriptions: 'सदस्यताएँ', noSubscriptions: 'कोई सक्रिय सदस्यता नहीं।' },
    financialHealth: { title: 'वित्तीय स्वास्थ्य', savingsStreak: 'बचत की लकीर', days: 'दिन', budgetUse: 'बजट उपयोग', spent: 'खर्च', savingsGoal: 'बचत लक्ष्य', ofGoal: 'लक्ष्य हासिल किया गया' },
    analytics: { spendAnalysis: 'खर्च विश्लेषण', categoryBreakdown: 'श्रेणी विश्लेषण', dailyExpense: 'दैनिक व्यय', noExpenseData: 'चार्ट के लिए कोई व्यय डेटा नहीं।' },
    transactions: { title: 'सभी लेनदेन', noTransactions: 'अभी तक कोई लेनदेन नहीं।' },
    modals: {
      newEntry: 'नई प्रविष्टि', newSubscription: 'नई सदस्यता', settingsTitle: 'ऐप सेटिंग्स', expense: 'व्यय', income: 'आय',
      titlePlaceholder: 'शीर्षक', amountPlaceholder: 'राशि', category: 'श्रेणी', saveTransaction: 'लेनदेन सहेजें',
      subscriptionNamePlaceholder: 'सदस्यता का नाम (जैसे नेटफ्लिक्स)', billingCycle: 'बिलिंग चक्र', monthly: 'मासिक', yearly: 'वार्षिक',
      startDate: 'आरंभ तिथि', saveSubscription: 'सदस्यता सहेजें', baseCurrency: 'आधार मुद्रा', stealthMode: 'स्टील्थ मोड',
      stealthModeDesc: 'संवेदनशील नंबरों को धुंधला करें', dataBackup: 'डेटा और बैकअप', exportCSV: 'सीएसवी में निर्यात करें', exportPDF: 'पीडीएफ में निर्यात करें', signOut: 'साइन आउट', language: 'भाषा',
      financialTargets: 'वित्तीय लक्ष्य', budgetLimitLabel: 'मासिक बजट सीमा', savingsGoalLabel: 'बचत लक्ष्य'
    },
     categories: {
        Food: 'भोजन', Transport: 'परिवहन', Shopping: 'खरीदारी', Bills: 'बिल', Entertainment: 'मनोरंजन', Health: 'स्वास्थ्य',
        Salary: 'वेतन', Investment: 'निवेश', General: 'सामान्य'
    }
  },
  fr: {
    login: {
      title: 'XpenseFlow',
      subtitle: 'Gestion Professionnelle des Dépenses',
      emailPlaceholder: 'Adresse E-mail',
      passwordPlaceholder: 'Mot de passe',
      signIn: 'Se Connecter',
      createAccount: 'Créer un Compte',
      or: 'OU',
      signInWithGoogle: 'Se connecter avec Google',
      noAccount: "Vous n'avez pas de compte ? ",
      hasAccount: 'Vous avez déjà un compte ? ',
      signUp: "S'inscrire",
    },
    header: { goPro: 'Devenir Pro' },
    fab: { addTransaction: 'Ajouter une transaction' },
    sync: { idle: 'Inactif', syncing: 'Synchronisation...', synced: 'Synchronisé', error: 'Erreur de Synchro' },
    nav: { home: 'Accueil', analytics: 'Analyse', historique: 'Historique', settings: 'Réglages' },
    dashboard: { totalBalance: 'Solde Total', income: 'Revenus', expense: 'Dépenses', subscriptions: 'Abonnements', noSubscriptions: 'Aucun abonnement actif.' },
    financialHealth: { title: 'Santé Financière', savingsStreak: 'Série d\'Épargne', days: 'Jours', budgetUse: 'Utilisation du Budget', spent: 'Dépensé', savingsGoal: 'Objectif d\'Épargne', ofGoal: 'de l\'objectif atteint' },
    analytics: { spendAnalysis: 'Analyse des Dépenses', categoryBreakdown: 'Répartition par Catégorie', dailyExpense: 'Dépense Quotidienne', noExpenseData: 'Aucune donnée de dépense pour le graphique.' },
    transactions: { title: 'Toutes les Transactions', noTransactions: 'Aucune transaction pour le moment.' },
    modals: {
      newEntry: 'Nouvelle Entrée', newSubscription: 'Nouvel Abonnement', settingsTitle: "Réglages de l'App", expense: 'Dépense', income: 'Revenu',
      titlePlaceholder: 'Titre', amountPlaceholder: 'Montant', category: 'Catégorie', saveTransaction: 'Enregistrer la Transaction',
      subscriptionNamePlaceholder: "Nom de l'abonnement (ex. Netflix)", billingCycle: 'Cycle de Facturation', monthly: 'Mensuel', yearly: 'Annuel',
      startDate: 'Date de Début', saveSubscription: "Enregistrer l'Abonnement", baseCurrency: 'Devise de Base', stealthMode: 'Mode Discret',
      stealthModeDesc: 'Flouter les chiffres sensibles', dataBackup: 'Données et Sauvegarde', exportCSV: 'Exporter en CSV', exportPDF: 'Exporter en PDF', signOut: 'Se Déconnecter', language: 'Langue',
      financialTargets: 'Objectifs Financiers', budgetLimitLabel: 'Limite de Budget Mensuel', savingsGoalLabel: 'Objectif d\'Épargne'
    },
    categories: {
        Food: 'Nourriture', Transport: 'Transport', Shopping: 'Achats', Bills: 'Factures', Entertainment: 'Divertissement', Health: 'Santé',
        Salary: 'Salaire', Investment: 'Investissement', General: 'Général'
    }
  }
};