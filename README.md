# Pi-hole Web Interface

View stats and control your Pi-hole via this web interface. For the previous PHP-based web interface,
see [pi-hole/AdminLTE](https://github.com/pi-hole/AdminLTE/).

### Web [Preview](https://web.pi-hole.io)

## Changes compared to the AdminLTE interface
- eliminates the reliance on server-side rendering scripts
- eliminates spaghetti code resulted from heavily modifying the base AdminLTE template
- reduces attack vectors by using JavaScript’s explicit imports instead of importing entire .php files
- makes it easier for new developers to figure out the code, which speeds up development
- makes the split between client and server code much more explicit
- allows us to easily generate fake data for testing
- includes all the benefits that come from React (ES6 JavaScript), including automatic DOM manipulations, stateful development, and component-based development

## Getting Started (Development)

- Install Node + NPM (usually installed together): https://nodejs.org/
    - Install at least 8.x.x
    - You should either install it via your package manager or one of the curl | bash scripts they provide:
      https://nodejs.org/en/download/package-manager/
- You should also install your distro's build tools just in case
    - `build-essential` for Debian distros, `gcc-c++` and `make` for RHEL distros
- Fork the repository and clone to your computer (not the Pi-hole). In production the Pi-hole only needs the compiled
  output of the project, not its source
- Open the folder in the terminal
- Run `npm install`
    - This will install all the packages listed in `package.json` and will let you build/run the web interface
- Run `npm start` to make sure that it is working
    - This will launch the web interface on port 3000 in debug mode
    - If it crashes/has a compile error it will show you the code and the error
    - Changes will be automatically applied and the web interface will reload
- If you've never used React, you should read the [React Quick Start](https://reactjs.org/docs/hello-world.html) and/or
the [Tutorial](https://reactjs.org/tutorial/tutorial.html) before diving too deep into the code.
- When you are ready to make changes, make a branch off of `development` in your fork to work in. When you're ready to
make a pull request, base the PR against `development`.
