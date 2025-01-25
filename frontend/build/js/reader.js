// تهيئة PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;

// جلب الكتاب
const fetchBook = async (bookId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}/read`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('غير مصرح بقراءة هذا الكتاب');
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        alert(error.message);
        window.location.href = '/pages/books/list.html';
    }
};

// عرض الصفحة
const renderPage = (num) => {
    pageRendering = true;
    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
            pageRendering = false;
            const viewer = document.getElementById('pdfViewer');
            viewer.innerHTML = '';
            viewer.appendChild(canvas);
            
            document.getElementById('currentPage').textContent = num;
            
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
};

// تحميل الكتاب
const loadBook = async () => {
    const bookId = new URLSearchParams(window.location.search).get('id');
    if (!bookId) {
        window.location.href = '/pages/books/list.html';
        return;
    }

    const pdfUrl = await fetchBook(bookId);
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    
    loadingTask.promise.then((pdf) => {
        pdfDoc = pdf;
        document.getElementById('totalPages').textContent = pdf.numPages;
        renderPage(pageNum);
    });
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadBook();

    // أزرار التنقل
    document.getElementById('prevPage').onclick = () => {
        if (pageNum <= 1) return;
        pageNum--;
        renderPage(pageNum);
    };

    document.getElementById('nextPage').onclick = () => {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        renderPage(pageNum);
    };

    // زر ملء الشاشة
    document.getElementById('toggleFullscreen').onclick = () => {
        document.querySelector('.reader-container').classList.toggle('fullscreen');
    };
}); 