const fileInput = document.getElementById('fileInput');
const newWidthInput = document.getElementById('newWidth');
const newHeightInput = document.getElementById('newHeight');
const resizeBtn = document.getElementById('resizeBtn');
const resultDiv = document.getElementById('result');
const downloadLink = document.getElementById('downloadLink');

let originalImage = null;

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) {
    resizeBtn.disabled = true;
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage = new Image();
    originalImage.onload = () => {
      resizeBtn.disabled = false;
      // 默认把原图尺寸填到输入框，方便修改
      newWidthInput.value = originalImage.width;
      newHeightInput.value = originalImage.height;
      resultDiv.innerHTML = '';
      downloadLink.style.display = 'none';
    };
    originalImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

resizeBtn.addEventListener('click', () => {
  if (!originalImage) return alert('Please upload an image first.');
  const w = parseInt(newWidthInput.value);
  const h = parseInt(newHeightInput.value);
  if (!w || !h || w <= 0 || h <= 0) return alert('Please enter valid width and height.');

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // 先清空为透明（默认就是透明的，可以不写）
  ctx.clearRect(0, 0, w, h);

  // 计算绘制图像的位置，居中显示
  const offsetX = Math.max((w - originalImage.width) / 2, 0);
  const offsetY = Math.max((h - originalImage.height) / 2, 0);

  // 绘制原图到canvas中心，超出部分自动裁剪
  ctx.drawImage(originalImage, offsetX, offsetY);

  // 生成结果预览和下载链接
  const dataURL = canvas.toDataURL('image/png');
  resultDiv.innerHTML = `<img src="${dataURL}" alt="Resized Image" />`;
  
  downloadLink.href = dataURL;
  downloadLink.style.display = 'block';
});
