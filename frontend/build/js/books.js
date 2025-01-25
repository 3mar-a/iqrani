// جلب الكتب من الخادم
const fetchBooks = async (filters = {}) => {
    try {
        let url = 'http://localhost:5000/api/books';
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.price) params.append('price', filters.price);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        return data;
    } catch (error) {
        console.error('خطأ في جلب الكتب:', error);
        return [];
    }
};

// عرض الكتب في الصفحة
const displayBooks = (books) => {
    const booksGrid = document.getElementById('booksGrid');
    const template = document.getElementById('bookCardTemplate');
    
    if (!booksGrid || !template) return;
    
    booksGrid.innerHTML = '';
    
    books.forEach(book => {
        const clone = template.content.cloneNode(true);
        
        const img = clone.querySelector('img');
        img.src = book.coverImage;
        img.alt = book.title;
        
        clone.querySelector('.book-title').textContent = book.title;
        clone.querySelector('.book-author').textContent = `الكاتب: ${book.author.username}`;
        clone.querySelector('.book-price').textContent = `${book.price} ريال`;
        clone.querySelector('.book-link').href = `/pages/books/details.html?id=${book.id}`;
        
        booksGrid.appendChild(clone);
    });
};

// تحديث الكتب عند تغيير الفلاتر
const handleFilters = async () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    const filters = {
        search: searchInput?.value,
        category: categoryFilter?.value,
        price: priceFilter?.value
    };
    
    const books = await fetchBooks(filters);
    displayBooks(books);
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    // إضافة مستمعي الأحداث للفلاتر
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleFilters, 500));
    }
    
    const filters = document.querySelectorAll('select');
    filters.forEach(filter => {
        filter.addEventListener('change', handleFilters);
    });
    
    // عرض الكتب الأولية
    const books = await fetchBooks();
    displayBooks(books);
});

// دالة مساعدة للتأخير
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 