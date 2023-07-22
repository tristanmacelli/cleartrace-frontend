# slack-clone-client


## Local Development

In order to connect from another device it must be on the same network. Once on the network run one of the following
commands to acquire the IP of the device running the app. Then append :8080 to this IP in the address bar of a browser
to connect from an external device.
- ipconfig getifaddr en0 (MacOS)
- ipconfig/all (Windows)

## Useful commands

### Project Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Build for production
```
sh build.sh
```

### Build & Deploy to production
```
sh deploy.sh
```

### Vite Bundle Analyzer
```
npx vite-bundle-visualizer
```