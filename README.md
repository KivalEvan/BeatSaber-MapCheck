<img align="left" src="./public/img/icon-large.png" height="180" width="180">

# Beat Saber Map Check

A small project to bring extensive overview of maps, aimed to reduce error before modding & release.

by **Kival Evan#5480**

## How to use

Visit the [github.io page](https://kivalevan.github.io/BeatSaber-MapCheck/), more information in the
[GitHub Wiki](https://github.com/KivalEvan/BeatSaber-MapCheck/wiki).

## Development

### Installing

Clone or fork the project and install dependencies with `yarn`.

### Deploying

Run the development server with `yarn run dev`, the URL will be given in the CLI.

To run the app locally, `yarn run build` for the first time setup, then `yarn run serve` to run the
server.

## Contributing

If you wish to contribute, do follow the guidelines. Make pull request for feature
addition/enhancement/fix or create an issue if you encounter error/problem or want an improvement.

### Guidelines

- File names shall use camel case.
- Use formatting standard given in prettier config.
- Top-level function must use regular function.
- Use `dev` branch as base for new development and only merge here.
- No other third-dependencies unless absolutely necessary.
- Avoid circular imports.

Any beatmap related has to be done in [Beat Saber Deno](https://github.com/KivalEvan/BeatSaber-Deno)
repository instead.

## Planned

- Pre-render page for higher performance
- Rewrite swing detection
- Save tool parameters
- Tool presets
- Localization

## Note

Since this is my first ever (web) project, I'm open to feedback to further improve skill and develop
better stuff in the future. If you have any suggestion or feedback, let me know on Discord@Kival
Evan#5480

## Credits

- Uninstaller and Qwasyx (improving it) for note swing detection algorithm
- Top_Cat for math guidance
- BSMG Team for CORS proxy service
- Others for helpful feedback & indirect contribution
