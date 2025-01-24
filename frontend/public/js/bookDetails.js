// جلب معرف الكتاب من URL
const getBookId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// جلب تفاصيل الكتاب
const fetchBookDetails = async (bookId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        console.error('خطأ في جلب تفاصيل الكتاب:', error);
        return null;
    }
};

// عرض تفاصيل الكتاب
const displayBookDetails = (book) => {
    // تحديث الصورة
    const coverImage = document.getElementById('bookCover');
    if (coverImage) {
        coverImage.src = book.coverImage;
        coverImage.alt = book.title;
    }

    // تحديث العنوان
    const title = document.getElementById('bookTitle');
    if (title) title.textContent = book.title;

    // تحديث اسم الكاتب
    const author = document.getElementById('bookAuthor');
    if (author) author.textContent = `الكاتب: ${book.author.username}`;

    // تحديث التقييم
    const rating = document.getElementById('bookRating');
    const ratingCount = document.getElementById('ratingCount');
    if (rating && ratingCount) {
        const stars = '★'.repeat(Math.round(book.rating)) + '☆'.repeat(5 - Math.round(book.rating));
        rating.innerHTML = stars;
        ratingCount.textContent = `(${book.ratingCount} تقييم)`;
    }

    // تحديث الوصف
    const description = document.getElementById('bookDescription');
    if (description) description.textContent = book.description;

    // تحديث السعر
    const price = document.getElementById('bookPrice');
    if (price) price.textContent = `${book.price} ريال`;

    // تحديث التصنيف
    const category = document.getElementById('bookCategory');
    if (category) category.textContent = book.category;

    // تحديث أزرار الشراء والقراءة
    updateBookActions(book);
};

// تحديث أزرار الشراء والقراءة
const updateBookActions = (book) => {
    const token = localStorage.getItem('token');
    const purchaseButton = document.getElementById('purchaseButton');
    const readButton = document.getElementById('readButton');

    if (!token) {
        // المستخدم غير مسجل دخول
        purchaseButton.onclick = () => window.location.href = '/pages/auth/login.html';
        readButton.style.display = 'none';
        return;
    }

    if (book.purchased) {
        // المستخدم اشترى الكتاب
        purchaseButton.style.display = 'none';
        readButton.style.display = 'block';
        readButton.onclick = () => window.location.href = `/pages/books/read.html?id=${book.id}`;
    } else {
        // المستخدم لم يشتري الكتاب
        purchaseButton.onclick = () => showPurchaseModal(book);
        readButton.style.display = 'none';
    }
};

// عرض نافذة تأكيد الشراء
const showPurchaseModal = (book) => {
    const modal = document.getElementById('purchaseModal');
    const confirmButton = document.getElementById('confirmPurchase');
    const cancelButton = document.getElementById('cancelPurchase');

    modal.style.display = 'flex';

    confirmButton.onclick = () => handlePurchase(book.id);
    cancelButton.onclick = () => modal.style.display = 'none';
};

// معالجة عملية الشراء
const handlePurchase = async (bookId) => {
    try {
        const response = await fetch('http://localhost:5000/api/books/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ bookId })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        // إخفاء النافذة وتحديث الصفحة
        document.getElementById('purchaseModal').style.display = 'none';
        window.location.reload();
    } catch (error) {
        alert(error.message);
    }
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    const bookId = getBookId();
    if (!bookId) {
        window.location.href = '/pages/books/list.html';
        return;
    }

    const book = await fetchBookDetails(bookId);
    if (!book) {
        window.location.href = '/pages/books/list.html';
        return;
    }

    displayBookDetails(book);
}); 