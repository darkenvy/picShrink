#PicSkimmer

A tool to reduce image file size without severe degredation. For use primarily where screens are small & filesize matters.

---

###How to install
Download or clone the repo & execute `npm install`. Be sure to have imagemagick installed on your system or install with `brew imagemagick`.

###How to use
`node index.js` can be executed on first run to generate the `in/` folder. Place anything inside the **in** folder to have it process and re-run index.js

The images are replaced in-line. Current estimates show around 9.5% filesize reduction.

###ToDo
* Remove out/ folder. It is no longer used
* Add instructions for running inside program
* Allow parameters to specify directory
* Compile into standalone
	* Would still require imagemagick 