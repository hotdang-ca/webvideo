const record = document.getElementById('record')
const stop = document.getElementById('stop')

if (!navigator.mediaDevices) {
    alert('getUserMedia support required to use this page')
}

const chunks = []
let onDataAvailable = (e) => {
    chunks.push(e.data)
}

// Not showing vendor prefixes.
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
        width: { ideal: 320 },
        height: { ideal: 240 }
    }
}).then((mediaStream) => {
    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = onDataAvailable;

    const video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.volume = 0.0; // don't re-play audio.

    record.onclick = () => {
        recorder.start()
        document.getElementById('status').innerHTML = 'recorder started'
        console.log(recorder.state)
        console.log('recorder started')
    }

    stop.onclick = () => {
        recorder.stop()
        console.log(recorder.state)
        document.getElementById('status').innerHTML = 'recorder stopped'
        console.log('recorder stopped')
    }

    video.onloadedmetadata = (e) => {
        console.log('onloadedmetadata', e)
    }

    recorder.onstop = (e) => {
        console.log('e', e);
        console.log('chunks', chunks);
        const bigVideoBlob = new Blob(chunks, { 'type': 'video/webm; codecs=webm' })

        let fd = new FormData();
        fd.append('fname', 'test.webm');
        fd.append('data', bigVideoBlob);

        const fetchUrl = '/';
        const fetchOptions = {
            method: 'post',
            body: fd,
        };

        fetch(fetchUrl, fetchOptions)
            .then((response) => {
                return response.text()
            })
            .then((responseText) => {
                console.log('response text', responseText);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}).catch(function (err) {
    console.log('error', err)
})