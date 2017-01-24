#PicSkimmer

A tool to reduce image file size without severe degredation. For use primarily where screens are small & filesize matters.

---

###How to install
Download or clone the repo & execute `npm install`. Be sure to have imagemagick installed on your system or install with `brew imagemagick`.

###How to use
`node index.js` can be executed on first run to generate the `in/` folder. Place anything inside the **in** folder to have it process and re-run index.js

The images are replaced in-line. Current estimates show around 9.5% filesize reduction.

`node index.js -heads 5` is recommended

`node index.js -heads 1` use for fallback

###parameters
`node index.js`

`--help` for information on usage

`-heads 5` to allow simultaneous concurrent conversions. 5 is the recommended amount.

###ToDo
* Remove out/ folder. It is no longer used
* Add instructions for running inside program
* Allow parameters to specify directory
* Compile into standalone
	* Would still require imagemagick 