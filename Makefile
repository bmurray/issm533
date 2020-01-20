all: build/windows.exe build/linux build/macos

pkged.go: web/build 
	pkger -include /web/build


build/windows.exe: pkged.go
	GOOS=windows GOARCH=amd64 go build -o build/windows.exe main.go pkged.go

build/linux: pkged.go
	GOOS=linux GOARCH=amd64 go build -o build/linux main.go pkged.go

build/macos: pkged.go
	GOOS=darwin GOARCH=amd64 go build -o build/macos main.go pkged.go

web/build:
	(cd web && npm run build)

clean:
	rm -rf build web/build
