export type Language = 'en' | 'es' | 'hi' | 'fr';

export const translations = {
  en: {
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
    header: {
        goPro: 'Go Pro'
    },
    fab: {
        addTransaction: 'Add new transaction'
    },
    sync: {
        idle: 'Idle',
        syncing: 'Syncing...',
        synced: 'Synced',
        error: 'Sync Error'
    },
    nav: {
        home: 'Home',
        analytics: 'Analytics',
        history: 'History',
        settings: 'Settings'
    },
    dashboard: {
        totalBalance: 'Total Balance',
        income: 'Income',
        expense: 'Expense',
        subscriptions: 'Subscriptions',
        noSubscriptions: 'No active subscriptions.'
    },
    financialHealth: {
        title: 'Financial Health',
        savingsStreak: 'Savings Streak',
        days: 'Days',
        budgetUse: 'Budget Use',
        spent: 'Spent',
        savingsGoal: 'Savings Goal',
        ofGoal: 'of goal reached'
    },
    analytics: {
        spendAnalysis: 'Spend Analysis',
        categoryBreakdown: 'Category Breakdown',
        dailyExpense: 'Daily Expense',
        noExpenseData: 'No expense data for chart.'
    },
    transactions: {
        title: 'All Transactions',
        noTransactions: 'No transactions yet.'
    },
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
        showOriginalCurrency: 'Original Currency',
        showOriginalCurrencyDesc: 'Show native amount next to converted total',
        exchangeRates: 'Exchange Rates',
        ratesReference: 'Reference Rates',
        resetRates: 'Reset to System Defaults',
        show: 'Show',
        hide: 'Hide',
        dataBackup: 'Data & Backup',
        exportCSV: 'Export to CSV',
        exportPDF: 'Export to PDF',
        signOut: 'Sign Out',
        language: 'Language',
        financialTargets: 'Financial Targets',
        budgetLimitLabel: 'Monthly Budget Limit',
        savingsGoalLabel: 'Target Savings Goal'
    },
    categories: {
        Food: 'Food', Transport: 'Transport', Shopping: 'Shopping', Bills: 'Bills',
        Entertainment: 'Entertainment', Health: 'Health', Salary: 'Salary',
        Investment: 'Investment', Other: 'Other'
    }
  },
  es: {
    login: {
      title: 'XpenseFlow', subtitle: 'Gestión Profesional de Gastos', emailPlaceholder: 'Correo Electrónico', passwordPlaceholder: 'Contraseña',
      signIn: 'Iniciar Sesión', createAccount: 'Crear Cuenta', or: 'O', signInWithGoogle: 'Iniciar sesión con Google',
      noAccount: '¿No tienes una cuenta? ', hasAccount: '¿Ya tienes una cuenta? ', signUp: 'Regístrate',
    },
    header: { goPro: 'Hazte Pro' },
    nav: { home: 'Inicio', analytics: 'Análisis', history: 'Historial', settings: 'Ajustes' },
    modals: {
        showOriginalCurrency: 'Moneda Original',
        showOriginalCurrencyDesc: 'Ver monto nativo junto al total convertido',
        exchangeRates: 'Tipos de Cambio',
        ratesReference: 'Tasas de Referencia',
        resetRates: 'Restablecer Valores Predeterminados',
        show: 'Mostrar',
        hide: 'Ocultar'
    },
    categories: {
        Food: 'Comida', Transport: 'Transporte', Shopping: 'Compras', Bills: 'Cuentas', Entertainment: 'Entretenimiento', Health: 'Salud',
        Salary: 'Salario', Investment: 'Inversión', Other: 'Otro'
    }
  },
  hi: {
    login: {
      title: 'XpenseFlow', subtitle: 'पेशेवर व्यय प्रबंधन', emailPlaceholder: 'ईमेल पता', passwordPlaceholder: 'पासवर्ड',
      signIn: 'साइन इन करें', createAccount: 'खाता बनाएं', or: 'या', signInWithGoogle: 'Google से साइन इन करें',
      noAccount: 'खाता नहीं है? ', hasAccount: 'पहले से ही खाता है? ', signUp: 'साइन अप करें',
    },
    nav: { home: 'होम', analytics: 'विश्लेषण', history: 'इतिहास', settings: 'सेटिंग्स' },
    modals: {
        showOriginalCurrency: 'मूल मुद्रा',
        showOriginalCurrencyDesc: 'परिवर्तित कुल के आगे मूल राशि दिखाएं',
        exchangeRates: 'विनिमय दरें',
        ratesReference: 'संदर्भ दरें',
        resetRates: 'डिफ़ॉल्ट पर रीसेट करें',
        show: 'दिखाएं',
        hide: 'छिपाएं'
    },
    categories: {
        Food: 'भोजन', Transport: 'परिवहन', Shopping: 'खरीदारी', Bills: 'बिल', Entertainment: 'मनोरंजन', Health: 'स्वास्थ्य',
        Salary: 'वेतन', Investment: 'निवेश', Other: 'अन्य'
    }
  },
  fr: {
    login: {
      title: 'XpenseFlow', subtitle: 'Gestion Professionnelle des Dépenses', emailPlaceholder: 'Adresse E-mail', passwordPlaceholder: 'Mot de passe',
      signIn: 'Se Connecter', createAccount: 'Créer un Compte', or: 'OU', signInWithGoogle: 'Se connecter avec Google',
      noAccount: "Vous n'avez pas de compte ? ", hasAccount: 'Vous avez déjà un compte ? ', signUp: "S'inscrire",
    },
    nav: { home: 'Accueil', analytics: 'Analyse', history: 'Historique', settings: 'Réglages' },
    modals: {
        showOriginalCurrency: 'Devise d\'Origine',
        showOriginalCurrencyDesc: 'Afficher le montant natif à côté du total converti',
        exchangeRates: 'Taux de Change',
        ratesReference: 'Taux de Référence',
        resetRates: 'Réinitialiser aux Valeurs par Défaut',
        show: 'Afficher',
        hide: 'Masquer'
    },
    categories: {
        Food: 'Nourriture', Transport: 'Transport', Shopping: 'Achats', Bills: 'Factures', Entertainment: 'Divertissement', Health: 'Santé',
        Salary: 'Salaire', Investment: 'Investissement', Other: 'Autre'
    }
  }
};