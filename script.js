let peerConnection;
let dataChannel;

// إنشاء الاتصال عند تحميل الصفحة
function createConnection() {
    peerConnection = new RTCPeerConnection();
    dataChannel = peerConnection.createDataChannel("fileTransfer");

    dataChannel.onopen = () => console.log("قناة الاتصال مفتوحة");
    dataChannel.onclose = () => console.log("قناة الاتصال مغلقة");
    
    dataChannel.onmessage = (event) => {
        const receivedFile = event.data;
        const blob = new Blob([receivedFile]);
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "received_file";
        downloadLink.innerText = "تحميل الملف المستلم";
        document.body.appendChild(downloadLink);
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            document.getElementById("offer").value = JSON.stringify(peerConnection.localDescription);
        }
    };
}

// توليد عرض اتصال (Offer) للطرف الآخر
async function createOffer() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    document.getElementById("offer").value = JSON.stringify(offer);
}

// قبول الطلب من الجهاز الآخر (Answer)
async function acceptOffer() {
    const offer = JSON.parse(document.getElementById("offer").value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    document.getElementById("answer").value = JSON.stringify(answer);
}

// إرسال الاستجابة للطرف الآخر
async function acceptAnswer() {
    const answer = JSON.parse(document.getElementById("answer").value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// إرسال الملف المختار عبر WebRTC
function sendFile() {
    const fileInput = document.getElementById("fileInput").files[0];
    if (fileInput && dataChannel.readyState === "open") {
        dataChannel.send(fileInput);
        alert("تم إرسال الملف بنجاح!");
    } else {
        alert("القناة غير جاهزة لإرسال الملفات!");
    }
}

// تهيئة الاتصال عند بدء الصفحة
createConnection();

document.getElementById("sendButton").addEventListener("click", sendFile);
document.getElementById("createOffer").addEventListener("click", createOffer);
document.getElementById("acceptOffer").addEventListener("click", acceptOffer);
document.getElementById("acceptAnswer").addEventListener("click", acceptAnswer);
