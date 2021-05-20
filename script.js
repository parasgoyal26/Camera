let videoElem = document.querySelector("video");
let recordBtn = document.querySelector(".record");

let isRecording = false;

// user requirements jo chaiye (necessary for getUserMedia)
let constraint = {
	audio: true,
	video: true,
};

let recording = []; //to push video chunks when they are available to get pushed
let mediaRecordingObjectForCurrStream;

//promise
let usermediaPromise = navigator.mediaDevices.getUserMedia(constraint); //required stream coming from user

usermediaPromise
	.then(function (stream) {
		// UI stream
		videoElem.srcObject = stream;

		//browser
		mediaRecordingObjectForCurrStream = new MediaRecorder(stream); //object banaya taaki API ka use kr sake object k through
		// adding camera recording in to recording array
		mediaRecordingObjectForCurrStream.ondataavailable = function (e) {
			recording.push(e.data);
		};

		//download
		mediaRecordingObjectForCurrStream.onstop = function () {
			// recording -> url convert
			// type -> MIME type (extension)
			const blob = new Blob(recording, { type: "video/mp4" });    //video to blob
			const url = window.URL.createObjectURL(blob);               //blob to url to get passed into href
			let a = document.createElement("a");                        // anchor tag for href
			a.download = "file.mp4";                                    //file name 
			a.href = url;                                               //url passed to href
			a.click();                                                  //clicking the anchor 
			recording = [];                                             //emptying the recording array for next recording
		};
	})
	.catch(function (err) {
		console.log(err);
		alert(" Please allow both camera and microphone ");
	});

recordBtn.addEventListener("click", function () {
	if (mediaRecordingObjectForCurrStream == undefined) {
		//if there is no object bec we deny the access
		alert(" Allow access to the devices ");
		return;
	}
	if (isRecording == false) {
		mediaRecordingObjectForCurrStream.start();          //to start the recording 
		recordBtn.innerText = "Recording...";
	} else {
		mediaRecordingObjectForCurrStream.stop();           //to stop the recording
		recordBtn.innerText = "Record";
	}
	isRecording = !isRecording;
});

