<br/>
<p align="center">
  <h3 align="center">Filen Web</h3>

  <p align="center">
    Web and Desktop Frontend for Filen.
    <br/>
    <br/>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/FilenCloudDienste/filen-web?color=dark-green) ![Forks](https://img.shields.io/github/forks/FilenCloudDienste/filen-web?style=social) ![Stargazers](https://img.shields.io/github/stars/FilenCloudDienste/filen-web?style=social) ![Issues](https://img.shields.io/github/issues/FilenCloudDienste/filen-web) ![License](https://img.shields.io/github/license/FilenCloudDienste/filen-web)

### Installation and building

1. Clone repository

```sh
git clone https://github.com/FilenCloudDienste/filen-web filen-web
```

2. Update dependencies

```sh
cd filen-web && npm install
```

3. Running a development build

```sh
npm run dev
```

4. Build

```sh
npm run build
```

## About this fork — large-deletion confirmation with a configurable threshold

The sync settings of each pair gain a threshold under the existing "Deletion confirmation" switch: how many deleted files or folders trigger the confirmation. Unset, only a deletion of everything in the pair does (the upstream rule).

- **Settings** — "Confirm from" is rendered as a sub-setting of the confirmation switch (it is a parameter of that gate, not a feature beside it) and appears only while the switch is on. The switch reads OFF only when explicitly off — pairs from before the setting existed are protected and shown as such.
- **Warning bar** — the pending-deletion warning stays on screen until the decision is made; it is no longer overwritten by "Everything synced" a moment after appearing. It clears on `cycleSuccess` only, which the engine suppresses while a decision is pending.
- **Dialog** — the confirmation shows the actual number of items at stake (`count` from the engine), not the size of the previously-synced tree.
- **i18n** — the whole confirmation flow (settings rows, dialogs, warning bar) is translated to Italian; other locales fall back to English as before.

The engine semantics live in [`@filen/sync`](https://github.com/ark3us/filen-sync), the desktop wiring in [`@filen/desktop`](https://github.com/ark3us/filen-desktop) — see their READMEs.

## License

Distributed under the AGPL-3.0 License. See [LICENSE](https://github.com/FilenCloudDienste/filen-s3/blob/main/LICENSE.md) for more information.
