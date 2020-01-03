all: build/windows.exe build/linux build/macos


build/windows.exe: web/build
	GOOS=windows GOARCH=amd64 go build -o build/windows.exe main.go

build/linux: web/build
	GOOS=linux GOARCH=amd64 go build -o build/linux main.go

build/macos: web/build
	GOOS=darwin GOARCH=amd64 go build -o build/macos main.go

web/build:
	(cd web && npm run build)

clean:
	rm -rf build web/build
