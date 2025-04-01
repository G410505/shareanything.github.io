document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const sendFileButton = document.getElementById("sendFile");
    const statusDiv = document.getElementById("status");

    if (!fileInput || !sendFileButton || !statusDiv) {
        console.error("حدث خطأ في تحميل العناصر! تأكد من أن لديك جميع العناصر في HTML.");
        return;
    }

    // إنشاء قناة اتصال WebRTC
    const peerConnection = new RTCPeerConnection();
    const dataChannel = peerConnection.createDataChannel("fileTransfer");

    dataChannel.onopen = () => console.log("تم فتح القناة!");
    dataChannel.onclose = () => console.log("تم إغلاق القناة!");

    sendFileButton.addEventListener("click", function () {
        if (fileInput.files.length === 0) {
            alert("يرجى اختيار ملف أولاً!");
            return;
        }

        const file = fileInput.files[0];
        if (dataChannel.readyState === "open") {
            dataChannel.send(file);
            statusDiv.innerHTML = `<p style="color: green;">تم إرسال الملف بنجاح!</p>`;
        } else {
            alert("القناة غير جاهزة لإرسال الملفات!");
        }
    });

    // استقبال الملفات
    peerConnection.ondatachannel = (event) => {
        const receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => {
            const receivedFile = event.data;
            console.log("تم استلام الملف:", receivedFile);
            statusDiv.innerHTML = `<p style="color: blue;">تم استلام الملف: ${receivedFile.name}</p>`;
        };
    };
});
