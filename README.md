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

## Auf dem Handy installieren

Test- und Produktiv-App liegen unter derselben Adresse
(`markusesser167.github.io`), aber in getrennten Pfaden. Sie lassen sich
deshalb **parallel** installieren und stören sich nicht: eigener Name, eigenes
Startsymbol, eigener Offline-Cache.

Testversion im Browser öffnen → Menü → „Zum Startbildschirm hinzufügen".

## Änderungen in die Produktivversion übernehmen

Es wird **nur `index.html`** übernommen. `manifest.json` und `sw.js` gehören zum
jeweiligen Repo (App-Name, Cache-Name) und bleiben, wo sie sind.

1. `index.html` aus diesem Repo in eine Arbeitskopie des Produktiv-Repos kopieren
2. `python tools/make_testversion.py --prod <arbeitskopie>` – setzt den Schalter
   auf `false`
3. Prüfen, dass im Diff nur die gewollten Änderungen stehen
4. Committen und pushen

Schritt 2 stellt genau eine Zeile um. Es gibt nichts zurückzubauen, weil in
beiden Fassungen dasselbe Gerüst steckt.

Die Skripte liegen im Arbeitsordner `claude-work/PROJECTS/Wego-Unfall-App`,
nicht im Repo.

## Standortliste

`ndl.json` wird vom Service Worker netzwerk-zuerst geladen und lässt sich ohne
App-Update austauschen. Pflegequelle ist `stammdaten/NL_Mail.xlsx` im
Arbeitsordner, Generator `tools/ndl_aus_excel.py`.

## Aufbau

Alles steckt in einer einzigen `index.html` (rund 155 KB): Oberfläche, Logik,
Übersetzungen in sieben Sprachen (de, en, tr, ru, ro, pl, cs) und das Logo als
eingebettetes Bild. Webfleet-Abfragen und Mailversand laufen über ein Google
Apps Script, in dem auch die Zugangsdaten liegen – nicht im App-Code.
