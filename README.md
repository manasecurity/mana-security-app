<h1>
  Mana Security
</h1>

<p>

[Mana Security](https://www.manasecurity.com) is a vulnerability management tool for macOS.

</p>


## Features

- Continious monitoring of 100+ apps against known and potential vulnerabilities.
- **Instant** detection of a new vulnerabilities as soon as they appear in public databases (e.g. CVE).
- Tracks patching velocity and compares it against Mana's community and other benchmarks.

## Install

First, clone the repo via git and install dependencies:

```bash
git clone https://github.com/manasecurity/mana-macos
cd mana-macos
yarn
```

## Starting Development

Start the app in the `dev` environment:

```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```
