// Dichiarazioni di tipi globali per il progetto
declare global {
  interface Window {
    gtag?: (command: string, event_name: string, event_parameters?: Record<string, any>) => void;
    toggleFAQ?: (button: HTMLElement) => void;
    setBilling?: (type: 'monthly' | 'annual') => void;
    gdprManager?: GDPRManager;
  }
  
  interface PerformanceEntry {
    value?: number;
  }
  
  interface GDPRManager {
    consentKey: string;
    consentVersion: string;
    banner: HTMLElement | null;
    modal: HTMLElement | null;
    settingsBtn: HTMLElement | null;
    
    init(): void;
    getConsent(): any;
    saveConsent(consent: any): any;
    showBanner(): void;
    hideBanner(): void;
    showModal(): void;
    hideModal(): void;
    showSettingsButton(): void;
    hideSettingsButton(): void;
    getCookiePreferences(): any;
    applyConsent(consent: any): void;
    updateTrackingScripts(consent: any): void;
    disableScriptByType(type: string): void;
    acceptAll(): void;
    acceptNecessary(): void;
    savePreferences(): void;
    fireConsentEvent(consent: any): void;
    setupEventListeners(): void;
  }
}

export {};