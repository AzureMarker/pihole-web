# Pi-hole Web Interface

View stats and control your Pi-hole via this web interface. For the previous PHP-based web interface,
see [pi-hole/AdminLTE](https://github.com/pi-hole/AdminLTE/).

### Web [Preview](https://mcat12.github.io/pihole-web)

## Changes compared to the AdminLTE interface

- Eliminates the reliance on server-side rendering scripts
- Eliminates spaghetti code resulted from heavily modifying the base AdminLTE template
- Reduces attack vectors by forcing interactions to go through an API instead of directly calling server functions.
- Makes it easier for new developers to figure out the code, which speeds up development
- Makes the split between client and server code much more explicit
- Allows us to easily generate fake data for testing
- Includes all the benefits that come from React (ES6 JavaScript), including automatic DOM manipulations and reusable components

## Getting Started (Development)

- Install Node.js + npm (usually installed together): <https://nodejs.org/>
    - Install at least 10.x
    - You should either install it via your package manager or one of the `curl | bash` scripts they provide:
      <https://nodejs.org/en/download/package-manager/>
- You should also install your distro's build tools just in case
    - `build-essential` for Debian distros, `gcc-c++` and `make` for RHEL distros
- Fork the repository and clone to your computer (not the Pi-hole). In production the Pi-hole only needs the compiled
  output of the project, not its source
- Open the folder in the terminal
- Run `npm install`
    - This will install all the packages listed in `package.json` and will let you build/run the web interface
- Run `npm run start-fake` to make sure that it is working
    - This will launch the web interface on port 3000 in debug mode
    - If it crashes/has a compile error it will show you the code and the error
    - Changes will be automatically applied and the web interface will reload
- If you've never used React, you should read the [React Quick Start](https://reactjs.org/docs/hello-world.html) and/or
the [Tutorial](https://reactjs.org/tutorial/tutorial.html) before diving too deep into the code.
- When you are ready to make changes, make a branch off of `development` in your fork to work in. When you're ready to
make a pull request, base the PR against `development`.

## Testing With Fake Data

- Follow the "Getting Started" guide above
- Checkout the branch you want to test using `git checkout`
- Run `npm install` just to make sure you have the correct dependencies for the branch
- Run `npm run start-fake` to start the web interface with fake data
    - See the `npm start-fake` section of the getting started guide above for more details,
    like the port number
- Note: interactive API features, like adding to the whitelist, will not work with fake data

## Testing With Real Data

- Follow the "Getting Started" guide above
- Checkout the branch you want to test using `git checkout`
- Run `npm install` just to make sure you have the correct dependencies for the branch
- Open `package.json` and add `"proxy": "http://pi.hole"`. Change the URL to a URL that your API is listening on if
  it is not `http://pi.hole` (ex. `http://my.device.local:8000`)
- Run `npm run start` to start the web interface
    - See the `npm start-fake` section of the getting started guide above for more details,
    like the port number
