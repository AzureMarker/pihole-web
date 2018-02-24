# Pi-hole Web Interface

View stats and control your Pi-hole via this web interface. For the previous PHP-based web interface,
see [pi-hole/AdminLTE](https://github.com/pi-hole/AdminLTE/).

Preview:
![Dashboard](https://user-images.githubusercontent.com/4417660/30337048-1f3b0a06-97b5-11e7-9af3-03c2e763e36a.png)
![Query Log](https://user-images.githubusercontent.com/4417660/30356528-882f7cfc-9807-11e7-99eb-19ff1a5f521f.png)
![Blacklist (Exact)](https://user-images.githubusercontent.com/4417660/30337510-7eba111a-97b6-11e7-8574-6c7355efaa57.png)

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