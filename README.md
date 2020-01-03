# Code for ISSM533

To run, node and go must be installed. See releases for ready-built binaries.

You may run the react only web server by running:
```
cd web
npm start
```

You can run the react code via the Go webserver, required for later projects, by building the react code, then starting the go web server

```
cd web
npm run build
cd ..
go run main.go
```