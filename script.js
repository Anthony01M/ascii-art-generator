document.addEventListener('DOMContentLoaded', function () {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);

    const imageUpload = document.getElementById('imageUpload');
    const asciiArt = document.getElementById('asciiArt');
    const copyButton = document.getElementById('copyButton');
    let img = null;

    imageUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    generateAsciiArt(img);
                    copyButton.style.display = 'block';
                };
            };
            reader.readAsDataURL(file);
        }
    });

    copyButton.addEventListener('click', function () {
        const text = asciiArt.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('ASCII art copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    function generateAsciiArt(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const height = (img.height / img.width) * 100;
        canvas.width = 100;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, 100, height);
        const imageData = ctx.getImageData(0, 0, 100, height);
        asciiArt.textContent = convertToAscii(imageData);
    }

    function convertToAscii(imageData) {
        const chars = '@%#*+=-:. ';
        let ascii = '';
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const offset = (y * imageData.width + x) * 4;
                const r = imageData.data[offset];
                const g = imageData.data[offset + 1];
                const b = imageData.data[offset + 2];
                const avg = (r + g + b) / 3;
                const charIndex = Math.floor((avg / 255) * (chars.length - 1));
                ascii += chars[charIndex];
            }
            ascii += '\n';
        }
        return ascii;
    }
});