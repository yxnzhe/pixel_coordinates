document.writeln("<script async src='https://cdn.jsdelivr.net/npm/geotiff'></script>");
document.writeln("<script src='js/tiff.js' type='text/javascript'></script>");

//read image
async function readImage(file) {
    const input = file;
    // const input = document.getElementById('tiff-file');
    const tiff = await GeoTIFF.fromBlob(input.files[0]);
    const image = await tiff.getImage();

    const origin = image.getOrigin();
    const resolution = image.getResolution();
    const bbox = image.getBoundingBox();

    console.log("Origin: ", origin);
    console.log("Resolution: ", resolution);
    console.log("Bbox: ", bbox);
}

//show image
// function prepareTIFF(file) {
//     const input = file;
//     // const input = document.getElementById('tiff-file');
//     var reader = new FileReader();

//     reader.onload = function(e) {
//         var canvas = document.getElementById("tiff-image");
//         var canvasParent = canvas.parentNode;

//         // Load the TIFF parser.
//         var tiffParser = new TIFFParser();

//         console.log( tiffParser );

//         // Parse the TIFF image.
//         var tiffCanvas = tiffParser.parseTIFF(e.target.result, canvas);

//         // Make it clear that we've loaded the image.
//         tiffCanvas.style.borderStyle = "solid";

//         console.log(tiffCanvas);

//         // Put the parsed image in the page.
//         canvasParent.replaceChild(tiffCanvas, canvas);
//     };

//     reader.readAsArrayBuffer(input.files[0]);
// }

function dragNdrop(event){
    var files = document.getElementById("tiff-file").files;
    var file = files[0];

    if (files.length < 1 || file.type !== 'image/tiff') {
        return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        var canvas = document.getElementById("tiff-image");
        var canvasParent = canvas.parentNode;

        // Load the TIFF parser.
        var tiffParser = new TIFFParser();

        // Parse the TIFF image.
        var tiffCanvas = tiffParser.parseTIFF(e.target.result, canvas);

        // Make it clear that we've loaded the image.
        tiffCanvas.style.borderStyle = "solid";

        console.log( tiffCanvas );

        // Put the parsed image in the page.
        canvasParent.replaceChild(tiffCanvas, canvas);
    };

    reader.readAsArrayBuffer( file );
}

//2. drag
function drag(){
    //while dragging it will fire this function that will add the following class
    document.getElementById('tiff-file').parentNode.className = "draging dragBox";
}

//3. finally the drop()
function drop(){
    document.getElementById('tiff-file').parentNode.className = 'dragBox';
}

var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    zoom = document.getElementById("zoom");

function setTransform() {
    zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

zoom.onmousedown = function (e) {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

zoom.onmouseup = function (e) {
    panning = false;
}

zoom.onmousemove = function (e) {
    e.preventDefault();
    if (!panning) {
        return;
    }
    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

zoom.onwheel = function (e) {
    e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    setTransform();
}

//selecting all required elements
// const dropArea = document.querySelector(".drag-area"),
// dragText = dropArea.querySelector("header"),
// button = dropArea.querySelector("button"),
// input = document.getElementById('tiff-file');
// let file; //this is a global variable and we'll use it inside multiple functions

// button.onclick = ()=>{
//     input.click(); //if user click on the button then the input also clicked
// }

// input.addEventListener("change", function(){
//   //getting user select file and [0] this means if user select multiple files then we'll select only the first one
//     file = this.files[0];
//     dropArea.classList.add("active");
//     // showFile(); //calling function
//     readImage(input);
//     prepareTIFF(input);
// });

// //If user Drag File Over DropArea
// dropArea.addEventListener("dragover", (event)=>{
//     event.preventDefault(); //preventing from default behaviour
//     dropArea.classList.add("active");
//     dragText.textContent = "Release to Upload File";
// });

// //If user leave dragged File from DropArea
// dropArea.addEventListener("dragleave", ()=>{
//     dropArea.classList.remove("active");
//     dragText.textContent = "Drag & Drop to Upload File";
// });

// //drop tiff on DropArea
// dropArea.addEventListener("drop", (event)=>{
//     event.preventDefault(); //preventing from default behaviour
//     //getting user select file and [0] this means if user select multiple files then we'll select only the first one
//     file = event.dataTransfer.files[0];
//     console.log('im at 89', file);
//     // showFile(); //calling function
//     // uploadFiles();
//     readImage(input);
//     prepareTIFF(input);
// });

// // function showFile(input){
// //     let fileType = file.type; //getting selected file type
// //     let validExtensions = ["image/png", "image/jpg", "image/tiff"]; //adding some valid image extensions in array
// //     if(validExtensions.includes(fileType)){ //if user selected file is an image file
// //         let fileReader = new FileReader(); //creating new FileReader object
// //         fileReader.onload = ()=>{
// //         let fileURL = fileReader.result; //passing user file source in fileURL variable
// //             // UNCOMMENT THIS BELOW LINE. I GOT AN ERROR WHILE UPLOADING THIS POST SO I COMMENTED IT
// //         // let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
// //         dropArea.innerHTML = input;
// //         // dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
// //         }
// //         fileReader.readAsDataURL(file);
// //     }else{
// //         alert("This is not a valid File!");
// //         dropArea.classList.remove("active");
// //         dragText.textContent = "Drag & Drop to Upload File";
// //     }
// // }

// function uploadFiles() {
//     var files = document.getElementById('file_upload').files;
//     if(files.length==0){
//         alert("Please first choose or drop any file(s)...");
//         return;
//     }
//     var filenames="";
//     for(var i=0;i<files.length;i++){
//         filenames+=files[i].name+"\n";
//     }
//     alert("Selected file(s) :\n____________________\n"+filenames);
// }