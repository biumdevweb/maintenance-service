# Prompt per Generare Immagini del Progetto

## Immagini da Creare

### 1. Dashboard Monitoraggio Siti Web (hero-dashboard.webp)
**Posizione**: public/images/hero-dashboard.webp
**Dimensioni**: 1200x800 pixel (ratio 3:2)
**Stile**: Dashboard professionale moderna con interfaccia pulita

**Prompt**:
```
Create a professional website monitoring dashboard interface with a dark theme. The dashboard should display:
- A header with "Maintenance Service" logo
- Real-time uptime statistics showing 99.9% uptime
- Performance metrics with colorful charts and graphs
- Security status indicators with green checkmarks
- Server response time metrics
- A clean, modern interface with blue and orange accent colors
- No sensitive or personal data visible
- Professional business aesthetic suitable for B2B services
- High resolution, clean design
```

### 2. Sfondo Hero Section (hero-background.jpg)
**Posizione**: public/images/hero-background.jpg
**Dimensioni**: 1920x1080 pixel (Full HD)
**Stile**: Sfondo astratto professionale con gradiente

**Prompt**:
```
Create a professional abstract background for a website maintenance service hero section. The background should feature:
- A subtle gradient from deep navy blue to lighter blue tones
- Abstract geometric patterns or tech-inspired elements
- Subtle grid or circuit board patterns
- Professional business aesthetic
- Not too busy to distract from content
- Modern, clean design with blue and orange accent colors
- High resolution suitable for full-screen display
```

### 3. Immagine Case Study (pastificio-rossi-dashboard.png)
**Posizione**: public/images/cases/pastificio-rossi-dashboard.png
**Dimensioni**: 800x600 pixel (ratio 4:3)
**Stile**: Dashboard e-commerce per pastificio

**Prompt**:
```
Create an e-commerce dashboard interface for an Italian pasta company. The dashboard should show:
- Sales analytics with upward trending graphs
- Product inventory levels for various pasta types
- Customer order statistics
- Website performance metrics
- Italian pasta products imagery subtly integrated
- Clean, professional interface with warm color scheme
- Business metrics showing growth and success
- No sensitive customer data visible
- Professional e-commerce aesthetic
```

## Istruzioni per l'Implementazione

### 1. Dashboard Monitoraggio (hero-dashboard.webp)
1. Genera l'immagine usando il prompt fornito
2. Salva come `hero-dashboard.webp` nella cartella `public/images/`
3. Se necessario, converti in formato WebP per ottimizzazione
4. L'immagine è già referenziata nel codice a riga 267 di index.astro

### 2. Sfondo Hero Section (hero-background.jpg)
1. Genera l'immagine usando il prompt fornito
2. Salva come `hero-background.jpg` nella cartella `public/images/`
3. Aggiungi il seguente codice CSS nel file `src/styles/global.css`:

```css
.bg-gradient-hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/hero-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

### 3. Dashboard Case Study (pastificio-rossi-dashboard.png)
1. Genera l'immagine usando il prompt fornito
2. Salva come `pastificio-rossi-dashboard.png` nella cartella `public/images/cases/`
3. Aggiungi il seguente codice nella sezione case study di index.astro (dopo la riga 664):

```html
<div class="mb-6">
  <img 
    src="/images/cases/pastificio-rossi-dashboard.png" 
    alt="Dashboard e-commerce Pastificio Rossi"
    class="rounded-lg shadow-md w-full"
    width="800"
    height="600"
  />
</div>
```

## Note Tecniche

1. **Formati Immagini**:
   - Usa WebP per le immagini hero per migliore compressione
   - Usa PNG per le immagini con trasparenza
   - Usa JPG per le fotografie

2. **Ottimizzazione**:
   - Comprimi le immagini senza perdere troppa qualità
   - Le immagini hero non dovrebbero superare i 500KB
   - Usa attributi width e height per migliorare il CLS (Cumulative Layout Shift)

3. **Accessibilità**:
   - Fornisci sempre attributi alt descrittivi
   - Usa testo sufficientemente contrastante con gli sfondi

4. **Responsive Design**:
   - Assicurati che le immagini siano ben visibili su tutti i dispositivi
   - Considera di usare immagini diverse per mobile e desktop se necessario

## Verifica

Dopo aver aggiunto le immagini:
1. Riavvia il server di sviluppo
2. Verifica che tutte le immagini carichino correttamente
3. Controlla la console del browser per eventuali errori
4. Testa la velocità di caricamento della pagina