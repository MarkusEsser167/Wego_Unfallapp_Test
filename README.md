# Wego Unfall-App – Testversion

> **Nicht produktiv einsetzen.** Diese App verschickt keine echten Unfallberichte.
> Der Produktivstand liegt in [Wego_Unfallapp](https://github.com/MarkusEsser167/Wego_Unfallapp).

Entwicklungsfassung der Unfallaufnahme-App. Hier wird geändert und getestet;
ist ein Stand gut, wandert er in die Produktivversion.

| | Test | Produktiv |
|---|---|---|
| Repo | `Wego_Unfallapp_Test` | `Wego_Unfallapp` |
| Live | https://markusesser167.github.io/Wego_Unfallapp_Test/ | https://markusesser167.github.io/Wego_Unfallapp/ |
| Mail an | `digital-services@wego-vti.de` | `logistik@wego-vti.de` |
| CC | keins | HSE, Niederlassung, Vertriebsleiter |
| App-Name auf dem Gerät | „Unfall TEST" | „Unfallaufnahme" |

## Zwei Bereiche

Die App startet mit einer Auswahl:

| Bereich | Für was | Stammdaten |
|---|---|---|
| **Fuhrpark** | Unfall mit LKW oder PKW – mit Unfallgegner, Zeugen, Polizei, Versicherung | Webfleet (live) |
| **Lager** | Schaden mit einem Gabelstapler | `stapler.json` (295 Geräte) |

Beide Bereiche teilen sich Fotoaufnahme, Zusammenfassung, PDF- und
Word-Erzeugung sowie den Mailversand. Die Schritte 1 bis 3 gibt es je Bereich
einmal (`s1`–`s3` Fuhrpark, `l1`–`l3` Lager), Schritt 4 und 5 sind gemeinsam.

Beim Zurückgehen auf die Bereichsauswahl werden Schadensart und Fotos geleert –
die drei Angaben sind die einzigen, die sich beide Bereiche teilen, und würden
sonst in den anderen Bereich hinüberwirken.

### Lager-Ablauf

1. **Staplerauswahl** – nach Standort oder über die Suche (Gerätenummer, Typ, Ort)
2. **Schadensangaben** – Fahrer, Zeitpunkt, Ort/Halle, Betriebsstunden, Hergang, Schadensart
3. **Betroffen** – vier Kacheln zum Ankreuzen, **mehrere gleichzeitig möglich**:
   Stapler selbst, eigenes Material / Ausrüstung, fremdes Eigentum, Person.
   Die zugehörigen Blöcke erscheinen erst, wenn angekreuzt. Dazu Zeugen und
   interne Meldung.

   Mehrfachauswahl statt einer Liste, weil ein Anstoß mehrere Dinge zugleich
   treffen kann. Bei vier Angaben gäbe es sonst sechzehn Kombinationen zum
   Auswählen.
4. **Fotos** – mindestens 2, wie im Fuhrpark
5. **Zusammenfassung** und Versand

Die Niederlassung hängt beim Lager am Gerät selbst (aus `stapler.json`), nicht
an einer Webfleet-Gruppe. Der Mailverteiler ist derselbe wie im Fuhrpark.

### Staplerliste pflegen

`stapler.json` entsteht aus `Fuhrpark Bestandsliste.xls` im Arbeitsordner:

```
python tools/stapler_aus_excel.py
```

Übernommen wird nur die Fahrzeugart „Stapler". Mitnahmestapler hängen am LKW
und gehören zum Fuhrpark. Das Skript meldet Standorte, die in `ndl.json`
fehlen – deren Meldungen gehen sonst ohne Standort-CC raus.

Wie `ndl.json` wird die Datei netzwerk-zuerst geladen: eine neue Liste wirkt
ohne App-Update.

## Was im Testbetrieb anders ist

Ein einziger Schalter in `index.html` steuert alles:

```js
const TEST_MODE = true;
```

Steht er auf `true`:

- Der Versand geht ausschließlich an die Testadresse, **kein CC** an Logistik,
  HSE, Niederlassung oder Vertriebsleiter
- Rotes Warnbanner am oberen Rand
- `[TEST]` im Seitentitel und im Mailbetreff, „(TESTVERSION)" im PDF-Kopf

- Der Verteiler wird trotzdem berechnet und im Mailtext sowie im
  Bestätigungsdialog angezeigt – so lässt sich die Standortermittlung prüfen,
  ohne jemanden anzuschreiben

Zusätzlich lädt der Service Worker dieser Fassung `index.html` **netzwerk-zuerst**
statt aus dem Cache. Sonst testet man nach jeder Änderung unbemerkt weiter gegen
den alten Stand. Offline greift weiterhin der Cache. In der Produktivfassung
bleibt es bei Cache-zuerst – dort zählen Startgeschwindigkeit und Offlinebetrieb.

## Auf dem Handy installieren

Test- und Produktiv-App liegen unter derselben Adresse
(`markusesser167.github.io`), aber in getrennten Pfaden. Sie lassen sich
deshalb **parallel** installieren und stören sich nicht: eigener Name, eigenes
Startsymbol, eigener Offline-Cache.

Testversion im Browser öffnen → Menü → „Zum Startbildschirm hinzufügen".

## Änderungen in die Produktivversion übernehmen

Übernommen werden `index.html` und geänderte Stammdaten (`stapler.json`, `ndl.json`).
`manifest.json` bleibt repo-eigen.

**`sw.js` im Produktiv-Repo muss bei jeder Freigabe geändert werden**, mindestens der
Cache-Name (derzeit `wego-unfallapp-v3`). Die Produktiv-App lädt `index.html`
cache-zuerst – ohne geänderte `sw.js` kommt die neue Fassung auf den Geräten nie an.
Die `sw.js` dieses Repos wird dabei nicht kopiert.

1. `index.html` aus diesem Repo in eine Arbeitskopie des Produktiv-Repos kopieren
2. `python tools/make_testversion.py --prod <arbeitskopie>` – setzt den Schalter
   auf `false`
3. Im Produktiv-Repo den Cache-Namen in `sw.js` hochzählen
4. Lokal abnehmen, den Versand dabei abfangen – produktiv geht er echt an Logistik
5. Prüfen, dass im Diff nur die gewollten Änderungen stehen
6. Committen und pushen

Zuletzt freigegeben: 11.09.2026, Produktiv-Commit `eb1ef56`.

Schritt 2 stellt genau eine Zeile um. Es gibt nichts zurückzubauen, weil in
beiden Fassungen dasselbe Gerüst steckt.

Die Skripte liegen im Arbeitsordner `claude-work/PROJECTS/Wego-Unfall-App`,
nicht im Repo.

## Standortliste

`ndl.json` wird vom Service Worker netzwerk-zuerst geladen und lässt sich ohne
App-Update austauschen. Pflegequelle ist `stammdaten/NL_Mail.xlsx` im
Arbeitsordner, Generator `tools/ndl_aus_excel.py`.

## Aufbau

Alles steckt in einer einzigen `index.html` (rund 185 KB): Oberfläche, Logik beider
Bereiche, Übersetzungen (Fuhrpark in sieben Sprachen, Lager bislang Deutsch) und das Logo als
eingebettetes Bild. Webfleet-Abfragen und Mailversand laufen über ein Google
Apps Script, in dem auch die Zugangsdaten liegen – nicht im App-Code.
