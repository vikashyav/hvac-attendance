"use client";
export const dynamic = "force-dynamic";
import { useRef, useState, useEffect } from "react";
// import * as faceapi from "face-api.js";
import * as faceapi from "face-api.js/dist/face-api.js";

export default function AttendanceSelfie(props) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [captured, setCaptured] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [retryNo, setRetryNo] = useState(0);
    const [statusMsg, setStatusMsg] = useState("Loading models...");
    const [imgData, setImgData] = useState()
    const [intervalTimeId, setIntervalTimeId] = useState();

    useEffect(() => {
        // let stream;
        // startCamera();
        async function loadModels() {
            // await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector/");
            // await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68/");
            // await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition/");
            // await loadFaceAPIModels(); // load + cache on startup

            console.log("✅ Models loaded");
            setModelsLoaded(true);
            setStatusMsg("Models loaded, starting camera...");
            startCamera();
        }

        loadModels();
        // loadFaceAPIModels(); // load + cache on startup
        return () => {
            stopCamera(); // Use the new stopCamera function for cleanup
        };
    }, []);

    async function startCamera() {
        let intervalId;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setStatusMsg("Please await while starting camera...");
                    // detectFace(); // start detection loop
                    setTimeout(detectFace, 100)
                };
                // intervalId = setInterval(detectFace, 1500);
                // setIntervalTimeId(intervalId);
                // return () => clearInterval(intervalId);
            }
        } catch (err) {
            alert("Camera access denied!");
        }
    }

    const stopCamera = () => {
        const video = videoRef?.current;
        const stream = video?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Stop all tracks in the stream
            video.srcObject = null;
        }
        video?.pause();
    };

    const captureSelfie = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth || 300;
        canvas.height = video.videoHeight || 300;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setImgData(imageData)
        if (props?.handleTakePhoto) {
            props?.handleTakePhoto(imageData, { isCaptured: true })
        }
        // ✅ Properly stop all media tracks
        if (video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
                track.stop();   // stop track
                stream.removeTrack(track); // detach from stream
            });
            video.srcObject = null;  // clear stream from video element
        }

        // ✅ Pause video (extra safe)
        video.pause();
        setCaptured(true);
        // return () => clearInterval(intervalTimeId);
    };

    const retakeSelfie = async () => {
        setCaptured(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert("Unable to access camera again!");
        }
    };

    const detectFace = async () => {
        if (!videoRef.current) return;
        if (captured) return;
        try {
            setStatusMsg("Please await while detecting your face...", );
            console.log("deet", 1);
            const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            // .withFaceLandmarks()
            // .withFaceDescriptor();
            console.log("deet", detections);

            if (detections) {
                const video = videoRef.current;
                const canvas = canvasRef.current;

                if (!video || !canvas) return;

                const context = canvas.getContext("2d");
                canvas.width = video.videoWidth || 300;
                canvas.height = video.videoHeight || 300;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL("image/png");
                if (props?.handleTakePhoto) {
                    setStatusMsg("Face detected ✅, Photo captured");
                    setImgData(imageData);
                    setCaptured(true);
                    props?.handleTakePhoto(imageData, { isCaptured: true })
                    stopCamera();
                }
                setStatusMsg("Face detected ✅, Photo captured");
                console.log(detections);
                return
            } else {
                console.log("retrying.............");

                setRetryNo((prev) => {
                    setStatusMsg(`No face found ❌, retrying..${prev + 1},  Please Smile and blink your eyes`);
                    return prev + 1
                });
                setTimeout(detectFace, 100); // retry after 100 millisec
            }
        } catch (error) {
            console.log("eeeeeeeee", error);
            setTimeout(detectFace, 100); // retry after 100 millisec
        }
    };

    const verifyFace = async () => {
        if (!modelsLoaded || !videoRef.current) return;

        // 1️⃣ Detect face from webcam
        const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
        console.log(1);

        if (!detection) {
            setStatusMsg("❌ No face detected!");
            console.log(2);
            // return;
        }

        // 2️⃣ Load stored employee reference face descriptor
        const refImg = await faceapi.fetchImage("/vikas.jpeg");
        // const refDetection = await faceapi
        //     .detectSingleFace(refImg)//new faceapi.TinyFaceDetectorOptions()
        //     .withFaceLandmarks()
        //     .withFaceDescriptor();
        // let refDetection = await faceapi.detectSingleFace(refImg).withFaceLandmarks().withFaceDescriptors()
        const refDetection = await faceapi.detectSingleFace(refImg)
            .withFaceLandmarks()
            .withFaceDescriptor();
        console.log(3);

        console.log("refimg", refImg, "refdet", refDetection)
        if (!refDetection) {
            setStatusMsg("❌ Reference face not found!");
            return;
        }

        // 3️⃣ Compare
        const faceMatcher = new faceapi.FaceMatcher(refDetection);
        const bestMatch = faceMatcher.findBestMatch(detection?.descriptor);

        if (bestMatch.label === "unknown" || bestMatch.distance > 0.5) {
            alert("❌ Face not verified!");
            // setIsVerified(false);
        } else {
            alert("✅ Face verified, you can check-in!");
            // setIsVerified(true);
        }
    };


    return (
        <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-bold">{statusMsg}</p>
            <video
                ref={videoRef}
                autoPlay
                className={`rounded-full w-64 h-64 object-cover ${captured ? "hidden" : "block"}`}
            />
            <canvas
                ref={canvasRef}
                // src={imgData}
                className={`rounded-full w-64 h-64 ${captured ? "block" : "hidden"}`}
            />
            <button
                onClick={verifyFace}
                className="hidden px-4 py-2 bg-blue-600 text-white rounded"
            >
                Verify Face
            </button>
            <button
                onClick={captureSelfie}
                className=" hidden px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                📸 Capture
            </button>
            {/* <button
                onClick={detectFace}
                className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
            >
                Detect Face
            </button> */}
            {/* <img src={imgData} /> */}
        </div>
    );
}
